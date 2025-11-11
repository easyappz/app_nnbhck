from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"

    def ready(self) -> None:
        # Ensure signals are imported and registered
        from . import signals  # noqa: F401
        return super().ready()
