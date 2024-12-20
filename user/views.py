import random

from django.conf import settings
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import transaction
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from rest_framework import generics, status, viewsets
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView

from user.custom_token.token_view import RegisterThrottle
from user.serializers import (
    UserSerializer,
    MyProfileSerializer,
    UserSearchListSerializer,
    GPSSerializer,
    GPSDetailSerializer,
    UserInListProfileSerializer,
    MyNewsSerializer,
    MyInfosSerializer,
    MyPostsSerializer,
    UserGenderStatsListSerializer
)
from user.models import GPS, User

from beabee.сustom_permissions.is_not_banned_permission import IsNotBanned
from user.token_utilities import create_jwt_token


class CreateUserViewSet(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)
    throttle_classes = (RegisterThrottle,)


class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = MyProfileSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    permission_classes = [IsNotBanned]

    def post(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not user.check_password(current_password):
            return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'error': 'New passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password, user=user)
        except ValidationError as e:
            return Response({'error': e.messages}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)



class MyNewsView(APIView):
    permission_classes = (IsNotBanned,)

    def get(self, request, *args, **kwargs):
        serializer = MyNewsSerializer(request.user)
        return Response(serializer.data)


class MyInfosView(APIView):
    permission_classes = (IsNotBanned,)

    def get(self, request, *args, **kwargs):
        serializer = MyInfosSerializer(request.user)
        return Response(serializer.data)


class MyPostsView(APIView):
    permission_classes = (IsNotBanned,)

    def get(self, request, *args, **kwargs):
        serializer = MyPostsSerializer(request.user)
        return Response(serializer.data)


class UserSearchListView(generics.ListAPIView):
    serializer_class = UserSearchListSerializer
    permission_classes = (IsNotBanned,)

    def get_queryset(self):
        user = get_user_model()
        queryset = user.objects.all().order_by("-date_joined")

        nickname = self.request.query_params.get("nickname", None)
        user_id = self.request.query_params.get("user_id", None)

        if nickname:
            queryset = queryset.filter(nickname__icontains=nickname)
            return queryset.distinct()

        if user_id:
            queryset = queryset.filter(id=user_id)

        return queryset

class UserGenderStatsView(generics.ListAPIView):
    serializer_class = UserGenderStatsListSerializer
    permission_classes = (IsNotBanned,)

    def get_queryset(self):
        user = get_user_model()
        queryset = user.objects.all().order_by("-date_joined")
        return queryset


class UserSearchDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserInListProfileSerializer
    permission_classes = (permissions.IsAuthenticated, IsNotBanned)

    def get_queryset(self):
        user = get_user_model()
        queryset = user.objects.all()
        user_id = self.kwargs.get("pk", None)

        if user_id is not None:
            queryset = queryset.filter(id=user_id)

        return queryset


class GPSViewSet(viewsets.ModelViewSet):
    serializer_class = GPSSerializer
    permission_classes = (permissions.IsAuthenticated, IsNotBanned)

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


class TwoFactorAuthView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(email=email, password=password)

        if user is not None:
            # Генерируем новую сессию
            request.session.cycle_key()

            # Генерируем код
            code = str(random.randint(100000, 999999))

            # Сохраняем данные в сессии
            request.session['2fa_code'] = code
            request.session['user_id'] = user.id
            request.session.set_expiry(300)  # 5 минут
            request.session.save()

            # Генерация HTML-сообщения
            html_message = render_to_string('emails/2fa_code.html', {'code': code})
            plain_message = strip_tags(html_message)  # Для текстовой версии письма

            send_mail(
                subject='Код подтверждения',
                message=plain_message,
                from_email='from@example.com',
                recipient_list=[email],
                html_message=html_message,
                fail_silently=False,
            )

            response = Response({
                'message': 'Код подтверждения отправлен',
                'requires_2fa': True,
                'session_key': request.session.session_key
            })

            return response

        return Response({
            'error': 'Invalid credentials!'
        }, status=400)


class VerifyCodeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data.get('code')
        stored_code = request.session.get('2fa_code')
        user_id = request.session.get('user_id')

        if not stored_code or not user_id:
            return Response({
                'error': 'Session expired! Please try again later!.'
            }, status=400)

        if stored_code == code:
            # Очищаем данные верификации из сессии
            del request.session['2fa_code']
            del request.session['user_id']

            # Создаем токен
            user = User.objects.get(id=user_id)
            token = create_jwt_token(user)

            return Response(token)

        return Response({
            'error': 'Invalid code!'
        }, status=400)


class CheckSessionView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # Проверяем текущую сессию
        current_session = request.session.session_key
        session_data = dict(request.session.items())
        cookies = request.COOKIES

        # Создаем тестовую сессию если нет
        if not current_session:
            request.session['test'] = 'test_value'
            request.session.save()

        response = Response({
            'session_key': request.session.session_key,
            'session_data': session_data,
            'cookies': cookies
        })

        # Явно устанавливаем cookie сессии
        response.set_cookie(
            settings.SESSION_COOKIE_NAME,
            request.session.session_key,
            max_age=settings.SESSION_COOKIE_AGE,
            domain=settings.SESSION_COOKIE_DOMAIN,
            secure=settings.SESSION_COOKIE_SECURE,
            httponly=settings.SESSION_COOKIE_HTTPONLY,
            samesite=settings.SESSION_COOKIE_SAMESITE
        )

        return response
