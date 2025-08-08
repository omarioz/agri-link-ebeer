from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Profile, AppUser, Produce, Bid, Order, Payout, Warehouse, Todo
from decimal import Decimal

class CoreFlowTest(APITestCase):
    """Test the core business flow: farmer creates produce → buyer bids → farmer accepts → order created"""
    
    def setUp(self):
        # Create test users
        self.farmer_user = User.objects.create_user(
            username='farmer1',
            email='farmer1@test.com',
            password='testpass123'
        )
        self.farmer_app_user = AppUser.objects.create(
            user=self.farmer_user,
            name='John Farmer',
            email='farmer1@test.com',
            role='farmer'
        )
        
        self.buyer_user = User.objects.create_user(
            username='buyer1',
            email='buyer1@test.com',
            password='testpass123'
        )
        self.buyer_app_user = AppUser.objects.create(
            user=self.buyer_user,
            name='Jane Buyer',
            email='buyer1@test.com',
            role='buyer'
        )
        
        # Create test produce
        self.produce = Produce.objects.create(
            farmer=self.farmer_user,
            name='Fresh Tomatoes',
            quantity=Decimal('100.00'),
            price_per_kg=Decimal('5.00'),
            min_price=Decimal('4.50'),
            location='Farm A',
            is_active=True
        )
        
        # Get tokens
        self.farmer_token = RefreshToken.for_user(self.farmer_user)
        self.buyer_token = RefreshToken.for_user(self.buyer_user)
    
    def test_core_business_flow(self):
        """Test the complete flow: produce → bid → accept → order"""
        
        # 1. Buyer places a bid
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.buyer_token.access_token}')
        bid_data = {
            'produce': self.produce.id,
            'bid_price': Decimal('4.75')
        }
        response = self.client.post('/api/bids/', bid_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        bid_id = response.data['id']
        
        # 2. Farmer accepts the bid
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.farmer_token.access_token}')
        response = self.client.post(f'/api/bids/{bid_id}/accept/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 3. Verify produce is now inactive
        self.produce.refresh_from_db()
        self.assertFalse(self.produce.is_active)
        
        # 4. Verify bid status is accepted
        bid = Bid.objects.get(id=bid_id)
        self.assertEqual(bid.status, 'accepted')
        
        # 5. Verify order was created
        order = Order.objects.filter(produce=self.produce, buyer=self.buyer_user).first()
        self.assertIsNotNone(order)
        self.assertEqual(order.status, 'accepted')
        
        # 6. Verify buyer can see their order
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.buyer_token.access_token}')
        response = self.client.get('/api/orders/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], str(order.id))

class ProduceTest(APITestCase):
    """Test produce listing functionality"""
    
    def setUp(self):
        self.farmer_user = User.objects.create_user(
            username='farmer2',
            email='farmer2@test.com',
            password='testpass123'
        )
        self.farmer_app_user = AppUser.objects.create(
            user=self.farmer_user,
            name='Farmer Two',
            email='farmer2@test.com',
            role='farmer'
        )
        self.farmer_token = RefreshToken.for_user(self.farmer_user)
    
    def test_farmer_can_create_produce(self):
        """Test that farmers can create produce listings"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.farmer_token.access_token}')
        produce_data = {
            'name': 'Organic Carrots',
            'quantity': Decimal('50.00'),
            'price_per_kg': Decimal('3.50'),
            'min_price': Decimal('3.00'),
            'location': 'Farm B'
        }
        response = self.client.post('/api/produce/', produce_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Produce.objects.count(), 1)
    
    def test_public_can_view_active_produce(self):
        """Test that public can view active produce listings"""
        Produce.objects.create(
            farmer=self.farmer_user,
            name='Fresh Lettuce',
            quantity=Decimal('25.00'),
            price_per_kg=Decimal('2.50'),
            min_price=Decimal('2.00'),
            location='Farm C',
            is_active=True
        )
        
        response = self.client.get('/api/produce/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class BidTest(APITestCase):
    """Test bidding functionality"""
    
    def setUp(self):
        # Create farmer and produce
        self.farmer_user = User.objects.create_user(
            username='farmer3',
            email='farmer3@test.com',
            password='testpass123'
        )
        self.farmer_app_user = AppUser.objects.create(
            user=self.farmer_user,
            name='Farmer Three',
            email='farmer3@test.com',
            role='farmer'
        )
        
        self.produce = Produce.objects.create(
            farmer=self.farmer_user,
            name='Sweet Corn',
            quantity=Decimal('75.00'),
            price_per_kg=Decimal('4.00'),
            min_price=Decimal('3.50'),
            location='Farm D',
            is_active=True
        )
        
        # Create buyer
        self.buyer_user = User.objects.create_user(
            username='buyer2',
            email='buyer2@test.com',
            password='testpass123'
        )
        self.buyer_app_user = AppUser.objects.create(
            user=self.buyer_user,
            name='Buyer Two',
            email='buyer2@test.com',
            role='buyer'
        )
        
        self.buyer_token = RefreshToken.for_user(self.buyer_user)
    
    def test_buyer_can_place_bid(self):
        """Test that buyers can place bids"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.buyer_token.access_token}')
        bid_data = {
            'produce': self.produce.id,
            'bid_price': Decimal('3.75')
        }
        response = self.client.post('/api/bids/', bid_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Bid.objects.count(), 1)
    
    def test_bid_below_min_price_rejected(self):
        """Test that bids below minimum price are rejected"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.buyer_token.access_token}')
        bid_data = {
            'produce': self.produce.id,
            'bid_price': Decimal('3.00')  # Below min_price of 3.50
        }
        response = self.client.post('/api/bids/', bid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class PayoutTest(APITestCase):
    """Test payout functionality"""
    
    def setUp(self):
        self.farmer_user = User.objects.create_user(
            username='farmer4',
            email='farmer4@test.com',
            password='testpass123'
        )
        self.farmer_app_user = AppUser.objects.create(
            user=self.farmer_user,
            name='Farmer Four',
            email='farmer4@test.com',
            role='farmer'
        )
        self.farmer_token = RefreshToken.for_user(self.farmer_user)
        
        # Create produce and delivered order
        self.produce = Produce.objects.create(
            farmer=self.farmer_user,
            name='Fresh Peppers',
            quantity=Decimal('30.00'),
            price_per_kg=Decimal('6.00'),
            min_price=Decimal('5.50'),
            location='Farm E',
            is_active=False
        )
        
        self.buyer_user = User.objects.create_user(
            username='buyer3',
            email='buyer3@test.com',
            password='testpass123'
        )
        
        self.order = Order.objects.create(
            buyer=self.buyer_user,
            produce=self.produce,
            status='delivered'
        )
    
    def test_farmer_can_request_payout(self):
        """Test that farmers can request payouts for delivered orders"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.farmer_token.access_token}')
        response = self.client.post('/api/payouts/request/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Payout.objects.count(), 1)
        
        payout = Payout.objects.first()
        self.assertEqual(payout.amount, Decimal('6.00'))  # price_per_kg
        self.assertEqual(payout.status, 'pending')

class AuthTest(APITestCase):
    """Test authentication functionality"""
    
    def test_user_registration(self):
        """Test user registration with role"""
        user_data = {
            'username': 'newuser',
            'email': 'newuser@test.com',
            'password': 'testpass123',
            'password2': 'testpass123',
            'role': 'farmer',
            'name': 'New User'
        }
        response = self.client.post('/api/auth/register/', user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify user and AppUser were created
        self.assertTrue(User.objects.filter(username='newuser').exists())
        self.assertTrue(AppUser.objects.filter(user__username='newuser').exists())
        self.assertEqual(AppUser.objects.get(user__username='newuser').role, 'farmer')
    
    def test_user_login(self):
        """Test user login with JWT"""
        user = User.objects.create_user(
            username='logintest',
            email='logintest@test.com',
            password='testpass123'
        )
        AppUser.objects.create(
            user=user,
            name='Login Test',
            email='logintest@test.com',
            role='buyer'
        )
        
        login_data = {
            'username': 'logintest',
            'password': 'testpass123'
        }
        response = self.client.post('/api/auth/login/', login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
