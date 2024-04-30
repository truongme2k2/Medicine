from django.urls import path

from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login_user/', views.loginUser, name='login_user')
]