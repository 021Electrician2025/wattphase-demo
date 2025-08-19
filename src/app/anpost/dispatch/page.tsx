"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { anpostElectricians, anpostLocation } from "@/lib/mock-data";
import dynamic from "next/dynamic";

// Dynamically import ElectricianMap with SSR disabled to avoid window/browser API issues
const ElectricianMap = dynamic(
  () =>
    import("@/components/electrician-map").then((mod) => ({
      default: mod.ElectricianMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Loading map...</p>
        </div>
      </div>
    ),
  }
);
import { Electrician } from "@/lib/types";
import {
  MapPin,
  Phone,
  Star,
  Clock,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePower } from "@/contexts/power-context";

function ElectricianCard({
  electrician,
  onAssign,
}: {
  electrician: Electrician;
  onAssign: (electrician: Electrician) => void;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
            <AvatarImage
              src={electrician.profilePhoto}
              alt={electrician.name}
            />
            <AvatarFallback>
              {electrician.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg truncate">
                {electrician.name}
              </CardTitle>

              <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 font-semibold">
                No 1. Contractor
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs sm:text-sm font-medium">
                  {electrician.rating}
                </span>
              </div>
              <Badge
                variant={electrician.isAvailable ? "default" : "secondary"}
                className="text-xs"
              >
                {electrician.isAvailable ? "Available" : "Busy"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
            <span className="text-xs sm:text-sm">
              ETA: {electrician.eta} min
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
            <span className="text-xs sm:text-sm">
              {electrician.id === "1"
                ? "0.8 km away"
                : electrician.id === "2"
                ? "1.2 km away"
                : electrician.id === "3"
                ? "1.0 km away"
                : electrician.id === "4"
                ? "1.5 km away"
                : "2.1 km away"}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-xs sm:text-sm font-medium mb-2">
            Specializations
          </h4>
          <div className="flex flex-wrap gap-1">
            {electrician.specializations.map((spec, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-1.5 py-0.5"
              >
                {spec}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
            onClick={() => onAssign(electrician)}
            disabled={!electrician.isAvailable}
            size="sm"
          >
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Assign Job
          </Button>
          <Button variant="outline" size="sm" className="px-2 sm:px-3">
            <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnPostDispatchPage() {
  const router = useRouter();
  const { selectElectrician, state } = usePower();
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssign = async (electrician: Electrician) => {
    setIsAssigning(true);
    selectElectrician(electrician);

    // Simulate assignment process
    setTimeout(() => {
      setIsAssigning(false);
      router.push("/anpost/confirmation");
    }, 2000);
  };

  const availableElectricians = anpostElectricians
    .filter((e) => e.isAvailable)
    .sort((a, b) => a.eta - b.eta);

  if (isAssigning) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Assigning Electrician</CardTitle>
            <CardDescription>
              Dispatching {state.selectedElectrician?.name} to AnPost Clonakilty...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">
              Please wait while we confirm the assignment
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                AnPost Electrician Dispatch
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Select an available electrician for emergency response
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Info */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2 text-lg sm:text-xl">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
              Emergency Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <h3 className="font-medium text-red-800 text-sm sm:text-base">
                  {anpostLocation.name}
                </h3>
                <p className="text-red-700 text-sm sm:text-base">
                  {anpostLocation.address}
                </p>
                <p className="text-xs sm:text-sm text-red-600 mt-2">
                  Issue: Power loss detected on Phase 2 - Critical
                  infrastructure affected
                </p>
              </div>
              <div className="bg-red-100 p-3 sm:p-4 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2 text-sm sm:text-base">
                  Priority: HIGH
                </h4>
                <p className="text-xs sm:text-sm text-red-700">
                  Mail sorting operations disrupted. Immediate response required
                  to prevent service delays.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Map */}
        <Card>
          <CardHeader>
            <CardTitle>Electrician Locations - Clonakilty Area</CardTitle>
            <CardDescription>
              Real-time positions of available electricians and AnPost location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ElectricianMap
              electricians={anpostElectricians}
              emergencyLocation={anpostLocation}
              onElectricianSelect={handleAssign}
              className="h-96"
            />
          </CardContent>
        </Card>

        {/* Available Electricians */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            Available Electricians ({availableElectricians.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {availableElectricians.map((electrician) => (
              <ElectricianCard
                key={electrician.id}
                electrician={electrician}
                onAssign={handleAssign}
              />
            ))}
          </div>
        </div>

        {availableElectricians.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No electricians currently available
              </h3>
              <p className="text-gray-600 mb-4">
                All electricians are currently on assignment. We'll notify you
                when someone becomes available.
              </p>
              <Button variant="outline">Join Waiting List</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}