import os
import uuid
from datetime import timedelta

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.db import models
from django.utils.text import slugify
from django.utils import timezone

from beabee.models import Post


class UserManager(BaseUserManager):
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_superuser", False)
        extra_fields.setdefault("is_staff", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_staff", True)

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")

        return self._create_user(email, password, **extra_fields)



def avatar_path(instance, filename):
    _, extension = os.path.splitext(filename)
    filename = f"{slugify(instance.username)}-{uuid.uuid4()}{extension}"
    return os.path.join("uploads/avatars/", filename)

class SexTextChoices(models.TextChoices):
    MALE = "Male",
    FEMALE = "Female",


class ServiceStatusChoices(models.TextChoices):
    CREATOR = "Creator",
    ADMIN = "Admin",
    USER = "User",

class BanReasonsChoices(models.TextChoices):
    INSULTING = "Insulting community members"
    OBSCENE_CONTENT = "Publishing obscene content"
    SPAM = "Spam"


class User(AbstractUser):
    avatar = models.ImageField(_("avatar"), upload_to=avatar_path)
    username = models.CharField(_("username"), max_length=50, unique=True)
    first_name = models.CharField(_("first name"), max_length=50, null=True, blank=True)
    last_name = models.CharField(_("last name"), max_length=50, null=True, blank=True)
    email = models.EmailField(_("email address"), unique=True)
    sex = models.CharField(
        _("sex"),
        max_length=10,
        choices=SexTextChoices.choices
    )
    birth_date = models.DateField(_("birth date"))
    language = models.CharField(_("language"), max_length=50, null=True, blank=True)
    phone_number = models.CharField(_("phone number"), max_length=50, unique=True, null=True, blank=True)
    country = models.CharField(_("country"), max_length=50, null=True, blank=True)
    twitter = models.URLField(_("twitter url"), max_length=250, unique=True, null=True, blank=True)
    linkedin = models.URLField(_("linkedin url"), max_length=250, unique=True, null=True, blank=True)
    facebook = models.URLField(_("facebook url"), max_length=250, unique=True, null=True, blank=True)
    instagram = models.URLField(_("instagram url"), max_length=250, unique=True, null=True, blank=True)
    github = models.URLField(_("github url"), max_length=250, unique=True, null=True, blank=True)
    group = models.CharField(_("group"), max_length=50, default="CS-32")
    status_in_service = models.CharField(
        _("status_in_service"),
        max_length=50,
        choices=ServiceStatusChoices.choices,
        default=ServiceStatusChoices.USER
    )
    posts = models.ForeignKey(
        Post,
        blank=True,
        null=True,
        related_name="user_posts",
        on_delete=models.CASCADE
    )
    password = models.CharField(_("password"), max_length=255)
    date_joined = models.DateField(_("date joined"), auto_now_add=True)
    is_banned = models.BooleanField(default=False)
    ban_reason = models.CharField(max_length=255, null=True, blank=True, choices=BanReasonsChoices.choices)
    ban_until = models.DateTimeField(null=True, blank=True)

    @property
    def is_ban_active(self):
        """
        Checks if the user has an active ban.
        If `ban_until` is present and the time is less than this value, True is returned.
        """
        if self.is_banned and (self.ban_until is None or self.ban_until > timezone.now()):
            return True
        return False

    def ban(self, reason=None, duration=None):
        """
        Bans a user.
        :param reason: reason for ban.
        :param duration: duration of ban in hours (if temporary ban).
        """
        self.is_banned = True
        self.ban_reason = reason
        if duration:
            self.ban_until = timezone.now() + timedelta(hours=duration)
        else:
            self.ban_until = None  # If the ban is permanent
        self.save()

    def unban(self):
        """Removes the ban from the user."""
        self.is_banned = False
        self.ban_reason = None
        self.ban_until = None
        self.save()

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return self.full_name

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["avatar", "username", "status_in_service", "first_name", "last_name", "group"]

    objects = UserManager()
