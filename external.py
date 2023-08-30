import requests, json, os, urllib.parse

telegram_bot_endpoint = os.environ['TELEGRAM_BOT_ENDPOINT']
telegram_private_chat_id = 274852283

def telegram_send_message(chat_id, text):
    sanitized_text = urllib.parse.quote(text)
    query_url = telegram_bot_endpoint + '/sendmessage?chat_id=' + str(chat_id) + '&text=' + sanitized_text + '&parse_mode=markdown&disable_web_page_preview=true&disable_notification=true'
    response = requests.get(query_url)
    print('[INFO] send message to chat_id: ' + str(chat_id) + ' with text: ' + sanitized_text)
    return response

def fetch():
    response = requests.get('http://seanmcapp.herokuapp.com/api/news').text
    return json.loads(response)