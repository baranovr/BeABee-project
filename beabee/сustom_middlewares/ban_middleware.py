from django.http import HttpResponse
from rest_framework import status


class BanMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated and request.user.is_banned:
            # Возвращаем ответ с кодом 400, чтобы показать, что доступ запрещен
            return HttpResponse(
                {"message": "Your account is banned. Reason: {}".format(request.user.ban_reason)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return self.get_response(request)
