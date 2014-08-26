# IMD Data Scraper #

Scrapes IMD data and saves into SQLITE. Can also export into CSV, JSON

Ref: http://imdaws.com/ViewArgData.aspx 

## Download ##

Downlonad from the releases and or clone the git project.


## Install Dependencies ##
`
pip install -r requirements
`

## To run ##


#### default: download day before yesterdays data for all states ####

`
--default
python scrape.py

--or for a specific date
scraper.py --runtype=daily --date="24/08/2014" --state_no=all

`

#### Get help on parameters ####

`
python scrape.py -h 
`

### Export ####
Weather data is in weather table. Make sure you take the distinct values of the table. 

`
#to export as json
datafreeze export_json.yaml
`

`
#to export as csv
datafreeze export_csv.yaml
`


## Author ##

Thejesh GN <i@thejeshgn.com>

Fingerprint: C7D4 1911 9893 ADAF 27B0 FCAA BFFC 8DD3 C06D D6B0

<table>
  <tr>
    <td><img src="http://www.gravatar.com/avatar/4545b2a84b0ae407abc97ad8f23cc28b?s=60"></td><td valign="middle">Thejesh GN<br><a href="http:/thejeshgn.com">http://thejeshgn.com</a></td>
    <td>i-at-thejeshgn-com <br> GPG ID :  0xBFFC8DD3C06DD6B0</td>
  </tr>
</table>


## License ##
IMD Data Scraper - Scrapes IMD data and saves into SQLITE. Can also export into CSV, JSON
Copyright (C) 2014  Thejesh GN <i@thejeshgn.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.


## State Codes ##

10=HIMACHAL PRADESH \\
11=JHARKHAND \\
12=KARNATAKA \\
13=KERALA \\
15=MADHYA PRADESH \\
16=MAHARASHTRA \\
20=ORISSA \\
22=PUNJAB \\
23=RAJASTHAN \\
24=SIKKIM \\
25=TAMIL NADU \\
26=UTTAR PRADESH \\
28=WEST BENGAL \\
2=ANDHRA PRADESH \\
32=DELHI \\
33=UTTARAKHAND \\
36=BIHAR \\
37=DAMAN &amp; DIU \\
40=JAMMU &amp; KASHMIR \\
41=TRIPURA \\
45=NEW DELHI \\
46=PUDUCHERRY \\
49=LABORATORY \\
4=ASSAM \\
5=CHATTISGARH \\
7=GOA \\
9=HARYANA \\
8=GUJARAT \\