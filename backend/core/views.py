from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.db.models import Count, Q
from django.http import HttpResponse
import csv

from .models import (
    Province, District, Hospital, UserProfile, DonorProfile,
    BloodRequest, DonorContactRequest, BloodCampaign,
    CampaignRegistration, ContactMessage, Notification, AuditLog
)
from .serializers import (
    ProvinceSerializer, DistrictSerializer, HospitalSerializer,
    PublicDonorSerializer, BloodRequestSerializer, DonorContactRequestSerializer,
    BloodCampaignSerializer, ContactMessageSerializer, NotificationSerializer,
    AuditLogSerializer
)

class PublicDonorViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PublicDonorSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = DonorProfile.objects.filter(
            is_verified=True,
            is_suspended=False,
            consent_given=True
        ).select_related('user_profile__user', 'user_profile__district')

        blood_group = self.request.query_params.get('bloodGroup')
        district = self.request.query_params.get('district')
        available_only = self.request.query_params.get('availability')

        if blood_group and blood_group.lower() != 'all':
            queryset = queryset.filter(blood_group=blood_group)
        if district and district.lower() != 'all':
            queryset = queryset.filter(user_profile__district__name__iexact=district)
        if available_only == 'available':
            queryset = queryset.filter(is_available=True)

        return queryset

class BloodRequestViewSet(viewsets.ModelViewSet):
    serializer_class = BloodRequestSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return BloodRequest.objects.all()
        # Public verified requests
        return BloodRequest.objects.filter(status__in=['Active', 'Fulfilled', 'Verified'])

    def perform_create(self, serializer):
        import uuid
        req_id = f"REQ-LK-2024-{str(uuid.uuid4())[:6].upper()}"
        serializer.save(
            requester=self.request.user if self.request.user.is_authenticated else None,
            request_id=req_id
        )

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def contact_form_submit(request):
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Contact message recorded successfully.'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_dashboard_stats(request):
    total_donors = DonorProfile.objects.count()
    verified_donors = DonorProfile.objects.filter(is_verified=True).count()
    active_requests = BloodRequest.objects.filter(status='Active').count()
    fulfilled_requests = BloodRequest.objects.filter(status='Fulfilled').count()
    unread_messages = ContactMessage.objects.filter(is_read=False).count()

    return Response({
        'registered_donors': total_donors,
        'verified_donors': verified_donors,
        'active_requests': active_requests,
        'fulfilled_requests': fulfilled_requests,
        'unread_messages': unread_messages,
    })

@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def export_reports_csv(request):
    report_type = request.query_params.get('type', 'donors')
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="lifelink_{report_type}_report.csv"'

    writer = csv.writer(response)
    if report_type == 'donors':
        writer.writerow(['ID', 'Name', 'Blood Group', 'District', 'City', 'Phone', 'Available', 'Total Donations'])
        for donor in DonorProfile.objects.select_related('user_profile__user', 'user_profile__district'):
            writer.writerow([
                donor.id,
                donor.user_profile.user.get_full_name(),
                donor.blood_group,
                donor.user_profile.district.name if donor.user_profile.district else '',
                donor.user_profile.city,
                donor.user_profile.phone,
                donor.is_available,
                donor.total_donations
            ])
    else:
        writer.writerow(['Request ID', 'Patient', 'Blood Group', 'Units', 'Hospital', 'District', 'Status'])
        for req in BloodRequest.objects.select_related('district'):
            writer.writerow([
                req.request_id,
                req.patient_name,
                req.blood_group,
                req.units_needed,
                req.hospital_name,
                req.district.name,
                req.status
            ])

    return response
