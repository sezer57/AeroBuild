# Generated by Django 5.1.2 on 2024-10-23 12:23

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Component',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, null=True)),
                ('assemblyOrProduction', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='AeroStock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('createdDate', models.DateTimeField(default=django.utils.timezone.now)),
                ('components', models.ManyToManyField(related_name='aero_stocks', to='api.component')),
            ],
        ),
        migrations.CreateModel(
            name='Aero',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('needsComponent', models.ManyToManyField(related_name='needed_by_aeros', to='api.component')),
            ],
        ),
        migrations.CreateModel(
            name='ComponentStock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('createdDate', models.DateTimeField(default=django.utils.timezone.now)),
                ('isUsed', models.BooleanField(default=False)),
                ('aeroID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='aero_id', to='api.aero')),
                ('componentID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='component_id', to='api.component')),
            ],
        ),
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('hire_date', models.DateField()),
                ('is_active', models.BooleanField(default=True)),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now)),
                ('team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='employees', to='api.team')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='component',
            name='team',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='components', to='api.team'),
        ),
    ]