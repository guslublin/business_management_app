from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class Usuario(AbstractUser):
    ROLES = (
        ('admin', 'Administrador'),
        ('supervisor', 'Supervisor'),
        ('user', 'Usuario'),
    )
    rol = models.CharField(max_length=20, choices=ROLES, default='user')

    # Evitar conflictos con related_names en Group y Permission
    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_groups",  # Cambiado el related_name
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions",  # Cambiado el related_name
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    def __str__(self):
        return f"{self.username} - {self.get_rol_display()}"
