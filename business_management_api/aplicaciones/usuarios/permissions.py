from rest_framework.permissions import BasePermission

class IsAdminRol(BasePermission):
    """
    Permiso personalizado que verifica si el usuario tiene el rol 'admin'.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.rol == 'admin'
