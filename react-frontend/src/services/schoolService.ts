import api from "./api";

// DTO Interfaces
export interface StudentParentDto extends ParentDto {
  relationshipType: string;
}

export interface StudentDto {
  imageUrl?: string;
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  enrollmentDate: string;
  isActive?: boolean;

  middleName?: string;
  gender?: string;
  nationality?: string;
  studentPhone?: string;
  currentAddress?: AddressDto;
  permanentAddress?: AddressDto;
  studentCode?: string;
  branchId?: string;
  classroomId?: string;
  dormitoryId?: string;
  clinicPatientId?: string;

  parents?: StudentParentDto[];
  extracurriculars?: ExtracurricularDto[];
  medicalRecord?: MedicalRecordDto;
  customAttributes?: string;
  isIdPoor?: boolean;
  idPoorNumber?: string;
  broughtByOutreachWorker?: boolean;
  outreachWorkerName?: string;
  outreachOrganization?: string;

  globalClientId?: number;
}

export interface StudentParentCommandDto {
  parentId: string;
  relationshipType: string;
}

export interface CreateStudentCommand {
  imageUrl?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  enrollmentDate: string;

  middleName?: string;
  gender?: string;
  nationality?: string;
  studentPhone?: string;
  currentAddress?: AddressDto;
  permanentAddress?: AddressDto;
  studentCode?: string;
  branchId?: string;
  classroomId?: string;
  dormitoryId?: string;

  parentRelationships?: StudentParentCommandDto[];
  extracurricularIds?: string[];
  medicalConditions?: string;
  clinicPatientId?: string;
  customAttributes?: Record<string, any>;
  isIdPoor?: boolean;
  idPoorNumber?: string;
  broughtByOutreachWorker?: boolean;
  outreachWorkerName?: string;
  outreachOrganization?: string;
  globalClientId?: number;
}

export interface UpdateStudentCommand extends CreateStudentCommand {
  isActive?: boolean;
}

export interface TeacherDto {
  imageUrl?: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  hireDate: string;
  subject: string;
  isActive?: boolean;
  baseSalary?: number;
  address?: AddressDto;
  branchId?: string;
}

export interface BranchDto {
  imageUrl?: string;
  id: string;
  branchName: string;
  address?: AddressDto;
  phoneNumber?: string;
  email?: string;
}

export interface CourseDto {
  imageUrl?: string;
  id: string;
  name: string;
  description: string;
  credits: number;
  teacherId: string;
  teacherFirstName?: string;
  teacherLastName?: string;
}

export interface EnrollmentDto {
  id: string;
  studentId: string;
  studentName?: string;
  courseId: string;
  courseName?: string;
  enrollmentDate: string;
  grade?: string;
}

