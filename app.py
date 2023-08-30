from database import Database
from external import fetch
from dotenv import load_dotenv
from flask import Flask, render_template
from time import sleep
import threading, atexit, schedule
from util import *

load_dotenv() # development use only
db = Database()
    
def cleanup():
    print('stopping all scheduled task...')
    schedule.clear()
    print('closing DB connection...')
    db.close_connection
    print('bye bye :)')

atexit.register(cleanup)

#################### route starts here ####################

app = Flask(__name__, static_folder='__templates__/static', template_folder='__templates__')

@app.route('/api/<path:path>')
def api(path):
    match path:
        case 'dota':
            return fetch()
        case _:
            return 'API'

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template('index.html')

############### scheduled task starts here ###############

def scheduled_task():
    # https://schedule.readthedocs.io/en/stable/
    schedule.every().day.at('06:00', 'Asia/Jakarta')
    while True:
        schedule.run_pending()
        sleep(1)

thread = threading.Thread(target=scheduled_task)
thread.daemon = True
thread.start()