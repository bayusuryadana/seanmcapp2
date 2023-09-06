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
        self.cursor.execute("""SELECT * FROM stalls
                            WHERE (name ILIKE %(name)s OR %(name)s IS NULL)
                            AND (city_id = %(city_id)s OR %(city_id)s IS NULL)
                            AND (
                                (latitude IS NOT NULL AND longitude IS NOT NULL 
                                AND latitude <= %(nw_lat)s AND latitude >= %(se_lat)s
                                AND longitude <= %(nw_lng)s AND longitude >= %(se_lng)s)
                                OR
                                (%(nw_lat)s IS NULL OR %(se_lat)s IS NULL OR %(nw_lng)s IS NULL OR %(se_lng)s IS NULL)
                            )
                            """, {
                                "name": f'%{request.name}%' if request.name else None, 
                                "city_id": request.city_id, 
                                "nw_lat": request.geo['nw']['lat'] if request.geo else None,
                                "se_lat": request.geo['se']['lat'] if request.geo else None,
                                "nw_lng": request.geo['nw']['lng'] if request.geo else None,
                                "se_lng": request.geo['se']['lng'] if request.geo else None,
                            })
        stalls = self.cursor.fetchall()
        return stalls
    
    def _wallet_get_saving_account(self, date=None):
        done = True if date is None else None
        query = """SELECT SUM(amount) FROM wallets 
                            WHERE account = %(account)s
                            AND (done = %(done)s OR %(done)s IS NULL) 
                            AND (date <= %(date)s OR %(date)s IS NULL)"""
        self.cursor.execute(query, {"account": "DBS", "done": done, "date": date})
        dbs = self.cursor.fetchall()[0]['sum']
        self.cursor.execute(query, {"account": "BCA", "done": done, "date": date})
        bca = self.cursor.fetchall()[0]['sum']
        return dbs, bca
    
    def wallet_dashboard(self, date):
        def _simplified_result(wallet_data):
            result = {}
            for w in wallet_data:
                result[w['category']] = w['sum']
            return result

        balance_query = """SELECT date as category, SUM(monthly_expenses::int) OVER (PARTITION BY account ORDER BY date) AS sum FROM (
                                SELECT date, account, SUM(amount) as monthly_expenses FROM wallets 
                                WHERE date <= %(date)s AND account = %(account)s GROUP BY date, account
                            ) as w1 ORDER BY date desc LIMIT 12"""
        self.cursor.execute(balance_query, {"account": "DBS", "date": date})
        balance = _simplified_result(self.cursor.fetchall())

        expenses_query = """SELECT category, sum(-amount) FROM wallets WHERE (date / 100) = %(truncated_date)s AND done = true AND account = 'DBS' 
                            AND category NOT IN ('Bonus', 'ROI', 'Salary', 'Temp', 'Transfer') GROUP BY category"""
        self.cursor.execute(expenses_query, {"truncated_date": int(date) // 100})
        last_year_expenses = _simplified_result(self.cursor.fetchall())

        self.cursor.execute(expenses_query, {"truncated_date": (int(date) // 100) - 1})
        ytd_expenses = _simplified_result(self.cursor.fetchall())

        dbs, bca = self._wallet_get_saving_account()

        return {
            "chart": {
                "balance": balance,
                "last_year_expenses": last_year_expenses,
                "ytd_expenses": ytd_expenses, 
                "pie": "not yet implemented!"
            },
            "dbs": dbs,
            "bca": bca
        }

    def wallet_data(self, date):
        self.cursor.execute("SELECT * FROM wallets WHERE date=%s", (date,))
        this_month_data = self.cursor.fetchall()
        dbs, bca = self._wallet_get_saving_account()
        planned_sgd, planned_idr = self._wallet_get_saving_account(date)
        return {
            "data": this_month_data,
            "dbs": dbs,
            "bca": bca,
            "planned": {
                "sgd": planned_sgd,
                "idr": planned_idr
            }
        }
    
    def wallet_create(self, wallet: Wallet):
        query = """INSERT INTO wallets (id, date, name, category, currency, amount, done, account) 
                    VALUES (DEFAULT, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id"""
        data = (wallet.date, wallet.name, wallet.category, wallet.currency, wallet.amount, wallet.done, wallet.account)
        try: 
            self.cursor.execute(query, data) 
            id_new_row = self.cursor.fetchone()
            self.conn.commit()
        except Exception as e: 
            self.conn.rollback()
            raise e
        return id_new_row
    
    def wallet_update(self, wallet: Wallet):
        if (wallet.id is None): raise AttributeError('id not found')
        query = """UPDATE wallets SET date=%s, name=%s, category=%s, currency=%s, amount=%s, done=%s, account=%s WHERE id = %s"""
        data = (wallet.date, wallet.name, wallet.category, wallet.currency, wallet.amount, wallet.done, wallet.account, wallet.id)
        try: 
            self.cursor.execute(query, data) 
            is_success = self.cursor.rowcount
            self.conn.commit()
        except Exception as e: 
            self.conn.rollback()
            raise e
        return is_success
    
    def wallet_delete(self, id):
        query = """DELETE FROM wallets WHERE id=%s"""
        data = (id,)
        try:
            self.cursor.execute(query, data)
            is_success = self.cursor.rowcount
            self.conn.commit()
        except Exception as e: 
            self.conn.rollback()
            raise e
        return is_success
    
    def instagram(self):
        self.cursor.execute("SELECT * FROM accounts WHERE group_type = 2")
        accounts = self.cursor.fetchall()
        
        # https://medium.com/@harshgolu82/scraping-instagram-using-python-and-scrapy-%EF%B8%8F-ca4af5ed4dc1
        # image fetched min = 4 (should be 6 to be save from pinned), max= 63
        headers = {
            "x-asbd-id": '198387',
            "x-csrftoken": "gqeYY9dr1dCwfvtyZCgy88tcMn1A2N85",
            "x-ig-app-id": '936619743392459',
            "x-requested-with": "XMLHttpRequest"
        }

        result = []
        for acc in accounts:
            id = acc['id']
            username = acc['alias']
            print(f'{id}:{username}')
            response = requests.get(f'https://www.instagram.com/api/v1/feed/user/{id}/?count=6&max_id=', headers = headers)
            if (response.status_code != 200):
                response = requests.get(f'https://www.instagram.com/api/v1/feed/user/{username}/username/?count=6&max_id=', headers = headers)
            json_response = json.loads(response.text)
            items = json_response['items']
            # next_max_id = json_response['next_max_id']

            self.cursor.execute('SELECT * FROM caches WHERE account_id = %s', (id, ))
            cache = self.cursor.fetchone()
            cache_value_set = set(cache['value'].split(',')) if cache is not None and cache.get('value') is not None else []
            new_pk_list = [i['pk'] for i in items]
            diff_set = set([x for x in new_pk_list if x not in cache_value_set])

            items_diff = [x for x in items if x['pk'] in diff_set]
            for item in items_diff:
                display_url = item['image_versions2']['candidates'][0]['url']
                caption = (item['caption']['text'] if item.get('caption') is not None else '')
                _telegram_send_photo_with_caption(telegram_private_chat_id, f'<b>{username}</b> {caption}', display_url)

            new_cache_value = ''
            for d in new_pk_list[:-1]:
                new_cache_value += d + ','
            else:
                new_cache_value += new_pk_list[-1]
            
            if cache is None:
                self.cursor.execute("INSERT INTO caches VALUES ('instapost', %s, NULL, %s)", (new_cache_value, id))
            else:
                self.cursor.execute("UPDATE caches SET value = %s WHERE account_id = %s", (new_cache_value, id))
            self.conn.commit()

            result.append({
                "username": username,
                "new_pk_list": list(map(str, diff_set))
            })
        
        return result


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
            response = json.loads(_request(url))
            lat = response['results'][0]['geometry']['location']['lat']
            lng = response['results'][0]['geometry']['location']['lng']
            self.cursor.execute("UPDATE stalls SET latitude = %s, longitude = %s WHERE id = %s", (lat, lng, stall['id']))
            updated_rows += self.cursor.rowcount
            self.conn.commit()
        return str(updated_rows)

########## util in this package ##########

def _request(url):
    # https://saturncloud.io/blog/how-to-bypass-cloudflare-with-python-on-get-requests/
    # https://saturncloud.io/blog/how-to-fix-python-requests-being-blocked-by-cloudflare/
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    return requests.get(url, headers=headers).text

def _telegram_send_message(chat_id, text):
    sanitized_text = urllib.parse.quote(text)
    query_url = telegram_bot_endpoint + '/sendmessage?chat_id=' + str(chat_id) + '&text=' + sanitized_text + '&parse_mode=markdown&disable_web_page_preview=true&disable_notification=true'
    response = _request(query_url)
    print('[INFO] send message to chat_id: ' + str(chat_id) + ' with text: ' + sanitized_text)
    return response

def _telegram_send_photo_with_caption(chat_id, caption, display_url):
    sanitized_caption = urllib.parse.quote(caption)
    sanitized_display_url = urllib.parse.quote(display_url)
    query_url = f'{telegram_bot_endpoint}/sendphoto?chat_id={chat_id}&photo={sanitized_display_url}&caption={sanitized_caption}&parse_mode=html'
    response = _request(query_url)
    print(f'[INFO] send photo to chat_id: {chat_id} with caption: {caption}')
    return response

def scheduled_news():
    news_list = [Detik, Tirtol, Kumparan, Mothership, CNA]
    message = 'Awali harimu dengan berita \U0001f4f0 dari **Seanmctoday** by @seanmcbot\n\n'
    for news in news_list:
        try:        
            html = _request(news.url)
            title, url = news.parse(html)
            message += news.flag + ' ' + news.name + ' - [' + title + '](' + url + ')\n\n'
        except Exception as e:
            print(news.name + ': ' + str(e))
    _telegram_send_message(telegram_private_chat_id, message)