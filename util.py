from datetime import datetime
import pytz, json

############### data structure ###############
class MamenRequest:

    name = None
    city_id = None
    geo = None

    def __init__(self, json):
        filter = json['filter']
        self.name = filter['name'] if filter.get('name') else None
        self.city_id = filter['city_id'] if filter.get('city_id') else None
        self.geo = filter['geo'] if filter.get('geo') else None

class GenericResponse:
    data = None
    error = None
    def __init__(self, data=None, error=None):
        if (data is not None):
            self.data = data
        if (error is not None):
            self.error = error
        
    def toJson(self):
        if self.data is not None:
            return json.dumps({"data": self.data})
        else:
            return json.dumps({"error": self.error})
        
class Wallet:
    date: int = None

    id: int = None
    name: str = None
    category: str = None
    currency: str = None
    amount: int = None
    done: bool = None
    account: str = None

    def __init__(self, json):
        self.date = json['date']
        self.id = json['id'] if json.get('id') is not None else None
        self.name = json['name']
        self.category = json['category']
        self.currency = json['currency']
        self.amount = json['amount']
        self.done = json['done']
        self.account = json['account']

############### util function ###############
def get_current_time():
    return datetime.now(pytz.timezone('Asia/Jakarta'))