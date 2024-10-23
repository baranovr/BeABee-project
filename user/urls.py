from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from user.custom_token.token_view import CustomTokenObtainPairView
from user.views import (
    CreateUserViewSet,
    MyProfileView
)


urlpatterns = [
    path("register/", CreateUserViewSet.as_view(), name="register"),
    path("my_profile/", MyProfileView.as_view(), name="my-profile"),
    path("token/", CustomTokenObtainPairView.as_view(), name="create-token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token-verify"),
]

app_name = "user"
