from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Province, District, City, Hospital, UserProfile, DonorProfile,
    BloodRequest, DonorContactRequest, DonationHistory, BloodCampaign,
    CampaignRegistration, ContactMessage, Notification, AuditLog
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = '__all__'

class DistrictSerializer(serializers.ModelSerializer):
    province_name = serializers.ReadOnlyField(source='province.name')
    class Meta:
        model = District
        fields = '__all__'

class HospitalSerializer(serializers.ModelSerializer):
    district_name = serializers.ReadOnlyField(source='district.name')
    class Meta:
        model = Hospital
        fields = '__all__'

class PublicDonorSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    district_name = serializers.ReadOnlyField(source='user_profile.district.name')
    city = serializers.ReadOnlyField(source='user_profile.city')
    avatar_url = serializers.ReadOnlyField(source='user_profile.avatar_url')

    class Meta:
        model = DonorProfile
        fields = [
            'id', 'full_name', 'blood_group', 'district_name', 'city',
            'is_available', 'preferred_locations', 'total_donations',
            'lives_helped', 'community_points', 'avatar_url',
            'approx_lat', 'approx_lng'
        ]

    def get_full_name(self, obj):
        name = obj.user_profile.user.get_full_name() or obj.user_profile.user.username
        parts = name.split()
        if len(parts) > 1:
            return f"{parts[0]} {parts[1][0]}."
        return name

class BloodRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodRequest
        fields = '__all__'
        read_only_fields = ['request_id', 'created_at', 'verified_at', 'fulfilled_at']

class DonorContactRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonorContactRequest
        fields = '__all__'
        read_only_fields = ['created_at', 'responded_at']

class BloodCampaignSerializer(serializers.ModelSerializer):
    district_name = serializers.ReadOnlyField(source='district.name')
    class Meta:
        model = BloodCampaign
        fields = '__all__'

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ['created_at']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'
