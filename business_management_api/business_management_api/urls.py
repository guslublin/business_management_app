from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Login
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh Token
    path('api/', include('aplicaciones.usuarios.urls')),  # Módulo de usuarios y roles
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
