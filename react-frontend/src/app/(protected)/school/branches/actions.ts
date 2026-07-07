"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteBranchAction(branchId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  const tenantId = cookieStore.get("tenant-type")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`
  };
  if (tenantId) {
    headers["X-Tenant-ID"] = tenantId;
  }

  try {
    const res = await fetch(`http://127.0.0.1:8080/api/school/branches/${branchId}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!res.ok) {
      const text = await res.text();
      console.error("Failed to delete branch. Status:", res.status, text);
      throw new Error("Failed to delete branch");
    }
    
    // Revalidate the branches page to update the list
    revalidatePath("/school/branches");
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting branch:", err);
    throw new Error(err.message || "Failed to delete branch");
  }
}
