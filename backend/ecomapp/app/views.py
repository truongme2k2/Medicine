from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserProfileSerializer, CategoriesSerializer, OrderMedicineSerializer, OrdersSerializer, MedicineSerializer
from .models import UserProfile, Categories, Orders, Order_Medicine, Medicine
from rest_framework_simplejwt.tokens import RefreshToken
from app.middlewares import UserMiddleware, AdminMiddleware
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

# Create your views here.
@api_view(['POST'])
def register(request):
    data = request.data

    required_fields = ['password', 'confirm_password', 'email']
    for field in required_fields:
        if field not in data or not data[field]:
            return Response({'error': f'{field.capitalize()} is required'}, status=status.HTTP_400_BAD_REQUEST)

    if data['confirm_password'] != data['password']:
        return Response({'error': 'Password does not match Confirm_password'}, status=status.HTTP_400_BAD_REQUEST)

    if UserProfile.objects.filter(email=data['email']).exists():
        return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = UserProfileSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Register is success', 'data': serializer.data}, status=status.HTTP_201_CREATED)

    return Response({'message': 'Information is invalid', 'data': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def loginUser(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    user = authenticate(email=email, password=password)
    print(user)

    if not user:
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
    
    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token) 
    refresh = str(refresh) 

    user_data = {
        'email': user.email,
        'is_staff': user.is_staff  
    }

    return Response({'refresh_token': refresh,'access_token': access, 'user_data': user_data})

@api_view(['GET'])
@csrf_exempt
@UserMiddleware
def getAllCategories(request):
    list_category = Categories.objects.all()
    serializer = CategoriesSerializer(list_category, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@csrf_exempt
@UserMiddleware
def getAllMedicine(request):
    list_medicine = Medicine.objects.all()
    serializer = MedicineSerializer(list_medicine, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@csrf_exempt
@UserMiddleware
def addToCart(request):
    return Response("ok")

@api_view(['GET'])
@csrf_exempt
@UserMiddleware
def getByCategory(request,id):
    try:
        medicines = Medicine.objects.filter(category_id=id)
        serializer = MedicineSerializer(medicines, many=True)
        
        return Response(serializer.data)
    except Medicine.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@csrf_exempt
@UserMiddleware
def order(request):
    return Response("ok")

@api_view(['POST'])
@csrf_exempt
@AdminMiddleware
def createMedicine(request):
    if request.method == 'POST':
        serializer = MedicineSerializer(data=request.data)
        if serializer.is_valid():
            # Kiểm tra xem tên thuốc đã tồn tại chưa
            name = serializer.validated_data.get('name')
            if Medicine.objects.filter(name=name).exists():
                return Response({'error': 'Medicine with this name already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Lưu sản phẩm vào cơ sở dữ liệu
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
