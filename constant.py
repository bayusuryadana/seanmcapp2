import os
from bs4 import BeautifulSoup

telegram_bot_endpoint = os.environ['TELEGRAM_BOT_ENDPOINT']
telegram_private_chat_id = 274852283
telegram_group_chat_id = -1001359004262
wallet_password = os.environ['WALLET_PASSWORD']

# region news model

class Detik:
    name = 'Detik'
    url = 'https://www.detik.com/'
    flag = '\U0001F1EE\U0001F1E9'

    def parse(html):
        soup = BeautifulSoup(html, 'html.parser')
        tag = soup.select_one('[dtr-evt=headline]')
        return tag.get('dtr-ttl'), tag.get('href')
    
class Tirtol:
    name = 'Tirtol'
    url = 'https://tirto.id'
    flag = '\U0001F1EE\U0001F1E9'

    def parse(html):
        soup = BeautifulSoup(html, 'html.parser')
        tag_list = [t for t in soup.select('.welcome-title') if t.text == 'POPULER']
        if (len(tag_list) > 0):
            tag = tag_list[0].parent.parent.parent.select_one('.mb-3 a')
            return tag.text, 'https://tirto.id' + tag.get('href')
        else:
            raise Exception('tag POPULER not found' )

class Kumparan:
    name = 'Kumparan'
    url = 'https://kumparan.com/trending'    
    flag = '\U0001F1EE\U0001F1E9'

    def parse(html):
        soup = BeautifulSoup(html, 'html.parser')
        tag = soup.select_one('[data-qa-id=news-item]')
        return tag.select_one('[data-qa-id=title]').text, 'https://kumparan.com' + tag.select_one('a').get('href')
    
class Mothership:
    name = 'Mothership'
    url = 'https://mothership.sg'    
    flag = '\U0001F1F8\U0001F1EC'

    def parse(html):
        soup = BeautifulSoup(html, 'html.parser')
        tag = soup.select_one('.main-item > .top-story')
        return tag.select_one('h1').text, tag.select_one('a').get('href')
    
class CNA:
    name = 'CNA'
    url = 'https://www.channelnewsasia.com/news/singapore'    
    flag = '\U0001F1F8\U0001F1EC'

    def parse(html):
        soup = BeautifulSoup(html, 'html.parser')
        tag = soup.select_one('.card-object h3')
        return tag.text.strip(), 'https://www.channelnewsasia.com' + tag.select_one('a').get('href')

# endregion
