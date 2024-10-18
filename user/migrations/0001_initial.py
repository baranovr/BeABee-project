# Generated by Django 4.0.4 on 2024-10-18 19:37

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import user.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('beabee', '0001_initial'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('avatar', models.ImageField(upload_to=user.models.avatar_path, verbose_name='avatar')),
                ('username', models.CharField(max_length=50, unique=True, verbose_name='username')),
                ('first_name', models.CharField(max_length=50, verbose_name='first name')),
                ('last_name', models.CharField(max_length=50, verbose_name='last name')),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='email address')),
                ('sex', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female')], max_length=10, verbose_name='sex')),
                ('birth_date', models.DateField(verbose_name='birth date')),
                ('language', models.CharField(max_length=50, verbose_name='language')),
                ('phone_number', models.CharField(max_length=50, unique=True, verbose_name='phone number')),
                ('country', models.CharField(max_length=50, verbose_name='country')),
                ('twitter', models.URLField(max_length=250, unique=True, verbose_name='twitter url')),
                ('linkedin', models.URLField(max_length=250, unique=True, verbose_name='linkedin url')),
                ('facebook', models.URLField(max_length=250, unique=True, verbose_name='facebook url')),
                ('instagram', models.URLField(max_length=250, unique=True, verbose_name='instagram url')),
                ('github', models.URLField(max_length=250, unique=True, verbose_name='github url')),
                ('group', models.CharField(default='CS-32', max_length=50, verbose_name='group')),
                ('status', models.CharField(choices=[('Creator', 'Creator'), ('Admin', 'Admin'), ('User', 'User')], default='User', max_length=50, verbose_name='status')),
                ('is_banned', models.BooleanField(default=False)),
                ('ban_reason', models.CharField(blank=True, choices=[('Insulting community members', 'Insulting'), ('Publishing obscene content', 'Obscene Content'), ('Spam', 'Spam')], max_length=255, null=True)),
                ('ban_until', models.DateTimeField(blank=True, null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('posts', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_posts', to='beabee.post')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
        ),
    ]
