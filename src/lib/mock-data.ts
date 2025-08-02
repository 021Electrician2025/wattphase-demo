import { PowerReading, Electrician, PowerStatus } from "./types";

// Generate realistic power readings
export function generatePowerReading(): PowerReading {
  const baseVoltage = 230; // Standard EU voltage
  const baseFrequency = 50; // Standard EU frequency

  // Add some realistic variation
  const voltageVariation = (Math.random() - 0.5) * 10; // ±5V variation
  const currentVariation = Math.random() * 50 + 10; // 10-60A range
  const frequencyVariation = (Math.random() - 0.5) * 0.2; // ±0.1Hz variation

  return {
    timestamp: new Date(),
    phase1Voltage: baseVoltage + voltageVariation,
    phase2Voltage: baseVoltage + voltageVariation * 0.8,
    phase3Voltage: baseVoltage + voltageVariation * 1.2,
    phase1Current: currentVariation,
    phase2Current: currentVariation * 0.9,
    phase3Current: currentVariation * 1.1,
    frequency: baseFrequency + frequencyVariation,
  };
}

// Generate historical data for charts
export function generateHistoricalData(hours: number = 24): PowerReading[] {
  const data: PowerReading[] = [];
  const now = new Date();

  for (let i = hours * 60; i >= 0; i -= 5) {
    // Every 5 minutes
    const timestamp = new Date(now.getTime() - i * 60 * 1000);
    const reading = generatePowerReading();
    reading.timestamp = timestamp;
    data.push(reading);
  }

  return data;
}

// Simulate power issues
export function generatePowerReadingWithIssue(
  issueType: "voltage_drop" | "power_loss"
): PowerReading {
  const reading = generatePowerReading();

  if (issueType === "voltage_drop") {
    // Simulate voltage drop (15-20% reduction)
    const dropFactor = 0.8 - Math.random() * 0.05;
    reading.phase1Voltage *= dropFactor;
    reading.phase2Voltage *= dropFactor;
    reading.phase3Voltage *= dropFactor;
  } else if (issueType === "power_loss") {
    // Simulate complete power loss on one or more phases
    const phasesToAffect = Math.floor(Math.random() * 3) + 1;
    if (phasesToAffect >= 1) {
      reading.phase1Voltage = 0;
      reading.phase1Current = 0;
    }
    if (phasesToAffect >= 2) {
      reading.phase2Voltage = 0;
      reading.phase2Current = 0;
    }
    if (phasesToAffect >= 3) {
      reading.phase3Voltage = 0;
      reading.phase3Current = 0;
    }
  }

  return reading;
}

// Determine power status based on readings
export function getPowerStatus(reading: PowerReading): PowerStatus {
  const minVoltage = Math.min(
    reading.phase1Voltage,
    reading.phase2Voltage,
    reading.phase3Voltage
  );
  const maxVoltage = Math.max(
    reading.phase1Voltage,
    reading.phase2Voltage,
    reading.phase3Voltage
  );

  // Check for power loss (any phase below 50V)
  if (minVoltage < 50) {
    return {
      status: "power_loss",
      message: "Critical: Power loss detected on one or more phases",
      severity: "high",
    };
  }

  // Check for voltage drop (any phase below 200V)
  if (minVoltage < 200) {
    return {
      status: "voltage_drop",
      message: "Warning: Voltage drop detected",
      severity: "medium",
    };
  }

  // Check for voltage imbalance (>10V difference between phases)
  if (maxVoltage - minVoltage > 10) {
    return {
      status: "voltage_drop",
      message: "Caution: Voltage imbalance detected",
      severity: "low",
    };
  }

  return {
    status: "normal",
    message: "All systems operating normally",
    severity: "low",
  };
}

// Mock electrician data - Positioned around Clonakilty emergency location
export const mockElectricians: Electrician[] = [
  {
    id: "1",
    name: "021 Electrician",
    profilePhoto: "/api/placeholder/64/64",
    rating: 4.8,
    eta: 8,
    phone: "+353 87 123 4567",
    email: "john.murphy@wattphase.ie",
    specializations: ["Industrial", "3-Phase Systems", "Emergency Response"],
    isAvailable: true,
    location: { lat: 51.6195, lng: -8.8845 }, // Clonakilty North - Closest to emergency
  },
  {
    id: "2",
    name: "021 Electrician",
    profilePhoto: "/api/placeholder/64/64",
    rating: 4.9,
    eta: 12,
    phone: "+353 87 234 5678",
    email: "sarah.oconnor@wattphase.ie",
    specializations: ["Commercial", "Power Distribution", "Fault Diagnosis"],
    isAvailable: true,
    location: { lat: 51.6251, lng: -8.8975 }, // Clonakilty West
  },
  {
    id: "3",
    name: "021 Electrician",
    profilePhoto: "/api/placeholder/64/64",
    rating: 4.7,
    eta: 18,
    phone: "+353 87 345 6789",
    email: "michael.kelly@wattphase.ie",
    specializations: ["Residential", "Maintenance", "Safety Inspections"],
    isAvailable: true,
    location: { lat: 51.6185, lng: -8.8795 }, // Clonakilty East
  },
  {
    id: "4",
    name: "021 Electrician",
    profilePhoto: "/api/placeholder/64/64",
    rating: 4.9,
    eta: 15,
    phone: "+353 87 456 7890",
    email: "emma.walsh@wattphase.ie",
    specializations: [
      "Industrial Automation",
      "PLC Systems",
      "Emergency Repairs",
    ],
    isAvailable: true,
    location: { lat: 51.6275, lng: -8.8925 }, // Clonakilty Southwest
  },
  {
    id: "5",
    name: "021 Electrician",
    profilePhoto: "/api/placeholder/64/64",
    rating: 4.6,
    eta: 25,
    phone: "+353 87 567 8901",
    email: "david.ryan@wattphase.ie",
    specializations: [
      "High Voltage",
      "Transformer Maintenance",
      "Grid Systems",
    ],
    isAvailable: true,
    location: { lat: 51.6155, lng: -8.8735 }, // Clonakilty Southeast - Furthest but still nearby
  },
];

// Emergency location in Cork
export const emergencyLocation = {
  lat: 51.62271186746584,
  lng: -8.8911,
  name: "Clonakilty Post Office",
  address: "Bridge St, Tawnies Upper, Clonakilty, Co. Cork, Ireland",
};

// Generate unique job ticket ID
export function generateJobTicketId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  return `WP-${year}-${randomNum}`;
}

// Chart data formatters
export function formatChartData(readings: PowerReading[]) {
  return readings.map((reading) => ({
    time: reading.timestamp.toLocaleTimeString("en-IE", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    timestamp: reading.timestamp,
    phase1V: Math.round(reading.phase1Voltage * 10) / 10,
    phase2V: Math.round(reading.phase2Voltage * 10) / 10,
    phase3V: Math.round(reading.phase3Voltage * 10) / 10,
    phase1A: Math.round(reading.phase1Current * 10) / 10,
    phase2A: Math.round(reading.phase2Current * 10) / 10,
    phase3A: Math.round(reading.phase3Current * 10) / 10,
    frequency: Math.round(reading.frequency * 100) / 100,
  }));
}
