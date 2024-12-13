from rest_framework import serializers
from .models import Usuario  # Solo importa el modelo

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'rol']
