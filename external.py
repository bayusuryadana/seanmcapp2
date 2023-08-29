import requests
import json

def fetch():
    response = requests.get('http://seanmcapp.herokuapp.com/api/news').text
    return json.loads(response)