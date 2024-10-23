from rest_framework.permissions import BasePermission

class IsNotBanned(BasePermission):
    """
    Проверка, что пользователь не забанен.
    """
    def has_permission(self, request, view):
        return not (request.user.is_authenticated and request.user.is_banned)
