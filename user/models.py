import os
import uuid

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.db import models
from django.utils.text import slugify


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


class StatusChoices(models.TextChoices):
    CREATOR = "Creator",
    ADMIN = "Admin",
    USER = "User",


class User(AbstractUser):
    avatar = models.ImageField(_("avatar"), upload_to=avatar_path)
    username = models.CharField(_("username"), max_length=50, unique=True)
    first_name = models.CharField(_("first name"), max_length=50)
    last_name = models.CharField(_("last name"), max_length=50)
    email = models.EmailField(_("email address"), unique=True)
    sex = models.CharField(
        _("sex"),
        max_length=10,
        choices=SexTextChoices
    )
    birth_date = models.DateField(_("birth date"))
    language = models.CharField(_("language"), max_length=50)
    phone_number = models.CharField(_("phone number"), max_length=50, unique=True)
    country = models.CharField(_("country"), max_length=50)
    twitter = models.URLField(_("twitter url"), max_length=250, unique=True)
    linkedin = models.URLField(_("linkedin url"), max_length=250, unique=True)
    facebook = models.URLField(_("facebook url"), max_length=250, unique=True)
    instagram = models.URLField(_("instagram url"), max_length=250, unique=True)
    github = models.URLField(_("github url"), max_length=250, unique=True)
    group = models.CharField(_("group"), max_length=50, default="CS-32")
    status = models.CharField(
        _("status"), max_length=50, choices=StatusChoices.choices, default=StatusChoices.USER
    )

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return self.full_name

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["avatar", "username", "status", "first_name", "last_name", "group", "email"]

    objects = UserManager()
