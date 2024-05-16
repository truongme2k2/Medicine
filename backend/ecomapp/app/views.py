from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserProfileSerializer, CategoriesSerializer, OrderMedicineSerializer, OrdersSerializer, MedicineSerializer, TypeOfUserSerializer
from .models import UserProfile, Categories, Orders, Order_Medicine, Medicine, TypeOfUser
from rest_framework_simplejwt.tokens import RefreshToken
from app.middlewares import UserMiddleware, AdminMiddleware
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import datetime
import os
import calendar

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

    if not user:
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
    
    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token) 
    refresh = str(refresh) 

    user_data = {
        'email': user.email,
        'is_staff': user.is_staff  
    }

    print(user_data)
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
def getAllType(request):
    list_tye = TypeOfUser.objects.all()
    serializer = TypeOfUserSerializer(list_tye, many=True)
    return Response(serializer.data)

@csrf_exempt
@UserMiddleware
@api_view(['GET'])
def getByType(request,id):
    try:
        medicines = Medicine.objects.filter(type_of_user_id=id)
        serializer = MedicineSerializer(medicines, many=True)
        
        return Response(serializer.data)
    except Medicine.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

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
            name = request.data.get('name')
            if Medicine.objects.filter(name=name).exists():
                return Response({'error': 'Medicine with this name already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Lưu sản phẩm vào cơ sở dữ liệu
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@csrf_exempt
@UserMiddleware
def getByName(request):
    name = request.query_params.get('name', None) 
    if name:
        try:
            medicine = Medicine.objects.filter(name__icontains = name)
            serializers = MedicineSerializer(medicine, many = True)
            return Response(serializers.data)
        except Medicine.DoesNotExist:
            return Response({'error':'medicine not found'}, status=404)
    else:
        return Response({'error':'url is wrong'}, status=404)

@api_view(['GET'])
@csrf_exempt
@UserMiddleware
def getHistoryOrders(request):
    user_id = request.user_id
    try: 
        user = UserProfile.objects.get(id = user_id)
    except UserProfile.DoesNotExist:
        return Response({'error': 'user not found'})
    orders = Orders.objects.filter(user=user_id, status=1).order_by('-time')
    serializers = OrdersSerializer(orders, many = True)
    return Response(serializers.data)

@api_view(['GET'])
@csrf_exempt
@UserMiddleware
def getOrderDetail(request,id):
    if id:
        try:
            order_id = int(id)
        except ValueError:
            return Response({'error': 'Orderid wrong.'}, status=400)
        try:
            order = Orders.objects.get(order_id = order_id)
            serializer = OrdersSerializer(order, many=False)
            order_medicine = Order_Medicine.objects.filter(order_id = order_id)
            data = []
            for item in order_medicine:
                try:
                    medicine = Medicine.objects.get(med_id = item.medicine_id)
                    tmp = {
                        'name': medicine.name,
                        'quantity': item.quantity,
                        'price': item.price,
                        'image': medicine.img
                    }
                    data.append(tmp)
                except Medicine.DoesNotExist:
                    return Response({'error':'medicine not found'})
            return Response({'data':data,'order':serializer.data})
        except Orders.DoesNotExist:
            return Response({'error':'order not found'}, status=404)
    else:
        return Response({'error':'url is wrong'}, status=404)
    
@api_view(['GET'])
@csrf_exempt
@UserMiddleware
def getByPrice(request):
    # Kiểm tra xem 'min' và 'max' có được cung cấp không
    min_price = request.GET.get('min')
    max_price = request.GET.get('max')
    
    if min_price is None or max_price is None:
        return Response({'error': 'Both min and max prices must be provided.'}, status=400)
    
    # Kiểm tra xem 'min' và 'max' có phải là số không
    try:
        min_price = int(min_price)
        max_price = int(max_price)
    except ValueError:
        return Response({'error': 'Both min and max prices must be valid integers.'}, status=400)
    
    # Xử lý lấy sản phẩm từ cơ sở dữ liệu dựa trên min và max price
    medicines = Medicine.objects.filter(buy_price__gte=min_price, buy_price__lte=max_price)
    
    # Serialize dữ liệu và trả về response
    serializer = MedicineSerializer(medicines, many=True)
    return Response(serializer.data)

def calTime(month, quarter, year):
    if year:
        year = int(year)  # Convert year to integer
        if month:
            month = int(month)  # Convert month to integer
            start_date = datetime.datetime(year, month, 1)
            end_date = start_date.replace(day=calendar.monthrange(year, month)[1],hour=23, minute=59, second=59)
            return start_date, end_date
        elif quarter:
            quarter = int(quarter)  # Convert quarter to integer
            # Tính toán khoảng thời gian cho quý
            quarter_start_month = (quarter - 1) * 3 + 1  # Tháng bắt đầu của quý
            quarter_end_month = quarter * 3  # Tháng kết thúc của quý
            start_date = datetime.datetime(year, quarter_start_month, 1)
            end_date = datetime.datetime(year, quarter_end_month, calendar.monthrange(year, quarter_end_month)[1],23, 59, 59)
            return start_date, end_date
        else:
            start_date = datetime.datetime(year, 1, 1)
            end_date = datetime.datetime(year, 12, 31,23, 59, 59)
            return start_date, end_date
    else:
        return False, False



@api_view(['POST']) 
@csrf_exempt
@AdminMiddleware
def viewReport(request):
    month = request.data.get('month')
    quarter = request.data.get('quarter')
    year = request.data.get('year')
    
    start_date, end_date = calTime(month,quarter,year)
    if start_date==False or end_date == False:
        return Response({'error':'time is wrong'})
    else:
        orders = Orders.objects.filter(time__gte = start_date, time__lte = end_date, status=1)
        num_of_orders = len(orders)
        dict_medice = {}
        for order in orders:
            order_medicine = Order_Medicine.objects.filter(order_id = order.order_id)
            for item in order_medicine:
                dict_medice[item.medicine.med_id] = dict_medice.get(item.medicine.med_id,0)+item.quantity
        data = []
        sum_total_price = 0
        sum_productive = 0
        for key in dict_medice.keys():
            try:
                medicine = Medicine.objects.get(med_id = key)
            except Medicine.DoesNotExist:
                return Response({'error':'loi'})
            tmp = {
                'name': medicine.name,
                'saled': dict_medice.get(key),
                'total_price': dict_medice.get(key)*medicine.buy_price,
                'productive': dict_medice.get(key)*(medicine.buy_price-medicine.import_price)
            }
            sum_productive+=dict_medice.get(key)*(medicine.buy_price-medicine.import_price)
            sum_total_price+=dict_medice.get(key)*medicine.buy_price
            data.append(tmp)
        return Response({'data':data,'num_of_orders': num_of_orders,'sum_total_price':sum_total_price,'sum_productive':sum_productive})
    

@api_view(['POST'])
@csrf_exempt
@AdminMiddleware
def updateMedicine(request, id):
    try:
        # Lấy dữ liệu mới từ request data
        updated_data = request.data

        # Lấy đối tượng Medicine cần cập nhật từ id
        medicine = Medicine.objects.get(med_id=id)

        # Cập nhật dữ liệu của đối tượng Medicine từ request data

        medicine.description = updated_data.get('description', medicine.description)
        medicine.quantity = updated_data.get('quantity', medicine.quantity)

        # Lưu lại dữ liệu đã được cập nhật
        medicine.save()

        # Trả về dữ liệu đã được cập nhật
        return Response(status=200)
    except Medicine.DoesNotExist:
        return Response({'error': 'Medicine not found'}, status=404)


@api_view(['POST'])
@csrf_exempt
@AdminMiddleware
def viewChart(request):
    print("ok")
    
    # Đường dẫn trực tiếp đến tệp thực thi Power BI Desktop
    duong_dan_power_bi_desktop = r"C:\Program Files\WindowsApps\Microsoft.MicrosoftPowerBIDesktop_2.128.1380.0_x64__8wekyb3d8bbwe\bin\PBIDesktop.exe"
    
    # Đường dẫn đến tệp Power BI của bạn
    duong_dan_tap_tin_power_bi = r"D:\Pharmcy-DRF\backend\ecomapp\app\ptthttql_final.pbix"
    
    # Tạo lệnh để mở tệp Power BI
    lenh = f'"{duong_dan_power_bi_desktop}" "{duong_dan_tap_tin_power_bi}"'
    
    # Thực thi lệnh
    os.system(f'start "" {lenh}')
    
    return Response('ok')


