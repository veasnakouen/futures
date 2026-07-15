import api from "./api";

export const attendanceService = {
  getDepartmentQrToken: async (departmentId: number): Promise<string> => {
    const response = await api.get(`/hr/attendance/department/${departmentId}/qr`);
    return response.data;
  },

  scanQrCode: async (token: string, employeeId: number): Promise<any> => {
    const response = await api.post(`/hr/attendance/scan-qr?token=${token}&employeeId=${employeeId}`);
    return response.data;
  },
};
