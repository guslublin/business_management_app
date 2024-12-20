from django.urls import path
from .views import LoginView, UsuarioCreateView, UsuarioListView, UsuarioDetailView, UsuarioDetalleActualView, UsuarioUpdateView, ConfiguracionNegocioView, ConfiguracionView, ConfiguracionPublicaView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('usuarios/', UsuarioListView.as_view(), name='usuarios-list'),
    path('usuarios/crear/', UsuarioCreateView.as_view(), name='usuarios-crear'),
    path('usuarios/<int:pk>/', UsuarioDetailView.as_view(), name='usuarios-detalle'),
    path('auth/user/', UsuarioDetalleActualView.as_view(), name='usuario-detalle'), 
    path('usuarios/<int:pk>/editar/', UsuarioUpdateView.as_view(), name='usuarios-editar'),
    path('configuracion/', ConfiguracionView.as_view(), name="configuracion"),
    path('configuracion/publica/', ConfiguracionPublicaView.as_view(), name="configuracion-publica"),

]
