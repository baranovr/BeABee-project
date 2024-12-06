from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from user.custom_token.token_view import CustomTokenObtainPairView
from user.views import (
    CreateUserViewSet,
    MyProfileView,
    UserSearchListView,
    UserSearchDetailView,
    TwoFactorAuthView,
    VerifyCodeView,
    CheckSessionView,
    MyNewsView,
    MyInfosView,
    MyPostsView,
    ChangePasswordView,
    UserGenderStatsView,
)

urlpatterns = [
    path("register/", CreateUserViewSet.as_view(), name="register"),
    path("my_profile/", MyProfileView.as_view(), name="my-profile"),
    path('my_profile/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path("my_profile/news/", MyNewsView.as_view(), name="my-news"),
    path("my_profile/infos/", MyInfosView.as_view(), name="my-infos"),
    path("my_profile/posts/", MyPostsView.as_view(), name="my-posts"),

    path("token/", CustomTokenObtainPairView.as_view(), name="create-token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token-verify"),

    path('login/2fa/', TwoFactorAuthView.as_view(), name='2fa-login'),
    path('login/2fa/verify/', VerifyCodeView.as_view(), name='2fa-verify'),
    path('check-session/', CheckSessionView.as_view(), name='check-session'),

    path("users/", UserSearchListView.as_view(), name="users"),
    path("users/<int:pk>/", UserSearchDetailView.as_view(), name="profile"),
    path('users/gender-stats/', UserGenderStatsView.as_view(), name='user-gender-stats'),
]

app_name = "user"
