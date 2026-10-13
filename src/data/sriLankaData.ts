export interface ProvinceInfo {
  name: string;
  nameSi: string;
  nameTa: string;
  districts: string[];
}

export interface DistrictInfo {
  name: string;
  province: string;
  centerLat: number;
  centerLng: number;
  cities: string[];
}

export interface VerifiedHospital {
  id: string;
  name: string;
  type: 'Teaching Hospital' | 'Provincial General' | 'District General' | 'Base Hospital' | 'National Hospital';
  district: string;
  province: string;
  phone: string;
  emergencyHotline: string;
  address: string;
  lat: number;
  lng: number;
}

export const SRI_LANKA_PROVINCES: Record<string, ProvinceInfo> = {
  'Northern': {
    name: 'Northern',
    nameSi: 'උතුරු පළාත',
    nameTa: 'வட மாகாணம்',
    districts: ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
  },
  'Western': {
    name: 'Western',
    nameSi: 'බස්නාහිර පළාත',
    nameTa: 'மேல் மாகாணம்',
    districts: ['Colombo', 'Gampaha', 'Kalutara'],
  },
  'Central': {
    name: 'Central',
    nameSi: 'මධ්‍යම පළාත',
    nameTa: 'மத்திய மாகாணம்',
    districts: ['Kandy', 'Matale', 'Nuwara Eliya'],
  },
  'Southern': {
    name: 'Southern',
    nameSi: 'දකුණු පළාත',
    nameTa: 'தென் மாகாணம்',
    districts: ['Galle', 'Matara', 'Hambantota'],
  },
  'Eastern': {
    name: 'Eastern',
    nameSi: 'නැගෙනහිර පළාත',
    nameTa: 'கிழக்கு மாகாணம்',
    districts: ['Batticaloa', 'Ampara', 'Trincomalee'],
  },
  'North Western': {
    name: 'North Western',
    nameSi: 'වයඹ පළාත',
    nameTa: 'வடமேல் மாகாணம்',
    districts: ['Kurunegala', 'Puttalam'],
  },
  'North Central': {
    name: 'North Central',
    nameSi: 'උතුරු මැද පළාත',
    nameTa: 'வடமத்திய மாகாணம்',
    districts: ['Anuradhapura', 'Polonnaruwa'],
  },
  'Uva': {
    name: 'Uva',
    nameSi: 'ඌව පළාත',
    nameTa: 'ஊவா மாகாணம்',
    districts: ['Badulla', 'Monaragala'],
  },
  'Sabaragamuwa': {
    name: 'Sabaragamuwa',
    nameSi: 'සබරගමුව පළාත',
    nameTa: 'சப்ரகமுவ மாகாணம்',
    districts: ['Ratnapura', 'Kegalle'],
  },
};

