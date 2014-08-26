
# 10=HIMACHAL PRADESH
# 11=JHARKHAND
# 12=KARNATAKA
# 13=KERALA
# 15=MADHYA PRADESH
# 16=MAHARASHTRA
# 20=ORISSA
# 22=PUNJAB
# 23=RAJASTHAN
# 24=SIKKIM
# 25=TAMIL NADU
# 26=UTTAR PRADESH
# 28=WEST BENGAL
# 2=ANDHRA PRADESH
# 32=DELHI
# 33=UTTARAKHAND
# 36=BIHAR
# 37=DAMAN &amp; DIU
# 40=JAMMU &amp; KASHMIR
# 41=TRIPURA
# 45=NEW DELHI
# 46=PUDUCHERRY
# 49=LABORATORY
# 4=ASSAM
# 5=CHATTISGARH
# 7=GOA
# 8=GUJARAT
# 9=HARYANA


import sys, getopt
from datetime import datetime
from datetime import timedelta
import sqlite3 as lite
import requests
from BeautifulSoup import BeautifulSoup
import hashlib

def main(argv):
    run_type = 'daily'
    today = datetime.utcnow().date()
    yesterday = today - timedelta(2)
    date = yesterday.strftime("%d/%m/%Y")
    state_no = 'all'
    try:
        opts, args = getopt.getopt(argv,"hi:o:",["runtype=","date=","state_no="])
    except getopt.GetoptError:
        print "Exception"
        print 'scraper.py --runtype=daily --date="24/08/2014" --state_no=all'
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print 'scraper.py --runtype=daily --date="24/08/2014" --state_no=all'
            sys.exit()
        elif opt in ("-r", "--run_type"):
            run_type = arg
        elif opt in ("-o", "--date"):
            date = arg
        elif opt in ("-s", "--state_no"):
            state_no = arg

    print "INPUT COMMAND "+run_type+" job for date="+date+" state="+state_no

    single_state = None
    if state_no == "all":
        states = [5,7,8,9, 10,11,12,13,15,16,20,22,23,24,25,26,28,32,33,36,37,40,41,45,46,49,2,4]
    else:
        states = [state_no]

    for single_state in states:
        con = lite.connect('./database/imd.sqlite')
        cur = con.cursor()
        print "Running "+run_type+" job for date="+date+" state="+str(single_state)
        baseurl = "http://imdaws.com/WeatherARGData.aspx?&FromDate="+str(date)+"&ToDate="+str(date)+"&State="+str(single_state)
        m = hashlib.md5()
        m.update(baseurl)
        url_hash = m.hexdigest()
        print str(url_hash)
        #first check if the request already has been made
        query = 'select url_hash, content, status, parsed, url, p_date, p_state from requests where url_hash="'+url_hash+'"'
        cur.execute(query)
        results = cur.fetchone()


        scrape_required = False
        html_content = ""
        parsed = "no"

        #if no requests found
        if results == None:
            print "No requests and hence INSERTING into REQUESTS"
            insert_data = {"url_hash": url_hash, "status":"999","parsed":"no","url":baseurl, "p_date":date, "p_state":single_state}
            cur.execute('INSERT INTO requests (url_hash, status, parsed, url, p_date, p_state) VALUES (:url_hash, :status, :parsed, :url, :p_date, :p_state)', insert_data)
            con.commit()
            scrape_required = True
        else:
            print "REQUESTS Exists"
            parsed = results[3]
            print str(results[2])
            if str(results[2]) == "200":
                print "Has valid content"
                html_content = results[1]
                #if already parsed then no need to parse
                if parsed == "yes":
                    print "Parsed = yes, so go to next"
                    continue
            else:
                scrape_required = True

        if scrape_required:
            print "Scrape the data from web"
            print str(baseurl)
            r = requests.get(baseurl)
            if r.status_code == 200:
                #update status and html_content
                print "UPDATE REQUESTS"
                cur.execute("UPDATE requests SET status=?, content=? WHERE url_hash=?", ( str(r.status_code), str(r.text), str(url_hash) )  )
                con.commit()
                html_content = str(r.text)
                parsed = "no"
            else:
                #may be we can try later, now continue
                continue


        if parsed == "no":
            print "Parsed = No, so parse"
            print html_content
            soup = BeautifulSoup(html_content)
            tables = soup.findAll(id="DeviceData")
            for k in range(0, len(tables[0].contents)):
                if k <= 1:
                    continue
                #ignore if not tr
                columns = []
                if getattr(tables[0].contents[k], 'name', None) == 'tr':
                    row = tables[0].contents[k]
                    for r in range(0, len(row.contents)):
                        if getattr(row.contents[r], 'name', None) == 'td': 
                            td_column = row.contents[r]
                            #print td_column
                            if len(td_column.contents[0]) > 0:                       
                                value = td_column.contents[0].contents[0]
                                columns.append(value)
                            else:
                                columns.append("")
                else:
                    continue
                print str(columns)  
                station_id_name = columns[1]
                station_id_name = station_id_name.replace("'", '')

                query = "select location_id from locations where location='"+station_id_name+"'"
                cur.execute(query)
                results = cur.fetchone()
                station_id = ""
                if results == None:
                    pass
                else:
                    station_id = results[0]


                insert_weather_data = {"station_id": station_id_name, "date":columns[2], "time_utc":columns[3], "lat":columns[4], "lng":columns[5], "rainfall":columns[6], "temp":columns[7],"temp_max":columns[8], "temp_min":columns[9], "state":single_state, "url_hash":url_hash}
                cur.execute('INSERT INTO weather (station_id, date, time_utc, lat, lng, rainfall, temp,temp_max, temp_min, state, url_hash) VALUES (:station_id, :date, :time_utc, :lat, :lng, :rainfall, :temp,:temp_max, :temp_min, :state, :url_hash)', insert_weather_data)
                con.commit()
            cur.execute("UPDATE requests SET parsed=? WHERE url_hash=?", (  str("yes"), str(url_hash) )  )
            con.commit()
        con.close()



if __name__ == "__main__":
    main(sys.argv[1:])