from django.urls import re_path
from beabee.websockets import consumers

websocket_urlpatterns = [
    re_path(r'ws/important_info/$', consumers.ImportantInfoConsumer.as_asgi()),
    re_path(r'ws/homework/$', consumers.HomeConsumer.as_asgi()),
]
