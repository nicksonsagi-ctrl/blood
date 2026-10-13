from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator

# Sri Lanka Phone Validator (+94 or 07X)
phone_regex = RegexValidator(
    regex=r'^(?:\+94|0|94)(?:7[01245678]|11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)\d{7}$',
    message="Phone number must be a valid Sri Lankan mobile or telephone format (+94 7X XXXXXXX or 07XXXXXXXX)."
)

BLOOD_GROUP_CHOICES = [
    ('A+', 'A+'),
    ('A-', 'A-'),
    ('B+', 'B+'),
    ('B-', 'B-'),
    ('AB+', 'AB+'),
    ('AB-', 'AB-'),
    ('O+', 'O+'),
    ('O-', 'O-'),
]

URGENCY_CHOICES = [
    ('normal', 'Normal'),
    ('urgent', 'Urgent'),
    ('emergency', 'Emergency'),
]

REQUEST_STATUS_CHOICES = [
    ('Pending Verification', 'Pending Verification'),
    ('Verified', 'Verified'),
    ('Active', 'Active'),
    ('Donor Responded', 'Donor Responded'),
    ('Fulfilled', 'Fulfilled'),
    ('Cancelled', 'Cancelled'),
    ('Expired', 'Expired'),
]

USER_ROLE_CHOICES = [
    ('admin', 'Administrator'),
    ('donor', 'Blood Donor'),
    ('requester', 'Blood Requester'),
]

class Province(models.Model):
    name = models.CharField(max_length=100, unique=True)
    name_si = models.CharField(max_length=100, blank=True)
    name_ta = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name

class District(models.Model):
    name = models.CharField(max_length=100, unique=True)
    province = models.ForeignKey(Province, on_delete=models.CASCADE, related_name='districts')
    center_lat = models.DecimalField(max_digits=9, decimal_places=6, default=9.6615)
    center_lng = models.DecimalField(max_digits=9, decimal_places=6, default=80.0255)

    def __str__(self):
        return f"{self.name} ({self.province.name})"

class City(models.Model):
    name = models.CharField(max_length=150)
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name='cities')
    lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    lng = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    class Meta:
        unique_together = ('name', 'district')

    def __str__(self):
        return f"{self.name}, {self.district.name}"

class Hospital(models.Model):
    name = models.CharField(max_length=200, unique=True)
    hospital_type = models.CharField(max_length=100, default='Teaching Hospital')
    district = models.ForeignKey(District, on_delete=models.PROTECT, related_name='hospitals')
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=30, validators=[phone_regex])
    emergency_hotline = models.CharField(max_length=30, blank=True)
    lat = models.DecimalField(max_digits=9, decimal_places=6)
    lng = models.DecimalField(max_digits=9, decimal_places=6)
    is_verified = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.district.name}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=USER_ROLE_CHOICES, default='donor')
    phone = models.CharField(max_length=30, validators=[phone_regex])
    province = models.ForeignKey(Province, on_delete=models.SET_NULL, null=True)
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True)
    city = models.CharField(max_length=150)
    address = models.CharField(max_length=255, blank=True)
    avatar_url = models.URLField(max_length=500, blank=True)
    is_phone_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} ({self.role})"

class DonorProfile(models.Model):
    user_profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='donor_info')
    blood_group = models.CharField(max_length=5, choices=BLOOD_GROUP_CHOICES)
    gender = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    is_available = models.BooleanField(default=True)
    preferred_locations = models.JSONField(default=list, help_text="List of towns donor is willing to travel to")
    last_donation_date = models.DateField(null=True, blank=True)
    total_donations = models.PositiveIntegerField(default=0)
    lives_helped = models.PositiveIntegerField(default=0)
    community_points = models.PositiveIntegerField(default=20)
    consent_given = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    is_suspended = models.BooleanField(default=False)
    medical_eligibility_note = models.TextField(blank=True)
    approx_lat = models.DecimalField(max_digits=9, decimal_places=6, default=9.6615)
    approx_lng = models.DecimalField(max_digits=9, decimal_places=6, default=80.0255)

    def __str__(self):
        return f"Donor: {self.user_profile.user.get_full_name()} ({self.blood_group})"

