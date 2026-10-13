from django.contrib import admin
from .models import (
    Province, District, City, Hospital, UserProfile, DonorProfile,
    BloodRequest, DonorContactRequest, DonationHistory, BloodCampaign,
    CampaignRegistration, ContactMessage, Notification, AuditLog, ApplicationSettings
)

@admin.register(DonorProfile)
class DonorProfileAdmin(admin.ModelAdmin):
    list_display = ('user_profile', 'blood_group', 'is_available', 'is_verified', 'is_suspended', 'total_donations')
    list_filter = ('blood_group', 'is_available', 'is_verified', 'is_suspended', 'user_profile__district')
    search_fields = ('user_profile__user__first_name', 'user_profile__user__last_name', 'user_profile__user__email', 'user_profile__phone')

@admin.register(BloodRequest)
class BloodRequestAdmin(admin.ModelAdmin):
    list_display = ('request_id', 'patient_name', 'blood_group', 'units_needed', 'hospital_name', 'district', 'urgency', 'status', 'created_at')
    list_filter = ('blood_group', 'urgency', 'status', 'district')
    search_fields = ('request_id', 'patient_name', 'hospital_name', 'requester_name', 'requester_phone')

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('subject', 'full_name', 'email', 'status', 'is_read', 'created_at')
    list_filter = ('status', 'is_read')
    search_fields = ('full_name', 'email', 'subject', 'message')

@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display = ('name', 'hospital_type', 'district', 'phone', 'emergency_hotline')
    list_filter = ('hospital_type', 'district')
    search_fields = ('name', 'phone')

@admin.register(BloodCampaign)
class BloodCampaignAdmin(admin.ModelAdmin):
    list_display = ('title', 'organizer', 'district', 'date', 'target_units', 'is_published')
    list_filter = ('district', 'is_published')

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'actor_email', 'actor_role', 'action', 'target_resource', 'ip_address')
    list_filter = ('actor_role', 'action')
    search_fields = ('actor_email', 'target_resource', 'details')

admin.site.register(Province)
admin.site.register(District)
admin.site.register(City)
admin.site.register(UserProfile)
admin.site.register(DonorContactRequest)
admin.site.register(DonationHistory)
admin.site.register(CampaignRegistration)
admin.site.register(Notification)
admin.site.register(ApplicationSettings)
