"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateJobTicketId } from "@/lib/mock-data";
import { JobTicket } from "@/lib/types";
import {
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  ArrowLeft,
  Truck,
  Wrench,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePower } from "@/contexts/power-context";

type JobStatus =
  | "created"
  | "dispatched"
  | "on_site"
  | "in_progress"
  | "completed";

const statusConfig = {
  created: { label: "Job Created", color: "bg-blue-500", progress: 20 },
  dispatched: {
    label: "Electrician Dispatched",
    color: "bg-orange-500",
    progress: 40,
  },
  on_site: { label: "On Site", color: "bg-yellow-500", progress: 60 },
  in_progress: {
    label: "Work in Progress",
    color: "bg-purple-500",
    progress: 80,
  },
  completed: { label: "Job Completed", color: "bg-green-500", progress: 100 },
};

function StatusTimeline({ currentStatus }: { currentStatus: JobStatus }) {
  const statuses: JobStatus[] = [
    "created",
    "dispatched",
    "on_site",
    "in_progress",
    "completed",
  ];
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="space-y-4">
      {statuses.map((status, index) => {
        const config = statusConfig[status];
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={status} className="flex items-center gap-4">
            <div
              className={`w-4 h-4 rounded-full flex-shrink-0 ${
                isCompleted ? config.color : "bg-gray-300"
              }`}
            />
            <div className="flex-1">
              <div
                className={`font-medium ${
                  isCurrent
                    ? "text-gray-900"
                    : isCompleted
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                {config.label}
              </div>
              {isCurrent && (
                <div className="text-sm text-gray-600 mt-1">
                  Current status - Updated{" "}
                  {new Date().toLocaleTimeString("en-IE")}
                </div>
              )}
            </div>
            {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
          </div>
        );
      })}
    </div>
  );
}

export default function ConfirmationPage() {
  const router = useRouter();
  const { state } = usePower();
  
  // If no electrician is selected, redirect back to dispatch
  useEffect(() => {
    if (!state.selectedElectrician) {
      router.push('/dispatch');
    }
  }, [state.selectedElectrician, router]);
  
  const [jobTicket] = useState<JobTicket>({
    id: generateJobTicketId(),
    issueType: "Power Loss - Phase 2",
    priority: "high",
    status: "created",
    assignedElectrician: state.selectedElectrician || {
      id: "1",
      name: "John Murphy",
      profilePhoto: "/api/placeholder/64/64",
      rating: 4.8,
      eta: 15,
      phone: "+353 87 123 4567",
      email: "john.murphy@wattphase.ie",
      specializations: ["Industrial", "3-Phase Systems", "Emergency Response"],
      isAvailable: true,
      location: { lat: 53.3498, lng: -6.2603 },
    },
    createdAt: new Date(),
    estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    description:
      "Critical power loss detected on Phase 2 affecting mail sorting operations at An Post facility.",
    location: {
      lat: 53.3498,
      lng: -6.2603,
      address:
        "An Post Sorting Office, Dublin Industrial Estate, Glasnevin, Dublin 11",
    },
  });

  const [currentStatus, setCurrentStatus] = useState<JobStatus>("created");
  const [progress, setProgress] = useState(20);

  // Simulate job progress
  useEffect(() => {
    const intervals = [
      { status: "dispatched" as JobStatus, delay: 3000 },
      { status: "on_site" as JobStatus, delay: 8000 },
      { status: "in_progress" as JobStatus, delay: 12000 },
      { status: "completed" as JobStatus, delay: 20000 },
    ];

    intervals.forEach(({ status, delay }) => {
      setTimeout(() => {
        setCurrentStatus(status);
        setProgress(statusConfig[status].progress);
      }, delay);
    });
  }, []);

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Job Confirmation
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Track your emergency response request
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-green-600" />
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-green-800">
                  Electrician Successfully Dispatched!
                </h2>
                <p className="text-sm sm:text-base text-green-700">
                  Your emergency request has been processed and an electrician
                  is on the way.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Job Information */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1 sm:gap-0">
                  <span className="font-medium text-sm sm:text-base">
                    Ticket ID:
                  </span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">
                    {jobTicket.id}
                  </code>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1 sm:gap-0">
                  <span className="font-medium text-sm sm:text-base">
                    Priority:
                  </span>
                  <Badge className={priorityColors[jobTicket.priority]}>
                    {jobTicket.priority.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1 sm:gap-0">
                  <span className="font-medium text-sm sm:text-base">
                    Issue Type:
                  </span>
                  <span className="text-xs sm:text-sm">
                    {jobTicket.issueType}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                  <span className="font-medium text-sm sm:text-base">
                    Created:
                  </span>
                  <span className="text-xs sm:text-sm">
                    {jobTicket.createdAt.toLocaleString("en-IE")}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-sm sm:text-base">
                  Description
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 sm:p-3 rounded">
                  {jobTicket.description}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                  Location
                </h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  {jobTicket.location.address}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Electrician */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />
                Assigned Electrician
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              {jobTicket.assignedElectrician && (
                <>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                      <AvatarImage
                        src={jobTicket.assignedElectrician.profilePhoto}
                        alt={jobTicket.assignedElectrician.name}
                      />
                      <AvatarFallback>
                        {jobTicket.assignedElectrician.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-base sm:text-lg">
                        {jobTicket.assignedElectrician.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm text-gray-600">
                          Rating:
                        </span>
                        <span className="font-medium text-xs sm:text-sm">
                          {jobTicket.assignedElectrician.rating}/5.0
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                      <div>
                        <div className="text-xs sm:text-sm font-medium">
                          ETA
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          {jobTicket.assignedElectrician.eta} minutes
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                      <div>
                        <div className="text-xs sm:text-sm font-medium">
                          Status
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          En route
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-sm sm:text-base">
                      Specializations
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {jobTicket.assignedElectrician.specializations.map(
                        (spec, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {spec}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  <Button className="w-full" variant="outline" size="sm">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Call {jobTicket.assignedElectrician.name}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress Tracking */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Job Progress</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Real-time updates on your emergency response request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm sm:text-base">
                  Overall Progress
                </span>
                <span className="text-xs sm:text-sm text-gray-600">
                  {progress}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <StatusTimeline currentStatus={currentStatus} />

            {currentStatus === "completed" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                <h4 className="font-medium text-green-800 mb-2 text-sm sm:text-base">
                  Job Completed Successfully!
                </h4>
                <p className="text-xs sm:text-sm text-green-700">
                  The electrical issue has been resolved. Power has been
                  restored to all phases. A detailed report will be sent to your
                  email within 24 hours.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button variant="outline" className="w-full sm:w-auto" size="sm">
            Download Report
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" size="sm">
            Rate Service
          </Button>
        </div>
      </div>
    </div>
  );
}
