from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from datetime import datetime, timedelta


def create_jwt_token(user):
    """
    Создает JWT токены для пользователя
    """
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


def get_token_lifetime():
    """
    Возвращает время жизни токена из настроек
    """
    access_lifetime = settings.SIMPLE_JWT.get('ACCESS_TOKEN_LIFETIME', timedelta(minutes=5))
    refresh_lifetime = settings.SIMPLE_JWT.get('REFRESH_TOKEN_LIFETIME', timedelta(days=1))

    return {
        'access_lifetime': access_lifetime,
        'refresh_lifetime': refresh_lifetime
    }
