from rest_framework import generics

from user.serializers import UserSerializer, MyProfileSerializer
from rest_framework import permissions


class CreateUserViewSet(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)


class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = MyProfileSerializer

    def get_object(self):
        return self.request.user
