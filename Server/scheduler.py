import schedule
import time
import requests

def job():
    r = requests.get('http://localhost:8080/scrape')

schedule.every().day.at("21:54").do(job)

while True:
    schedule.run_pending()
    time.sleep(1)