export const SRI_LANKA_DISTRICTS: Record<string, DistrictInfo> = {
  'Jaffna': {
    name: 'Jaffna',
    province: 'Northern',
    centerLat: 9.6615,
    centerLng: 80.0255,
    cities: [
      'Jaffna Town',
      'Nallur',
      'Chavakachcheri',
      'Point Pedro',
      'Chunnakam',
      'Vaddukoddai',
      'Chulipuram',
      'Araly',
      'Tellippalai',
      'Kopay',
      'Manipay',
      'Atchuvely',
      'Karainagar',
      'Velanai',
    ],
  },
  'Kilinochchi': {
    name: 'Kilinochchi',
    province: 'Northern',
    centerLat: 9.3803,
    centerLng: 80.3770,
    cities: ['Kilinochchi Town', 'Paranthan', 'Poonakary', 'Pallai'],
  },
  'Mannar': {
    name: 'Mannar',
    province: 'Northern',
    centerLat: 8.9810,
    centerLng: 79.9044,
    cities: ['Mannar Town', 'Pesalai', 'Talaimannar', 'Madhu', 'Nanaddan'],
  },
  'Mullaitivu': {
    name: 'Mullaitivu',
    province: 'Northern',
    centerLat: 9.2671,
    centerLng: 80.8142,
    cities: ['Mullaitivu Town', 'Puthukkudiyiruppu', 'Mankulam', 'Oddusuddan'],
  },
  'Vavuniya': {
    name: 'Vavuniya',
    province: 'Northern',
    centerLat: 8.7542,
    centerLng: 80.4982,
    cities: ['Vavuniya Town', 'Nedurkeni', 'Cheddikulam'],
  },
  'Colombo': {
    name: 'Colombo',
    province: 'Western',
    centerLat: 6.9271,
    centerLng: 79.8612,
    cities: ['Colombo 01-15', 'Dehiwala', 'Mount Lavinia', 'Moratuwa', 'Kotte', 'Kaduwela', 'Nugegoda', 'Maharagama'],
  },
  'Gampaha': {
    name: 'Gampaha',
    province: 'Western',
    centerLat: 7.0840,
    centerLng: 79.9940,
    cities: ['Gampaha Town', 'Negombo', 'Kelaniya', 'Ja-Ela', 'Wattala', 'Kiribathgoda'],
  },
  'Kalutara': {
    name: 'Kalutara',
    province: 'Western',
    centerLat: 6.5854,
    centerLng: 79.9607,
    cities: ['Kalutara Town', 'Panadura', 'Horana', 'Beruwala', 'Matugama'],
  },
  'Kandy': {
    name: 'Kandy',
    province: 'Central',
    centerLat: 7.2906,
    centerLng: 80.6337,
    cities: ['Kandy City', 'Peradeniya', 'Gampola', 'Katugastota', 'Kundasale'],
  },
  'Matale': {
    name: 'Matale',
    province: 'Central',
    centerLat: 7.4675,
    centerLng: 80.6234,
    cities: ['Matale Town', 'Dambulla', 'Galewela', 'Sigiriya'],
  },
  'Nuwara Eliya': {
    name: 'Nuwara Eliya',
    province: 'Central',
    centerLat: 6.9497,
    centerLng: 80.7891,
    cities: ['Nuwara Eliya Town', 'Hatton', 'Talawakele', 'Ragala'],
  },
  'Galle': {
    name: 'Galle',
    province: 'Southern',
    centerLat: 6.0535,
    centerLng: 80.2210,
    cities: ['Galle Fort', 'Karapitiya', 'Hikkaduwa', 'Ambalangoda', 'Baddegama'],
  },
  'Matara': {
    name: 'Matara',
    province: 'Southern',
    centerLat: 5.9549,
    centerLng: 80.5550,
    cities: ['Matara Town', 'Weligama', 'Dikwella', 'Akuressa'],
  },
  'Hambantota': {
    name: 'Hambantota',
    province: 'Southern',
    centerLat: 6.1429,
    centerLng: 81.1212,
    cities: ['Hambantota Town', 'Tangalle', 'Tissamaharama', 'Ambalantota'],
  },
  'Trincomalee': {
    name: 'Trincomalee',
    province: 'Eastern',
    centerLat: 8.5874,
    centerLng: 81.2152,
    cities: ['Trincomalee Town', 'Kinniya', 'Muttur', 'Kantale'],
  },
  'Batticaloa': {
    name: 'Batticaloa',
    province: 'Eastern',
    centerLat: 7.7310,
    centerLng: 81.6747,
    cities: ['Batticaloa Town', 'Kattankudy', 'Eravur', 'Valaichchenai'],
  },
  'Ampara': {
    name: 'Ampara',
    province: 'Eastern',
    centerLat: 7.2912,
    centerLng: 81.6724,
    cities: ['Ampara Town', 'Kalmunai', 'Sammanthurai', 'Akkaraipattu'],
  },
  'Kurunegala': {
    name: 'Kurunegala',
    province: 'North Western',
    centerLat: 7.4863,
    centerLng: 80.3623,
    cities: ['Kurunegala Town', 'Kuliyapitiya', 'Narammala', 'Pannala'],
  },
  'Puttalam': {
    name: 'Puttalam',
    province: 'North Western',
    centerLat: 8.0408,
    centerLng: 79.8394,
    cities: ['Puttalam Town', 'Chilaw', 'Marawila', 'Wennappuwa'],
  },
  'Anuradhapura': {
    name: 'Anuradhapura',
    province: 'North Central',
    centerLat: 8.3114,
    centerLng: 80.4037,
    cities: ['Anuradhapura Town', 'Kekirawa', 'Medawachchiya', 'Tambuttegama'],
  },
  'Polonnaruwa': {
    name: 'Polonnaruwa',
    province: 'North Central',
    centerLat: 7.9403,
    centerLng: 81.0188,
    cities: ['Polonnaruwa Town', 'Kaduruwela', 'Hingurakgoda', 'Medirigiriya'],
  },
  'Badulla': {
    name: 'Badulla',
    province: 'Uva',
    centerLat: 6.9934,
    centerLng: 81.0550,
    cities: ['Badulla Town', 'Bandarawela', 'Haputale', 'Ella', 'Mahiyanganaya'],
  },
  'Monaragala': {
    name: 'Monaragala',
    province: 'Uva',
    centerLat: 6.8728,
    centerLng: 81.3507,
    cities: ['Monaragala Town', 'Wellawaya', 'Bibile', 'Kataragama'],
  },
  'Ratnapura': {
    name: 'Ratnapura',
    province: 'Sabaragamuwa',
    centerLat: 6.6828,
    centerLng: 80.3992,
    cities: ['Ratnapura Town', 'Balangoda', 'Embilipitiya', 'Pelmadulla'],
  },
  'Kegalle': {
    name: 'Kegalle',
    province: 'Sabaragamuwa',
    centerLat: 7.2513,
    centerLng: 80.3464,
    cities: ['Kegalle Town', 'Mawanella', 'Warakapola', 'Yatiyantota'],
  },
};

