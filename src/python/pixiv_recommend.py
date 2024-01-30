from bs4 import BeautifulSoup
import requests
import os
import json
from dotenv import load_dotenv
import random
import sys 

start = sys.stdin.readline()

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

res1 = requests.get("https://www.pixiv.net/ajax/top/illust?mode=all&lang=zh_tw&version=6c38cc7c723c6ae8b0dc7022d497a1ee751824c0", headers=HEADERS)
id = json.loads(res1.text)

png_id = (id["body"]["page"]["follow"][int(random.uniform(1,40))])

res2 = requests.get(f"https://www.pixiv.net/artworks/{png_id}",headers=HEADERS)
soup = BeautifulSoup(res2.text, "lxml")

title_link = soup.find("meta", attrs={"property":"twitter:title"})
title = title_link.get("content")
description_link = soup.find("meta", attrs={"name":'description'})
description = description_link.get("content")

link = soup.find("meta", attrs={"id":"meta-preload-data"})
link_json = json.loads(link.get("content"))

res3 = requests.get(link_json["illust"][f"{png_id}"]["urls"]["original"], stream=True, headers=HEADERS)

########## End ##########

data = {}
# Request succed
if res3.status_code == 200:

    data['error'] = False
    data['title'] = title
    data['png_id'] = png_id
    data['description'] = description

    if not os.path.isfile(f"{ASSEST_PATH}\\images\\{png_id}.png"):
        os.chdir(ASSEST_PATH+"\\images")
        img = res3.raw.read()
        with open(f"{png_id}.png", mode='wb') as f:
            f.write(img)

    print(str(json.dumps(data)))
    
else:
    
    data['error'] = True
    print(str(json.dumps(data)))
    