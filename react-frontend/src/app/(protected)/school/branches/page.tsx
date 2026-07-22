import React from "react";
import { cookies } from "next/headers";
import BranchListClient from "../../../../features/school/components/BranchListClient";
import { BranchDto } from "../../../../services/schoolService";

const FALLBACK_BRANCHES: BranchDto[] = [
  {
    id: "1",
    branchName: "Phnom Penh Main Campus",
    phoneNumber: "+855 23 888 999",
    email: "main.campus@futures-school.edu.kh",
    address: { street: "Monivong Blvd", city: "Phnom Penh" },
  },
  {
    id: "2",
    branchName: "Siem Reap Innovation Campus",
    phoneNumber: "+855 63 777 888",
    email: "siemreap@futures-school.edu.kh",
    address: { street: "Charles de Gaulle Blvd", city: "Siem Reap" },
  },
  {
    id: "3",
    branchName: "Battambang Regional Campus",
    phoneNumber: "+855 53 666 777",
    email: "battambang@futures-school.edu.kh",
    address: { street: "National Road 5", city: "Battambang" },
  },
];

async function getBranches(): Promise<BranchDto[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  const tenantId = cookieStore.get("tenant-type")?.value;

  if (!token) return FALLBACK_BRANCHES;

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`
  };
  if (tenantId) {
    headers["X-Tenant-ID"] = tenantId;
  }

  try {
    const res = await fetch("http://127.0.0.1:8080/api/school/branches", {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`[School Service] API gateway returned status ${res.status}. Falling back to default demonstration branches.`);
      return FALLBACK_BRANCHES;
    }

    const json = await res.json();
    const list = Array.isArray(json) ? json : (json.data || []);
    return list.length > 0 ? list : FALLBACK_BRANCHES;
  } catch (err) {
    console.warn("[School Service] Network/Service exception fetching branches. Using fallback demonstration layer:", err);
    return FALLBACK_BRANCHES;
  }
}

export default async function BranchesPage() {
  const branches = await getBranches();

  return (
    <>
      <BranchListClient initialBranches={branches} />
    </>
  );
}
