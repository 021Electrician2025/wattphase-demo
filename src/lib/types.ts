// Core types for the Wattphase application

export interface PowerReading {
  timestamp: Date;
  phase1Voltage: number;
  phase2Voltage: number;
  phase3Voltage: number;
  phase1Current: number;
  phase2Current: number;
  phase3Current: number;
  frequency: number;
}

export interface PowerStatus {
  status: 'normal' | 'voltage_drop' | 'power_loss';
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Electrician {
  id: string;
  name: string;
  profilePhoto: string;
  rating: number;
  eta: number; // minutes
  phone: string;
  email: string;
  specializations: string[];
  isAvailable: boolean;
  location: {
    lat: number;
    lng: number;
  };
}

export interface JobTicket {
  id: string;
  issueType: string;
  priority: 'low' | 'medium' | 'high';
  status: 'created' | 'dispatched' | 'on_site' | 'in_progress' | 'completed';
  assignedElectrician?: Electrician;
  createdAt: Date;
  estimatedCompletion?: Date;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface Alert {
  id: string;
  type: 'voltage_drop' | 'power_loss' | 'frequency_deviation';
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  acknowledged: boolean;
  powerReading: PowerReading;
}