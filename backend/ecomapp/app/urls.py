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
    path('createMedicine/', views.createMedicine, name='createMedicine')
]