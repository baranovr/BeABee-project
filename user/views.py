from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import generics, status, viewsets
from rest_framework import permissions
from rest_framework.response import Response

from user.serializers import (
    UserSerializer,
    MyProfileSerializer,
    UserSearchListSerializer,
    UserSearchDetailSerializer,
    GPSSerializer,
    GPSDetailSerializer
)
from user.models import GPS

from beabee.сustom_permissions.is_not_banned_permission import IsNotBanned


class CreateUserViewSet(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)


class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = MyProfileSerializer
    permission_classes = [IsNotBanned]

    def get_object(self):
        return self.request.user

class UserSearchListView(generics.ListAPIView):
    serializer_class = UserSearchListSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        user = get_user_model()
        queryset = user.objects.all().order_by("-date_joined")

        nickname = self.request.query_params.get("nickname", None)
        user_id = self.request.query_params.get("user_id", None)

        if nickname:
            queryset = queryset.filter(nickname__icontains=nickname)
            return queryset.distinc()

        if user_id:
            queryset = queryset.filter(id=user_id)

        return queryset


class UserSearchDetailView(generics.RetrieveAPIView):
    serializer_class = UserSearchDetailSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = get_user_model()
        queryset = user.objects.all()
        user_id = self.kwargs.get("pk", None)

        if user_id is not None:
            queryset = queryset.filter(id=user_id)

        return queryset


class GPSViewSet(viewsets.ModelViewSet):
    serializer_class = GPSSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return GPS.objects.select_related('user')

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return GPSDetailSerializer
        return GPSSerializer

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            # Check if the user already has a location and delete it if exists
            GPS.objects.filter(user=request.user).delete()

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            gps_instance = GPS.objects.create(user=request.user, **serializer.validated_data)

            return Response(GPSSerializer(gps_instance).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        if instance.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer.save()

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        super().destroy(request, *args, **kwargs)
        return Response(status=status.HTTP_204_NO_CONTENT)
