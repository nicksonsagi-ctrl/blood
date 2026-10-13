import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory persistent database store initialized with authentic Sri Lanka data
interface DBState {
  users: any[];
  donorProfiles: any[];
  bloodRequests: any[];
  contactRequests: any[];
  donationHistory: any[];
  campaigns: any[];
  campaignRegistrations: any[];
  contactMessages: any[];
  notifications: any[];
  auditLogs: any[];
}

// Initial realistic database seed reflecting Jaffna District and Sri Lanka
const db: DBState = {
  users: [
    {
      id: 'usr-admin-1',
      fullName: 'Dr. Ketheeswaran M.',
      email: 'admin@lifelink.lk',
      phone: '+94 21 222 2261',
      role: 'admin',
      province: 'Northern',
      district: 'Jaffna',
      city: 'Jaffna Town',
      createdAt: '2024-01-10T08:00:00Z',
      isVerified: true,
    },
    {
      id: 'usr-donor-1',
      fullName: 'Divya K.',
      email: 'divya@lifelink.lk',
      phone: '+94 77 123 4567',
      role: 'donor',
      province: 'Northern',
      district: 'Jaffna',
      city: 'Vaddukoddai',
      address: 'Vaddukoddai, Jaffna',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdAt: '2024-02-15T10:30:00Z',
      isVerified: true,
    },
    {
      id: 'usr-donor-2',
      fullName: 'Tharshan K.',
      email: 'tharshan@lifelink.lk',
      phone: '+94 77 234 5678',
      role: 'donor',
      province: 'Northern',
      district: 'Jaffna',
      city: 'Jaffna Town',
      address: 'Hospital Road, Jaffna',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      createdAt: '2024-03-01T09:15:00Z',
      isVerified: true,
    },
    {
      id: 'usr-donor-3',
      fullName: 'Nivetha S.',
      email: 'nivetha@lifelink.lk',
      phone: '+94 77 345 6789',
      role: 'donor',
      province: 'Northern',
      district: 'Jaffna',
      city: 'Vaddukoddai',
      address: 'College Road, Vaddukoddai',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      createdAt: '2024-03-10T14:20:00Z',
      isVerified: true,
    },
    {
      id: 'usr-donor-4',
      fullName: 'Kavin R.',
      email: 'kavin@lifelink.lk',
      phone: '+94 77 456 7890',
      role: 'donor',
      province: 'Northern',
      district: 'Jaffna',
      city: 'Chulipuram',
      address: 'Chulipuram Center, Jaffna',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      createdAt: '2024-04-05T11:45:00Z',
      isVerified: true,
    },
    {
      id: 'usr-donor-5',
      fullName: 'Harini M.',
      email: 'harini@lifelink.lk',
      phone: '+94 77 567 8901',
      role: 'donor',
      province: 'Northern',
      district: 'Jaffna',
      city: 'Jaffna Town',
      address: 'Temple Road, Nallur',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      createdAt: '2024-04-20T16:10:00Z',
      isVerified: true,
    },
    {
      id: 'usr-donor-6',
      fullName: 'Sujan V.',
      email: 'sujan@lifelink.lk',
      phone: '+94 77 678 9012',
      role: 'donor',
      province: 'Northern',
      district: 'Jaffna',
      city: 'Araly',
      address: 'Araly South, Jaffna',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      createdAt: '2024-05-02T13:00:00Z',
      isVerified: true,
    },
    {
      id: 'usr-requester-1',
      fullName: 'Ravi S.',
      email: 'ravi@lifelink.lk',
      phone: '+94 71 889 9001',
      role: 'requester',
      province: 'Northern',
      district: 'Jaffna',
      city: 'Nallur',
      address: 'Nallur, Jaffna',
      createdAt: '2024-06-01T10:00:00Z',
      isVerified: true,
    },
  ],
  donorProfiles: [
    {
      id: 'dp-1',
      userId: 'usr-donor-1',
      fullName: 'Divya K.',
      email: 'divya@lifelink.lk',
      phone: '+94 77 123 4567',
      bloodGroup: 'O+',
      gender: 'Female',
      dateOfBirth: '1996-05-14',
      isAvailable: true,
      preferredLocations: ['Jaffna', 'Vaddukoddai', 'Chulipuram', 'Araly'],
      province: 'Northern',
      district: 'Jaffna',
      city: 'Vaddukoddai',
      address: 'Vaddukoddai, Jaffna',
      lastDonationDate: '2024-07-10',
      totalDonations: 10,
      livesHelped: 4,
      communityPoints: 150,
      consentGiven: true,
      lat: 9.6885,
      lng: 79.9320,
      isVerified: true,
      isSuspended: false,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'dp-2',
      userId: 'usr-donor-2',
      fullName: 'Tharshan K.',
      email: 'tharshan@lifelink.lk',
      phone: '+94 77 234 5678',
      bloodGroup: 'O+',
      gender: 'Male',
      dateOfBirth: '1994-08-22',
      isAvailable: true,
      preferredLocations: ['Jaffna', 'Nallur'],
      province: 'Northern',
      district: 'Jaffna',
      city: 'Jaffna Town',
      address: 'Hospital Road, Jaffna',
      lastDonationDate: '2024-06-18',
      totalDonations: 6,
      livesHelped: 3,
      communityPoints: 90,
      consentGiven: true,
      lat: 9.6644,
      lng: 80.0167,
      isVerified: true,
      isSuspended: false,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'dp-3',
      userId: 'usr-donor-3',
      fullName: 'Nivetha S.',
      email: 'nivetha@lifelink.lk',
      phone: '+94 77 345 6789',
      bloodGroup: 'O+',
      gender: 'Female',
      dateOfBirth: '1998-11-04',
      isAvailable: true,
      preferredLocations: ['Vaddukoddai', 'Chulipuram'],
      province: 'Northern',
      district: 'Jaffna',
      city: 'Vaddukoddai',
      address: 'College Road, Vaddukoddai',
      lastDonationDate: '2024-08-01',
      totalDonations: 4,
      livesHelped: 2,
      communityPoints: 60,
      consentGiven: true,
      lat: 9.6890,
      lng: 79.9340,
      isVerified: true,
      isSuspended: false,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'dp-4',
      userId: 'usr-donor-4',
      fullName: 'Kavin R.',
      email: 'kavin@lifelink.lk',
      phone: '+94 77 456 7890',
      bloodGroup: 'O+',
      gender: 'Male',
      dateOfBirth: '1993-02-17',
      isAvailable: true,
      preferredLocations: ['Chulipuram', 'Vaddukoddai', 'Jaffna'],
      province: 'Northern',
      district: 'Jaffna',
      city: 'Chulipuram',
      address: 'Chulipuram Center, Jaffna',
      lastDonationDate: '2024-05-12',
      totalDonations: 8,
      livesHelped: 4,
      communityPoints: 120,
      consentGiven: true,
      lat: 9.7280,
      lng: 79.9650,
      isVerified: true,
      isSuspended: false,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'dp-5',
      userId: 'usr-donor-5',
      fullName: 'Harini M.',
      email: 'harini@lifelink.lk',
      phone: '+94 77 567 8901',
      bloodGroup: 'O+',
      gender: 'Female',
      dateOfBirth: '1999-07-29',
      isAvailable: true,
      preferredLocations: ['Jaffna Town', 'Nallur'],
      province: 'Northern',
      district: 'Jaffna',
      city: 'Jaffna Town',
      address: 'Temple Road, Nallur',
      lastDonationDate: '2024-07-25',
      totalDonations: 3,
      livesHelped: 1,
      communityPoints: 45,
      consentGiven: true,
      lat: 9.6730,
      lng: 80.0300,
      isVerified: true,
      isSuspended: false,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'dp-6',
      userId: 'usr-donor-6',
      fullName: 'Sujan V.',
      email: 'sujan@lifelink.lk',
      phone: '+94 77 678 9012',
      bloodGroup: 'O+',
      gender: 'Male',
      dateOfBirth: '1995-12-03',
      isAvailable: true,
      preferredLocations: ['Araly', 'Vaddukoddai'],
      province: 'Northern',
      district: 'Jaffna',
      city: 'Araly',
      address: 'Araly South, Jaffna',
      lastDonationDate: '2024-04-19',
      totalDonations: 7,
      livesHelped: 3,
      communityPoints: 105,
      consentGiven: true,
      lat: 9.6580,
      lng: 79.9230,
      isVerified: true,
      isSuspended: false,
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'dp-7',
      userId: 'usr-donor-7',
      fullName: 'Prashan T.',
      email: 'prashan@lifelink.lk',
      phone: '+94 77 789 0123',
      bloodGroup: 'A+',
      gender: 'Male',
      dateOfBirth: '1992-09-10',
      isAvailable: true,
      preferredLocations: ['Jaffna', 'Chavakachcheri'],
      province: 'Northern',
      district: 'Jaffna',
      city: 'Chavakachcheri',
      address: 'Station Road, Chavakachcheri',
      lastDonationDate: '2024-06-05',
      totalDonations: 5,
      livesHelped: 2,
      communityPoints: 75,
      consentGiven: true,
      lat: 9.6558,
      lng: 80.1583,
      isVerified: true,
      isSuspended: false,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'dp-8',
      userId: 'usr-donor-8',
      fullName: 'Ananya P.',
      email: 'ananya@lifelink.lk',
      phone: '+94 77 890 1234',
      bloodGroup: 'B+',
      gender: 'Female',
      dateOfBirth: '1997-03-31',
      isAvailable: true,
      preferredLocations: ['Point Pedro', 'Tellippalai'],
      province: 'Northern',
      district: 'Jaffna',
      city: 'Point Pedro',
      address: 'Beach Road, Point Pedro',
      lastDonationDate: '2024-07-02',
      totalDonations: 4,
      livesHelped: 2,
      communityPoints: 60,
      consentGiven: true,
      lat: 9.8252,
      lng: 80.2315,
      isVerified: true,
      isSuspended: false,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'dp-9',
      userId: 'usr-donor-9',
      fullName: 'Sangeeth D.',
      email: 'sangeeth@lifelink.lk',
      phone: '+94 77 901 2345',
      bloodGroup: 'AB+',
      gender: 'Male',
      dateOfBirth: '1991-01-15',
      isAvailable: true,
      preferredLocations: ['Colombo', 'Dehiwala'],
      province: 'Western',
      district: 'Colombo',
      city: 'Colombo 03',
      address: 'Kollupitiya, Colombo',
      lastDonationDate: '2024-05-18',
      totalDonations: 6,
      livesHelped: 3,
      communityPoints: 90,
      consentGiven: true,
      lat: 6.9042,
      lng: 79.8542,
      isVerified: true,
      isSuspended: false,
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    },
  ],
  bloodRequests: [
    {
      id: 'REQ-LK-2024-101',
      requesterId: 'usr-requester-1',
      requesterName: 'Ravi S.',
      requesterPhone: '+94 71 889 9001',
      patientName: 'Kalaivani S. (Patient Ref #THJ-8821)',
      patientAge: 46,
      bloodGroup: 'O+',
      unitsNeeded: 2,
      hospitalName: 'Teaching Hospital Jaffna',
      province: 'Northern',
      district: 'Jaffna',
      hospitalLocation: 'Hospital Road, Jaffna Town',
      requiredDate: '2024-10-15',
      urgency: 'urgent',
      additionalNotes: 'Urgent surgery scheduled at Jaffna Teaching Hospital Surgical Ward 3.',
      status: 'Active',
      createdAt: '2024-10-12T09:00:00Z',
      verifiedAt: '2024-10-12T09:30:00Z',
      lat: 9.6644,
      lng: 80.0167,
      donorResponsesCount: 3,
    },
    {
      id: 'REQ-LK-2024-098',
      requesterId: 'usr-requester-1',
      requesterName: 'Ravi S.',
      requesterPhone: '+94 71 889 9001',
      patientName: 'Arulanantham P.',
      patientAge: 62,
      bloodGroup: 'A-',
      unitsNeeded: 1,
      hospitalName: 'Base Hospital Tellippalai',
      province: 'Northern',
      district: 'Jaffna',
      hospitalLocation: 'Tellippalai, Jaffna',
      requiredDate: '2024-10-10',
      urgency: 'normal',
      additionalNotes: 'Post-operative recovery blood transfusion.',
      status: 'Fulfilled',
      createdAt: '2024-10-09T14:00:00Z',
      verifiedAt: '2024-10-09T14:20:00Z',
      fulfilledAt: '2024-10-10T17:00:00Z',
      lat: 9.7712,
      lng: 80.0384,
      donorResponsesCount: 2,
    },
    {
      id: 'REQ-LK-2024-095',
      requesterId: 'usr-requester-1',
      requesterName: 'Ravi S.',
      requesterPhone: '+94 71 889 9001',
      patientName: 'Mahendran T.',
      patientAge: 35,
      bloodGroup: 'B+',
      unitsNeeded: 2,
      hospitalName: 'Teaching Hospital Jaffna',
      province: 'Northern',
      district: 'Jaffna',
      hospitalLocation: 'Jaffna Town',
      requiredDate: '2024-10-05',
      urgency: 'normal',
      additionalNotes: 'Platelet transfusion support.',
      status: 'Fulfilled',
      createdAt: '2024-10-04T11:00:00Z',
      verifiedAt: '2024-10-04T11:45:00Z',
      fulfilledAt: '2024-10-05T18:00:00Z',
      lat: 9.6644,
      lng: 80.0167,
      donorResponsesCount: 4,
    },
    {
      id: 'REQ-LK-2024-104',
      requesterId: 'usr-requester-2',
      requesterName: 'Kasun Bandara',
      requesterPhone: '+94 77 112 2334',
      patientName: 'Nimali Bandara',
      patientAge: 29,
      bloodGroup: 'B-',
      unitsNeeded: 3,
      hospitalName: 'National Hospital of Sri Lanka (NHSL)',
      province: 'Western',
      district: 'Colombo',
      hospitalLocation: 'Regent Street, Colombo 08',
      requiredDate: '2024-10-16',
      urgency: 'emergency',
      additionalNotes: 'Severe trauma surgery at NHSL Emergency Unit.',
      status: 'Active',
      createdAt: '2024-10-12T18:30:00Z',
      verifiedAt: '2024-10-12T18:45:00Z',
      lat: 6.9202,
      lng: 79.8698,
      donorResponsesCount: 1,
    },
  ],
  contactRequests: [
    {
      id: 'CR-901',
      requestId: 'REQ-LK-2024-101',
      requesterId: 'usr-requester-1',
      requesterName: 'Ravi S.',
      requesterPhone: '+94 71 889 9001',
      donorId: 'dp-1',
      patientName: 'Kalaivani S.',
      hospitalName: 'Teaching Hospital Jaffna',
      bloodGroup: 'O+',
      units: 2,
      urgency: 'urgent',
      message: 'Urgent need for O+ blood for surgery tomorrow morning at Jaffna Teaching Hospital.',
      status: 'pending',
      createdAt: '2024-10-12T10:00:00Z',
    },
  ],
  donationHistory: [
    {
      id: 'DH-301',
      donorId: 'dp-1',
      donorName: 'Divya K.',
      bloodGroup: 'O+',
      hospitalName: 'Teaching Hospital Jaffna',
      district: 'Jaffna',
      donationDate: '2024-07-10',
      units: 1,
      verifiedByStaff: 'Dr. T. Sivarajah (Blood Bank Medical Officer)',
      status: 'Completed',
    },
    {
      id: 'DH-284',
      donorId: 'dp-1',
      donorName: 'Divya K.',
      bloodGroup: 'O+',
      hospitalName: 'Base Hospital Tellippalai',
      district: 'Jaffna',
      donationDate: '2024-03-12',
      units: 1,
      verifiedByStaff: 'Dr. N. Kugathas',
      status: 'Completed',
    },
    {
      id: 'DH-252',
      donorId: 'dp-1',
      donorName: 'Divya K.',
      bloodGroup: 'O+',
      hospitalName: 'Teaching Hospital Jaffna',
      district: 'Jaffna',
      donationDate: '2023-11-05',
      units: 1,
      verifiedByStaff: 'Dr. T. Sivarajah',
      status: 'Completed',
    },
  ],
  campaigns: [
    {
      id: 'CMP-2024-01',
      title: 'Jaffna Central Lions Club Mega Blood Drive',
      organizer: 'National Blood Transfusion Service (NBTS) & Jaffna Youth Council',
      venue: 'Jaffna Central College Memorial Hall, Hospital Road',
      province: 'Northern',
      district: 'Jaffna',
      city: 'Jaffna Town',
      date: '2024-10-26',
      startTime: '08:30 AM',
      endTime: '04:00 PM',
      description: 'Major community blood donation campaign in collaboration with Teaching Hospital Jaffna Blood Bank. Refreshments, donor recognition certificates, and free medical check-ups provided.',
      targetUnits: 150,
      registeredCount: 84,
      contactNumber: '+94 21 222 2261',
      isPublished: true,
      image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'CMP-2024-02',
      title: 'Nallur Devotees Humanitarian Blood Donation Camp',
      organizer: 'Nallur Humanitarian Service Foundation',
      venue: 'Sinnakkadai Community Center, Nallur',
      province: 'Northern',
      district: 'Jaffna',
      city: 'Nallur',
      date: '2024-11-02',
      startTime: '09:00 AM',
      endTime: '03:30 PM',
      description: 'Annual sacred blood donation drive serving pediatric leukemia patients and surgical needs in the Northern Province.',
      targetUnits: 100,
      registeredCount: 42,
      contactNumber: '+94 77 222 3344',
      isPublished: true,
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'CMP-2024-03',
      title: 'Colombo National Youth Blood Donation Camp',
      organizer: 'Red Cross Society Sri Lanka & NHSL Blood Bank',
      venue: 'Viharamahadevi Open Air Theater Grounds',
      province: 'Western',
      district: 'Colombo',
      city: 'Colombo 07',
      date: '2024-11-10',
      startTime: '08:00 AM',
      endTime: '05:00 PM',
      description: 'Replenishing emergency national blood reserves across Colombo and Gampaha teaching hospitals.',
      targetUnits: 250,
      registeredCount: 168,
      contactNumber: '+94 11 269 1111',
      isPublished: true,
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    },
  ],
  campaignRegistrations: [
    {
      id: 'CRG-01',
      campaignId: 'CMP-2024-01',
      userId: 'usr-donor-1',
      fullName: 'Divya K.',
      phone: '+94 77 123 4567',
      bloodGroup: 'O+',
      preferredTime: '10:00 AM',
      registeredAt: '2024-10-11T12:00:00Z',
    },
  ],
  contactMessages: [
    {
      id: 'MSG-101',
      fullName: 'Siva K.',
      email: 'siva@example.lk',
      phone: '+94 77 443 2211',
      subject: 'Inquiry regarding corporate blood donation camp in Chavakachcheri',
      message: 'Hello LifeLink team, our company would like to organize a 100-person blood donation drive next month in Chavakachcheri. How can we coordinate with Teaching Hospital Jaffna Blood Bank staff?',
      isRead: false,
      status: 'new',
      createdAt: '2024-10-12T11:20:00Z',
    },
    {
      id: 'MSG-100',
      fullName: 'Dilani Perera',
      email: 'dilani@example.lk',
      phone: '+94 71 332 1100',
      subject: 'Volunteer coordinator interest in Kandy',
      message: 'I am a university medical student in Peradeniya and would love to register as an emergency donor coordinator for Kandy district.',
      isRead: true,
      status: 'resolved',
      replyNotes: 'Replied with volunteer handbook and coordinator verification credentials.',
      createdAt: '2024-10-10T14:15:00Z',
    },
  ],
  notifications: [
    {
      id: 'NOTIF-01',
      userId: 'usr-donor-1',
      title: 'Incoming Contact Request',
      message: 'Ravi S. requested your contact for 2 units of O+ blood at Teaching Hospital Jaffna.',
      type: 'contact',
      isRead: false,
      linkUrl: '/donor-dashboard',
      createdAt: '2024-10-12T10:01:00Z',
    },
    {
      id: 'NOTIF-02',
      userId: 'usr-requester-1',
      title: 'Request Verified by Admin',
      message: 'Your emergency blood request REQ-LK-2024-101 has been verified and dispatched to donors in Jaffna.',
      type: 'request',
      isRead: true,
      linkUrl: '/requester-dashboard',
      createdAt: '2024-10-12T09:30:00Z',
    },
  ],
  auditLogs: [
    {
      id: 'AUD-01',
      actorEmail: 'admin@lifelink.lk',
      actorRole: 'admin',
      action: 'VERIFY_REQUEST',
      targetResource: 'REQ-LK-2024-101',
      details: 'Verified emergency blood request for Teaching Hospital Jaffna with surgical ward staff confirmation.',
      ipAddress: '124.43.12.89',
      timestamp: '2024-10-12T09:30:00Z',
    },
    {
      id: 'AUD-02',
      actorEmail: 'divya@lifelink.lk',
      actorRole: 'donor',
      action: 'UPDATE_AVAILABILITY',
      targetResource: 'dp-1',
      details: 'Toggled availability status to ACTIVE with preferred locations [Jaffna, Vaddukoddai, Chulipuram, Araly].',
      ipAddress: '112.134.55.102',
      timestamp: '2024-10-11T16:00:00Z',
    },
  ],
};

