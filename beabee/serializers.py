from rest_framework import serializers

from beabee.models import (
    Tag, Post, Comment, Subject, Teacher, Homework, News, ImportantInfo, Ban, Exam
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
    photo = serializers.ImageField()
    user = serializers.CharField(source='user.username', read_only=True)
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
    created_at = serializers.DateTimeField(read_only=True, format='%Y-%m-%d %H:%M')

    class Meta:
        model = Comment
        fields = (
            "id",
            "post",
            "text",
            "created_at",
        )


class CommentListSerializer(CommentSerializer):
    user = serializers.CharField(source='user.username')

    class Meta:
        model = Comment
        fields = CommentSerializer.Meta.fields + ("user",)


class CommentDetailSerializer(CommentSerializer):
    class Meta:
        model = Comment
        fields = CommentListSerializer.Meta.fields


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
            "id", "teacher_avatar", "first_name", "last_name", "surname", "subject", "degree"
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
        )


class ExamListSerializer(ExamSerializer):
    teacher_avatar = serializers.ImageField(source='teacher.teacher_avatar', read_only=True)
    teacher_surname = serializers.CharField(source='teacher.surname', read_only=True)
    teacher_first_name = serializers.CharField(source='teacher.first_name', read_only=True)
    teacher_last_name = serializers.CharField(source='teacher.last_name', read_only=True)
    subject = serializers.CharField(source='subject.name')

    class Meta:
        model = Exam
        fields = (
            "id",
            "teacher_avatar",
            "teacher_surname",
            "teacher_first_name",
            "teacher_last_name",
            "subject",
            "date_time",
            "group",
        )


class ExamDetailSerializer(ExamListSerializer):
    class Meta:
        model = Exam
        fields = ExamListSerializer.Meta.fields


class HomeworkSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M', read_only=True)
    deadline = serializers.DateTimeField(format='%Y-%m-%d %H:%M')
    added_by = serializers.CharField(source='added_by.username', read_only=True)

    class Meta:
        model = Homework
        fields = (
            "id",
            "title",
            "description",
            "file",
            "subject",
            "type",
            "teacher",
            "created_at",
            "deadline",
            "added_by"
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


class NewsSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M')
    posted_by = serializers.CharField(source='posted_by.username', read_only=True)

    class Meta:
        model = News
        fields = (
            "id",
            "file",
            "title",
            "created_at",
            "posted_by"
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
    posted_by = serializers.CharField(source='posted_by.username', read_only=True)
    avatar = serializers.CharField(source='user.avatar', read_only=True)
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M', read_only=True)

    class Meta:
        model = ImportantInfo
        fields = (
            "id",
            "title",
            "posted_by",
            "file",
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
        fields = ImportantInfoSerializer.Meta.fields


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