from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'auth', views.AuthViewSet, basename='auth')
router.register(r'profile', views.ProfileViewSet, basename='profile')
router.register(r'produce', views.ProduceViewSet, basename='produce')
router.register(r'bids', views.BidViewSet, basename='bids')
router.register(r'orders', views.OrderViewSet, basename='orders')
router.register(r'payouts', views.PayoutViewSet, basename='payouts')
router.register(r'warehouses', views.WarehouseViewSet, basename='warehouses')
router.register(r'todos', views.TodoViewSet, basename='todos')

urlpatterns = [
    path('test/', views.test_api, name='test_api'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]

