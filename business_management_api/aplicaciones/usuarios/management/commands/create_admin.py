from django.core.management.base import BaseCommand
from aplicaciones.usuarios.models import Usuario

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        if not Usuario.objects.filter(username='admin@businessmanagement.com').exists():
            Usuario.objects.create_superuser(
                username='admin@businessmanagement.com',
                email='admin@businessmanagement.com',
                password='123456',
                rol='admin'
            )
            print("Usuario administrador creado.")
        else:
            print("El usuario administrador ya existe.")
