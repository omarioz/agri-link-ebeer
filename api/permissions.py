from rest_framework import permissions
from .models import AppUser

class IsFarmer(permissions.BasePermission):
    """Permission to check if user is a farmer"""
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            return request.user.appuser.role == 'farmer'
        except AppUser.DoesNotExist:
            return False

class IsBuyer(permissions.BasePermission):
    """Permission to check if user is a buyer"""
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            return request.user.appuser.role == 'buyer'
        except AppUser.DoesNotExist:
            return False

class IsOwnerUser(permissions.BasePermission):
    """Permission to check if user owns the object"""
    
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class IsProduceOwner(permissions.BasePermission):
    """Permission to check if user owns the produce"""
    
    def has_object_permission(self, request, view, obj):
        return obj.farmer == request.user

class IsBidOwner(permissions.BasePermission):
    """Permission to check if user owns the bid"""
    
    def has_object_permission(self, request, view, obj):
        return obj.buyer == request.user

class IsOrderBuyer(permissions.BasePermission):
    """Permission to check if user is the buyer of the order"""
    
    def has_object_permission(self, request, view, obj):
        return obj.buyer == request.user

class IsOrderFarmer(permissions.BasePermission):
    """Permission to check if user is the farmer of the order's produce"""
    
    def has_object_permission(self, request, view, obj):
        return obj.produce.farmer == request.user
