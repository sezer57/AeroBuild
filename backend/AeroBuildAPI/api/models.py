from django.db import models
from django.contrib.auth.models import AbstractBaseUser , BaseUserManager
from django.utils import timezone

class Team(models.Model):
    name = models.CharField(max_length=100, null=True)
    assemblyOrProduction = models.BooleanField(default=False)  # montaj üretimi listlemek için kullanılıcak


class Component(models.Model):
    name = models.CharField(max_length=100)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='components')



class Aero(models.Model):
    name = models.CharField(max_length=100)
    needsComponent = models.ManyToManyField(Component, related_name='needed_by_aeros')   


class EmployeeManager(BaseUserManager):
    def create_employee(self, email, first_name, last_name, hire_date, team, password=None):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        employee = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            hire_date=hire_date,
            team=team
        )
        employee.set_password(password)  
        employee.save(using=self._db)
        return employee

class Employee(AbstractBaseUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    hire_date = models.DateField()
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='employees')
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = EmployeeManager()


class ComponentStock(models.Model):
    aeroID = models.ForeignKey(Aero, on_delete=models.CASCADE, related_name='aero_id')
    componentID = models.ForeignKey(Component, on_delete=models.CASCADE, related_name='component_id')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='employe_id', null=True)
    createdDate = models.DateTimeField(default=timezone.now)
    isUsed = models.BooleanField(default=False)



class AeroStock(models.Model):
    createdDate = models.DateTimeField(default=timezone.now)
    aeroID = models.ForeignKey(Aero, on_delete=models.CASCADE, related_name='aero_isd', null=True)
    components = models.ManyToManyField(ComponentStock, related_name='aero_stocks')   





