from rest_framework import serializers

from beabee.models import (
    Tag, Post, Comment, Subject, Teacher, Homework, Story, News
)

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = (
            "id", "tag"
        )


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = (
            "id",
            "photo",
            "title",
            "description",
            "created_at",
            "tags"
        )


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = (
            "id",
            "post",
            "text",
            "user",
            "created_at",
        )


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = (
            "id", "name"
        )


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = (
            "id", "first_name", "last_name", "surname", "subject", "degree"
        )


class HomeworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Homework
        fields = (
            "id", "title", "description", "file", "subject", "teacher", "created_at"
        )


class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = (
            "id",
            "user",
            "video_or_photo",
            "created_at",
            "expires_at"
            "is_expired"
        )


class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = (
            "id",
            "file",
            "title",
            "description",
            "created_at",
        )


class ImportantInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = NewsSerializer.Meta.fields
