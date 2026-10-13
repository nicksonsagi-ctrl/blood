from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PublicDonorViewSet, BloodRequestViewSet,
    contact_form_submit, admin_dashboard_stats, export_reports_csv
)

router = DefaultRouter()
router.register(r'donors', PublicDonorViewSet, basename='public-donors')
router.register(r'requests', BloodRequestViewSet, basename='blood-requests')

urlpatterns = [
    path('', include(router.urls)),
    path('contact/', contact_form_submit, name='contact-submit'),
    path('admin/stats/', admin_dashboard_stats, name='admin-stats'),
    path('admin/reports/csv/', export_reports_csv, name='export-reports-csv'),
]
