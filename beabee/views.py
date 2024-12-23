from datetime import datetime, timedelta

from django.core.mail import send_mail
from django.db import transaction
from django.db.models import Count, Q, F

from django.utils import timezone
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from beabee.models import (
    Post,
    Subject,
    Teacher,
    Homework,
    News,
    ImportantInfo,
    Ban,
    Exam,
    StudentInTable,
    SystemNotifications,
    SystemNotificationView
)
from beabee.serializers import (
    PostSerializer, PostListSerializer, PostDetailSerializer,
    SubjectListSerializer, SubjectSerializer, TeacherSerializer, TeacherListSerializer,
    HomeworkSerializer, HomeworkListSerializer, HomeworkDetailSerializer,
    NewsSerializer, NewsListSerializer, NewsDetailSerializer, ImportantInfoSerializer, BanSerializer, ExamSerializer,
    ExamListSerializer, BanListSerializer, BanDetailSerializer, StudentInTableSerializer,
    SystemNotificationsSerializer, SystemNotificationsListSerializer
)
from beabee.telegram_utils import send_telegram_notification
from beabee.сustom_permissions.is_not_banned_permission import IsNotBanned
from beabee_project import settings
from beabee_project.settings import BASE_URL
from user.models import User


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by("-created_at")
    serializer_class = PostSerializer
    permission_classes = [IsNotBanned]

    @staticmethod
    def _params_to_ints(qs):
        """Converts a list of string IDs to a list of integers"""
        return [int(str_id) for str_id in qs.split(",")]

    def get_queryset(self):
        nickname = self.request.query_params.get("user__nickname", None)
        post_title = self.request.query_params.get("title", None)
        created_at = self.request.query_params.get("created_at", None)
        tags = self.request.query_params.get("tags", None)

        queryset = self.queryset

        if nickname:
            queryset = queryset.filter(user__nickname__icontains=nickname)

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

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=request.user)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, headers=headers, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        with transaction.atomic():
            post = get_object_or_404(
                Post, pk=kwargs["pk"], user=request.user
            )
            serializer = self.get_serializer(
                post, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            author = post.user

            if author == request.user:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"message": "You are not allowed to update this post!"},
            )

    def destroy(self, request, *args, **kwargs):
        post = get_object_or_404(Post, pk=kwargs["pk"])
        author = post.user

        if author == request.user or request.user.status_in_service == "Creator":
            super().destroy(request, *args, **kwargs)
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(
            status=status.HTTP_403_FORBIDDEN,
            data={"message": "You are not allowed to delete this post!"},
        )

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="nickname",
                type=OpenApiTypes.STR,
                description="Filter posts by user nickname",
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


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsNotBanned]

    def get_queryset(self):
        name = self.request.query_params.get("name", None)

        queryset = self.queryset

        if name:
            queryset = queryset.filter(name__icontains=name)

        return queryset.distinct()

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return SubjectListSerializer

        return SubjectSerializer

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED, headers=headers
            )

    def update(self, request, *args, **kwargs):
        with transaction.atomic():
            subject = get_object_or_404(Subject, pk=kwargs["pk"])
            serializer = self.get_serializer(subject, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)

            if request.user.status_in_service in ["Admin", "Creator"]:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"message": "You are not allowed to update this subject!"},
            )

    def destroy(self, request, *args, **kwargs):
        if request.user.status_in_service in ["Admin", "Creator"]:
            super().destroy(request, *args, **kwargs)
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(
            status=status.HTTP_403_FORBIDDEN,
            data={"message": "You are not allowed to delete this subject!"},
        )


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
    permission_classes = [IsNotBanned]
    
    def get_queryset(self):
        first_name = self.request.query_params.get("first_name", None)
        last_name = self.request.query_params.get("last_name", None)
        surname = self.request.query_params.get("surname", None)
        subjects = self.request.query_params.getlist("subjects", None)
        degree = self.request.query_params.get("degree", None)
        
        queryset = self.queryset
        
        if first_name:
            queryset = queryset.filter(name__icontains=first_name)

        if last_name:
            queryset = queryset.filter(name__icontains=last_name)

        if surname:
            queryset = queryset.filter(name__icontains=surname)

        if subjects:
            queryset = queryset.filter(subjects__name__in=subjects)

        if degree:
            queryset = queryset.filter(degree__icontains=degree)

        
        return queryset.distinct()
    
    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return TeacherListSerializer

        return TeacherSerializer

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            if request.user.status_in_service in ["Admin", "Creator"]:
                serializer.save()
                headers = self.get_success_headers(serializer.data)
                return Response(
                    serializer.data, status=status.HTTP_201_CREATED, headers=headers
                )

            return Response(status=status.HTTP_403_FORBIDDEN)

    def update(self, request, *args, **kwargs):
        with transaction.atomic():
            teacher = get_object_or_404(Teacher, pk=kwargs["pk"])
            serializer = self.get_serializer(teacher, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)

            if request.user.status_in_service in ["Admin", "Creator"]:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"message": "You are not allowed to update information about this teacher!"},
            )

    def destroy(self, request, *args, **kwargs):
        if request.user.status_in_service in ["Admin", "Creator"]:
            super().destroy(request, *args, **kwargs)
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(
            status=status.HTTP_403_FORBIDDEN,
            data={"message": "You are not allowed to delete this teacher!"},
        )


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
                name="subjects",
                type={"type": "array", "items": {"type": "string"}},
                description="Filter teacher by subjects",
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


