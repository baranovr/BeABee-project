from rest_framework import generics

from user.serializers import UserSerializer, MyProfileSerializer
from rest_framework import permissions


class CreateUserViewSet(generics.CreateAPIView):
    serializer_class = UserSerializer


class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = MyProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user
