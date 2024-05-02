from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserProfileSerializer, CategoriesSerializer, OrderMedicineSerializer, OrdersSerializer, MedicineSerializer
from .models import UserProfile, Categories, Orders, Order_Medicine, Medicine
from rest_framework_simplejwt.tokens import RefreshToken
from app.middlewares import UserMiddleware, AdminMiddleware
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone

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

@api_view(['GET'])
@csrf_exempt
@UserMiddleware
def getDetailMedicine(request,id):
    med_id = int(id)
    if not med_id:
        return Response({'error': 'Medicine ID is required'}, status=400)
    try:
        medicine = Medicine.objects.get(med_id = med_id)
        serializer = MedicineSerializer(medicine)
        return Response(serializer.data)
    except Medicine.DoesNotExist:
        return Response({'error':'Medicine not fount'}, status=404)

@api_view(['POST'])
@csrf_exempt
@UserMiddleware
def addToCart(request):
    # Lấy user_id từ request
    user_id = request.user_id
    
    try:
        # Lấy UserProfile tương ứng với user_id
        user_profile = UserProfile.objects.get(id=user_id)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        # Tìm đơn hàng chưa thanh toán của người dùng
        order = Orders.objects.get(user=user_profile, status=0)
    except Orders.DoesNotExist:
        # Nếu không tìm thấy đơn hàng chưa thanh toán, tạo mới
        order = Orders.objects.create(user=user_profile, total_price=0, status=0)

    # Lấy dữ liệu mặt hàng từ request body
    data = request.data
    medicine_id = int(data.get('medicine_id'))
    quantity = int(data.get('quantity'))

    try:
        # Tìm thông tin mặt hàng từ database
        medicine = Medicine.objects.get(med_id=medicine_id)
    except Medicine.DoesNotExist:
        return Response({'error': 'Medicine not found'}, status=status.HTTP_404_NOT_FOUND)

    # Kiểm tra số lượng tồn kho
    if medicine.quantity < quantity:
        return Response({'error': 'Not enough stock for the requested quantity'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Kiểm tra xem mặt hàng đã tồn tại trong đơn hàng chưa
        order_medicine = Order_Medicine.objects.get(order=order, medicine_id=medicine_id)
        # Nếu mặt hàng đã tồn tại, không thêm vào lại
        return Response({'message': 'Medicine already exists in the order'}, status=status.HTTP_400_BAD_REQUEST)
    except Order_Medicine.DoesNotExist:
        # Tạo một Order_Medicine mới và thêm vào đơn hàng
        order_medicine = Order_Medicine.objects.create(order=order, medicine=medicine, quantity=quantity, price=medicine.buy_price * quantity)
        medicine.quantity -= quantity
        medicine.save()
        return Response({'message': 'Medicine added to cart successfully'}, status=status.HTTP_201_CREATED)
    

@csrf_exempt
@UserMiddleware
@api_view(['GET'])
def getOrder(request):
    user_id = request.user_id
    try: 
        user = UserProfile.objects.get(id = user_id)
    except UserProfile.DoesNotExist:
        return Response({'error': 'user not found'})
    orders = Orders.objects.filter(user=user_id, status=0)
    if orders.exists():  
        if orders.count() == 1:
            data = []
            list_med = Order_Medicine.objects.filter(order=orders[0].order_id)
            if list_med.exists():
                for med in list_med:
                    try:
                        tmp = Medicine.objects.get(med_id=med.medicine_id)
                        tmp_data = {
                            'id': tmp.med_id,
                            'name': tmp.name,
                            'img': tmp.img,
                            'buy_price': tmp.buy_price,
                            'quantity': med.quantity,
                            'price': med.price
                        }
                        data.append(tmp_data)
                    except Medicine.DoesNotExist:
                        return Response({'error': 'Medicine not found'})
            else:
                return Response("ko co mat hang nao")  # Trả về danh sách rỗng nếu không có mặt hàng nào trong đơn hàng
            return Response({'data': data, 'order_id': orders[0].order_id})
        else: 
            return Response("Error: Multiple active orders found")
    else:  
        new_order = Orders.objects.create(user=user, total_price=0, status=0)
        return Response({'order_id': new_order.order_id})

    



@csrf_exempt
@UserMiddleware
@api_view(['GET'])
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
    try:
        order = Orders.objects.get(order_id = int(request.data.get('order_id')))
        total_price = float(request.data.get('total_price'))

        order.total_price = total_price
        order.time = timezone.now()  # Thời điểm cập nhật
        order.status = 1
        order.save()
        print("okkok")
        return Response("ok")
    except Orders.DoesNotExist:
        return Response({'error':'order not found'}, status=404)


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
