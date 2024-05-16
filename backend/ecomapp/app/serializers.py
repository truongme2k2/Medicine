from rest_framework import serializers
from .models import UserProfile, Categories, Medicine, Orders, Order_Medicine, TypeOfUser

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('id', 'email','password', 'address', 'phone')
        extra_kwargs = {'password': {'write_only': True}}

    
    def create(self, validated_data):
        user = UserProfile.objects.create_user(**validated_data)
        return user

class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = ['category_id', 'name']

class TypeOfUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeOfUser
        fields = ['id', 'name']

class MedicineSerializer(serializers.ModelSerializer):

    class Meta:
        model = Medicine
        fields = ['med_id', 'name', 'description', 'quantity', 'category', 'img', 'import_price', 'buy_price', 'type_of_user']

class OrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = ['order_id', 'time', 'user', 'total_price']

class OrderMedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order_Medicine
        fields = ['id', 'order', 'medicine', 'quantity', 'price']




