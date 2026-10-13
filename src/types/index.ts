export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UserRole = 'admin' | 'donor' | 'requester';

export type UrgencyLevel = 'urgent' | 'emergency' | 'normal';

export type RequestStatus = 
  | 'Pending Verification'
  | 'Verified'
  | 'Active'
  | 'Donor Responded'
  | 'Fulfilled'
  | 'Cancelled'
  | 'Expired';

export type ContactRequestStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  province: string;
  district: string;
  city: string;
  address?: string;
  avatarUrl?: string;
  createdAt: string;
  isVerified?: boolean;
}

export interface DonorProfile extends User {
  bloodGroup: BloodGroup;
  gender?: string;
  dateOfBirth?: string;
  isAvailable: boolean;
  preferredLocations: string[];
  lastDonationDate?: string;
  totalDonations: number;
  livesHelped: number;
  communityPoints: number;
  consentGiven: boolean;
  medicalEligibilityNote?: string;
  distanceKm?: number; // Calculated relative to search
  lat: number;
  lng: number;
  isSuspended?: boolean;
}

export interface BloodRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterPhone: string;
  patientName: string;
  patientAge: number;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  province: string;
  district: string;
  hospitalLocation: string;
  requiredDate: string;
  urgency: UrgencyLevel;
  additionalNotes?: string;
  status: RequestStatus;
  createdAt: string;
  verifiedAt?: string;
  fulfilledAt?: string;
  lat?: number;
  lng?: number;
  donorResponsesCount: number;
}

export interface DonorContactRequest {
  id: string;
  requestId?: string;
  requesterId: string;
  requesterName: string;
  requesterPhone: string;
  donorId: string;
  patientName: string;
  hospitalName: string;
  bloodGroup: BloodGroup;
  units: number;
  urgency: UrgencyLevel;
  message: string;
  status: ContactRequestStatus;
  createdAt: string;
  respondedAt?: string;
}

export interface DonationRecord {
  id: string;
  donorId: string;
  donorName: string;
  bloodGroup: BloodGroup;
  hospitalName: string;
  district: string;
  donationDate: string;
  units: number;
  verifiedByStaff: string;
  status: 'Completed' | 'Scheduled' | 'Deferred';
}

export interface BloodCampaign {
  id: string;
  title: string;
  organizer: string;
  venue: string;
  province: string;
  district: string;
  city: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  targetUnits: number;
  registeredCount: number;
  contactNumber: string;
  isPublished: boolean;
  image?: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  status: 'new' | 'in_progress' | 'resolved';
  replyNotes?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'emergency' | 'request' | 'campaign' | 'system' | 'contact';
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  targetResource: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface AppStats {
  registeredDonors: number;
  activeRequests: number;
  completedDonations: number;
  livesSaved: number;
  supportedDistricts: number;
  verifiedDonors: number;
  availableDonors: number;
  pendingRequests: number;
  unreadMessages: number;
}
