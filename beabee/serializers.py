from rest_framework import serializers

from beabee.models import (
    Tag, Post, Comment, Subject, Teacher, Homework, Story, News, ImportantInfo
)

class BaseTagSubjectRelatedSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            "id",
            "name"
        )

class TagSerializer(BaseTagSubjectRelatedSerializer):
    class Meta(BaseTagSubjectRelatedSerializer.Meta):
        model = Tag


class TagListSerializer(BaseTagSubjectRelatedSerializer):
    class Meta(BaseTagSubjectRelatedSerializer.Meta):
        model = Tag


class TagDetailSerializer(BaseTagSubjectRelatedSerializer):
    class Meta(BaseTagSubjectRelatedSerializer.Meta):
        model = Tag


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = (
            "id",
            "photo",
            "title",
            "user",
            "description",
            "created_at",
            "tags"
        )


class PostListSerializer(PostSerializer):
    tags = TagSerializer(many=True)

    class Meta:
        model = Post
        fields = PostSerializer.Meta.fields


class PostDetailSerializer(PostListSerializer):
    class Meta:
        model = Post
        fields = PostSerializer.Meta.fields


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


class CommentListSerializer(CommentSerializer):
    class Meta:
        model = Comment
        fields = CommentSerializer.Meta.fields


class CommentDetailSerializer(CommentSerializer):
    class Meta:
        model = Comment
        fields = CommentSerializer.Meta.fields


class SubjectSerializer(BaseTagSubjectRelatedSerializer):
    class Meta(BaseTagSubjectRelatedSerializer.Meta):
        model = Subject


class SubjectListSerializer(BaseTagSubjectRelatedSerializer):
    class Meta(BaseTagSubjectRelatedSerializer.Meta):
        model = Subject


class SubjectDetailSerializer(BaseTagSubjectRelatedSerializer):
    class Meta(BaseTagSubjectRelatedSerializer.Meta):
        model = Subject


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = (
            "id", "first_name", "last_name", "surname", "subject", "degree"
        )


class TeacherListSerializer(TeacherSerializer):
    subject = SubjectSerializer(many=True)

    class Meta:
        model = Teacher
        fields = TeacherSerializer.Meta.fields


class TeacherDetailSerializer(TeacherListSerializer):
    class Meta:
        model = Teacher
        fields = TeacherSerializer.Meta.fields


class HomeworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Homework
        fields = (
            "id", "title", "description", "file", "subject", "teacher", "created_at", "deadline"
        )


class HomeworkListSerializer(HomeworkSerializer):
    subject = SubjectSerializer()
    teacher = TeacherDetailSerializer()

    class Meta:
        model = Homework
        fields = HomeworkSerializer.Meta.fields


class HomeworkDetailSerializer(HomeworkListSerializer):
    subject = SubjectSerializer()

    class Meta:
        model = Homework
        fields = HomeworkSerializer.Meta.fields


class StorySerializer(serializers.ModelSerializer):
    expires_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Story
        fields = (
            "id",
            "user",
            "video_or_photo",
            "created_at",
            "expires_at",
            "is_expired"
        )



class StoryListSerializer(StorySerializer):
    class Meta:
        model = Story
        fields = StorySerializer.Meta.fields


class StoryDetailSerializer(StorySerializer):
    class Meta:
        model = Story
        fields = StorySerializer.Meta.fields


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


class NewsListSerializer(NewsSerializer):
    class Meta:
        model = News
        fields = NewsSerializer.Meta.fields


class NewsDetailSerializer(NewsSerializer):
    class Meta:
        model = News
        fields = NewsSerializer.Meta.fields


class ImportantInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImportantInfo
        fields = (
            "id",
            "file",
            "title",
            "description",
            "created_at",
        )


class ImportantInfoListSerializer(ImportantInfoSerializer):
    class Meta:
        model = ImportantInfo
        fields = ImportantInfoSerializer.Meta.fields


class ImportantInfoDetailDetailSerializer(ImportantInfoSerializer):
    class Meta:
        model = ImportantInfo
        fields = ImportantInfoSerializer.Meta.fields
