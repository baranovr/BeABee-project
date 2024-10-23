from rest_framework import generics
from rest_framework import permissions

from user.serializers import UserSerializer, MyProfileSerializer

from beabee.сustom_permissions.is_not_banned_permission import IsNotBanned


class CreateUserViewSet(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)


class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = MyProfileSerializer
    permission_classes = [IsNotBanned]

    def get_object(self):
        return self.request.user
