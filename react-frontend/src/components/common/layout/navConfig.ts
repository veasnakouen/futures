import React from "react";
import {
  LayoutDashboard,
  Users,
  FileBarChart,
  Settings,
  Shield,
  Briefcase,
  FolderKanban,
  Package,
  LifeBuoy,
  Building2,
  MessageCircle,
  Inbox,
  Monitor,
  Handshake,
  GraduationCap,
  BookOpen,
  Activity,
  Stethoscope,
  CreditCard,
  Receipt,
  Bed,
  MapPin,
  History,
} from "lucide-react";

export interface NavLinkItem {
  to: string;
  icon: React.ElementType;
  label: string;
  subLinks?: { to: string; label: string }[];
}

export interface NavSection {
  title: string;
  links: NavLinkItem[];
}

export const getNavSections = (
  t: (key: string) => string,
  isAdmin: boolean
): NavSection[] => {
  const sections: NavSection[] = [
    {
      title: t("operations"),
      links: [
        { to: "/", icon: LayoutDashboard, label: t("dashboard") },
        { to: "/cases", icon: FolderKanban, label: t("cases") },
        { to: "/inventory", icon: Package, label: t("inventory") },
      ],
    },
    {
      title: t("recruitment"),
      links: [{ to: "/recruitment", icon: Handshake, label: t("recruitment") }],
    },
    {
      title: t("humanResources"),
      links: [
        { to: "/employees", icon: Users, label: t("Hr") },
        { to: "/leaves", icon: Briefcase, label: t("leaveManagement") },
      ],
    },
    {
      title: t("schoolManagement"),
      links: [
        { to: "/school/branches", icon: MapPin, label: t("branches") },
        { to: "/school/students", icon: Users, label: t("students") },
        { to: "/school/outreach", icon: MapPin, label: t("outreach") },
        { to: "/school/case-management", icon: Briefcase, label: t("caseManagement") },
        { to: "/school/departments", icon: Building2, label: t("departments") },
        { to: "/school/department-inbox", icon: Inbox, label: t("departmentInbox") },
        { to: "/school/teachers", icon: Briefcase, label: t("teachers") },
        { to: "/school/courses", icon: BookOpen, label: t("courses") },
        { to: "/school/enrollments", icon: GraduationCap, label: t("enrollments") },
        { to: "/school/parents", icon: Users, label: t("parents") },
        { to: "/school/extracurriculars", icon: Activity, label: t("activities") },
      ],
    },
    {
      title: t("clinicManagement"),
      links: [
        { to: "/clinic", icon: LayoutDashboard, label: t("dashboard") },
        { to: "/clinic/ipd", icon: Bed, label: "IPD Wards" },
        { to: "/clinic/patients", icon: Users, label: t("patients") },
        { to: "/clinic/appointments", icon: History, label: t("appointments") },
        { to: "/clinic/doctors", icon: Briefcase, label: t("doctors") },
        { to: "/clinic/prescriptions", icon: Stethoscope, label: t("prescriptions") },
        { to: "/clinic/lab-orders", icon: Activity, label: t("labOrders") },
        { to: "/clinic/medical-records", icon: BookOpen, label: t("medicalRecords") },
      ],
    },
    {
      title: t("billingAndFinance"),
      links: [
        { to: "/billing/invoices", icon: Receipt, label: t("invoices") },
        { to: "/billing/payments", icon: CreditCard, label: t("payments") },
      ],
    },
    {
      title: t("hospitalityAndHotel"),
      links: [
        { to: "/hotel/bookings", icon: History, label: t("bookings") },
        { to: "/hotel/guests", icon: Users, label: t("guests") },
        { to: "/hotel/rooms", icon: Bed, label: t("rooms") },
        { to: "/hotel/housekeeping", icon: Package, label: t("housekeeping") },
      ],
    },
    {
      title: t("retailAndPos"),
      links: [
        { to: "/pos", icon: Monitor, label: t("posTerminal") },
        { to: "/pos/products", icon: Package, label: t("products") },
        { to: "/pos/sales", icon: Receipt, label: t("salesHistory") },
      ],
    },
    {
      title: t("systemAndCore"),
      links: [
        { to: "/support", icon: LifeBuoy, label: t("supportPortal") },
        { to: "/reports", icon: FileBarChart, label: t("reports") },
        { to: "/chat", icon: MessageCircle, label: t("liveTeamChat") },
        { to: "/settings", icon: Settings, label: t("settings") },
        { to: "/settings/locations", icon: Building2, label: t("locationManagement") },
      ],
    },
  ];

  if (isAdmin) {
    sections.push({
      title: t("administrationGovernance") || "Administration & Governance",
      links: [
        {
          to: "/admin",
          icon: Shield,
          label: t("administration"),
        },
      ],
    });
  }

  return sections;
};
