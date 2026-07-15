import PatientProfile from "@/features/clinic/views/PatientProfile";

export default function PatientProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="h-full">
      <PatientProfile patientId={params.id} />
    </div>
  );
}
