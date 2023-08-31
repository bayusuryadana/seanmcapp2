from datetime import datetime
import pytz, json

############### request data structure ###############
class MamenRequest:

    name = None
    city_id = None
    geo = None

    def __init__(self, json):
        filter = json['filter']
        if filter.get('name') is not None:
            self.name = filter['name']
        if filter.get('cityId') is not None:
            self.city_id = filter['cityId']
        if filter.get('geo') is not None:
            self.geo = filter['geo']
            if self.geo.get('nw'):
                self.geo.nw = self.geo['nw']
            if self.geo.get('se'):
                self.geo.se = self.geo['se']

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

############### util function ###############
def get_current_time():
    return datetime.now(pytz.timezone('Asia/Jakarta'))