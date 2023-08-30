import psycopg2, os
from functools import lru_cache
from psycopg2.extras import RealDictCursor
from datetime import timedelta
from external import *
from util import *

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
            telegram_send_message(telegram_private_chat_id, 'Today is ' + p['name'] + '\'s birthday !!')
        for p in birthday_tomorrow:
            telegram_send_message(telegram_private_chat_id, 'Tomorrow is ' + p['name'] + '\'s birthday !!')
        for p in birthday_next_week:
            telegram_send_message(telegram_private_chat_id, 'Next week is ' + p['name'] + '\'s birthday !!')


        
    