export interface AddressDto {
  street?: string;
  village?: string;
  commune?: string;
  district?: string;
  city?: string; // or province
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface ParentDto {
  imageUrl?: string;
  id: string;
  name: string;
  contactNumber: string;
  email?: string;
  gender?: string;
  address?: AddressDto;
}

export interface ExtracurricularDto {
  id: string;
  name: string;
  description?: string;
  schedule?: string;
  location?: string;
  capacity?: number;
  cost?: number;
  leadTeacherId?: string;
}

export interface MedicalRecordDto {
  id: string;
  conditions: string;
}

// Service Methods
export const schoolService = {
  // --- Students ---
  getStudents: (page = 0, size = 10, outreachWorkerName?: string) => {
    let url = `/school/students?page=${page}&size=${size}`;
    if (outreachWorkerName) {
      url += `&outreachWorkerName=${encodeURIComponent(outreachWorkerName)}`;
    }
    return api.get(url);
  },
  getStudentById: (id: string) => api.get(`/school/students/${id}`),
  createStudent: (data: CreateStudentCommand) =>
    api.post(`/school/students`, data),
  updateStudent: (id: string, data: UpdateStudentCommand) =>
    api.put(`/school/students/${id}`, data),
  deleteStudent: (id: string) => api.delete(`/school/students/${id}`),

  getCustomFields: (entityType: string) =>
    api.get(`/school/custom-fields?entityType=${entityType}`),

  // --- Branches ---
  getBranches: () => api.get('/school/branches'),
  createBranch: (data: Omit<BranchDto, "id">) => api.post('/school/branches', data),
  updateBranch: (id: string, data: Omit<BranchDto, "id">) => api.put(`/school/branches/${id}`, data),
  deleteBranch: (id: string) => api.delete(`/school/branches/${id}`),

  // --- Teachers ---
  getTeachers: (page = 0, size = 10) =>
    api.get(`/school/teachers?page=${page}&size=${size}`),
  getTeacherById: (id: string) => api.get(`/school/teachers/${id}`),
  createTeacher: (data: Omit<TeacherDto, "id">) =>
    api.post(`/school/teachers`, data),
  updateTeacher: (id: string, data: Omit<TeacherDto, "id">) =>
    api.put(`/school/teachers/${id}`, data),
  deleteTeacher: (id: string) => api.delete(`/school/teachers/${id}`),

  // --- Courses ---
  getCourses: (page = 0, size = 10) =>
    api.get(`/school/courses?page=${page}&size=${size}`),
  getCourseById: (id: string) => api.get(`/school/courses/${id}`),
  createCourse: (data: Omit<CourseDto, "id">) =>
    api.post(`/school/courses`, data),
  updateCourse: (id: string, data: Omit<CourseDto, "id">) =>
    api.put(`/school/courses/${id}`, data),
  deleteCourse: (id: string) => api.delete(`/school/courses/${id}`),

  // --- Enrollments ---
  getEnrollments: (page = 0, size = 10) =>
    api.get(`/school/enrollments?page=${page}&size=${size}`),
  getEnrollmentById: (id: string) => api.get(`/school/enrollments/${id}`),
  createEnrollment: (data: Omit<EnrollmentDto, "id">) =>
    api.post(`/school/enrollments`, data),
  updateEnrollment: (id: string, data: Omit<EnrollmentDto, "id">) =>
    api.put(`/school/enrollments/${id}`, data),
  deleteEnrollment: (id: string) => api.delete(`/school/enrollments/${id}`),

  // --- Parents ---
  getParents: (page = 0, size = 10) =>
    api.get(`/school/parents?page=${page}&size=${size}`),
  getParentById: (id: string) => api.get(`/school/parents/${id}`),
  createParent: (data: Omit<ParentDto, "id">) =>
    api.post(`/school/parents`, data),
  updateParent: (id: string, data: Omit<ParentDto, "id">) =>
    api.put(`/school/parents/${id}`, data),
  deleteParent: (id: string) => api.delete(`/school/parents/${id}`),

  // --- Extracurriculars ---
  getExtracurriculars: (page = 0, size = 10) =>
    api.get(`/school/extracurriculars?page=${page}&size=${size}`),
  getExtracurricularById: (id: string) => api.get(`/school/extracurriculars/${id}`),
  createExtracurricular: (data: Omit<ExtracurricularDto, "id">) =>
    api.post(`/school/extracurriculars`, data),
  updateExtracurricular: (id: string, data: Omit<ExtracurricularDto, "id">) =>
    api.put(`/school/extracurriculars/${id}`, data),
  deleteExtracurricular: (id: string) => api.delete(`/school/extracurriculars/${id}`),

  // --- Medical Records ---
  getMedicalRecords: (page = 0, size = 10) =>
    api.get(`/school/medical-records?page=${page}&size=${size}`),
  getMedicalRecordById: (id: string) => api.get(`/school/medical-records/${id}`),
  createMedicalRecord: (data: Omit<MedicalRecordDto, "id">) =>
    api.post(`/school/medical-records`, data),
  updateMedicalRecord: (id: string, data: Omit<MedicalRecordDto, "id">) =>
    api.put(`/school/medical-records/${id}`, data),
};

// --- Outreach & Referrals DTOs ---
export interface OutreachVisitDto {
  id?: string;
  studentId: string;
  visitDate: string;
  communityEntryNotes?: string;
  needsAssessmentSurvey?: string;
  serviceDelivery?: string;
  referralNeeded?: boolean;
  nextVisitDate?: string;
  status?: string;
  assessmentScore?: number;
  committeeNotes?: string;
}

export interface DepartmentDto {
  id?: number;
  name: string;
  description?: string;
  requiredRole?: string;
  headOfDepartment?: string;
  contactEmail?: string;
  location?: string;
  active?: boolean;
  createdAt?: string;
}

export interface ReferralDto {
  id?: string;
  department?: DepartmentDto;
  status: string;
  assignedTo?: string;
  notes?: string;
  customAttributes?: string;
}

export interface ReferralCaseDto {
  id?: string;
  studentId: string;
  outreachVisitId?: string;
  leadCoordinator?: string;
  status: string;
  initialCasePlan?: string;
  monitoringNotes?: string;
  exitPlan?: string;
  referrals?: ReferralDto[];
}

export const outreachService = {
  getVisits: () => api.get(`/outreach-visits`),
  getVisitsByStudent: (studentId: string) => api.get(`/outreach-visits/student/${studentId}`),
  createVisit: (data: OutreachVisitDto) => api.post(`/outreach-visits`, data),
  updateVisit: (id: string, data: OutreachVisitDto) => api.put(`/outreach-visits/${id}`, data),
  deleteVisit: (id: string) => api.delete(`/outreach-visits/${id}`),
};

export const referralCaseService = {
  getCases: () => api.get(`/referral-cases`),
  getCasesByStudent: (studentId: string) => api.get(`/referral-cases/student/${studentId}`),
  createCase: (data: ReferralCaseDto) => api.post(`/referral-cases`, data),
  updateCase: (id: string, data: ReferralCaseDto) => api.put(`/referral-cases/${id}`, data),
  deleteCase: (id: string) => api.delete(`/referral-cases/${id}`),

  addReferral: (caseId: string, data: ReferralDto) => api.post(`/referral-cases/${caseId}/referrals`, data),
  updateReferral: (referralId: string, data: ReferralDto) => api.put(`/referral-cases/referrals/${referralId}`, data),
  getReferralsByDepartments: (departmentIds: number[]) =>
    api.get(`/referral-cases/referrals/by-departments?departmentIds=${departmentIds.join(',')}`),
};

export const departmentService = {
  getDepartments: () => api.get(`/school/departments`),
  createDepartment: (data: DepartmentDto) => api.post(`/school/departments`, data),
  updateDepartment: (id: number, data: DepartmentDto) => api.put(`/school/departments/${id}`, data),
  deleteDepartment: (id: number) => api.delete(`/school/departments/${id}`),
};
