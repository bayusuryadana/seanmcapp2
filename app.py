import atexit, schedule, threading
from constant import wallet_password
from database import Database, scheduled_news
from dotenv import load_dotenv
from flask import Flask, render_template, request
from flask_httpauth import HTTPBasicAuth
from time import sleep
from util import *
from werkzeug.security import generate_password_hash, check_password_hash

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
auth = HTTPBasicAuth()

users = {
    "bayu": generate_password_hash(wallet_password)
}

@app.route('/api/wallet/<path:path>', methods = ['GET', 'POST'])
@auth.login_required
def wallet_get_auth(path):
    match request.method:
        case 'GET':
            match path:
                case 'dashboard':
                    date = request.args.get('date')
                    response = db.wallet_dashboard(date)
                    return success_handler(response)
                case 'porto':
                    response = db.wallet_porto_dashboard()
                    return success_handler(response)
        case 'POST':
            match path:
                case 'login':
                    return success_handler({"message": "Success."})
                case 'create':
                    response = db.wallet_create(Wallet(request.get_json()))
                    return success_handler(response)
                case 'update':
                    response = db.wallet_update(Wallet(request.get_json()))
                    return success_handler(response)
                case 'delete':
                    id = request.get_json()['id']
                    response = db.wallet_delete(id)
                    return success_handler(response)

@app.route('/api/<path:path>', methods = ['GET', 'POST'])
def api(path):
    match path:
        case 'mamen':
            if request.method == 'POST':
                result = db.mamen_search(MamenRequest(request.get_json()))
                return success_handler(result)
        case 'city-list':
            if request.method == 'GET':
                result = db.mamen_cities()
                return success_handler(result)
        # case 'instagram':
        #     if request.method == 'GET':
        #         result = db.instagram()
        #         return success_handler(result)
        # case 'stalls':
        #         return db.mamen_fetch_lat_lng()
        # case 'cities':
        #         return db.cities_fetch_lat_lng()
        # case 'news':
        #     scheduled_news()
        #     return 'done'
        case _:
            raise Exception('resource not found')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template('index.html')

def success_handler(data):
    return app.response_class(
        response=GenericResponse(data=data).toJson(),
        status=200,
        mimetype='application/json'
    )

@app.errorhandler(Exception)
def handle_exception(e):
    return app.response_class(
        response=GenericResponse(error=str(e)).toJson(),
        status=500,
        mimetype='application/json'
    )

@auth.verify_password
def verify_password(username, password):
    if username in users and check_password_hash(users.get(username), password):
        return username
    return None 
    
@auth.error_handler
def auth_error():
    error_message = {
        "message": "Access Denied."
    }
    return app.response_class(
        response=GenericResponse(error=error_message).toJson(),
        status=403,
        mimetype='application/json'
    )

############### scheduled task starts here ###############

def scheduled_task():
    # https://schedule.readthedocs.io/en/stable/
    schedule.every().day.at('06:00', 'Asia/Jakarta').do(db.scheduled_birthday)
    schedule.every().day.at('08:00', 'Asia/Jakarta').do(scheduled_news)
    schedule.every().day.at('20:00', 'Asia/Singapore').do(db.instagram)
    # all_jobs = schedule.get_jobs()
    # for j in all_jobs:
    #     print(j.next_run)
    while True:
        schedule.run_pending()
        sleep(1)

thread = threading.Thread(target=scheduled_task)
thread.daemon = True
thread.start()
