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
    yesterday = today - timedelta(1)
    date = yesterday.strftime("%d/%m/%Y")
    state_no = 'all'
    try:
        opts, args = getopt.getopt(argv,"hi:o:",["runtype=","date=","state_no="])
    except getopt.GetoptError:
        print 'scraper.py -r <run_type> -d <date> -s <state_no>'
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print 'scraper.py -r <run_type> -d <date> -s <state_no>'
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
        states = [12]
    else:
        states = [state_no]

    for single_state in states:
        con = lite.connect('/media/thej/data2/imd/database/imd.sqlite')
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
            if results[2] == "200":
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
                parsed = "no"
            else:
                #may be we can try later, now continue
                continue


        if parsed == "no":
            print "Parsed = No, so parse"
            soup = BeautifulSoup(html_content)
            tables = soup.findAll(id="DeviceData")
            for k in range(0, len(tables[0].contents)):
                if k <= 1:
                    continue
                #ignore if not tr
                if getattr(tables[0].contents[k], 'name', None) == 'tr':
                    columns = []
                    row = tables[0].contents[k].contents
                    for r in range(0, len(row[k].contents)):
                        print getattr(row[k].contents[r], 'name', None)
                        if getattr(row[k].contents[r], 'name', None) == 'span': 
                            if len(row[k].contents[r].contents) > 0:                       
                                value = row[k].contents[r].contents[0]
                                columns.append(value)
                    print str(columns)        
                else:
                    continue




if __name__ == "__main__":
    main(sys.argv[1:])