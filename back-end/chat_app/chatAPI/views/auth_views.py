from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from ..serializers.auth_serializers import UserSerializer, CustomTokenObtainPairSerializer, ProfileSerializer
from ..models import Profile
from rest_framework_simplejwt.tokens import RefreshToken
from ..helpers.email_service import send_registration_email

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # Create profile for user
        Profile.objects.create(user=user)
        userData = serializer.data
        
        try:
            send_registration_email(user.email)
        except Exception as e:
            print(f"Email sending failed: {str(e)}")
        
        return Response(userData, status=status.HTTP_201_CREATED)

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        print(response.data)
        return Response(response.data, status=status.HTTP_200_OK)
    
class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated,)
    def get_object(self):
        return self.request.user.profile

