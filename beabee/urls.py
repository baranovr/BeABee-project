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

urlpatterns = [
    path("", include(router.urls)),
]

app_name = 'beabee'
