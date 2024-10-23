from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.throttling import UserRateThrottle

from user.custom_token.token_serializers import CustomTokenObtainPairSerializer


class LoginThrottle(UserRateThrottle):
    scope = "try_login"


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    throttle_classes = [LoginThrottle]
