from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=32, blank=True, default='')
    birth_date = models.DateField(null=True, blank=True)
    about = models.TextField(blank=True, default='')

    def __str__(self) -> str:
        return f"Profile<{self.user.email}>"
