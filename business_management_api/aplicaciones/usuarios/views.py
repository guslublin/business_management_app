from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Usuario
from .serializers import UsuarioSerializer, UsuarioCreateSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

# Login con JWT
class LoginView(TokenObtainPairView):
    pass

# Crear Usuario (solo admin puede crear)
class UsuarioCreateView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioCreateSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

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