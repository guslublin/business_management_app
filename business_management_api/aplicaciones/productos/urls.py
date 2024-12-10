from django.urls import path
from .views import ProductoListCreateView, ProductoDetailView

urlpatterns = [
    path('productos/', ProductoListCreateView.as_view(), name='productos-list-create'),
    path('productos/<int:pk>/', ProductoDetailView.as_view(), name='productos-detail'),
]
