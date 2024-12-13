from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Usuario, ConfiguracionNegocio
from .serializers import UsuarioSerializer, UsuarioCreateSerializer, ConfiguracionNegocioSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.generics import RetrieveUpdateAPIView
from .permissions import IsAdminRol

# Login con JWT
class LoginView(TokenObtainPairView):
    pass

# Crear Usuario (solo admin puede crear)
class UsuarioCreateView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioCreateSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRol]

# Listar Usuarios (solo admin y supervisores)
class UsuarioListView(generics.ListAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Si el usuario no es admin, restringir la lista
        if user.rol != 'admin':
            return Usuario.objects.filter(rol='user')
        return super().get_queryset()

# Detalle de Usuario, actualización, desactivación lógica
class UsuarioDetailView(generics.RetrieveUpdateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        # Desactivación lógica
        instance.is_active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Usuario desactivado correctamente."}, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        # Verificar si el usuario intenta desactivarse a sí mismo
        instance = self.get_object()
        if not instance.is_active and request.user == instance:
            return Response(
                {"error": "No puedes desactivarte a ti mismo."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Permitir actualización
        return super().update(request, *args, **kwargs)

# Obtener detalles del usuario autenticado
class UsuarioDetalleActualView(APIView):
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)
    
# Actualizar usuario
class UsuarioUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        user = Usuario.objects.get(pk=pk)
        if request.user == user:  # Evitar desactivarse a sí mismo
            return Response({"message": "No puedes desactivar tu propia cuenta."}, status=400)

        user.is_active = request.data.get("is_active", user.is_active)
        password = request.data.get("password")
        if password:
            user.set_password(password)
        user.save()

        return Response({"message": "Usuario actualizado correctamente."})
    
class ConfiguracionNegocioView(RetrieveUpdateAPIView):
    queryset = ConfiguracionNegocio.objects.all()
    serializer_class = ConfiguracionNegocioSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_object(self):
        # Solo un registro, por lo tanto, devuelve el primer objeto o lo crea si no existe
        obj, created = ConfiguracionNegocio.objects.get_or_create()
        return obj
    
class ConfiguracionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        config = ConfiguracionNegocio.objects.first()
        if config:
            serializer = ConfiguracionNegocioSerializer(config)
            return Response(serializer.data)
        return Response({"error": "Configuración no encontrada."}, status=status.HTTP_404_NOT_FOUND)
    
    def patch(self, request):
        # Actualizar la configuración
        config, created = ConfiguracionNegocio.objects.get_or_create()
        serializer = ConfiguracionNegocioSerializer(config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ConfiguracionPublicaView(APIView):
    """
    Endpoint público para obtener la configuración del negocio (nombre y logo).
    """
    permission_classes = [AllowAny]  # Permite acceso sin autenticación

    def get(self, request):
        config = ConfiguracionNegocio.objects.first()
        if config:
            serializer = ConfiguracionNegocioSerializer(config)
            return Response({
                "nombre_negocio": serializer.data["nombre_negocio"],
                "logo": serializer.data["logo"]
            })
        return Response({"error": "Configuración no encontrada."}, status=status.HTTP_404_NOT_FOUND)