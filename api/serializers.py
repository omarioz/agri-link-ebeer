from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Profile, AppUser, Produce, Bid, Order, Payout, Warehouse, Todo

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for Profile model"""
    class Meta:
        model = Profile
        fields = ['id', 'name']

class AppUserSerializer(serializers.ModelSerializer):
    """Serializer for AppUser model"""
    class Meta:
        model = AppUser
        fields = ['id', 'name', 'email', 'role']

class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=AppUser.ROLE_CHOICES)
    name = serializers.CharField(max_length=255)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'role', 'name']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        role = validated_data.pop('role')
        name = validated_data.pop('name')
        validated_data.pop('password2')
        
        user = User.objects.create_user(**validated_data)
        AppUser.objects.create(user=user, name=name, email=validated_data['email'], role=role)
        
        return user

class ProduceSerializer(serializers.ModelSerializer):
    """Serializer for Produce model"""
    farmer_name = serializers.CharField(source='farmer.username', read_only=True)
    
    class Meta:
        model = Produce
        fields = [
            'id', 'farmer', 'farmer_name', 'name', 'image_url', 'quantity',
            'price_per_kg', 'min_price', 'location', 'harvest_date',
            'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def validate(self, attrs):
        if attrs.get('min_price', 0) > attrs.get('price_per_kg', 0):
            raise serializers.ValidationError("Minimum price cannot be higher than price per kg")
        return attrs

class BidSerializer(serializers.ModelSerializer):
    """Serializer for Bid model"""
    buyer_name = serializers.CharField(source='buyer.username', read_only=True)
    produce_name = serializers.CharField(source='produce.name', read_only=True)
    
    class Meta:
        model = Bid
        fields = [
            'id', 'produce', 'produce_name', 'buyer', 'buyer_name',
            'bid_price', 'status', 'timestamp'
        ]
        read_only_fields = ['id', 'buyer', 'status', 'timestamp']

    def validate(self, attrs):
        produce = attrs.get('produce')
        bid_price = attrs.get('bid_price')
        
        if not produce.is_active:
            raise serializers.ValidationError("Cannot bid on inactive produce")
        
        if bid_price < produce.min_price:
            raise serializers.ValidationError(f"Bid price must be at least {produce.min_price}")
        
        return attrs

class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model"""
    buyer_name = serializers.CharField(source='buyer.username', read_only=True)
    produce_name = serializers.CharField(source='produce.name', read_only=True)
    farmer_name = serializers.CharField(source='produce.farmer.username', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'buyer', 'buyer_name', 'produce', 'produce_name',
            'farmer_name', 'status', 'delivery_route', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class PayoutSerializer(serializers.ModelSerializer):
    """Serializer for Payout model"""
    farmer_name = serializers.CharField(source='farmer.username', read_only=True)
    
    class Meta:
        model = Payout
        fields = ['id', 'farmer', 'farmer_name', 'amount', 'status', 'requested_at']
        read_only_fields = ['id', 'status', 'requested_at']

class WarehouseSerializer(serializers.ModelSerializer):
    """Serializer for Warehouse model"""
    class Meta:
        model = Warehouse
        fields = ['id', 'location', 'capacity_kg', 'current_load_kg']

class TodoSerializer(serializers.ModelSerializer):
    """Serializer for Todo model"""
    class Meta:
        model = Todo
        fields = ['id', 'task', 'user', 'inserted_at']
        read_only_fields = ['id', 'inserted_at']
