"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePower } from "@/contexts/power-context";
import {
  Home,
  BarChart3,
  Users,
  CheckCircle,
  Zap,
  ArrowLeft,
  Building,
} from "lucide-react";

const anpostNavigationItems = [
  {
    href: "/anpost",
    label: "Dashboard",
    icon: BarChart3,
    description: "Power monitoring",
  },
  {
    href: "/anpost/dispatch",
    label: "Dispatch",
    icon: Users,
    description: "Electrician dispatch",
  },
  {
    href: "/anpost/confirmation",
    label: "Jobs",
    icon: CheckCircle,
    description: "Job tracking",
  },
];

function AnPostNavigation() {
  const pathname = usePathname();
  const { state } = usePower();

  const hasActiveAlerts = state.alerts.some((alert) => !alert.acknowledged);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Building className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg text-gray-900">AnPost Clonakilty</span>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
          <Building className="h-8 w-8 text-blue-600" />
          <div>
            <span className="font-bold text-xl text-gray-900">AnPost</span>
            <div className="text-sm text-gray-600">Clonakilty</div>
          </div>
        </div>
        
        <div className="px-4 py-3 border-b border-gray-100">
          <Link href="/">
            <Button variant="outline" size="sm" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Locations
            </Button>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {anpostNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">
                    {item.description}
                  </div>
                </div>
                {(item.href === "/anpost") && hasActiveAlerts && (
                  <Badge className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5">
                    !
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-30">
        <div className="flex justify-around">
          {anpostNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors relative ${
                  isActive ? "text-blue-600" : "text-gray-500"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
                {(item.href === "/anpost") && hasActiveAlerts && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function AnPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AnPostNavigation />
      <div className="lg:pl-64">
        <main className="pb-16 lg:pb-0">{children}</main>
      </div>
    </div>
  );
}