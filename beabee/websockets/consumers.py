import json
from channels.generic.websocket import WebsocketConsumer

class ImportantInfoConsumer(WebsocketConsumer):
    def connect(self):
        # Присоединение к группе
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        # Получаем данные
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Отправляем сообщение
        self.send(text_data=json.dumps({
            'message': message
        }))


class HomeConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        self.send(text_data=json.dumps({
            'message': message
        }))
