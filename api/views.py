from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from drf_spectacular.utils import extend_schema
from rest_framework import serializers

from .serializers import MessageSerializer, RegistrationSerializer, ProfileMeSerializer


class HelloView(APIView):
    """
    A simple API endpoint that returns a greeting message.
    """

    @extend_schema(
        responses={200: MessageSerializer}, description="Get a hello world message"
    )
    def get(self, request):
        data = {"message": "Hello!", "timestamp": timezone.now()}
        serializer = MessageSerializer(data)
        return Response(serializer.data)


class RegisterView(APIView):
    """
    Register a new user using RegistrationSerializer and return created user payload.
    """

    @extend_schema(
        request=RegistrationSerializer,
        responses={201: RegistrationSerializer},
        description="Register a new user"
    )
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer to accept 'email' instead of 'username'.
    Looks up user by email (case-insensitive), maps to username, then proceeds with default validation.
    """

    email = serializers.EmailField(write_only=True, required=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make the username field optional since we accept email
        username_field_name = self.username_field
        if username_field_name in self.fields:
            self.fields[username_field_name].required = False

    def validate(self, attrs):
        email = attrs.get("email")
        if email:
            try:
                user = User.objects.get(email__iexact=email)
                # Map to the expected username field for SimpleJWT
                username_field_name = self.username_field
                username_value = getattr(user, username_field_name, user.username)
                attrs[username_field_name] = username_value
            except User.DoesNotExist:
                # Populate with provided email to fail gracefully in super().validate
                attrs[self.username_field] = email
        return super().validate(attrs)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class ProfileMeView(generics.RetrieveUpdateAPIView):
    """
    Retrieve and update the current authenticated user's profile data.
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfileMeSerializer

    def get_object(self):
        return self.request.user
