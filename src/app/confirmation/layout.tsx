import { NavigationLayout } from "@/components/navigation";

export default function ConfirmationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavigationLayout>{children}</NavigationLayout>;
}