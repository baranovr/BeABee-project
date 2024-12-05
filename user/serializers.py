from django.contrib.auth import get_user_model
from rest_framework import serializers

from beabee.models import Post, News, ImportantInfo
from beabee.serializers import NewsInProfileSerializer, ImportantInfoInProfileSerializer, PostInProfileSerializer
from beabee_project import settings
from user.models import User, GPS


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=True, allow_null=True)

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = get_user_model().objects.create_user(
            password=password, **validated_data
        )
        return user

    def update(self, instance, validated_data):
        avatar = validated_data.get('avatar')
        if avatar:
            instance.avatar = avatar

        instance.nickname = validated_data.get('nickname', instance.nickname)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.sex = validated_data.get('sex', instance.sex)
        instance.birth_date = validated_data.get('birth_date', instance.birth_date)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.country = validated_data.get('country', instance.country)
        instance.city = validated_data.get('city', instance.city)
        instance.linkedin = validated_data.get('linkedin', instance.linkedin)
        instance.facebook = validated_data.get('facebook', instance.facebook)
        instance.instagram = validated_data.get('instagram', instance.instagram)
        instance.github = validated_data.get('github', instance.github)
        instance.group = validated_data.get('group', instance.group)
        instance.status_in_service = validated_data.get('status_in_service', instance.status_in_service)
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)

        instance.save()
        return instance

    class Meta:
        model = User
        fields = [
            'id', 'avatar', 'nickname', 'first_name', 'last_name', 'email',
            'sex', 'birth_date', 'phone_number', 'country', 'city', 'linkedin',
            'facebook', 'instagram', 'github', 'group', 'status_in_service',
            'password', 'date_joined', 'is_banned', 'ban_reason', 'full_name'
        ]
        read_only_fields = ['is_banned', 'ban_reason', 'full_name', 'date_joined']
        extra_kwargs = {
            "password": {
                "write_only": True,
                "style": {"input_type": "password"},
                "min_length": 8,
            }
        }


class MyNewsSerializer(serializers.ModelSerializer):
    news = serializers.SerializerMethodField()

    def get_news(self, obj):
        user_news = News.objects.filter(posted_by=obj)
        return NewsInProfileSerializer(user_news, many=True).data

    class Meta:
        model = User
        fields = ['id', 'news']


class MyInfosSerializer(serializers.ModelSerializer):
    infos = serializers.SerializerMethodField()

    def get_infos(self, obj):
        user_infos = ImportantInfo.objects.filter(posted_by=obj)
        return ImportantInfoInProfileSerializer(user_infos, many=True).data

    class Meta:
        model = User
        fields = ['id', 'infos']


class MyPostsSerializer(serializers.ModelSerializer):
    posts = serializers.SerializerMethodField()

    def get_posts(self, obj):
        user_posts = Post.objects.filter(user=obj)
        return PostInProfileSerializer(user_posts, many=True).data

    class Meta:
        model = User
        fields = ['id', 'posts']


class MyProfileSerializer(UserSerializer):
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    class Meta:
        model = User
        fields = [
            'id', 'avatar', 'nickname', 'first_name', 'last_name', 'full_name', 'email',
            'sex', 'birth_date', 'phone_number', 'country', 'city',
            'linkedin', 'facebook', 'instagram', 'github', 'group', 'status_in_service',
            'date_joined', 'is_banned', 'ban_reason'
        ]
        read_only_fields = ['is_banned', 'ban_reason', 'full_name', 'date_joined']


class UserSearchListSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = (
            "id",
            "avatar",
            "nickname",
            "first_name",
            "full_name",
            "email",
            "status_in_service",
            "date_joined",
            "group",
            "is_banned",
            "ban_reason",
        )


class UserInListProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'avatar', 'nickname', 'first_name', 'last_name', 'full_name', 'email',
            'sex', 'birth_date', 'phone_number', 'country', 'city',
            'linkedin', 'facebook', 'instagram', 'github', 'group', 'status_in_service',
            'date_joined', 'is_banned', 'ban_reason'
        ]


class GPSUserBasicSerializer(serializers.ModelSerializer):
    """Базовая информация о пользователе для карты"""

    avatar = serializers.SerializerMethodField()

    def get_avatar(self, obj):
        request = self.context.get('request')
        if obj.avatar:
            avatar_url = obj.avatar.url
            if request:
                return request.build_absolute_uri(avatar_url)  # Возвращаем полный URL
            else:
                return f"{settings.BASE_URL}{avatar_url}"
        return None

    class Meta:
        model = User
        fields = ('id', 'avatar')


class GPSSerializer(serializers.ModelSerializer):
    """Сериализатор для создания и обновления локации"""

    class Meta:
        model = GPS
        fields = ('id', 'latitude', 'longitude')


class GPSDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для отображения данных на карте"""
    user = GPSUserBasicSerializer(read_only=True)

    class Meta:
        model = GPS
        fields = ('id', 'user', 'latitude', 'longitude')


class TwoFactorAuthSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})


class VerifyCodeSerializer(serializers.Serializer):
    code = serializers.CharField(min_length=6, max_length=6)
