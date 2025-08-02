'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { PowerReading, PowerStatus, Alert, Electrician } from '@/lib/types';
import { 
  generatePowerReading, 
  generateHistoricalData, 
  getPowerStatus,
  generatePowerReadingWithIssue 
} from '@/lib/mock-data';

interface PowerState {
  currentReading: PowerReading | null;
  historicalData: PowerReading[];
  powerStatus: PowerStatus;
  alerts: Alert[];
  isSimulatingIssue: boolean;
  issueType: 'voltage_drop' | 'power_loss' | null;
  selectedElectrician: Electrician | null;
}

type PowerAction = 
  | { type: 'UPDATE_READING'; payload: PowerReading }
  | { type: 'SET_HISTORICAL_DATA'; payload: PowerReading[] }
  | { type: 'ADD_ALERT'; payload: Alert }
  | { type: 'ACKNOWLEDGE_ALERT'; payload: string }
  | { type: 'SIMULATE_ISSUE'; payload: 'voltage_drop' | 'power_loss' }
  | { type: 'STOP_SIMULATION' }
  | { type: 'CLEAR_ALERTS' }
  | { type: 'SELECT_ELECTRICIAN'; payload: Electrician }
  | { type: 'CLEAR_SELECTED_ELECTRICIAN' };

const initialState: PowerState = {
  currentReading: null,
  historicalData: [],
  powerStatus: {
    status: 'normal',
    message: 'Initializing system...',
    severity: 'low'
  },
  alerts: [],
  isSimulatingIssue: false,
  issueType: null,
  selectedElectrician: null,
};

function powerReducer(state: PowerState, action: PowerAction): PowerState {
  switch (action.type) {
    case 'UPDATE_READING': {
      const newReading = action.payload;
      const newStatus = getPowerStatus(newReading);
      
      // Add to historical data (keep last 288 readings = 24 hours at 5-minute intervals)
      const updatedHistorical = [...state.historicalData, newReading].slice(-288);
      
      // Check if we need to create an alert
      let newAlerts = [...state.alerts];
      if (newStatus.status !== 'normal' && !state.alerts.some(alert => !alert.acknowledged)) {
        const alert: Alert = {
          id: `alert-${Date.now()}`,
          type: newStatus.status === 'voltage_drop' ? 'voltage_drop' : 'power_loss',
          message: newStatus.message,
          timestamp: new Date(),
          severity: newStatus.severity,
          acknowledged: false,
          powerReading: newReading,
        };
        newAlerts.push(alert);
      }
      
      return {
        ...state,
        currentReading: newReading,
        historicalData: updatedHistorical,
        powerStatus: newStatus,
        alerts: newAlerts,
      };
    }
    
    case 'SET_HISTORICAL_DATA':
      return {
        ...state,
        historicalData: action.payload,
      };
    
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [...state.alerts, action.payload],
      };
    
    case 'ACKNOWLEDGE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(alert => 
          alert.id === action.payload 
            ? { ...alert, acknowledged: true }
            : alert
        ),
      };
    
    case 'SIMULATE_ISSUE':
      return {
        ...state,
        isSimulatingIssue: true,
        issueType: action.payload,
      };
    
    case 'STOP_SIMULATION':
      return {
        ...state,
        isSimulatingIssue: false,
        issueType: null,
      };
    
    case 'CLEAR_ALERTS':
      return {
        ...state,
        alerts: [],
      };
    
    case 'SELECT_ELECTRICIAN':
      return {
        ...state,
        selectedElectrician: action.payload,
      };
    
    case 'CLEAR_SELECTED_ELECTRICIAN':
      return {
        ...state,
        selectedElectrician: null,
      };
    
    default:
      return state;
  }
}

const PowerContext = createContext<{
  state: PowerState;
  dispatch: React.Dispatch<PowerAction>;
  simulateIssue: (type: 'voltage_drop' | 'power_loss') => void;
  stopSimulation: () => void;
  acknowledgeAlert: (alertId: string) => void;
  clearAlerts: () => void;
  selectElectrician: (electrician: Electrician) => void;
  clearSelectedElectrician: () => void;
} | null>(null);

export function PowerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(powerReducer, initialState);
  
  // Initialize historical data
  useEffect(() => {
    const historicalData = generateHistoricalData(24);
    dispatch({ type: 'SET_HISTORICAL_DATA', payload: historicalData });
  }, []);
  
  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      let newReading: PowerReading;
      
      if (state.isSimulatingIssue && state.issueType) {
        newReading = generatePowerReadingWithIssue(state.issueType);
      } else {
        newReading = generatePowerReading();
      }
      
      dispatch({ type: 'UPDATE_READING', payload: newReading });
    }, 2000); // Update every 2 seconds for demo purposes
    
    return () => clearInterval(interval);
  }, [state.isSimulatingIssue, state.issueType]);
  
  const simulateIssue = (type: 'voltage_drop' | 'power_loss') => {
    dispatch({ type: 'SIMULATE_ISSUE', payload: type });
    
    // Auto-stop simulation after 30 seconds
    setTimeout(() => {
      dispatch({ type: 'STOP_SIMULATION' });
    }, 30000);
  };
  
  const stopSimulation = () => {
    dispatch({ type: 'STOP_SIMULATION' });
  };
  
  const acknowledgeAlert = (alertId: string) => {
    dispatch({ type: 'ACKNOWLEDGE_ALERT', payload: alertId });
  };
  
  const clearAlerts = () => {
    dispatch({ type: 'CLEAR_ALERTS' });
  };
  
  const selectElectrician = (electrician: Electrician) => {
    dispatch({ type: 'SELECT_ELECTRICIAN', payload: electrician });
  };
  
  const clearSelectedElectrician = () => {
    dispatch({ type: 'CLEAR_SELECTED_ELECTRICIAN' });
  };
  
  return (
    <PowerContext.Provider value={{
      state,
      dispatch,
      simulateIssue,
      stopSimulation,
      acknowledgeAlert,
      clearAlerts,
      selectElectrician,
      clearSelectedElectrician,
    }}>
      {children}
    </PowerContext.Provider>
  );
}

export function usePower() {
  const context = useContext(PowerContext);
  if (!context) {
    throw new Error('usePower must be used within a PowerProvider');
  }
  return context;
}