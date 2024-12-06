from django.urls import path, include
from rest_framework import routers

from beabee.views import (
    PostViewSet,
    SubjectViewSet,
    TeacherViewSet,
    ExamViewSet,
    HomeworkViewSet,
    NewsViewSet,
    ImportantInfoViewSet,
    BanViewSet,
    StudentInTableViewSet,
    invite_student,
    HomeworkTypeDistributionView,
    SystemNotificationsViewSet,
    TopTeachersAPIView,
    TopTeachersDetailedAPIView,
    TopTeachersHomeworkByDayAPIView,
)
from user.views import GPSViewSet

router = routers.DefaultRouter()

router.register(r'posts', PostViewSet, basename='posts')
router.register(r'subjects', SubjectViewSet, basename='subjects')
router.register(r'teachers', TeacherViewSet, basename='teachers')
router.register(r'exams', ExamViewSet, basename='exams')
router.register(r'homeworks', HomeworkViewSet, basename='homeworks')
router.register(r'news', NewsViewSet, basename='news')
router.register(r'importantinfo', ImportantInfoViewSet, basename='importantinfo')
router.register(r'bans', BanViewSet, basename='bans')
router.register(r"map", GPSViewSet, basename="gps")
router.register(r'system_notifications', SystemNotificationsViewSet, basename='system_notifications')

# Data tables
router.register(r'students_table', StudentInTableViewSet, basename='students_table')

urlpatterns = [
    path("", include(router.urls)),
    path('top-teachers-values/', TopTeachersAPIView.as_view(), name='top-teachers'),
    path('top-teachers-names/', TopTeachersDetailedAPIView.as_view(), name='top-teachers'),
    path('top-teachers-homework-by-day/', TopTeachersHomeworkByDayAPIView.as_view(), name='top-teachers'),

    # Invite
    path('students/<int:student_id>/invite/', invite_student, name='invite-student'),

    # Homework types statistics
    path('homework_types/stat/', HomeworkTypeDistributionView.as_view(), name='homework-types-stat')
]

app_name = 'beabee'
