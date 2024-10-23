import os
import uuid

from django.db import models
from django.utils.text import slugify
from beabee_project import settings


class Tag(models.Model):
    name = models.CharField(max_length=50)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


def photo_path(instance, filename):
    _, extension = os.path.splitext(filename)
    filename = f"{slugify(instance.title)}-{uuid.uuid4()}{extension}"
    return os.path.join("uploads/posts_photos/", filename)


class Post(models.Model):
    photo = models.ImageField(upload_to=photo_path)
    title = models.CharField(max_length=50)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts_authors')
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField(Tag)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Comment(models.Model):
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="comments",
    )
    text = models.TextField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="user_comments",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return self.text


class Subject(models.Model):
    name = models.CharField(max_length=150, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class TeacherDegreeChoice(models.TextChoices):
    BACHELOR = "Bachelor's Degree"
    MASTER = "Master's Degree"
    CANDIDATE = "Candidate of Sciences"
    DOCTOR = "Doctor of Sciences"


def teachers_avatars_path(instance, filename):
    _, extension = os.path.splitext(filename)
    filename = f"{slugify(instance.last_name)}-{uuid.uuid4()}{extension}"
    return os.path.join("uploads/teachers_avatars/", filename)



class Teacher(models.Model):
    teacher_avatar = models.ImageField(upload_to=teachers_avatars_path)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    subject = models.ManyToManyField(Subject)
    degree = models.CharField(max_length=50, choices=TeacherDegreeChoice.choices)

    class Meta:
        ordering = ["last_name", "first_name"]

    def __str__(self):
        return f"{self.first_name} {self.last_name} {self.surname} ({self.subject})"


class GroupChoices(models.TextChoices):
    CS_31 = "CS_31"
    CS_32 = "CS-32",
    CS_33 = "CS-33",
    CS_34 = "CS-34",
    CS_41 = "CS_41",
    CS_42 = "CS-42",
    CS_43 = "CS-43",
    CS_44 = "CS-44",


class Exam(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    date_time = models.DateTimeField()
    details = models.CharField(max_length=150, default="No Details")
    group = models.CharField(max_length=50, choices=GroupChoices.choices)

    class Meta:
        ordering = ["date_time"]

    def __str__(self):
        return f"{self.teacher} {self.subject} {self.date_time}"


def homework_file_path(instance, filename):
    _, extension = os.path.splitext(filename)
    filename = f"{slugify(instance.title)}-{uuid.uuid4()}{extension}"
    return os.path.join("uploads/homeworks_files/", filename)


class HomeworkTypeChoice(models.TextChoices):
    MATH_PHYSICS = "Math/Physics"
    PROG_NETWORKS = "Prog/Networks"
    LANG_CULTURE = "Lang/Culture"


class Homework(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()
    file = models.FileField(upload_to=homework_file_path, null=True, blank=True)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="subject_homeworks")
    type = models.CharField(max_length=50, choices=HomeworkTypeChoice.choices)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="teacher_homeworks")
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(null=True, blank=True)
    added_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="added_by_homeworks")

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return self.title


def news_media_path(instance, filename):
    _, extension = os.path.splitext(filename)
    filename = f"{slugify(instance.title)}-{uuid.uuid4()}{extension}"
    return os.path.join("uploads/news_media/", filename)


class News(models.Model):
    file = models.FileField(upload_to=news_media_path)
    title = models.CharField(max_length=150)
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="news_posters")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return self.title

def info_media_path(instance, filename):
    _, extension = os.path.splitext(filename)
    filename = f"{slugify(instance.title)}-{uuid.uuid4()}{extension}"
    return os.path.join("uploads/info_media/", filename)


class ImportantInfo(models.Model):
    title = models.CharField(max_length=150)
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="info_posters")
    file = models.FileField(upload_to=info_media_path)
    description = models.CharField(max_length=555, default="No Description")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

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
        related_name="banned_users",
    )
    reason = models.CharField(max_length=55, choices=BanReasonsChoices.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    banned_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="banners")

    class Meta:
        ordering = ["created_at"]

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
