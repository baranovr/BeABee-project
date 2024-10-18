from django.urls import path, include
from rest_framework import routers

from user.views import (
    CreateUserViewSet,
    MyProfileView
)


urlpatterns = [
    path("register/", CreateUserViewSet.as_view(), name="register"),
    path("my_profile/", MyProfileView.as_view(), name="my_profile"),
]

app_name = "user"
