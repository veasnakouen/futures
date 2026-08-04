import { prescriptionService } from "./clinic/prescriptionService";
import { labOrderService } from "./clinic/labOrderService";
import { patientService } from "./clinic/patientService";
import { appointmentService } from "./clinic/appointmentService";
import { doctorService } from "./clinic/doctorService";
import { medicalRecordService } from "./clinic/medicalRecordService";

export * from "./clinic/clinicTypes";
export * from "./clinic/clinicStorage";

export const clinicService = {
  ...prescriptionService,
  ...labOrderService,
  ...patientService,
  ...appointmentService,
  ...doctorService,
  ...medicalRecordService,
};

export default clinicService;
