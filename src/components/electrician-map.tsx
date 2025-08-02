"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { Electrician } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, Phone, CheckCircle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
const createCustomIcon = (color: string, isEmergency: boolean = false) => {
  const svgIcon = `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z"/>
      <circle fill="#fff" cx="12.5" cy="12.5" r="${isEmergency ? '8' : '6'}"/>
      ${isEmergency ? '<text x="12.5" y="17" text-anchor="middle" fill="' + color + '" font-size="12" font-weight="bold">!</text>' : ''}
    </svg>
  `;
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

interface ElectricianMapProps {
  electricians: Electrician[];
  emergencyLocation?: { lat: number; lng: number; name: string; address: string };
  onElectricianSelect?: (electrician: Electrician) => void;
  className?: string;
}

function MapUpdater({ center }: { center: LatLngExpression }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
}

export function ElectricianMap({ 
  electricians, 
  emergencyLocation, 
  onElectricianSelect,
  className = "h-64" 
}: ElectricianMapProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div className={`${className} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Loading map...</p>
        </div>
      </div>
    );
  }
  
  // Cork city center as default center
  const defaultCenter: LatLngExpression = [51.8985, -8.4756];
  const mapCenter = emergencyLocation ? [emergencyLocation.lat, emergencyLocation.lng] as LatLngExpression : defaultCenter;
  
  const availableElectricians = electricians.filter(e => e.isAvailable);
  
  return (
    <div className={className}>
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        scrollWheelZoom={true}
      >
        <MapUpdater center={mapCenter} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Emergency location marker */}
        {emergencyLocation && (
          <Marker 
            position={[emergencyLocation.lat, emergencyLocation.lng]} 
            icon={createCustomIcon('#ef4444', true)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-red-800 mb-1">{emergencyLocation.name}</h3>
                <p className="text-sm text-red-700 mb-2">{emergencyLocation.address}</p>
                <Badge variant="destructive" className="text-xs">
                  Emergency Location
                </Badge>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Electrician markers */}
        {availableElectricians.map((electrician) => (
          <Marker
            key={electrician.id}
            position={[electrician.location.lat, electrician.location.lng]}
            icon={createCustomIcon('#3b82f6')}
          >
            <Popup>
              <div className="p-3 min-w-[250px]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {electrician.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{electrician.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{electrician.rating}</span>
                      </div>
                      <Badge variant="default" className="text-xs">
                        Available
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span className="text-sm">ETA: {electrician.eta} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-gray-500" />
                    <span className="text-sm">Call</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <h4 className="text-sm font-medium mb-1">Specializations</h4>
                  <div className="flex flex-wrap gap-1">
                    {electrician.specializations.slice(0, 2).map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {electrician.specializations.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{electrician.specializations.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => onElectricianSelect?.(electrician)}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Assign
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}