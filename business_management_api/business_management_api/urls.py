from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Login
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh Token
    path('api/', include('aplicaciones.usuarios.urls')),  # Módulo de usuarios y roles
]
