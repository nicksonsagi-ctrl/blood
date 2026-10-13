import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { DonorProfile } from '../types';
import { MapPin, Navigation } from 'lucide-react';

interface DonorMapProps {
  donors: (DonorProfile | any)[];
  onSelectDonor: (donor: any) => void;
  selectedDonor: any | null;
  centerDistrict?: string;
}

export const DonorMap: React.FC<DonorMapProps> = ({
  donors,
  onSelectDonor,
  selectedDonor,
  centerDistrict = 'Jaffna',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');

  // Jaffna coordinates default: 9.6615, 80.0255
  const centerCoords: [number, number] = centerDistrict === 'Colombo' ? [6.9271, 79.8612] : [9.6644, 80.0167];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: centerCoords,
        zoom: 12,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Add OpenStreetMap Standard tiles
      const tileUrl =
        mapType === 'satellite'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tiles = L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map alive or cleanup if unmounted
    };
  }, []);

  // Update tile layer on Map / Satellite toggle
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    const tileUrl =
      mapType === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      attribution: mapType === 'satellite' ? '&copy; Esri & Earthstar Geographics' : '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(mapInstanceRef.current);
  }, [mapType]);

  // Update Markers when donors change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Create custom pin icon
    const createCustomIcon = (bloodGroup: string, isSelected: boolean) => {
      return L.divIcon({
        className: 'custom-donor-pin',
        html: `
          <div class="relative flex items-center justify-center transform -translate-x-1/2 -translate-y-full transition-transform hover:scale-110 ${
            isSelected ? 'scale-125 z-50' : ''
          }">
            <div class="w-8 h-8 rounded-full bg-[#B80024] text-white flex items-center justify-center font-black text-xs shadow-lg border-2 border-white">
              ${bloodGroup}
            </div>
            <div class="absolute -bottom-1 w-2 h-2 bg-[#B80024] rotate-45 border-r border-b border-white"></div>
          </div>
        `,
        iconSize: [32, 38],
        iconAnchor: [16, 38],
        popupAnchor: [0, -38],
      });
    };

    donors.forEach((donor) => {
      if (!donor.lat || !donor.lng) return;

      const isSelected = selectedDonor?.id === donor.id;
      const marker = L.marker([donor.lat, donor.lng], {
        icon: createCustomIcon(donor.bloodGroup, isSelected),
      }).addTo(mapInstanceRef.current!);

      // Popup HTML matching reference image
      const popupContent = `
        <div class="p-3 max-w-[220px] text-slate-800">
          <div class="flex items-center gap-2 mb-2">
            <img src="${donor.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}" 
                 class="w-10 h-10 rounded-full object-cover border border-rose-200 shrink-0" />
            <div>
              <h4 class="font-bold text-sm leading-tight text-slate-900">${donor.fullName}</h4>
              <div class="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500 font-medium">
                <span class="text-[#B80024] font-black">${donor.bloodGroup}</span>
                <span>•</span>
                <span>${donor.distanceKm || 2} km away</span>
              </div>
            </div>
          </div>
          <div class="text-xs text-slate-600 mb-2 font-medium">
            ${donor.city || 'Jaffna'}, Sri Lanka
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-rose-50">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              donor.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }">
              <span class="w-1.5 h-1.5 rounded-full ${donor.isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}"></span>
              ${donor.isAvailable ? 'Available' : 'Busy'}
            </span>
            <button id="btn-popup-contact-${donor.id}" class="px-2.5 py-1 text-xs font-bold text-white bg-[#B80024] hover:bg-[#98001E] rounded-md transition">
              Contact
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { minWidth: 200, maxWidth: 240 });

      marker.on('popupopen', () => {
        const contactBtn = document.getElementById(`btn-popup-contact-${donor.id}`);
        if (contactBtn) {
          contactBtn.onclick = () => onSelectDonor(donor);
        }
      });

      marker.on('click', () => {
        onSelectDonor(donor);
      });

      markersRef.current.push(marker);

      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [donors, selectedDonor]);

  return (
    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden shadow-lg border border-rose-100">
      {/* Map Style Controls */}
      <div className="absolute top-4 left-4 z-20 flex bg-white/90 backdrop-blur-xs rounded-xl shadow-md border border-rose-100 p-1">
        <button
          onClick={() => setMapType('standard')}
          className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
            mapType === 'standard' ? 'bg-[#B80024] text-white shadow-xs' : 'text-slate-700 hover:text-[#B80024]'
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setMapType('satellite')}
          className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
            mapType === 'satellite' ? 'bg-[#B80024] text-white shadow-xs' : 'text-slate-700 hover:text-[#B80024]'
          }`}
        >
          Satellite
        </button>
      </div>

      {/* Recenter Location Button */}
      <button
        onClick={() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView(centerCoords, 12);
          }
        }}
        className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-xs text-xs font-bold text-slate-800 rounded-xl shadow-md border border-rose-100 hover:bg-rose-50 transition"
      >
        <Navigation className="w-3.5 h-3.5 text-[#B80024]" />
        Center on Jaffna
      </button>

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
