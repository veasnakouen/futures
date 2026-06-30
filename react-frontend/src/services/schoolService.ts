import api from "./api";

// DTO Interfaces
export interface StudentParentDto extends ParentDto {
  relationshipType: string;
}

export interface StudentDto {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  enrollmentDate: string;
  isActive?: boolean;
  parents?: StudentParentDto[];
  extracurriculars?: ExtracurricularDto[];
  medicalRecord?: MedicalRecordDto;
  customAttributes?: string;
}

export interface StudentParentCommandDto {
  parentId: number;
  relationshipType: string;
}

export interface CreateStudentCommand {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  enrollmentDate: string;
  parentRelationships?: StudentParentCommandDto[];
  extracurricularIds?: number[];
  medicalConditions?: string;
  customAttributes?: string;
}

export interface UpdateStudentCommand extends CreateStudentCommand {
  isActive?: boolean;
}

export interface TeacherDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  hireDate: string;
  department: string;
  isActive?: boolean;
  baseSalary?: number;
  address?: AddressDto;
  branchId?: string;
}

export interface CourseDto {
  id: number;
  courseName: string;
  courseCode: string;
  credits: number;
  teacherId: number;
}

export interface EnrollmentDto {
  id: number;
  studentId: number;
  courseId: number;
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
  id: number;
  name: string;
  contactNumber: string;
  email?: string;
  gender?: string;
  address?: AddressDto;
}

export interface ExtracurricularDto {
  id: number;
  name: string;
}

export interface MedicalRecordDto {
  id: number;
  conditions: string;
}

// Service Methods
export const schoolService = {
  // --- Students ---
  getStudents: (page = 0, size = 10) =>
    api.get(`/school/students?page=${page}&size=${size}`),
  getStudentById: (id: number) => api.get(`/school/students/${id}`),
  createStudent: (data: CreateStudentCommand) =>
    api.post(`/school/students`, data),
  updateStudent: (id: number, data: UpdateStudentCommand) =>
    api.put(`/school/students/${id}`, data),
  deleteStudent: (id: number) => api.delete(`/school/students/${id}`),
  
  getCustomFields: (entityType: string) => 
    api.get(`/school/custom-fields?entityType=${entityType}`),

  // --- Teachers ---
  getTeachers: (page = 0, size = 10) =>
    api.get(`/school/teachers?page=${page}&size=${size}`),
  getTeacherById: (id: number) => api.get(`/school/teachers/${id}`),
  createTeacher: (data: Omit<TeacherDto, "id">) =>
    api.post(`/school/teachers`, data),
  updateTeacher: (id: number, data: Omit<TeacherDto, "id">) =>
    api.put(`/school/teachers/${id}`, data),

  // --- Courses ---
  getCourses: (page = 0, size = 10) =>
    api.get(`/school/courses?page=${page}&size=${size}`),
  getCourseById: (id: number) => api.get(`/school/courses/${id}`),
  createCourse: (data: Omit<CourseDto, "id">) =>
    api.post(`/school/courses`, data),
  updateCourse: (id: number, data: Omit<CourseDto, "id">) =>
    api.put(`/school/courses/${id}`, data),

  // --- Enrollments ---
  getEnrollments: (page = 0, size = 10) =>
    api.get(`/school/enrollments?page=${page}&size=${size}`),
  getEnrollmentById: (id: number) => api.get(`/school/enrollments/${id}`),
  createEnrollment: (data: Omit<EnrollmentDto, "id">) =>
    api.post(`/school/enrollments`, data),
  updateEnrollment: (id: number, data: Omit<EnrollmentDto, "id">) =>
    api.put(`/school/enrollments/${id}`, data),

  // --- Parents ---
  getParents: (page = 0, size = 10) =>
    api.get(`/school/parents?page=${page}&size=${size}`),
  getParentById: (id: number) => api.get(`/school/parents/${id}`),
  createParent: (data: Omit<ParentDto, "id">) =>
    api.post(`/school/parents`, data),
  updateParent: (id: number, data: Omit<ParentDto, "id">) =>
    api.put(`/school/parents/${id}`, data),

  // --- Extracurriculars ---
  getExtracurriculars: (page = 0, size = 10) =>
    api.get(`/school/extracurriculars?page=${page}&size=${size}`),
  getExtracurricularById: (id: number) => api.get(`/school/extracurriculars/${id}`),
  createExtracurricular: (data: Omit<ExtracurricularDto, "id">) =>
    api.post(`/school/extracurriculars`, data),
  updateExtracurricular: (id: number, data: Omit<ExtracurricularDto, "id">) =>
    api.put(`/school/extracurriculars/${id}`, data),

  // --- Medical Records ---
  getMedicalRecords: (page = 0, size = 10) =>
    api.get(`/school/medical-records?page=${page}&size=${size}`),
  getMedicalRecordById: (id: number) => api.get(`/school/medical-records/${id}`),
  createMedicalRecord: (data: Omit<MedicalRecordDto, "id">) =>
    api.post(`/school/medical-records`, data),
  updateMedicalRecord: (id: number, data: Omit<MedicalRecordDto, "id">) =>
    api.put(`/school/medical-records/${id}`, data),
};