class BloodRequest(models.Model):
    request_id = models.CharField(max_length=50, unique=True, db_index=True)
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blood_requests')
    requester_name = models.CharField(max_length=150)
    requester_phone = models.CharField(max_length=30, validators=[phone_regex])
    patient_name = models.CharField(max_length=150)
    patient_age = models.PositiveIntegerField()
    blood_group = models.CharField(max_length=5, choices=BLOOD_GROUP_CHOICES)
    units_needed = models.PositiveIntegerField(default=1)
    hospital = models.ForeignKey(Hospital, on_delete=models.SET_NULL, null=True, blank=True)
    hospital_name = models.CharField(max_length=200)
    district = models.ForeignKey(District, on_delete=models.PROTECT)
    hospital_location = models.CharField(max_length=255)
    required_date = models.DateField()
    urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES, default='urgent')
    additional_notes = models.TextField(blank=True)
    status = models.CharField(max_length=30, choices=REQUEST_STATUS_CHOICES, default='Pending Verification')
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_requests')
    created_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    fulfilled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.request_id} - {self.blood_group} ({self.hospital_name})"

class DonorContactRequest(models.Model):
    blood_request = models.ForeignKey(BloodRequest, on_delete=models.SET_NULL, null=True, blank=True)
    donor = models.ForeignKey(DonorProfile, on_delete=models.CASCADE, related_name='contact_requests')
    requester = models.ForeignKey(User, on_delete=models.CASCADE)
    requester_name = models.CharField(max_length=150)
    requester_phone = models.CharField(max_length=30, validators=[phone_regex])
    message = models.TextField()
    status = models.CharField(max_length=20, default='pending') # pending, accepted, declined
    created_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)

class DonationHistory(models.Model):
    donor = models.ForeignKey(DonorProfile, on_delete=models.CASCADE, related_name='donation_records')
    blood_request = models.ForeignKey(BloodRequest, on_delete=models.SET_NULL, null=True, blank=True)
    hospital_name = models.CharField(max_length=200)
    district = models.CharField(max_length=100)
    donation_date = models.DateField()
    units = models.PositiveIntegerField(default=1)
    verified_by_staff = models.CharField(max_length=150)
    status = models.CharField(max_length=50, default='Completed')

class BloodCampaign(models.Model):
    title = models.CharField(max_length=255)
    organizer = models.CharField(max_length=255)
    venue = models.CharField(max_length=255)
    district = models.ForeignKey(District, on_delete=models.PROTECT)
    city = models.CharField(max_length=150)
    date = models.DateField()
    start_time = models.CharField(max_length=20)
    end_time = models.CharField(max_length=20)
    description = models.TextField()
    target_units = models.PositiveIntegerField(default=100)
    contact_number = models.CharField(max_length=30, validators=[phone_regex])
    is_published = models.BooleanField(default=True)
    image_url = models.URLField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class CampaignRegistration(models.Model):
    campaign = models.ForeignKey(BloodCampaign, on_delete=models.CASCADE, related_name='registrations')
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=30, validators=[phone_regex])
    blood_group = models.CharField(max_length=5, choices=BLOOD_GROUP_CHOICES)
    preferred_time = models.CharField(max_length=20, blank=True)
    registered_at = models.DateTimeField(auto_now_add=True)

class ContactMessage(models.Model):
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    status = models.CharField(max_length=20, default='new')
    reply_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} by {self.full_name}"

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, default='system')
    is_read = models.BooleanField(default=False)
    link_url = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class AuditLog(models.Model):
    actor_email = models.EmailField()
    actor_role = models.CharField(max_length=50)
    action = models.CharField(max_length=100)
    target_resource = models.CharField(max_length=100)
    details = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

class ApplicationSettings(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.CharField(max_length=255, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
