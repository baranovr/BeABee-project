# Generated by Django 4.0.4 on 2024-10-23 19:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('beabee', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='importantinfo',
            name='description',
            field=models.CharField(default='No Description', max_length=555),
        ),
    ]