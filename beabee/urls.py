from django.urls import path, include
from rest_framework import routers

from beabee.views import (
    TagViewSet,
    PostViewSet,
    CommentViewSet,
    StoryViewSet,
    TeacherViewSet,
    HomeworkViewSet,
    NewsViewSet,
    ImportantInfoViewSet
)


router = routers.DefaultRouter()


router.register(r'tags', TagViewSet, basename='tags')
router.register(r'posts', PostViewSet, basename='posts')
router.register(r'comments', CommentViewSet, basename='comments')
router.register(r'stories', StoryViewSet, basename='stories')
router.register(r'teachers', TeacherViewSet, basename='teachers')
router.register(r'homeworks', HomeworkViewSet, basename='homeworks')
router.register(r'news', NewsViewSet, basename='news')
router.register(r'importantinfo', ImportantInfoViewSet, basename='importantinfo')

urlpatterns = [
    path("", include(router.urls)),
]

app_name = 'beabee'
