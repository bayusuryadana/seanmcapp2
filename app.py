from .database import Database
from .external import fetch
from .task import job
from dotenv import load_dotenv
from flask import Flask, render_template
from time import sleep
import threading, configparser, atexit, schedule

class App:
    def __init__(self):
        load_dotenv() # development use only
        cfg = configparser.ConfigParser()
        cfg.read('app.ini')
        self.db = Database(cfg)
    
app = App()

def cleanup():
    print('stopping all scheduled task...')
    schedule.clear()
    print('closing DB connection...')
    app.db.close_connection
    print('bye bye :)')

atexit.register(cleanup)

#################### route starts here ####################

flask = Flask(__name__, static_folder='__templates__/static', template_folder='__templates__')

@flask.route('/api/<path:path>')
def api(path):
    match path:
        case 'dota':
            return fetch()
        case 'person':
            return app.db.get_people()
        case _:
            return 'API'

@flask.route('/', defaults={'path': ''})
@flask.route('/<path:path>')
def index(path):
    return render_template('index.html')

############### scheduled task starts here ###############

def scheduled_task():
    # https://schedule.readthedocs.io/en/stable/
    schedule.every(5).seconds.do(job)
    schedule.every(2).seconds.do(job)
    while True:
        schedule.run_pending()
        sleep(1)

thread = threading.Thread(target=scheduled_task)
thread.daemon = True
thread.start()