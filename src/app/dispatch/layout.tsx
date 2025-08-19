import { NavigationLayout } from "@/components/navigation";

export default function DispatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavigationLayout>{children}</NavigationLayout>;
}