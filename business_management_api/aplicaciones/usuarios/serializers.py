from rest_framework import serializers
from .models import Usuario, ConfiguracionNegocio

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'rol', 'is_active']

class UsuarioCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = ['email', 'password', 'rol']

    def create(self, validated_data):
        user = Usuario.objects.create(
            email=validated_data['email'],
            username=validated_data['email'],
            rol=validated_data['rol']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class ConfiguracionNegocioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionNegocio
        fields = ['nombre_negocio', 'logo']