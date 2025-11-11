from django.contrib import admin
from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "phone", "birth_date")
    search_fields = ("user__username", "user__email", "phone")
    list_select_related = ("user",)
