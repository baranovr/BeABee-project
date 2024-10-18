from datetime import datetime

from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import viewsets

from beabee.models import Tag, Post, Comment, Subject, Teacher, Homework, Story, News, ImportantInfo
from beabee.serializers import (
    TagSerializer, TagListSerializer, TagDetailSerializer, PostSerializer, PostListSerializer,
    PostDetailSerializer, CommentListSerializer, CommentDetailSerializer, CommentSerializer, SubjectListSerializer,
    SubjectDetailSerializer, SubjectSerializer, TeacherSerializer, TeacherListSerializer, TeacherDetailSerializer,
    HomeworkSerializer, HomeworkListSerializer, HomeworkDetailSerializer, StorySerializer, StoryListSerializer,
    StoryDetailSerializer, NewsSerializer, NewsListSerializer, NewsDetailSerializer, ImportantInfoSerializer
)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def get_queryset(self):
        name = self.request.query_params.get("name", None)

        queryset = self.queryset

        if name:
            queryset = queryset.filter(name__icontains=name)

        return queryset.distinct()


    def get_serializer_class(self):
        if self.action == "list":
            return TagListSerializer

        if self.action == "retrieve":
            return TagDetailSerializer
        
        return TagSerializer

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="name",
                type=OpenApiTypes.STR,
                description="Filter tags by name",
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        """
        List all tags, or create a new tag.
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        return super().list(request, *args, **kwargs)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    @staticmethod
    def _params_to_ints(qs):
        """Converts a list of string IDs to a list of integers"""
        return [int(str_id) for str_id in qs.split(",")]

    def get_queryset(self):
        username = self.request.query_params.get("user__username", None)
        post_title = self.request.query_params.get("title", None)
        created_at = self.request.query_params.get("created_at", None)
        tags = self.request.query_params.get("tags", None)

        queryset = self.queryset

        if username:
            queryset = queryset.filter(user__username__icontains=username)

        if post_title:
            queryset = queryset.filter(title__icontains=post_title)

        if created_at:
            date_c = datetime.strptime(created_at, "%Y-%m-%d").date()
            queryset = queryset.filter(created_at__date=date_c)

        if tags:
            queryset = queryset.filter(hashtags__name__in=tags)

        return queryset.distinct()

    def get_serializer_class(self):
        if self.action == "list":
            return PostListSerializer

        if self.action == "retrieve":
            return PostDetailSerializer
        
        return PostSerializer

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="username",
                type=OpenApiTypes.STR,
                description="Filter posts by user username",
            ),
            OpenApiParameter(
                name="title",
                type=OpenApiTypes.STR,
                description="Filter posts by title",
            ),
            OpenApiParameter(
                "created_at",
                type=OpenApiTypes.DATE,
                description=(
                        "Filter by creation date (ex. ?created_at=2024-04-05)"
                )
            ),
            OpenApiParameter(
                "tags",
                type={"type": "array", "items": {"type": "string"}},
                style="form",
                description="Filter by post tags"
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        """
        List all posts, or create a new post.
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        return super().list(request, *args, **kwargs)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        username = self.request.query_params.get("user__username", None)
        created_date = self.request.query_params.get("created_at", None)

        queryset = self.queryset

        if username:
            queryset = self.queryset.filter(username__icontains=username)

        if created_date:
            date_c = datetime.strptime(
                created_date, "%Y-%m-%d"
            ).date()
            queryset = queryset.filter(created_date__date=date_c)

        return queryset.distinct()

    def get_serializer_class(self):
        if self.action == "list":
            return CommentListSerializer

        if self.action == "retrieve":
            return CommentDetailSerializer

        return CommentSerializer


    @extend_schema(
        parameters=[
            OpenApiParameter(
                "username",
                type=OpenApiTypes.STR,
                style="form",
                description="Filter by commentator username"
            ),
            OpenApiParameter(
                "created_at",
                type=OpenApiTypes.DATE,
                description=(
                        "Filter by created creation date "
                        "(ex. ?date=20024-04-05)"
                )
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        """
        List all comments, find specific comment
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        return super().list(request, *args, **kwargs)


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = TagSerializer

    def get_queryset(self):
        name = self.request.query_params.get("name", None)

        queryset = self.queryset

        if name:
            queryset = queryset.filter(name__icontains=name)

        return queryset.distinct()

    def get_serializer_class(self):
        if self.action == "list":
            return SubjectListSerializer

        if self.action == "retrieve":
            return SubjectDetailSerializer

        return SubjectSerializer

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="name",
                type=OpenApiTypes.STR,
                description="Filter subject by name",
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        """
        List all subject, or create a new subject.
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        return super().list(request, *args, **kwargs)


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    
    def get_queryset(self):
        first_name = self.request.query_params.get("first_name", None)
        last_name = self.request.query_params.get("last_name", None)
        surname = self.request.query_params.get("surname", None)
        subject = self.request.query_params.get("subject__name", None)
        degree = self.request.query_params.get("degree", None)
        
        queryset = self.queryset
        
        if first_name:
            queryset = queryset.filter(name__icontains=first_name)

        if last_name:
            queryset = queryset.filter(name__icontains=last_name)

        if surname:
            queryset = queryset.filter(name__icontains=surname)

        if subject:
            queryset = queryset.filter(subject__icontains=subject)

        if degree:
            queryset = queryset.filter(degree__icontains=degree)

        
        return queryset.distinct()
    
    def get_serializer_class(self):
        if self.action == "list":
            return TeacherListSerializer
        
        if self.action == "retrieve":
            return TeacherDetailSerializer

        return TeacherSerializer

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="first_name",
                type=OpenApiTypes.STR,
                description="Filter teacher by first_name",
            ),
            OpenApiParameter(
                name="last_name",
                type=OpenApiTypes.STR,
                description="Filter teacher by last_name",
            ),
            OpenApiParameter(
                name="surname",
                type=OpenApiTypes.STR,
                description="Filter teacher by surname",
            ),
            OpenApiParameter(
                name="subject",
                type=OpenApiTypes.STR,
                description="Filter teacher by subject",
            ),
            OpenApiParameter(
                name="degree",
                type=OpenApiTypes.STR,
                description="Filter teacher by degree"
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        """
        List all teachers, or create a new teacher.
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        return super().list(request, *args, **kwargs)


class HomeworkViewSet(viewsets.ModelViewSet):
    queryset = Homework.objects.all()
    serializer_class = HomeworkSerializer

    def get_queryset(self):
        title = self.request.query_params.get("title", None)
        subject = self.request.query_params.get("subject__name", None)
        created_date = self.request.query_params.get("created_at", None)
        deadline = self.request.query_params.get("deadline", None)

        queryset = self.queryset

        if title:
            queryset = queryset.filter(title__icontains=title)

        if subject:
            queryset = queryset.filter(subject__icontains=subject)

        if created_date:
            date_c = datetime.strptime(
                created_date, "%Y-%m-%d"
            ).date()
            queryset = queryset.filter(created_date__date=date_c)

        if deadline:
            dead_date = datetime.strptime(
                deadline, "%Y-%m-%d"
            ).date()
            queryset = queryset.filter(deadline__date=dead_date)

        return queryset.distinct()

    def get_serializer_class(self):
        if self.action == "list":
            return HomeworkListSerializer

        if self.action == "retrieve":
            return HomeworkDetailSerializer

        return HomeworkSerializer

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="title",
                type=OpenApiTypes.STR,
                description="Filter homework by title",
            ),
            OpenApiParameter(
                name="subject",
                type=OpenApiTypes.STR,
                description="Filter homework by subject name",
            ),
            OpenApiParameter(
                name="created_date",
                type=OpenApiTypes.DATE,
                description="Filter homework by created_date",
            ),
            OpenApiParameter(
                name="deadline",
                type=OpenApiTypes.DATE,
                description="Filter homework by deadline",
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        """
        List all homework, or create a new homework.
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        return super().list(request, *args, **kwargs)


class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all()
    serializer_class = StorySerializer

    def get_queryset(self):
        username = self.request.query_params.get("user__username", None)
        created_date = self.request.query_params.get("created_at", None)

        queryset = self.queryset

        if username:
            queryset = queryset.filter(username__icontains=username)

        if created_date:
            date_c = datetime.strptime(
                created_date, "%Y-%m-%d"
            ).date()
            queryset = queryset.filter(created_date__date=date_c)

        return queryset.distinct()

    def get_serializer_class(self):
        if self.action == "list":
            return StoryListSerializer

        if self.action == "retrieve":
            return StoryDetailSerializer

        return StorySerializer

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="username",
                type=OpenApiTypes.STR,
                description="Filter story by username",
            ),
            OpenApiParameter(
                name="created_date",
                type=OpenApiTypes.DATE,
                description="Filter story by created_date",
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class FilterByTitleAndDateMixin:
    def filter_by_title_and_date(self, queryset):
        title = self.request.query_params.get("title", None)
        created_date = self.request.query_params.get("created_at", None)

        queryset = self.queryset

        if title:
            queryset = queryset.filter(title__icontains=title)

        if created_date:
            date_c = datetime.strptime(
                created_date, "%Y-%m-%d"
            ).date()
            queryset = queryset.filter(created_date__date=date_c)

        return queryset.distinct()


class NewsViewSet(FilterByTitleAndDateMixin, viewsets.ModelViewSet):
    queryset = News.objects.all()
    serializer_class = NewsSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        return self.filter_by_title_and_date(queryset)

    def get_serializer_class(self):
        if self.action == "list":
            return NewsListSerializer

        if self.action == "retrieve":
            return NewsDetailSerializer

        return NewsSerializer

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="title",
                type=OpenApiTypes.STR,
                description="Filter news by title",
            ),
            OpenApiParameter(
                name="created_date",
                type=OpenApiTypes.DATE,
                description="Filter news by created_date",
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class ImportantInfoViewSet(FilterByTitleAndDateMixin, viewsets.ModelViewSet):
    queryset = ImportantInfo.objects.all()
    serializer_class = ImportantInfoSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        return self.filter_by_title_and_date(queryset)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="title",
                type=OpenApiTypes.STR,
                description="Filter important info by title",
            ),
            OpenApiParameter(
                name="created_date",
                type=OpenApiTypes.DATE,
                description="Filter important info by created_date",
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
