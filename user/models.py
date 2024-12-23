import os
import random
import uuid

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.db import models
from django.utils.text import slugify

from beabee.models import Post


class UserManager(BaseUserManager):
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        # Используем nickname как username если он есть, иначе часть email
        username = extra_fields.get('nickname') or email.split('@')[0]
        extra_fields['username'] = username

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
    filename = f"{slugify(instance.nickname)}-{uuid.uuid4()}{extension}"
    return os.path.join("uploads/avatars/", filename)

class SexChoices(models.TextChoices):
    MALE = "Male", _("Male")
    FEMALE = "Female", _("Female")


class ServiceStatusChoices(models.TextChoices):
    CREATOR = "Creator", _("Creator")
    ADMIN = "Admin", _("Admin")
    USER = "User", _("User")


class GroupChoices(models.TextChoices):
    CS_31 = "CS-31", _("CS-31")
    CS_32 = "CS-32", _("CS-32")
    CS_33 = "CS-33", _("CS-33")
    CS_34 = "CS-34", _("CS-34")
    CS_41 = "CS-41", _("CS-41")
    CS_42 = "CS-42", _("CS-42")
    CS_43 = "CS-43", _("CS-43")
    CS_44 = "CS-44", _("CS-44")


class User(AbstractUser):
    avatar = models.ImageField(_("avatar"), upload_to=avatar_path)
    nickname = models.CharField(_("nickname"), max_length=30, unique=True, db_index=True)
    first_name = models.CharField(_("first name"), max_length=30, unique=True)
    last_name = models.CharField(_("last name"), max_length=30, unique=True)
    email = models.EmailField(_("email address"), unique=True)
    sex = models.CharField(
        _("sex"),
        max_length=7,
        choices=SexChoices.choices,
        db_index=True,
    )
    birth_date = models.DateField(_("birth date"))
    phone_number = models.CharField(_("phone number"), max_length=30, null=True, blank=True)
    country = models.CharField(_("country"), max_length=30, null=True, blank=True)
    city = models.CharField(_("city"), max_length=30, null=True, blank=True)
    linkedin = models.URLField(_("linkedin url"), max_length=100, null=True, blank=True)
    facebook = models.URLField(_("facebook url"), max_length=100, null=True, blank=True)
    instagram = models.URLField(_("instagram url"), max_length=100, null=True, blank=True)
    github = models.URLField(_("github url"), max_length=100, null=True, blank=True)
    group = models.CharField(
        _("group"),
        max_length=10,
        choices=GroupChoices.choices,
        default=GroupChoices.CS_32
    )
    status_in_service = models.CharField(
        _("status in service"),
        max_length=10,
        choices=ServiceStatusChoices.choices,
        default=ServiceStatusChoices.USER,
        db_index=True,
    )
    password = models.CharField(_("password"), max_length=255)
    date_joined = models.DateField(_("date joined"), auto_now_add=True)
    is_banned = models.BooleanField(default=False)
    ban_reason = models.CharField(max_length=30, null=True, blank=True)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def save(self, *args, **kwargs):
        # Проверяем, если объект уже существует в базе
        if self.pk:
            old_instance = User.objects.get(pk=self.pk)
            # Если есть старый аватар и он отличается от нового
            if old_instance.avatar and old_instance.avatar != self.avatar:
                old_instance.avatar.delete(save=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["avatar", "nickname", "status_in_service", "first_name", "last_name", "group"]

    objects = UserManager()


class GPS(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='location',
        verbose_name=_("User")
    )
    latitude = models.DecimalField(
        _("Latitude"),
        max_digits=20,
        decimal_places=16,
        help_text=_("Latitude coordinate")
    )
    longitude = models.DecimalField(
        _("Longitude"),
        max_digits=20,
        decimal_places=16,
        help_text=_("Longitude coordinate")
    )

    class Meta:
        verbose_name = _("User Location")
        verbose_name_plural = _("User Locations")
        ordering = ['-user']
        indexes = [
            models.Index(fields=['latitude', 'longitude']),
        ]
        unique_together = ('user', 'latitude', 'longitude')

    def __str__(self):
        return f"{self.user.nickname} at ({self.latitude}, {self.longitude})"


# class PaymentCard(models.Model):
#     class CardThemes(models.TextChoices):
#         RED_PINK_BLUE = "red_pink_blue", "Red Pink Blue"
#         VIVID_COLORFUL = "vivid_colorful", "Vivid Colorful"
#         GRADIENT_BLUE = "gradient_blue", "Gradient Blue"
#         LUXURY_DARK_BLUE = "luxury_dark_blue", "Luxury Dark Blue"
#         MASK_GROUP = "mask_group", "Mask Group"
#         RECTANGLE = "rectangle", "Rectangle"
#
#     name = models.CharField(max_length=255)
#     cvc = models.CharField(max_length=3)
#     expiry = models.CharField(max_length=5)
#     number = models.CharField(max_length=16)
#     focused = models.CharField(max_length=255, blank=True, default="")
#     theme = models.CharField(
#         max_length=20,
#         choices=CardThemes.choices,
#         default=CardThemes.RED_PINK_BLUE
#     )
#     is_edit = models.BooleanField(default=False)
#
#     def save(self, *args, **kwargs):
#         if self.number:
#             self.number = " ".join([self.number[i:i + 4] for i in range(0, len(self.number), 4)])
#
#         if self.expiry and len(self.expiry) == 4:
#             self.expiry = f"{self.expiry[:2]}/{self.expiry[2:]}"
#
#         super().save(*args, **kwargs)