from database import Database, scheduled_news
from dotenv import load_dotenv
from flask import Flask, render_template, request
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

@app.route('/api/<path:path>', methods = ['POST', 'GET'])
def api(path):
    match path:
        case 'mamen':
            if request.method == 'POST':
                result = db.mamen_search(MamenRequest(request.get_json()))
                return app.response_class(
                    response=GenericResponse(data=result).toJson(),
                    status=200,
                    mimetype='application/json'
                )
            # else:
                # return db.mamen_fetch_lat_lng()
        # case 'news':
        #     scheduled_news()
        #     return 'done'
        case _:
            return 'API'

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template('index.html')

@app.errorhandler(Exception)
def handle_exception(e):
    return app.response_class(
        response=GenericResponse(error=str(e)).toJson(),
        status=500,
        mimetype='application/json'
    )

############### scheduled task starts here ###############

def scheduled_task():
    # https://schedule.readthedocs.io/en/stable/
    schedule.every().day.at('06:00', 'Asia/Jakarta').do(db.scheduled_birthday)
    schedule.every().day.at('08:00', 'Asia/Jakarta').do(scheduled_news)
    # all_jobs = schedule.get_jobs()
    # for j in all_jobs:
    #     print(j.next_run)
    while True:
        schedule.run_pending()
        sleep(1)

thread = threading.Thread(target=scheduled_task)
thread.daemon = True
thread.start()
