import React from "react";
import { cookies } from "next/headers";
import PageLayoutWrapper from "../../../../components/common/PageLayoutWrapper";
import BranchListClient from "../../../../features/school/components/BranchListClient";
import { BranchDto } from "../../../../services/schoolService";

async function getBranches(): Promise<BranchDto[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  const tenantId = cookieStore.get("tenant-type")?.value;

  if (!token) return [];

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`
  };
  if (tenantId) {
    headers["X-Tenant-ID"] = tenantId;
  }

  try {
    const res = await fetch("http://127.0.0.1:8080/api/school/branches", {
      headers,
      cache: "no-store", // Always fetch fresh data for now
    });
    
    if (!res.ok) {
      console.error("Failed to fetch branches. Status:", res.status);
      return [];
    }
    
    // The Spring Boot controller might return an array or { data: array }.
    // Let's assume it returns what axios got (res.data was used in the client).
    // Axios res.data is the JSON body.
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data || []);
  } catch (err) {
    console.error("Error fetching branches:", err);
    return [];
  }
}

export default async function BranchesPage() {
  const branches = await getBranches();
  
  return (
    <PageLayoutWrapper title="Branches">
      <BranchListClient initialBranches={branches} />
    </PageLayoutWrapper>
  );
}
