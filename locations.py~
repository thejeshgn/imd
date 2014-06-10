import sys, getopt
from datetime import datetime
from datetime import timedelta
import sqlite3 as lite
import requests
from BeautifulSoup import BeautifulSoup
import hashlib
import time
#states = {"HIMACHAL PRADESH":10, "JHARKHAND":11, "KARNATAKA":12, "KERALA":13, "MADHYA PRADESH":15, "MAHARASHTRA":16, "ORISSA":16, "PUNJAB":22, "RAJASTHAN": 23, "SIKKIM":24, "TAMIL NADU":25, "UTTAR PRADESH":26,"WEST BENGAL": 28, "ANDHRA PRADESH":2, "DELHI": 32, "UTTARAKHAND": 33,"BIHAR": 36, "DAMAN &amp; DIU":37, "JAMMU &amp; KASHMIR":40, "TRIPURA":41, "NEW DELHI":45,  "PUDUCHERRY":46, "LABORATORY":49, "ASSAM":4,  "CHATTISGARH":5, "GOA":7, "GUJARAT":8, "HARYANA":9}

states = {"HIMACHAL PRADESH":10,  "KARNATAKA":12,   "MAHARASHTRA":16, "ORISSA":16, "RAJASTHAN": 23, "SIKKIM":24, "TAMIL NADU":25, "UTTAR PRADESH":26, "ANDHRA PRADESH":2, "DELHI": 32, "UTTARAKHAND": 33,  "JAMMU &amp; KASHMIR":40, "TRIPURA":41, "NEW DELHI":45,  "PUDUCHERRY":46, "LABORATORY":49, "ASSAM":4,  "CHATTISGARH":5, "GOA":7, "GUJARAT":8}


con = lite.connect('/home/thej/Documents/code/imd/database/imd.sqlite')
cur = con.cursor()

for state, state_id in states.iteritems():
	#Send State ID to get 
	state_url = "http://imdaws.com/DistrictData.aspx?DevType=ARG&StateId="+str(state_id)
	time.sleep(10)
	r = requests.get(state_url)
	if r.status_code == 200:
		content = r.text
		district_key_pairs_list=content.split("|")
		for district_pair in district_key_pairs_list:
			district_array = district_pair.split(":")
			if len(district_array)> 1:
				district     = district_array[0]
				district_id = district_array[1]
				#Then send district to get the Locations
				district_url ="http://imdaws.com/LocData.aspx?DevType=ARG&StateId="+str(state_id)+"&DistId="+district_id
				time.sleep(60)
				r2 = requests.get(district_url)
				if r2.status_code == 200:
					content = r2.text
					loc_key_pairs_list=content.split("|")
					for loc_pair in loc_key_pairs_list:
						loc_array = loc_pair.split(":")
						if len(loc_array)> 1:
							location     = loc_array[0]
							location_id = loc_array[1]
							insert_data = {"location_id":location_id  , "location":location , "district_id":district_id , "district":district , "state_id":str(state_id) , "state":state }
							print insert_data
							cur.execute('INSERT INTO locations (location_id  , location , district_id , district , state_id , state ) VALUES (:location_id  , :location , :district_id , :district , :state_id , :state )', insert_data)
							con.commit()


con.close()
