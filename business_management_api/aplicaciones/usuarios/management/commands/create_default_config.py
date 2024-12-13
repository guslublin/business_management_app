from django.core.management.base import BaseCommand
from aplicaciones.usuarios.models import ConfiguracionNegocio

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        if not ConfiguracionNegocio.objects.exists():
            ConfiguracionNegocio.objects.create(
                nombre_negocio="Business Management",
                logo=None
            )
            print("Configuración de negocio creada por defecto.")
        else:
            print("Configuración de negocio ya existe.")
