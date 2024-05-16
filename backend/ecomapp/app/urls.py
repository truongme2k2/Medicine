from django.urls import path

from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login_user/', views.loginUser, name='login_user'),
    path('getAllCategories/', views.getAllCategories, name = 'getAllCategories'),
    path('getAllMedicine/',views.getAllMedicine, name = 'getAllMedicine'),
    path('addToCart/', views.addToCart, name = 'addToCart'),
    path('getByCategory/<str:id>/', views.getByCategory, name = 'getByCategory'),
    path('order/', views.order, name = 'order'),
    path('createMedicine/', views.createMedicine, name='createMedicine'),
    path('getOrder/',views.getOrder, name='getOrder'),
    path('getDetailMedicine/<str:id>/', views.getDetailMedicine, name='getDetailMedicine'),
    path('getByType/<str:id>/', views.getByType, name='getByType'),
    path('getAllType/', views.getAllType, name='getAllType'),
    path('getByName/', views.getByName, name = 'getByName'),
    path('getHistoryOrders/', views.getHistoryOrders, name='getHistoryOrders'),
    path('getOrderDetail/<str:id>/', views.getOrderDetail, name='getOrderDetail'),
    path('getByPrice/', views.getByPrice, name='getByPrice'),
    path('viewReport/', views.viewReport, name = 'viewReport'),
    path('updateMedicine/<str:id>/', views.updateMedicine, name='updateMedicine'),
    path('viewChart/', views.viewChart, name='viewChart')
]