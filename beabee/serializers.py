from rest_framework import serializers

from beabee.models import (
    Post, Subject, Teacher, Homework, News, ImportantInfo, Ban, Exam
)
from beabee_project import settings


class BaseTagSubjectRelatedSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            "id",
            "name"
        )


class PostSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField()
    user = serializers.CharField(source='user.nickname', read_only=True)
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M', read_only=True)

    class Meta:
        model = Post
        fields = (
            "id",
            "photo",
            "title",
            "user",
            "description",
            "created_at",
        )


class PostListSerializer(PostSerializer):
    avatar = serializers.ImageField(source='user.avatar')

    class Meta:
        model = Post
        fields = PostSerializer.Meta.fields + ("avatar",)


class PostDetailSerializer(PostListSerializer):
    class Meta:
        model = Post
        fields = PostListSerializer.Meta.fields


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
            "id",
            "teacher_avatar",
            "first_name",
            "last_name",
            "surname",
            "subjects",
            "degree",
            "email"
        )


class TeacherListSerializer(TeacherSerializer):
    subjects = SubjectSerializer(many=True)

    class Meta:
        model = Teacher
        fields = (
            "id",
            "teacher_avatar",
            "full_name_sur",
            "subjects",
            "degree",
            "email"
        )


class TeacherDetailSerializer(TeacherListSerializer):
    class Meta:
        model = Teacher
        fields = TeacherSerializer.Meta.fields


class ExamSerializer(serializers.ModelSerializer):
    date_time = serializers.DateTimeField(format='%Y-%m-%d %H:%M')

    class Meta:
        model = Exam
        fields = (
            "id",
            "teacher",
            "subject",
            "date_time",
            "group",
            "type",
            "details",
        )


class ExamListSerializer(ExamSerializer):
    teacher = TeacherListSerializer()
    subject = serializers.CharField(source='subject.name')

    class Meta:
        model = Exam
        fields = (
            "id",
            "teacher",
            "subject",
            "date_time",
            "group",
            "type",
            "details",
        )


class ExamDetailSerializer(ExamListSerializer):
    class Meta:
        model = Exam
        fields = ExamListSerializer.Meta.fields


class HomeworkSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M', read_only=True)
    deadline = serializers.DateTimeField(format='%Y-%m-%d %H:%M')
    added_by = serializers.CharField(source='added_by.nickname', read_only=True)

    class Meta:
        model = Homework
        fields = (
            "id",
            "title",
            "description",
            "subject",
            "type",
            "teacher",
            "created_at",
            "deadline",
            "for_group",
            "added_by"
        )


class HomeworkListSerializer(HomeworkSerializer):
    teacher = serializers.CharField(source='teacher.full_name_sur', read_only=True)
    teacher_avatar = serializers.ImageField(source='teacher.teacher_avatar', read_only=True)
    subject = serializers.CharField(source='subject.name')

    class Meta:
        model = Homework
        fields = (
            "id",
            "title",
            "description",
            "subject",
            "type",
            "teacher_avatar",
            "teacher",
            "created_at",
            "deadline",
            "for_group",
            "added_by"
        )


class HomeworkDetailSerializer(HomeworkListSerializer):
    subject = SubjectSerializer()

    class Meta:
        model = Homework
        fields = HomeworkSerializer.Meta.fields


class NewsSerializer(serializers.ModelSerializer):
    posted_by = serializers.CharField(source='posted_by.nickname', read_only=True)
    posted_by_id = serializers.CharField(source='posted_by.id', read_only=True)
    status_in_service = serializers.CharField(source='posted_by.status_in_service', read_only=True)
    avatar = serializers.ImageField(source='posted_by.avatar', read_only=True)

    class Meta:
        model = News
        fields = (
            "id",
            "file",
            "title",
            "description",
            "posted_by_id",
            "posted_by",
            "status_in_service",
            "avatar"
        )


class NewsListSerializer(NewsSerializer):
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M')

    class Meta:
        model = News
        fields = NewsSerializer.Meta.fields + ("created_at", )


class NewsDetailSerializer(NewsSerializer):
    class Meta:
        model = News
        fields = NewsSerializer.Meta.fields


class ImportantInfoSerializer(serializers.ModelSerializer):
    owner = serializers.CharField(source='posted_by.nickname', read_only=True)
    status_in_service = serializers.CharField(source="posted_by.status_in_service", read_only=True)
    avatar = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M', read_only=True)

    def get_avatar(self, obj):
        request = self.context.get('request')
        if request is not None:
            return request.build_absolute_uri(obj.posted_by.avatar.url)
        return f"{settings.BASE_URL}{obj.posted_by.avatar.url}"

    class Meta:
        model = ImportantInfo
        fields = (
            "id",
            "title",
            "owner",
            "status_in_service",
            "image",
            "description",
            "created_at",
            "avatar"
        )


class ImportantInfoListSerializer(ImportantInfoSerializer):
    class Meta:
        model = ImportantInfo
        fields = ImportantInfoSerializer.Meta.fields


class ImportantInfoDetailDetailSerializer(ImportantInfoSerializer):
    class Meta:
        model = ImportantInfo
        fields = ("description",)


class BanSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)

    class Meta:
        model = Ban
        fields = ['id', 'user', 'reason', 'created_at']

    def create(self, validated_data):
        # При создании автоматически баним пользователя
        return Ban.objects.create(**validated_data)

    def delete(self):
        # При удалении автоматически разбаниваем пользователя
        self.instance.user.unban()
        self.instance.delete()


class BanListSerializer(BanSerializer):
    class Meta:
        model = Ban
        fields = BanSerializer.Meta.fields


class BanDetailSerializer(BanSerializer):
    class Meta:
        model = Ban
        fields = BanSerializer.Meta.fields