from configparser import ConfigParser
import psycopg2, os
from functools import lru_cache

class Database:

    def __init__(self, cfg: ConfigParser):
        # port = cfg.get('Database', 'port', vars=os.environ)
        self.conn = psycopg2.connect(
            database = cfg.get('Database', 'database', vars=os.environ),
            host = cfg.get('Database', 'host', vars=os.environ),
            user = cfg.get('Database', 'user', vars=os.environ),
            password = cfg.get('Database', 'password', vars=os.environ),
            port = 5432
        )
        self.cursor = self.conn.cursor()

    def close_connection(self):
        self.conn.close()

    @lru_cache(maxsize=1)
    def get_people(self):
        print('not using cache !\n')
        self.cursor.execute("SELECT * FROM people")
        return self.cursor.fetchall()