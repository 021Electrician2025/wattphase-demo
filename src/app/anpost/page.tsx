"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePower } from "@/contexts/power-context";
import { formatChartData } from "@/lib/mock-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { AlertTriangle, Zap, Activity, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

function StatusBadge({
  status,
}: {
  status: "normal" | "voltage_drop" | "power_loss";
}) {
  const variants = {
    normal: {
      variant: "default" as const,
      color: "bg-green-500",
      text: "Normal",
    },
    voltage_drop: {
      variant: "secondary" as const,
      color: "bg-orange-500",
      text: "Voltage Drop",
    },
    power_loss: {
      variant: "destructive" as const,
      color: "bg-red-500",
      text: "Power Loss",
    },
  };

  const config = variants[status];

  return (
    <Badge variant={config.variant} className={`${config.color} text-white`}>
      {config.text}
    </Badge>
  );
}

function PowerGauge({
  label,
  value,
  unit,
  status,
}: {
  label: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
}) {
  const statusColors = {
    normal: "text-green-600",
    warning: "text-orange-600",
    critical: "text-red-600",
  };

  return (
    <div className="text-center p-2 sm:p-3 md:p-4 border rounded-lg">
      <div className="text-xs sm:text-sm text-gray-600 mb-1 leading-tight">
        {label}
      </div>
      <div
        className={`text-lg sm:text-xl md:text-2xl font-bold ${statusColors[status]}`}
      >
        {value.toFixed(1)}
        <span className="text-xs sm:text-sm ml-1">{unit}</span>
      </div>
    </div>
  );
}

export default function AnPostDashboard() {
  const router = useRouter();
  const { state, simulateIssue, stopSimulation, acknowledgeAlert } = usePower();
  const { currentReading, historicalData, powerStatus, alerts } = state;
  const [showDispatchDialog, setShowDispatchDialog] = React.useState(false);
  const [currentAlert, setCurrentAlert] = React.useState<any>(null);

  // Format data for charts
  const chartData = formatChartData(historicalData.slice(-48)); // Last 4 hours
  const currentData = currentReading ? formatChartData([currentReading]) : [];

  // Get unacknowledged alerts
  const unacknowledgedAlerts = alerts.filter((alert) => !alert.acknowledged);

  // Show dispatch dialog for critical alerts
  React.useEffect(() => {
    const criticalAlert = unacknowledgedAlerts.find(
      (alert) => (alert.type === 'power_loss' || alert.type === 'voltage_drop') && !alert.acknowledged
    );
    if (criticalAlert && !showDispatchDialog) {
      setCurrentAlert(criticalAlert);
      setShowDispatchDialog(true);
    }
  }, [unacknowledgedAlerts, showDispatchDialog]);

  const handleDispatchElectrician = () => {
    if (currentAlert) {
      acknowledgeAlert(currentAlert.id);
    }
    setShowDispatchDialog(false);
    router.push('/anpost/dispatch');
  };

  const handleDismissAlert = () => {
    if (currentAlert) {
      acknowledgeAlert(currentAlert.id);
    }
    setShowDispatchDialog(false);
    setCurrentAlert(null);
  };

  // Determine gauge status based on voltage levels
  const getVoltageStatus = (voltage: number) => {
    if (voltage < 50) return "critical";
    if (voltage < 200) return "warning";
    return "normal";
  };

  const getCurrentStatus = (current: number) => {
    if (current > 80) return "warning";
    if (current > 100) return "critical";
    return "normal";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              AnPost Clonakilty - Power Monitoring
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Bridge St, Tawnies Upper, Clonakilty, Co. Cork
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <StatusBadge status={powerStatus.status} />
            <div className="text-xs sm:text-sm text-gray-600">
              Last update:{" "}
              {currentReading?.timestamp.toLocaleTimeString("en-IE")}
            </div>
          </div>
        </div>

        {/* Dispatch Alert Dialog */}
        <AlertDialog open={showDispatchDialog} onOpenChange={setShowDispatchDialog}>
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Power Issue Detected
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                ⚠️ Power Drop Detected at AnPost Clonakilty – Would you like to dispatch an electrician?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel 
                onClick={handleDismissAlert}
                className="w-full sm:w-auto"
              >
                No – Dismiss
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDispatchElectrician}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
              >
                Yes – Dispatch
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Status Alerts (Non-critical) */}
        {unacknowledgedAlerts.filter(alert => alert.severity === 'low').length > 0 && (
          <div className="space-y-2">
            {unacknowledgedAlerts.filter(alert => alert.severity === 'low').map((alert) => (
              <Alert key={alert.id} className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex justify-between items-center">
                  <span>{alert.message}</span>
                  <Button
                    size="sm"
                    onClick={() => acknowledgeAlert(alert.id)}
                    variant="outline"
                  >
                    Acknowledge
                  </Button>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Current Readings */}
        {currentReading && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                Current Power Readings
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {powerStatus.message}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
                <PowerGauge
                  label="Phase 1 Voltage"
                  value={currentReading.phase1Voltage}
                  unit="V"
                  status={getVoltageStatus(currentReading.phase1Voltage)}
                />
                <PowerGauge
                  label="Phase 2 Voltage"
                  value={currentReading.phase2Voltage}
                  unit="V"
                  status={getVoltageStatus(currentReading.phase2Voltage)}
                />
                <PowerGauge
                  label="Phase 3 Voltage"
                  value={currentReading.phase3Voltage}
                  unit="V"
                  status={getVoltageStatus(currentReading.phase3Voltage)}
                />
                <PowerGauge
                  label="Phase 1 Current"
                  value={currentReading.phase1Current}
                  unit="A"
                  status={getCurrentStatus(currentReading.phase1Current)}
                />
                <PowerGauge
                  label="Phase 2 Current"
                  value={currentReading.phase2Current}
                  unit="A"
                  status={getCurrentStatus(currentReading.phase2Current)}
                />
                <PowerGauge
                  label="Phase 3 Current"
                  value={currentReading.phase3Current}
                  unit="A"
                  status={getCurrentStatus(currentReading.phase3Current)}
                />
                <PowerGauge
                  label="Frequency"
                  value={currentReading.frequency}
                  unit="Hz"
                  status={
                    Math.abs(currentReading.frequency - 50) > 0.5
                      ? "warning"
                      : "normal"
                  }
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Voltage Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Voltage Trends (Last 4 Hours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" fontSize={12} />
                  <YAxis domain={[180, 250]} fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="phase1V"
                    stroke="#ef4444"
                    name="Phase 1"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="phase2V"
                    stroke="#f59e0b"
                    name="Phase 2"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="phase3V"
                    stroke="#10b981"
                    name="Phase 3"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Current Readings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Current Readings (Last 4 Hours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData.slice(-12)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="phase1A" fill="#ef4444" name="Phase 1" />
                  <Bar dataKey="phase2A" fill="#f59e0b" name="Phase 2" />
                  <Bar dataKey="phase3A" fill="#10b981" name="Phase 3" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Demo Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Controls</CardTitle>
            <CardDescription>
              Simulate power issues for demonstration purposes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button
                onClick={() => simulateIssue("voltage_drop")}
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-50 text-xs sm:text-sm"
                disabled={state.isSimulatingIssue}
                size="sm"
              >
                Simulate Voltage Drop
              </Button>
              <Button
                onClick={() => simulateIssue("power_loss")}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50 text-xs sm:text-sm"
                disabled={state.isSimulatingIssue}
                size="sm"
              >
                Simulate Power Loss
              </Button>
              {state.isSimulatingIssue && (
                <Button
                  onClick={stopSimulation}
                  variant="default"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  Stop Simulation
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}