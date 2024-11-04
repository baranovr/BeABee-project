from django.dispatch import receiver
from django.db.models.signals import post_save
from django.db import transaction

from beabee.models import Exam, Calendar

@receiver(post_save, sender=Exam)
def create_calendar_entry(sender, instance, created, **kwargs):
    if created:
        transaction.on_commit(lambda: Calendar.objects.create(exam=instance, date_time=instance.date_time))
