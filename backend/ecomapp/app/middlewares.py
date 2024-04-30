from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from .models import UserProfile

class UserMiddleware(MiddlewareMixin):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request, *args, **kwargs):

        try:
            user = JWTAuthentication().authenticate(request)
        except InvalidToken:
            user = None

        if user is not None:
            request.user_id = user[1]['user_id']
        else:
            return JsonResponse({'error': 'User is not authenticated'}, status=401)

        response = self.get_response(request, *args, **kwargs)
        return response

class AdminMiddleware(MiddlewareMixin):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request, *args, **kwargs):
        try:
            user = JWTAuthentication().authenticate(request)
        except InvalidToken:
            user = None

        if user is not None:
            try:
                check = UserProfile.objects.get(id=user[1]['user_id'])
                if check.is_staff == 1:
                    request.user_id = check.id
                    return self.get_response(request, *args, **kwargs)
                else:
                    return JsonResponse({'error': 'You are not an admin'}, status=401)
            except UserProfile.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)
        else:
            return JsonResponse({'error': 'User is not authenticated'}, status=401)
        
    

