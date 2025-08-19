"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { anpostLocation, tkmaxxLocation } from "@/lib/mock-data";
import { MapPin, Building, Store, ArrowRight, Zap, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function LocationCard({
  location,
  icon: Icon,
  href,
  bgColor,
  iconColor,
}: {
  location: typeof anpostLocation;
  icon: React.ComponentType<any>;
  href: string;
  bgColor: string;
  iconColor: string;
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-[1.02]">
        <CardHeader className="p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${bgColor}`}>
              <Icon className={`h-8 w-8 ${iconColor}`} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                {location.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{location.address}</span>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Power Monitoring Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">Real-time Data</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function LocationSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-full">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Wattphase
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Smart Power Monitoring & Emergency Response System
          </p>
          <p className="text-gray-500">
            Select a location to view real-time power monitoring and dispatch electricians
          </p>
        </div>

        {/* Location Selection */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Choose Location
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <LocationCard
              location={anpostLocation}
              icon={Building}
              href="/anpost"
              bgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            
            <LocationCard
              location={tkmaxxLocation}
              icon={Store}
              href="/tkmaxx"
              bgColor="bg-green-100"
              iconColor="text-green-600"
            />
          </div>
        </div>

        {/* Features Overview */}
        <div className="max-w-4xl mx-auto mt-12">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
            System Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Real-time Monitoring</h4>
              <p className="text-sm text-gray-600">
                Monitor 3-phase power systems with live voltage, current, and frequency readings
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-3">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Emergency Dispatch</h4>
              <p className="text-sm text-gray-600">
                Automatically dispatch qualified electricians to resolve power issues
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Smart Alerts</h4>
              <p className="text-sm text-gray-600">
                Intelligent detection of voltage drops, power loss, and system imbalances
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
