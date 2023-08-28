import requests

def fetch():
    return requests.get('http://seanmcapp.herokuapp.com/api/news').content