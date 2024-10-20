from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from beabee.models import ImportantInfo, Homework


@receiver(post_save, sender=ImportantInfo)
def send_important_info_notification(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'important_info',
            {
                'type': 'important_info_notification',
                'message': f'New important info: {instance.title}'
            }
        )


@receiver(post_save, sender=Homework)
def send_homework_notification(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'homework',
            {
                'type': 'homework_notification',
                'message': f'New homework: {instance.title}'
            }
        )

