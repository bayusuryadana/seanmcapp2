import os
from bs4 import BeautifulSoup

telegram_bot_endpoint = os.environ['TELEGRAM_BOT_ENDPOINT']
telegram_private_chat_id = 274852283

# region city enum
city_dict = {
    1 : "Jakarta", 
    2 : "Surabaya", 
    3 : "Bali",
    4 : "Pekanbaru",
    5 : "Batam",
    6 : "Palembang",
    7 : "BandarLampung",
    8 : "Bangka",
    9 : "Belitung",
    10 : "Padang",
    11 : "Nias",
    12 : "Bukittinggi",
    13 : "Singkawang",
    14 : "Palangkaraya",
    15 : "Banjarmasin",
    16 : "Samarinda",
    17 : "Tangerang",
    18 : "Yogyakarta",
    19 : "Pontianak",
    20 : "Bogor",
    21 : "Semarang",
    22 : "Bandung",
    23 : "Manado",
    24 : "BandaAceh",
    25 : "Medan",
    26 : "Solo",
    27 : "Madura",
    28 : "Cirebon",
    29 : "TangerangSelatan",
    30 : "Malang",
    31 : "Kediri",
    32 : "Purwakarta",
    33 : "Tegal",
    34 : "Balikpapan",
    35 : "Sukabumi",
    36 : "Lombok",
    37 : "Makassar",
    38 : "Purwokerto",
    39 : "Penang",
    40 : "KualaLumpur",
    41 : "Karawang",
    42 : "Serang",
    43 : "Cilegon",
    44 : "Bekasi",
    45 : "Tasikmalaya",
    46 : "Subang",
    47 : "Jambi",
    48 : "Bengkulu",
    49 : "Kupang",
    50 : "Ternate",
    51 : "Ambon",
    52 : "Depok",
    53 : "Karangasem",
    54 : "Sorong",
    55 : "Jayapura"
}
# endregion

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