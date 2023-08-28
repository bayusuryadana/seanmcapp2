from flask import Flask, render_template
from api.news import fetch

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

if __name__ == '__main__':
    app.run(debug=True)