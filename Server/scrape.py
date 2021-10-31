from bs4 import BeautifulSoup
from flask import current_app
import requests

def Scrape():
    print("Scrapingg......")
    site = "https://sks.itu.edu.tr/ExternalPages/sks/yemek-menu-v2/uzerinde-calisilan/yemek-menu.aspx?tip="
    r = requests.get(site)
    soup = BeautifulSoup(r.content, "html.parser")
    gelen_veri = soup.find_all("a",{"class":"js-nyro-modal"})
    food_names = []
    for yemek in gelen_veri:
        if yemek.text:
            if(len(yemek.text) > 40):
                continue
            food_names.append(yemek.text)    
    db = current_app.config["db"]
    if db.truncate_meals():
        for yemek in food_names:
            db.insert_food(yemek)
        return True
    return False