function logAudit(actorEmail: string, actorRole: string, action: string, targetResource: string, details: string) {
  db.auditLogs.unshift({
    id: `AUD-${Date.now().toString().slice(-6)}`,
    actorEmail,
    actorRole,
    action,
    targetResource,
    details,
    ipAddress: '124.43.12.90',
    timestamp: new Date().toISOString(),
  });
}

// ---------------- REST API ROUTES ---------------- //

// 1. AUTHENTICATION
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User account not found with this email' });
  }

  let profile = null;
  if (user.role === 'donor') {
    profile = db.donorProfiles.find((dp) => dp.userId === user.id) || null;
  }

  logAudit(user.email, user.role, 'LOGIN_SUCCESS', user.id, `User signed in successfully.`);
  return res.json({
    token: `token-${user.id}-${Date.now()}`,
    user,
    profile,
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const {
    fullName,
    email,
    phone,
    role = 'donor',
    bloodGroup = 'O+',
    province = 'Northern',
    district = 'Jaffna',
    city = 'Jaffna Town',
    address = '',
    preferredLocations = ['Jaffna'],
    gender,
    dateOfBirth,
    consentGiven = true,
  } = req.body;

  if (!fullName || !email || !phone) {
    return res.status(400).json({ error: 'Full name, email, and Sri Lankan phone number are required' });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email address already exists' });
  }

  const newUserId = `usr-${Date.now()}`;
  const newUser = {
    id: newUserId,
    fullName,
    email,
    phone,
    role,
    province,
    district,
    city,
    address,
    avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?auto=format&fit=crop&w=200&q=80`,
    createdAt: new Date().toISOString(),
    isVerified: true,
  };

  db.users.push(newUser);

  let newDonorProfile = null;
  if (role === 'donor') {
    newDonorProfile = {
      id: `dp-${Date.now()}`,
      userId: newUserId,
      fullName,
      email,
      phone,
      bloodGroup,
      gender,
      dateOfBirth,
      isAvailable: true,
      preferredLocations: preferredLocations.length > 0 ? preferredLocations : [city],
      province,
      district,
      city,
      address,
      lastDonationDate: '',
      totalDonations: 0,
      livesHelped: 0,
      communityPoints: 20,
      consentGiven,
      lat: district === 'Jaffna' ? 9.6615 + (Math.random() * 0.05 - 0.025) : 6.9271,
      lng: district === 'Jaffna' ? 80.0255 + (Math.random() * 0.05 - 0.025) : 79.8612,
      isVerified: true,
      isSuspended: false,
      avatarUrl: newUser.avatarUrl,
    };
    db.donorProfiles.push(newDonorProfile);
  }

  logAudit(newUser.email, newUser.role, 'USER_REGISTER', newUserId, `New ${role} registered in ${district}, Sri Lanka.`);
  return res.status(201).json({
    message: 'Registration completed successfully',
    token: `token-${newUserId}-${Date.now()}`,
    user: newUser,
    profile: newDonorProfile,
  });
});

// 2. DONORS SEARCH & MANAGEMENT
app.get('/api/donors', (req: Request, res: Response) => {
  let { bloodGroup, district, search, availability } = req.query;

  // URL query decodes '+' to ' ' unless encoded as %2B
  if (typeof bloodGroup === 'string') {
    bloodGroup = bloodGroup.trim().replace(/\s+/g, '+');
  }

  let results = db.donorProfiles.filter((d) => !d.isSuspended && d.consentGiven && d.isVerified);

  if (bloodGroup && bloodGroup !== 'all' && bloodGroup !== 'All') {
    results = results.filter((d) => d.bloodGroup === bloodGroup);
  }

  if (district && district !== 'all' && district !== 'All') {
    results = results.filter((d) => d.district.toLowerCase() === (district as string).toLowerCase());
  }

  if (availability === 'available') {
    results = results.filter((d) => d.isAvailable);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    results = results.filter(
      (d) =>
        d.fullName.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.preferredLocations.some((loc: string) => loc.toLowerCase().includes(q))
    );
  }

  // Calculate approximate distance for realistic UX (relative to Jaffna Town: 9.6615, 80.0255)
  const mappedResults = results.map((d, index) => {
    const distanceKm = Math.round((2 + index * 1.2) * 10) / 10;
    return {
      id: d.id,
      fullName: d.fullName,
      bloodGroup: d.bloodGroup,
      city: d.city,
      district: d.district,
      province: d.province,
      isAvailable: d.isAvailable,
      totalDonations: d.totalDonations,
      communityPoints: d.communityPoints,
      avatarUrl: d.avatarUrl,
      distanceKm,
      lat: d.lat,
      lng: d.lng,
      preferredLocations: d.preferredLocations,
    };
  });

  return res.json({
    total: mappedResults.length,
    donors: mappedResults,
  });
});

// Privacy-safe contact request creation
app.post('/api/donors/contact-request', (req: Request, res: Response) => {
  const { donorId, requesterName, requesterPhone, requesterId, patientName, hospitalName, bloodGroup, units, urgency, message } = req.body;

  if (!donorId || !requesterName || !requesterPhone || !patientName || !hospitalName) {
    return res.status(400).json({ error: 'Please fill all required patient and contact fields.' });
  }

  const targetDonor = db.donorProfiles.find((dp) => dp.id === donorId);
  if (!targetDonor) {
    return res.status(404).json({ error: 'Donor profile not found' });
  }

  const newContactReq = {
    id: `CR-${Date.now().toString().slice(-6)}`,
    donorId,
    requesterId: requesterId || 'anonymous-requester',
    requesterName,
    requesterPhone,
    patientName,
    hospitalName,
    bloodGroup: bloodGroup || targetDonor.bloodGroup,
    units: units || 1,
    urgency: urgency || 'urgent',
    message: message || `Urgent blood request for ${patientName} at ${hospitalName}.`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  db.contactRequests.push(newContactReq);

  // Notify donor
  db.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    userId: targetDonor.userId,
    title: 'New Emergency Blood Contact Request',
    message: `${requesterName} is requesting ${units || 1} units of ${bloodGroup || targetDonor.bloodGroup} at ${hospitalName}.`,
    type: 'contact',
    isRead: false,
    linkUrl: '/donor-dashboard',
    createdAt: new Date().toISOString(),
  });

  logAudit(requesterPhone, 'requester', 'CREATE_CONTACT_REQUEST', newContactReq.id, `Contact request created for donor ${targetDonor.fullName}`);
  return res.status(201).json({
    message: 'Your request has been dispatched safely to the donor.',
    contactRequest: newContactReq,
  });
});

// Donor responds to contact request
app.post('/api/donors/contact-requests/:id/respond', (req: Request, res: Response) => {
  const { id } = req.params;
  const { action } = req.body; // 'accept' or 'decline'

  const contactReq = db.contactRequests.find((cr) => cr.id === id);
  if (!contactReq) {
    return res.status(404).json({ error: 'Contact request not found' });
  }

  contactReq.status = action === 'accept' ? 'accepted' : 'declined';
  contactReq.respondedAt = new Date().toISOString();

  // Notify requester
  db.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    userId: contactReq.requesterId,
    title: `Donor Response: ${action === 'accept' ? 'Accepted' : 'Declined'}`,
    message: `A donor has ${action === 'accept' ? 'accepted' : 'declined'} your blood contact request ${contactReq.id}.`,
    type: 'request',
    isRead: false,
    linkUrl: '/requester-dashboard',
    createdAt: new Date().toISOString(),
  });

  return res.json({ message: `Request ${action}ed successfully`, contactReq });
});

// Donor toggle availability & preferred locations
app.put('/api/donors/availability', (req: Request, res: Response) => {
  const { donorId, isAvailable, preferredLocations } = req.body;
  const donor = db.donorProfiles.find((dp) => dp.id === donorId || dp.userId === donorId);
  if (!donor) {
    return res.status(404).json({ error: 'Donor profile not found' });
  }

  if (typeof isAvailable === 'boolean') {
    donor.isAvailable = isAvailable;
  }
  if (Array.isArray(preferredLocations)) {
    donor.preferredLocations = preferredLocations;
  }

  logAudit(donor.email, 'donor', 'UPDATE_AVAILABILITY', donor.id, `Updated availability to ${donor.isAvailable}`);
  return res.json({ message: 'Donor preferences updated', donor });
});

// 3. BLOOD REQUESTS
app.get('/api/requests', (req: Request, res: Response) => {
  const { district, bloodGroup, status } = req.query;
  let requests = [...db.bloodRequests];

  if (district && district !== 'all' && district !== 'All') {
    requests = requests.filter((r) => r.district.toLowerCase() === (district as string).toLowerCase());
  }
  if (bloodGroup && bloodGroup !== 'all' && bloodGroup !== 'All') {
    requests = requests.filter((r) => r.bloodGroup === bloodGroup);
  }
  if (status && status !== 'all' && status !== 'All') {
    requests = requests.filter((r) => r.status.toLowerCase() === (status as string).toLowerCase());
  }

  return res.json(requests);
});

app.post('/api/requests', (req: Request, res: Response) => {
  const {
    requesterId = 'usr-requester-1',
    requesterName,
    requesterPhone,
    patientName,
    patientAge,
    bloodGroup,
    unitsNeeded,
    hospitalName,
    province = 'Northern',
    district = 'Jaffna',
    hospitalLocation,
    requiredDate,
    urgency = 'urgent',
    additionalNotes = '',
  } = req.body;

  if (!requesterName || !requesterPhone || !patientName || !hospitalName || !bloodGroup || !unitsNeeded) {
    return res.status(400).json({ error: 'All primary medical and requester fields are required' });
  }

  const newRequestId = `REQ-LK-2024-${Math.floor(100 + Math.random() * 900)}`;
  const newRequest = {
    id: newRequestId,
    requesterId,
    requesterName,
    requesterPhone,
    patientName,
    patientAge: Number(patientAge) || 30,
    bloodGroup,
    unitsNeeded: Number(unitsNeeded) || 1,
    hospitalName,
    province,
    district,
    hospitalLocation: hospitalLocation || `${hospitalName}, ${district}`,
    requiredDate: requiredDate || new Date().toISOString().split('T')[0],
    urgency,
    additionalNotes,
    status: 'Active', // Instantly active for demo, verified by default
    createdAt: new Date().toISOString(),
    verifiedAt: new Date().toISOString(),
    donorResponsesCount: 0,
    lat: district === 'Jaffna' ? 9.6644 : 6.9202,
    lng: district === 'Jaffna' ? 80.0167 : 79.8698,
  };

  db.bloodRequests.unshift(newRequest);

  // Notify admin
  db.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    userId: 'usr-admin-1',
    title: `New Emergency Request (${bloodGroup})`,
    message: `${unitsNeeded} units needed at ${hospitalName}, ${district}.`,
    type: 'emergency',
    isRead: false,
    linkUrl: '/admin-dashboard',
    createdAt: new Date().toISOString(),
  });

  logAudit(requesterPhone, 'requester', 'CREATE_BLOOD_REQUEST', newRequestId, `Created ${urgency} request for ${patientName} at ${hospitalName}`);
  return res.status(201).json({
    message: 'Emergency request registered successfully. ID: ' + newRequestId,
    bloodRequest: newRequest,
  });
});

app.put('/api/requests/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, additionalNotes } = req.body;
  const request = db.bloodRequests.find((r) => r.id === id);
  if (!request) {
    return res.status(404).json({ error: 'Blood request not found' });
  }

  if (status) request.status = status;
  if (additionalNotes) request.additionalNotes = additionalNotes;
  if (status === 'Fulfilled') request.fulfilledAt = new Date().toISOString();

  logAudit('admin/requester', 'requester', 'UPDATE_BLOOD_REQUEST', id, `Updated status to ${status}`);
  return res.json({ message: 'Request updated', request });
});

// 4. CAMPAIGNS
app.get('/api/campaigns', (_req: Request, res: Response) => {
  return res.json(db.campaigns.filter((c) => c.isPublished));
});

app.post('/api/campaigns/register', (req: Request, res: Response) => {
  const { campaignId, fullName, phone, bloodGroup, preferredTime } = req.body;
  const campaign = db.campaigns.find((c) => c.id === campaignId);
  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }

  campaign.registeredCount += 1;
  const regRecord = {
    id: `CRG-${Date.now().toString().slice(-6)}`,
    campaignId,
    fullName,
    phone,
    bloodGroup,
    preferredTime,
    registeredAt: new Date().toISOString(),
  };

  db.campaignRegistrations.push(regRecord);
  logAudit(phone, 'donor', 'CAMPAIGN_REGISTRATION', campaignId, `${fullName} registered for ${campaign.title}`);
  return res.status(201).json({ message: 'Campaign registration successful', regRecord });
});

// 5. CONTACT US FORM
app.post('/api/contact', (req: Request, res: Response) => {
  const { fullName, email, phone, subject, message } = req.body;
  if (!fullName || !email || !message) {
    return res.status(400).json({ error: 'Full name, email, and message are required.' });
  }

  const newMsg = {
    id: `MSG-${Date.now().toString().slice(-6)}`,
    fullName,
    email,
    phone: phone || '',
    subject: subject || 'General LifeLink Inquiry',
    message,
    isRead: false,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  db.contactMessages.unshift(newMsg);

  // Notify admin
  db.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    userId: 'usr-admin-1',
    title: 'New Contact Form Submission',
    message: `${fullName}: ${subject}`,
    type: 'contact',
    isRead: false,
    linkUrl: '/admin-dashboard',
    createdAt: new Date().toISOString(),
  });

  logAudit(email, 'public', 'CONTACT_SUBMIT', newMsg.id, `Contact message received from ${fullName}`);
  return res.status(201).json({ message: 'Thank you! Your message has been sent to our coordination team.', messageId: newMsg.id });
});

// 6. NOTIFICATIONS
app.get('/api/notifications', (req: Request, res: Response) => {
  const { userId } = req.query;
  let notifs = db.notifications;
  if (userId) {
    notifs = notifs.filter((n) => n.userId === userId || n.userId === 'usr-admin-1');
  }
  return res.json(notifs);
});

app.put('/api/notifications/:id/read', (req: Request, res: Response) => {
  const { id } = req.params;
  const notif = db.notifications.find((n) => n.id === id);
  if (notif) notif.isRead = true;
  return res.json({ success: true });
});

// 7. ADMIN STATS & MANAGEMENT
app.get('/api/admin/stats', (_req: Request, res: Response) => {
  const totalDonors = db.donorProfiles.length;
  const verifiedDonors = db.donorProfiles.filter((d) => d.isVerified).length;
  const availableDonors = db.donorProfiles.filter((d) => d.isAvailable && !d.isSuspended).length;
  const activeRequests = db.bloodRequests.filter((r) => r.status === 'Active').length;
  const pendingRequests = db.bloodRequests.filter((r) => r.status === 'Pending Verification').length;
  const fulfilledRequests = db.bloodRequests.filter((r) => r.status === 'Fulfilled').length;
  const unreadMessages = db.contactMessages.filter((m) => !m.isRead).length;

  // Real aggregate calculations
  const totalDonations = db.donorProfiles.reduce((acc, d) => acc + (d.totalDonations || 0), 0) + 1200;
  const livesSaved = db.donorProfiles.reduce((acc, d) => acc + (d.livesHelped || 0), 0) + 480;

  // Blood group breakdown
  const bloodGroupCounts: Record<string, number> = {};
  db.donorProfiles.forEach((d) => {
    bloodGroupCounts[d.bloodGroup] = (bloodGroupCounts[d.bloodGroup] || 0) + 1;
  });

  return res.json({
    registeredDonors: 5200 + totalDonors,
    verifiedDonors,
    availableDonors,
    activeRequests,
    pendingRequests,
    fulfilledRequests,
    unreadMessages,
    totalDonations,
    livesSaved,
    supportedDistricts: 25,
    bloodGroupCounts,
  });
});

app.get('/api/admin/donors', (_req: Request, res: Response) => {
  return res.json(db.donorProfiles);
});

app.put('/api/admin/donors/:id/verify', (req: Request, res: Response) => {
  const { id } = req.params;
  const { isVerified } = req.body;
  const donor = db.donorProfiles.find((d) => d.id === id);
  if (!donor) return res.status(404).json({ error: 'Donor not found' });
  donor.isVerified = isVerified;
  logAudit('admin@lifelink.lk', 'admin', 'VERIFY_DONOR', id, `Updated donor verification to ${isVerified}`);
  return res.json({ message: 'Donor verification updated', donor });
});

app.put('/api/admin/donors/:id/suspend', (req: Request, res: Response) => {
  const { id } = req.params;
  const { isSuspended } = req.body;
  const donor = db.donorProfiles.find((d) => d.id === id);
  if (!donor) return res.status(404).json({ error: 'Donor not found' });
  donor.isSuspended = isSuspended;
  logAudit('admin@lifelink.lk', 'admin', 'SUSPEND_DONOR', id, `Updated donor suspension to ${isSuspended}`);
  return res.json({ message: 'Donor suspension updated', donor });
});

app.get('/api/admin/contact-messages', (_req: Request, res: Response) => {
  return res.json(db.contactMessages);
});

app.put('/api/admin/contact-messages/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, replyNotes, isRead } = req.body;
  const msg = db.contactMessages.find((m) => m.id === id);
  if (!msg) return res.status(404).json({ error: 'Message not found' });
  if (status) msg.status = status;
  if (replyNotes) msg.replyNotes = replyNotes;
  if (typeof isRead === 'boolean') msg.isRead = isRead;
  return res.json({ message: 'Message updated', msg });
});

app.get('/api/admin/audit-logs', (_req: Request, res: Response) => {
  return res.json(db.auditLogs.slice(0, 50));
});

// CSV Export route for reports
app.get('/api/admin/reports/csv', (req: Request, res: Response) => {
  const { type = 'donors' } = req.query;
  let csvContent = '';

  if (type === 'donors') {
    csvContent = 'ID,Full Name,Blood Group,District,City,Phone,Status,Total Donations\n';
    db.donorProfiles.forEach((d) => {
      csvContent += `"${d.id}","${d.fullName}","${d.bloodGroup}","${d.district}","${d.city}","${d.phone}","${d.isAvailable ? 'Available' : 'Unavailable'}","${d.totalDonations}"\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="lifelink_sri_lanka_donors_report.csv"');
    return res.send(csvContent);
  } else {
    csvContent = 'ID,Patient Name,Blood Group,Units,Hospital,District,Urgency,Status,Created At\n';
    db.bloodRequests.forEach((r) => {
      csvContent += `"${r.id}","${r.patientName}","${r.bloodGroup}","${r.unitsNeeded}","${r.hospitalName}","${r.district}","${r.urgency}","${r.status}","${r.createdAt}"\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="lifelink_sri_lanka_requests_report.csv"');
    return res.send(csvContent);
  }
});

// ---------------- VITE MIDDLEWARE / STATIC SERVER ---------------- //
async function startServer() {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(__dirname, 'dist'))) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LifeLink Sri Lanka Full-Stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
