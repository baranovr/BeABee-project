from rest_framework import serializers

from beabee.models import Post
from beabee.serializers import PostSerializer
from .models import User


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=True, allow_null=True)

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        return user

    def update(self, instance, validated_data):
        avatar = validated_data.get('avatar')
        if avatar:
            instance.avatar = avatar

        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.sex = validated_data.get('sex', instance.sex)
        instance.birth_date = validated_data.get('birth_date', instance.birth_date)
        instance.language = validated_data.get('language', instance.language)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.country = validated_data.get('country', instance.country)
        instance.twitter = validated_data.get('twitter', instance.twitter)
        instance.linkedin = validated_data.get('linkedin', instance.linkedin)
        instance.facebook = validated_data.get('facebook', instance.facebook)
        instance.instagram = validated_data.get('instagram', instance.instagram)
        instance.github = validated_data.get('github', instance.github)
        instance.group = validated_data.get('group', instance.group)
        instance.status_in_service = validated_data.get('status_in_service', instance.status_in_service)

        instance.save()
        return instance

    class Meta:
        model = User
        fields = [
            'id', 'avatar', 'username', 'first_name', 'last_name', 'email',
            'sex', 'birth_date', 'language', 'phone_number', 'country',
            'twitter', 'linkedin', 'facebook', 'instagram', 'github', 'group', 'status_in_service',
            'is_banned', 'ban_reason', 'ban_until', 'full_name'
        ]
        read_only_fields = ['is_banned', 'ban_reason', 'ban_until', 'full_name']
        extra_kwargs = {
            "password": {
                "write_only": True,
                "style": {"input_type": "password"},
                "min_length": 8,
            }
        }


class MyProfileSerializer(UserSerializer):
    posts = serializers.SerializerMethodField()

    def get_posts(self, obj):
        posts = Post.objects.filter(user=obj)
        return PostSerializer(posts, many=True).data

    class Meta:
        model = User
        fields = [
            'id', 'avatar', 'username', 'first_name', 'last_name', 'email',
            'sex', 'birth_date', 'language', 'phone_number', 'country',
            'twitter', 'linkedin', 'facebook', 'instagram', 'github', 'group', 'status_in_service',
            'posts', 'is_banned', 'ban_reason', 'ban_until', 'full_name'
        ]
        read_only_fields = ['is_banned', 'ban_reason', 'ban_until', 'full_name']
