import os
import uuid
from datetime import timedelta

from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from beabee_project import settings


class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


def photo_path(instance, filename):
    _, extension = os.path.splitext(filename)
    filename = f"{slugify(instance.title)}-{uuid.uuid4()}{extension}"
    return os.path.join("uploads/posts_photos/", filename)


class Post(models.Model):
    photo = models.ImageField(upload_to=photo_path)
    title = models.CharField(max_length=50)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField(Tag)


class Comment(models.Model):
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="comments",
    )
    text = models.TextField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="comments"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return self.text


class Subject(models.Model):
    name = models.CharField(max_length=150, unique=True)

    def __str__(self):
        return self.name


class TeacherDegreeChoice(models.TextChoices):
    BACHELOR = "Bachelor's Degree"
    MASTER = "Master's Degree"
    CANDIDATE = "Candidate of Sciences"
    DOCTOR = "Doctor of Sciences"


class Teacher(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    subject = models.ManyToManyField(Subject)
    degree = models.CharField(max_length=50, choices=TeacherDegreeChoice.choices)

    def __str__(self):
        return f"{self.first_name} {self.last_name} {self.surname} ({self.subject})"


def homework_file_path(instance, filename):
    _, extension = os.path.splitext(filename)
    filename = f"{slugify(instance.title)}-{uuid.uuid4()}{extension}"
    return os.path.join("uploads/homeworks_files/", filename)


class Homework(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()
    file = models.FileField(upload_to=homework_file_path)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(null=True, blank=True)
    added_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


def story_media_path(instance, filename):
    _, extension = os.path.splitext(filename)
    filename = f"{slugify(instance.user.username)}-{uuid.uuid4()}{extension}"
    return os.path.join("uploads/stories_media/", filename)


def news_media_path(instance, filename):
    _, extension = os.path.splitext(filename)
    filename = f"{slugify(instance.title)}-{uuid.uuid4()}{extension}"
    return os.path.join("uploads/news_media/", filename)


class News(models.Model):
    file = models.FileField(upload_to=news_media_path)
    title = models.CharField(max_length=150)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

def info_media_path(instance, filename):
    _, extension = os.path.splitext(filename)
    filename = f"{slugify(instance.title)}-{uuid.uuid4()}{extension}"
    return os.path.join("uploads/info_media/", filename)


class ImportantInfo(models.Model):
    file = models.FileField(upload_to=info_media_path)
    title = models.CharField(max_length=150)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class BanReasonsChoices(models.TextChoices):
    INSULTING = "Insulting community members"
    OBSCENE_CONTENT = "Publishing obscene content"
    SPAM = "Spam"


class Ban(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="ban"
    )
    reason = models.CharField(max_length=55, choices=BanReasonsChoices.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        """
        Ban the user when this object is created.
        """
        self.user.is_banned = True
        self.user.ban_reason = self.reason
        self.user.save()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """
        Unban the user when this object is deleted.
        """
        self.user.is_banned = False
        self.user.ban_reason = None
        self.user.save()
        super().delete(*args, **kwargs)

    def __str__(self):
        return f"Ban for {self.user.email} - {self.reason}"