export const VERIFIED_HOSPITALS: VerifiedHospital[] = [
  {
    id: 'th-jaffna',
    name: 'Teaching Hospital Jaffna',
    type: 'Teaching Hospital',
    district: 'Jaffna',
    province: 'Northern',
    phone: '+94 21 222 2261',
    emergencyHotline: '+94 21 222 2222',
    address: 'Hospital Road, Jaffna, Sri Lanka',
    lat: 9.6644,
    lng: 80.0167,
  },
  {
    id: 'bh-tellippalai',
    name: 'Base Hospital Tellippalai',
    type: 'Base Hospital',
    district: 'Jaffna',
    province: 'Northern',
    phone: '+94 21 224 0222',
    emergencyHotline: '+94 21 224 0222',
    address: 'Kankesanthurai Road, Tellippalai, Jaffna',
    lat: 9.7712,
    lng: 80.0384,
  },
  {
    id: 'bh-point-pedro',
    name: 'Base Hospital Point Pedro',
    type: 'Base Hospital',
    district: 'Jaffna',
    province: 'Northern',
    phone: '+94 21 226 0222',
    emergencyHotline: '+94 21 226 0222',
    address: 'Hospital Road, Point Pedro, Jaffna',
    lat: 9.8252,
    lng: 80.2315,
  },
  {
    id: 'bh-chavakachcheri',
    name: 'Base Hospital Chavakachcheri',
    type: 'Base Hospital',
    district: 'Jaffna',
    province: 'Northern',
    phone: '+94 21 227 0222',
    emergencyHotline: '+94 21 227 0222',
    address: 'Kandy Road, Chavakachcheri, Jaffna',
    lat: 9.6558,
    lng: 80.1583,
  },
  {
    id: 'nhsl-colombo',
    name: 'National Hospital of Sri Lanka (NHSL)',
    type: 'National Hospital',
    district: 'Colombo',
    province: 'Western',
    phone: '+94 11 269 1111',
    emergencyHotline: '+94 11 269 1111',
    address: 'Regent Street, Colombo 08, Sri Lanka',
    lat: 6.9202,
    lng: 79.8698,
  },
  {
    id: 'csth-kalubowila',
    name: 'Colombo South Teaching Hospital (Kalubowila)',
    type: 'Teaching Hospital',
    district: 'Colombo',
    province: 'Western',
    phone: '+94 11 276 3064',
    emergencyHotline: '+94 11 276 3064',
    address: 'Hospital Road, Kalubowila, Dehiwala',
    lat: 6.8722,
    lng: 79.8833,
  },
  {
    id: 'th-peradeniya',
    name: 'Teaching Hospital Peradeniya / Kandy',
    type: 'Teaching Hospital',
    district: 'Kandy',
    province: 'Central',
    phone: '+94 81 238 8001',
    emergencyHotline: '+94 81 238 8001',
    address: 'Kandy-Colombo Road, Peradeniya',
    lat: 7.2625,
    lng: 80.5969,
  },
  {
    id: 'th-karapitiya',
    name: 'Teaching Hospital Karapitiya (Galle)',
    type: 'Teaching Hospital',
    district: 'Galle',
    province: 'Southern',
    phone: '+94 91 223 2176',
    emergencyHotline: '+94 91 223 2176',
    address: 'Karapitiya, Galle, Southern Province',
    lat: 6.0650,
    lng: 80.2300,
  },
];

// Validate Sri Lankan Phone Numbers (+94 or 07X XXX XXXX format)
export function validateSriLankanPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s-]/g, '');
  // Matches +94 7X XXXXXXX or 07X XXXXXXX or 947X XXXXXXX or landlines +94 XX XXXXXXX
  const regex = /^(?:\+94|0|94)(?:7[01245678]|11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)\d{7}$/;
  return regex.test(cleaned);
}

// Format to standardized display +94 7X XXX XXXX
export function formatSriLankanPhone(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('94') && digits.length === 11) {
    return `+94 ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  } else if (digits.startsWith('0') && digits.length === 10) {
    return `+94 ${digits.slice(1, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  } else if (digits.length === 9) {
    return `+94 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

// Distance approximation in km (Haversine Formula)
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
