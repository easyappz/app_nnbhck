from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["phone", "birth_date", "about"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name"]
        read_only_fields = ["id", "email", "first_name", "last_name"]


class UserWithProfileSerializer(UserSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ["profile"]


class RegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=32, required=False, allow_blank=True)
    birth_date = serializers.DateField(required=False, allow_null=True)
    about = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value: str) -> str:
        # Ensure email is unique (case-insensitive)
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        phone = validated_data.pop("phone", "")
        birth_date = validated_data.pop("birth_date", None)
        about = validated_data.pop("about", "")
        password = validated_data.pop("password")

        email = validated_data.get("email")
        first_name = validated_data.get("first_name", "")
        last_name = validated_data.get("last_name", "")

        user = User(
            username=email,
            email=email,
            first_name=first_name,
            last_name=last_name,
        )
        user.set_password(password)
        user.save()

        profile, _ = Profile.objects.get_or_create(user=user)
        profile.phone = phone if phone is not None else ""
        profile.birth_date = birth_date
        profile.about = about if about is not None else ""
        profile.save()

        return user

    def to_representation(self, instance):
        # Return combined user + profile data
        return UserWithProfileSerializer(instance, context=self.context).data


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=200)
    timestamp = serializers.DateTimeField(read_only=True)


class ProfileMeSerializer(serializers.ModelSerializer):
    """
    Serializer for reading/updating current user's public data and related profile.
    Allows updates for: first_name, last_name, and profile fields phone, birth_date, about.
    """

    profile = ProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "profile"]
        read_only_fields = ["id", "email"]

    def update(self, instance: User, validated_data):
        profile_data = validated_data.pop("profile", None)

        # Update user fields (PATCH-safe)
        if "first_name" in validated_data:
            instance.first_name = validated_data.get("first_name", instance.first_name)
        if "last_name" in validated_data:
            instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.save()

        # Ensure profile exists
        profile, _ = Profile.objects.get_or_create(user=instance)

        # Update profile fields if provided (PATCH-safe)
        if isinstance(profile_data, dict):
            if "phone" in profile_data:
                profile.phone = profile_data.get("phone") or ""
            if "birth_date" in profile_data:
                profile.birth_date = profile_data.get("birth_date")
            if "about" in profile_data:
                profile.about = profile_data.get("about") or ""
            profile.save()

        return instance
