import os
import uuid

from django.contrib.auth import get_user_model
from django.db import models
from django.utils.text import slugify
from beabee_project import settings


class GroupChoices(models.TextChoices):
    CS_31 = "CS-31"
    CS_32 = "CS-32",
    CS_33 = "CS-33",
    CS_34 = "CS-34",
    CS_41 = "CS-41",
    CS_42 = "CS-42",
    CS_43 = "CS-43",
    CS_44 = "CS-44",


class SubGroupChoices(models.TextChoices):
    FIRST = "1"
    SECOND = "2"


class TeacherDegreeChoice(models.TextChoices):
    BACHELOR = "Bachelor's Degree"
    MASTER = "Master's Degree"
    CANDIDATE = "Candidate of Sciences"
    DOCTOR = "Doctor of Sciences"


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

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Subject(models.Model):
    name = models.CharField(max_length=30, unique=True)
    group = models.CharField(max_length=8, choices=GroupChoices, default="NO_GROUP")
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


def teachers_avatars_path(instance, filename):
    _, extension = os.path.splitext(filename)
    filename = f"{slugify(instance.last_name)}-{uuid.uuid4()}{extension}"
    return os.path.join("uploads/teachers_avatars/", filename)


class Teacher(models.Model):
    teacher_avatar = models.ImageField(upload_to=teachers_avatars_path)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    surname = models.CharField(max_length=20)
    subjects = models.ManyToManyField(Subject)
    degree = models.CharField(max_length=25, choices=TeacherDegreeChoice.choices)
    email = models.EmailField(default='noemail@example.com')
    math_phy_count = models.PositiveIntegerField(default=0)
    prog_net_count = models.PositiveIntegerField(default=0)
    lang_cul_count = models.PositiveIntegerField(default=0)

    @property
    def full_name_sur(self):
        return f"{self.last_name} {self.first_name} {self.surname}"

    class Meta:
        ordering = ["last_name", "first_name"]

    def __str__(self):
        return f"{self.first_name} {self.last_name} {self.surname}"


class ExamTypeChoices(models.TextChoices):
    ANNUAL_EXAM = "Annual exam",
    ANNUAL_EXAM_RET = "Annual exam (retake)",

    YEAR_SESSION = "Year session",
    YEAR_SESSION_RET = "Year session (retake)",

    SEM_SESSION = "Semester session",
    SEM_SESSION_RET = "Semester session (retake)",

    MODULAR_CONTROL_WORK = "Modular control work",
    MODULAR_CONTROL_WORK_RET = "Modular control work (retake)",

    CONTROL_WORK = "Control work",
    CONTROL_WORK_RET = "Control work (retake)",

    SPECIFIC_TYPE = "Specific type"


class Exam(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    date_time = models.DateTimeField()
    details = models.CharField(max_length=50, default="No Details")
    group = models.CharField(max_length=5, choices=GroupChoices.choices)
    type = models.CharField(max_length=35, choices=ExamTypeChoices.choices, default=ExamTypeChoices.SPECIFIC_TYPE)

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
    title = models.CharField(max_length=50)
    description = models.TextField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="subject_homeworks")
    type = models.CharField(max_length=13, choices=HomeworkTypeChoice.choices)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="teacher_homeworks")
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(null=True, blank=True)
    for_group = models.CharField(max_length=8, choices=GroupChoices.choices, default="No group")
    added_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="added_by_homeworks")

    class Meta:
        ordering = ["created_at"]

    def save(self, *args, **kwargs):
        if self.pk:
            original = Homework.objects.get(pk=self.pk)
            if original.type != self.type or original.teacher != self.teacher:
                if original.type == HomeworkTypeChoice.MATH_PHYSICS:
                    original.teacher.math_phy_count -= 1
                elif original.type == HomeworkTypeChoice.PROG_NETWORKS:
                    original.teacher.prog_net_count -= 1
                elif original.type == HomeworkTypeChoice.LANG_CULTURE:
                    original.teacher.lang_cul_count -= 1
                original.teacher.save()

        super().save(*args, **kwargs)

        if self.type == HomeworkTypeChoice.MATH_PHYSICS:
            self.teacher.math_phy_count += 1
        elif self.type == HomeworkTypeChoice.PROG_NETWORKS:
            self.teacher.prog_net_count += 1
        elif self.type == HomeworkTypeChoice.LANG_CULTURE:
            self.teacher.lang_cul_count += 1
        self.teacher.save()

    def delete(self, *args, **kwargs):
        if self.type == HomeworkTypeChoice.MATH_PHYSICS:
            self.teacher.math_phy_count -= 1
        elif self.type == HomeworkTypeChoice.PROG_NETWORKS:
            self.teacher.prog_net_count -= 1
        elif self.type == HomeworkTypeChoice.LANG_CULTURE:
            self.teacher.lang_cul_count -= 1
        self.teacher.save()

        super().delete(*args, **kwargs)

    def __str__(self):
        return self.title


def news_media_path(instance, filename):
    _, extension = os.path.splitext(filename)
    filename = f"{slugify(instance.title)}-{uuid.uuid4()}{extension}"
    return os.path.join("uploads/news_media/", filename)


class News(models.Model):
    file = models.FileField(upload_to=news_media_path)
    title = models.CharField(max_length=30)
    description = models.CharField(max_length=1200, default="No description")
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
    title = models.CharField(max_length=50)
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="info_posters")
    image = models.ImageField(upload_to=info_media_path)
    description = models.CharField(max_length=1200, default="No Description")
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
    reason = models.CharField(max_length=30, choices=BanReasonsChoices.choices)
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


class RoleChoices(models.TextChoices):
    HEADMAN = "Headman"
    D_HEADMAN = "Deputy headman"
    STUDENT = "Student"


class LocationChoices(models.TextChoices):
    IN_UKR = "In Ukraine"
    ABOARD = "Lives aboard"


class StudentInTable(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    surname = models.CharField(max_length=20)
    group = models.CharField(max_length=5, choices=GroupChoices.choices)
    subgroup = models.CharField(max_length=2, choices=SubGroupChoices.choices)
    email = models.EmailField(default="noemail@example.com")
    role = models.CharField(max_length=15, choices=RoleChoices.choices)
    location = models.CharField(max_length=13, choices=LocationChoices.choices)

    @property
    def last_first_sur(self):
        return f"{self.last_name} {self.first_name} {self.surname}"

    @property
    def full_group(self):
        return f"{self.group}/{self.subgroup}"

    @property
    def role_and_location(self):
        return f"{self.role} {self.location}"

    def __str__(self):
        return f"{self.last_name}, {self.group}"


class SystemTypesChoices(models.TextChoices):
    SUCCESS = "Success"
    WARNING = "Warning"
    ERROR = "Error"


class SystemNotifications(models.Model):
    type = models.CharField(max_length=7, choices=SystemTypesChoices.choices)
    description = models.CharField(max_length=150)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    show_once = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.description

class SystemNotificationView(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    notification = models.ForeignKey(SystemNotifications, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'notification')