class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [IsNotBanned]

    def get_queryset(self):
        date_time = self.request.query_params.get("date_time", None)

        queryset = self.queryset

        if date_time:
            date_t = datetime.strptime(
                date_time, "%Y-%m-%d-%H-%M"
            ).date()
            queryset = queryset.filter(date_time__datetime=date_t)

        return queryset.distinct()

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return ExamListSerializer

        return ExamSerializer

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            if request.user.status_in_service in ["Admin", "Creator"]:
                exam = serializer.save()
                headers = self.get_success_headers(serializer.data)

                formatted_date_time = exam.date_time.strftime('%A, %B %d, %Y at %I:%M %p')
                message = (
                    f"📝 <b>New Exam Scheduled!</b>\n\n\n"
                    f"📄 <b>Details:</b>\n"
                    f"{exam.details}\n\n"
                    f"📘 <b>→ Subject:</b> {exam.subject}\n"
                    f"👨‍🏫 <b>→ Teacher:</b> {exam.teacher.last_name} {exam.teacher.first_name} {exam.teacher.surname}\n"
                    f"📅 <b>→ Date and Time:</b> {formatted_date_time}\n"
                    f"👥 <b>→ Group:</b> {exam.group}\n"
                    f"📑 <b>→ Type:</b> {exam.type}\n\n"
                    f"📣 Make sure to prepare well and be on time!"
                )
                send_telegram_notification(message)

                return Response(
                    serializer.data, status=status.HTTP_201_CREATED, headers=headers
                )

            return Response(status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, *args, **kwargs):
        if request.user.status_in_service in ["Admin", "Creator"]:
            super().destroy(request, *args, **kwargs)
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(
            status=status.HTTP_403_FORBIDDEN,
            data={"message": "You are not allowed to delete this exam!"},
        )

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="date_time",
                type=OpenApiTypes.DATETIME,
                description="Filter homework by date_time",
            ),
        ]
    )
    def list(self, request, *args, **kwargs):
        """
        List all exams, or create a new exam.
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        return super().list(request, *args, **kwargs)


class HomeworkViewSet(viewsets.ModelViewSet):
    queryset = Homework.objects.all().order_by("-created_at")
    serializer_class = HomeworkSerializer
    permission_classes = [IsNotBanned]

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
                created_date, "%Y-%m-%d-%H-%M"
            ).date()
            queryset = queryset.filter(created_date__date=date_c)

        if deadline:
            dead_date = datetime.strptime(
                deadline, "%Y-%m-%d-%H-%M"
            ).date()
            queryset = queryset.filter(deadline__date=dead_date)

        return queryset.distinct()

    def get_serializer_class(self):
        if self.action == "list":
            return HomeworkListSerializer

        if self.action == "retrieve":
            return HomeworkDetailSerializer

        return HomeworkSerializer

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            if request.user.status_in_service in ["Admin", "Creator"]:
                homework = serializer.save(added_by=request.user)
                headers = self.get_success_headers(serializer.data)

                formatted_deadline = homework.deadline.strftime('%A, %B %d, %Y at %I:%M %p')
                message = (
                    f"📚 <b>New Homework Assigned!</b>\n\n\n"
                    f"🎓 <b>Title:</b> {homework.title}\n\n"
                    f"📝 <b>Description:</b>\n{homework.description}\n\n"
                    f"📘 <b>→ Subject:</b> {homework.subject}\n"
                    f"👨‍🏫 <b>→ Teacher:</b> {homework.teacher.last_name} {homework.teacher.first_name} {homework.teacher.surname}\n"
                    f"👥 <b>→ Assigned to Group:</b> {homework.for_group}\n"
                    f"⏰ <b>→ Deadline:</b> {formatted_deadline}\n\n"
                    f"Don't forget to complete it on time!"
                )
                send_telegram_notification(message)

                return Response(
                    serializer.data, status=status.HTTP_201_CREATED, headers=headers
                )

            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"message": "You are not allowed to create homeworks!"},
            )

    def update(self, request, *args, **kwargs):
        with transaction.atomic():
            homework = get_object_or_404(
                Homework, pk=kwargs["pk"], added_by=request.user
            )
            serializer = self.get_serializer(homework, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)

            if request.user.status_in_service in ["Admin", "Creator"]:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"message": "You are not allowed to this homework!"},
            )

    def destroy(self, request, *args, **kwargs):
        if request.user.status_in_service in ["Admin", "Creator"]:
            super().destroy(request, *args, **kwargs)
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(
            status=status.HTTP_403_FORBIDDEN,
            data={"message": "You are not allowed to delete this homework!"},
        )

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


class HomeworkTypeDistributionView(APIView):
    permission_classes = [IsNotBanned]

    def get(self, request):
        # Получаем текущую дату
        now = timezone.now()

        # Определяем даты для текущего и прошлого месяцев
        current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        prev_month_start = (current_month_start - timezone.timedelta(days=1)).replace(day=1)
        current_month_end = current_month_start + timezone.timedelta(days=32)
        prev_month_end = current_month_start

        # Подсчет количества домашек по типам для текущего месяца
        current_month_counts = Homework.objects.filter(
            created_at__gte=current_month_start,
            created_at__lt=current_month_end
        ).values('type').annotate(count=Count('id'))

        # Подсчет количества домашек по типам для прошлого месяца
        prev_month_counts = Homework.objects.filter(
            created_at__gte=prev_month_start,
            created_at__lt=prev_month_end
        ).values('type').annotate(count=Count('id'))

        # Общее количество домашек в текущем месяце
        total_current_month = sum(item['count'] for item in current_month_counts)

        # Общее количество домашек в прошлом месяце
        total_prev_month = sum(item['count'] for item in prev_month_counts)

        # Преобразуем результаты в требуемый формат
        result = []
        type_mapping = {
            'Math/Physics': 1,
            'Prog/Networks': 2,
            'Lang/Culture': 3,

            # Fake Lang/Culture
            'Lang/Culture_dub': 4
        }

        for type_name, type_id in type_mapping.items():
            # Находим количество для текущего месяца
            current_count = next((item['count'] for item in current_month_counts if item['type'] == type_name), 0)
            current_percent = (current_count / total_current_month * 100) if total_current_month > 0 else 0

            # Находим количество для прошлого месяца
            prev_count = next((item['count'] for item in prev_month_counts if item['type'] == type_name), 0)
            prev_percent = (prev_count / total_prev_month * 100) if total_prev_month > 0 else 0

            result.append({
                'id': type_id,
                'value': round(current_percent),
                'prevValue': round(prev_percent),
                'unit': '%'
            })

        return Response(result, status=status.HTTP_200_OK)


class TopTeachersAPIView(APIView):
    """
    API для отображения топ-6 учителей по количеству домашних заданий
    за текущий и предыдущий месяц.
    """
    def get(self, request, *args, **kwargs):
        # Текущий месяц и предыдущий месяц
        current_date = now()
        start_of_current_month = current_date.replace(day=1)
        start_of_previous_month = (start_of_current_month - timedelta(days=1)).replace(day=1)

        # Агрегация домашних заданий
        teachers_stats = Teacher.objects.annotate(
            current_month_count=Count(
                'teacher_homeworks',
                filter=Q(
                    teacher_homeworks__created_at__gte=start_of_current_month
                )
            ),
            previous_month_count=Count(
                'teacher_homeworks',
                filter=Q(
                    teacher_homeworks__created_at__gte=start_of_previous_month,
                    teacher_homeworks__created_at__lt=start_of_current_month
                )
            ),
        ).order_by('-current_month_count')[:6]  # Топ-6 учителей

        # Формирование ответа
        data = [
            {
                "id": teacher.id,
                "value": teacher.current_month_count,
                "prevValue": teacher.previous_month_count,
            }
            for teacher in teachers_stats
        ]

        return Response(data)


class TopTeachersDetailedAPIView(APIView):
    """
    API для отображения топ-6 учителей по количеству домашних заданий
    с дополнительными полями.
    """
    def get(self, request, *args, **kwargs):
        # Текущий месяц и предыдущий месяц
        current_date = now()
        start_of_current_month = current_date.replace(day=1)
        start_of_previous_month = (start_of_current_month - timedelta(days=1)).replace(day=1)

        # Агрегация домашних заданий
        teachers_stats = Teacher.objects.annotate(
            current_month_count=Count(
                'teacher_homeworks',
                filter=Q(
                    teacher_homeworks__created_at__gte=start_of_current_month
                )
            ),
        ).order_by('-current_month_count')[:6]  # Топ-6 учителей

        # Формирование ответа
        data = [
            {
                "id": teacher.id,
                "name": teacher.last_name + " " + teacher.first_name + " " + teacher.surname,
                "teacher_avatar": f"{teacher.teacher_avatar.url}" if teacher.teacher_avatar else None,
            }
            for teacher in teachers_stats
        ]

        return Response(data)


class TopTeachersHomeworkByDayAPIView(APIView):
    """
    API для отображения количества домашних заданий по дням
    для топ-6 учителей.
    """
    def get(self, request, *args, **kwargs):
        # Определяем текущий месяц
        current_date = now()
        start_of_month = current_date.replace(day=1)

        # Получаем топ-6 учителей
        top_teachers = (
            Teacher.objects.annotate(
                homework_count=Count(
                    'teacher_homeworks',
                    filter=Q(teacher_homeworks__created_at__gte=start_of_month)
                )
            )
            .order_by('-homework_count')[:6]
        )

        # Получаем домашки по дням для этих учителей
        homework_data = (
            Homework.objects.filter(
                teacher__in=top_teachers,
                created_at__month=current_date.month,
            )
            .annotate(
                day=F('created_at__day'),
                homework_type=F('type')  # Изменяем имя аннотации
            )
            .values('teacher', 'day', 'homework_type')
            .annotate(count=Count('id'))
            .order_by('day')
        )

        # Формируем ответ
        response_data = []
        for teacher in top_teachers:
            teacher_homework = [entry for entry in homework_data if entry['teacher'] == teacher.id]
            for entry in teacher_homework:
                response_data.append({
                    'teacher_id': teacher.id,
                    'day': entry['day'],
                    'count': entry['count'],
                    'type': entry['homework_type'],  # Используем новое имя
                })

        return Response(response_data)


class FilterByTitleAndDateMixin:
    def filter_by_title_and_date(self, queryset):
        title = self.request.query_params.get("title", None)
        created_date = self.request.query_params.get("created_at", None)

        queryset = self.queryset

        if title:
            queryset = queryset.filter(title__icontains=title)

        if created_date:
            date_c = datetime.strptime(
                created_date, "%Y-%m-%d-%H-%M"
            ).date()
            queryset = queryset.filter(created_date__date=date_c)

        return queryset.distinct()


class NewsViewSet(FilterByTitleAndDateMixin, viewsets.ModelViewSet):
    queryset = News.objects.all().order_by("-created_at")
    serializer_class = NewsSerializer
    permission_classes = [IsNotBanned]

    def get_queryset(self):
        queryset = super().get_queryset()
        return self.filter_by_title_and_date(queryset)

    def get_serializer_class(self):
        if self.action == "list":
            return NewsListSerializer

        if self.action == "retrieve":
            return NewsDetailSerializer

        return NewsSerializer

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(posted_by=request.user)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        with transaction.atomic():
            news = get_object_or_404(
                News, pk=kwargs["pk"], posted_by=request.user
            )
            serializer = self.get_serializer(news, data=request.data)
            serializer.is_valid(raise_exception=True)
            author = news.posted_by

            if author == request.user:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"message": "You are not allowed to update news!"}
            )

    def destroy(self, request, *args, **kwargs):
        news = get_object_or_404(News, pk=kwargs["pk"])
        author = news.posted_by

        if (author == request.user or
                request.user.status_in_service == "Creator" or
                (request.user.status_in_service == "Admin" and author.status_in_service == "User")
        ):
            super().destroy(request, *args, **kwargs)
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(
            status=status.HTTP_403_FORBIDDEN,
            data={"message": "You are not allowed to delete news!"}
        )


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
    queryset = ImportantInfo.objects.all().order_by("-created_at")
    serializer_class = ImportantInfoSerializer
    permission_classes = [IsNotBanned]

    def get_queryset(self):
        queryset = super().get_queryset()
        return self.filter_by_title_and_date(queryset)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save(posted_by=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


    def update(self, request, *args, **kwargs):
        with transaction.atomic():
            imp_info = get_object_or_404(
                ImportantInfo, pk=kwargs["pk"], posted_by=request.user
            )
            serializer = self.get_serializer(imp_info, data=request.data)
            serializer.is_valid(raise_exception=True)
            author = imp_info.posted_by

            if author == request.user:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"message": "You are not allowed to update this important info!"}
            )

    def destroy(self, request, *args, **kwargs):
        imp_info = get_object_or_404(ImportantInfo, pk=kwargs["pk"])
        author = imp_info.posted_by

        if (author == request.user or
                request.user.status_in_service == "Creator" or
                (request.user.status_in_service == "Admin" and author.status_in_service == "User")
        ):
            super().destroy(request, *args, **kwargs)
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(
            status=status.HTTP_403_FORBIDDEN,
            data={"message": "You are not allowed to delete this important info!"}
        )

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


class BanViewSet(viewsets.ModelViewSet):
    queryset = Ban.objects.all()
    serializer_class = BanSerializer
    permission_classes = [IsNotBanned]

    def get_serializer_class(self):
        if self.action == "list":
            return BanListSerializer

        if self.action == "retrieve":
            return BanDetailSerializer

        return BanSerializer

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            banned_user = serializer.validated_data["user"]

            if (
                    banned_user != request.user and
                    request.user.status_in_service == "Admin" and
                    banned_user.status_in_service != "Admin" and
                    banned_user.status_in_service != "Creator"
            ) or request.user.status_in_service == "Creator" and banned_user != request.user:
                serializer.save(banned_by=request.user)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"message": "You are not allowed to create ban!"}
            )

    def destroy(self, request, *args, **kwargs):
        ban = get_object_or_404(Ban, pk=kwargs["pk"])
        banned_user = ban.user

        if (
                ban.user != request.user or
                banned_user.status_in_service != request.user.status_in_service or
                request.user.status_in_service == "Creator"
        ):
            super().destroy(request, *args, **kwargs)
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(
            status=status.HTTP_403_FORBIDDEN,
            data={"message": "You are not allowed to delete this ban!"}
        )


class StudentInTableViewSet(viewsets.ModelViewSet):
    queryset = StudentInTable.objects.all()
    serializer_class = StudentInTableSerializer
    permission_classes = [IsNotBanned]

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            if request.user.status_in_service != "User":
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"message": "You are not allowed to create student for table!"}
            )

    def update(self, request, *args, **kwargs):
        with transaction.atomic():
            student_in_lst = get_object_or_404(StudentInTable, pk=kwargs["pk"])
            serializer = self.get_serializer(student_in_lst, data=request.data)
            serializer.is_valid(raise_exception=True)

            if request.user.status_in_service != "User":
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"message": "You are not allowed to update student for table!"}
            )

    def destroy(self, request, *args, **kwargs):
        with transaction.atomic():
            if request.user.status_in_service != "User":
                super().destroy(request, *args, **kwargs)
                return Response(status=status.HTTP_204_NO_CONTENT)

            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"message": "You are not allowed to delete this student from table!"}
            )


class SystemNotificationsViewSet(viewsets.ModelViewSet):
    queryset = SystemNotifications.objects.all().order_by("-created_at")
    serializer_class = SystemNotificationsSerializer
    permission_classes = [IsNotBanned]

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return SystemNotificationsListSerializer

        return SystemNotificationsSerializer

    @action(detail=False, methods=["POST"])
    def mark_all_as_read(self, request):
        notifications = self.get_queryset().filter(is_read=False, show_once=True)
        if not notifications:
            return Response(
                {
                    "message": "All notification are already marked as read"
                },
                status=status.HTTP_200_OK
            )

        read_count = notifications.update(is_read=True, show_once=False)
        return Response(
            status=status.HTTP_200_OK,
            data={
                "message": "All notification marked as read",
                "read_count": read_count
            }
        )

    def get_queryset(self):
        user = self.request.user
        viewed_notifications = SystemNotificationView.objects.filter(
            user=user
        ).values_list('notification_id', flat=True)

        return SystemNotifications.objects.exclude(
            id__in=viewed_notifications
        )

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            if request.user.status_in_service == "Creator":
                serializer.save()
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"message": "You are not allowed to create system notifications!"}
            )

    @action(detail=False, methods=['DELETE'])
    def delete_all(self, request, pk=None):
        notifications = self.get_queryset()
        if not notifications:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={"message": "No notification found"}
            )

        deleted_count, _ = notifications.delete()
        return Response(
            status=status.HTTP_204_NO_CONTENT,
            data={
                "message": "All notification deleted",
                "deleted_count": deleted_count
            }
        )


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsNotBanned])
def invite_student(request, student_id):
    try:
        student = StudentInTable.objects.get(id=student_id)

        existing_user = User.objects.filter(first_name=student.first_name).exists()

        if existing_user:
            return Response(
                {"message": "User already exists"},
                status=400
            )

        send_mail(
            subject='Invitation to Join Platform',
            message=f"""
            Hello {student.first_name} {student.last_name},

            You have been invited to join BeABee platform.
            To become part of our team you should join by this link: <link>
            
            Note: please register using this email address.

            Best regards,
            BeABee Team
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[student.email],
        )

        return Response(
            {"message": "Invitation sent successfully"},
            status=200
        )

    except StudentInTable.DoesNotExist:
        return Response(
            {"message": "Student not found"},
            status=404
        )
    except Exception as e:
        return Response(
            {"message": str(e)},
            status=500
        )
