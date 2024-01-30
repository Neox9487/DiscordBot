from bs4 import BeautifulSoup
import requests
import os
import json
from dotenv import load_dotenv
import sys 

arr = sys.stdin.readline()
data = json.loads(arr)

painterID = data[0]
userID = data[1]

########## Set up ##########
load_dotenv()

ASSEST_PATH = os.getenv("ASSEST_PATH")
COOKIE = os.getenv("COOKIE")


HEADERS = {
    "Cookie":COOKIE,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3",
    "Sec-Fetch-Destt": "document",
    "Sec-Fetch-Mode":"navigate",
    "Sec-Fetch-Site":"cross-site",
    "Sec-Fetch-User":"?1",
    "Upgrade-Insecure-Requests":"1",
    "Referer": "https://www.pixiv.net/",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0"
}

########## Main ##########

res = requests.get(f"https://www.pixiv.net/users/{painterID}", headers=HEADERS)
html = res.text

soup = BeautifulSoup(html, "html.parser")

divs = soup.find_all("div", {"class":"_unit error-unit"})
err = False
for div in divs:
    if(div.find('h2').text == "發生了錯誤"):
        err = True

if(err):

    print("error")

else:

    if not os.path.isfile(f"{ASSEST_PATH}\\users\\{userID}.json"):

        os.chdir(ASSEST_PATH+"\\users")

        with open(f"{userID}.json", mode='wb') as f:

            data = {
                "userID":userID,
                "painterID":[]
            }

            data["painterID"].append(painterID)
            json.dump(data, open(f"{ASSEST_PATH}\\users\\{userID}.json",'w'))
        
        print("finish")
    
    else:

        os.chdir(ASSEST_PATH+"\\users")
        data = {}

        with open(f"{userID}.json", mode='rb') as f:

            data = json.load(open(f"{ASSEST_PATH}\\users\\{userID}.json",'rb'))

        with open(f"{userID}.json") as f:
           
           data["painterID"].append(painterID)
           json.dump(data, open(f"{ASSEST_PATH}\\users\\{userID}.json",'w'))

        print("finish")

