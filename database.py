import psycopg2, os, urllib.parse, requests, json, re
from functools import lru_cache
from psycopg2.extras import RealDictCursor
from datetime import timedelta
from util import *
from constant import *

class Database:
    def __init__(self):
        self.conn = psycopg2.connect(
            database = os.environ['DATABASE_NAME'],
            host = os.environ['DATABASE_HOST'],
            user = os.environ['DATABASE_USER'],
            password = os.environ['DATABASE_PASS'],
            port = 5432
        )
        self.cursor = self.conn.cursor(cursor_factory=RealDictCursor)

    def close_connection(self):
        self.conn.close()

    def scheduled_birthday(self):
        self.cursor.execute("SELECT * FROM people")
        people = self.cursor.fetchall()
        
        today = get_current_time()
        tomorrow = today + timedelta(days=1)
        next_week = today + timedelta(days=7)

        birthday_today = [x for x in people if x['day'] == today.day and x['month'] == today.month]
        birthday_tomorrow = [x for x in people if x["day"] == tomorrow and x['month'] == tomorrow.month]
        birthday_next_week = [x for x in people if x["day"] == next_week and x['month'] ==  next_week.month]
        
        for p in birthday_today:
            _telegram_send_message(telegram_private_chat_id, 'Today is ' + p['name'] + '\'s birthday !!')
        for p in birthday_tomorrow:
            _telegram_send_message(telegram_private_chat_id, 'Tomorrow is ' + p['name'] + '\'s birthday !!')
        for p in birthday_next_week:
            _telegram_send_message(telegram_private_chat_id, 'Next week is ' + p['name'] + '\'s birthday !!')

    def mamen_search(self, request: MamenRequest):
        self.cursor.execute("SELECT * FROM stalls")
        stalls = self.cursor.fetchall()
        if request.name is not None:
            stalls = [s for s in stalls if re.search(request.name, s['name'])]
        if request.city_id is not None:
            stalls = [s for s in stalls if request.city_id == s['city_id']]
        if request.geo is not None:
            nw = request.geo.nw
            se = request.geo.se
            stalls = [s for s in stalls 
                    if (s['latitude'] is not None) and (s['longitude'] is not None) and 
                    (s['latitude'] <= nw['lat']) and (s['latitude'] >= se['lat']) and
                    (s['longitude'] <= nw['lng']) and (s['longitude'] >= se['lng'])]
        return stalls

    ########## reserved function area ##########

    def mamen_fetch_lat_lng(self):
        self.cursor.execute("SELECT * FROM stalls")
        stalls = self.cursor.fetchall()
        filtered_stalls = [s for s in stalls if s['latitude'] is None or s['longitude'] is None]
        google_api_key = os.environ['GOOGLE_API_KEY']
        updated_rows = 0
        for stall in filtered_stalls:
            sanitized_plus_code = urllib.parse.quote(stall['plus_code'])
            url = 'https://maps.googleapis.com/maps/api/geocode/json?key=' + google_api_key + '&address=' + sanitized_plus_code
            response = json.loads(requests.get(url).text)
            lat = response['results'][0]['geometry']['location']['lat']
            lng = response['results'][0]['geometry']['location']['lng']
            self.cursor.execute("UPDATE stalls SET latitude = %s, longitude = %s WHERE id = %s", (lat, lng, stall['id']))
            updated_rows += self.cursor.rowcount
            self.conn.commit()
        return str(updated_rows)

########## util in this package ##########

def _telegram_send_message(chat_id, text):
    sanitized_text = urllib.parse.quote(text)
    query_url = telegram_bot_endpoint + '/sendmessage?chat_id=' + str(chat_id) + '&text=' + sanitized_text + '&parse_mode=markdown&disable_web_page_preview=true&disable_notification=true'
    response = requests.get(query_url)
    print('[INFO] send message to chat_id: ' + str(chat_id) + ' with text: ' + sanitized_text)
    return response

def fetch():
    response = requests.get('http://seanmcapp.herokuapp.com/api/news').text
    return json.loads(response)
    