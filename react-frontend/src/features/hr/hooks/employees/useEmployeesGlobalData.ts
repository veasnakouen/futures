import {
  useAttendance,
  usePayroll,
  useAnalyticsStats,
  useAnalyticsDemographics,
  useAnalyticsDeptDist,
  useHRAssets,
  useVacancies,
  useRecruitmentStats,
  useEmployers,
  usePlacements,
  useTickets,
  useAllUsers,
  useLookups,
  useAssessments,
  useCreateTicket,
  useUpdateTicket,
  useDeleteTicket,
  useUpdateTicketStatus,
  useAssignTicket,
  useUnassignTicket,
  useCreateTicketType,
  useDeleteTicketType,
  useCreateAssessment,
  useUpdateAssessment,
  useDeleteAssessment,
} from "@/hooks/useHR";
import { useAllLeaves as useLeavesFromHook } from "@/hooks/useLeaves";

export function useEmployeesGlobalData(employees: any[]) {
  const { data: globalAttendance = [] } = useAttendance();
  const { data: globalLeaves = [] } = useLeavesFromHook();
  const { data: globalAssets = [] } = useHRAssets();
  const { data: globalPayroll = [] } = usePayroll();
  const { data: analyticsStats } = useAnalyticsStats();
  const { data: demographics } = useAnalyticsDemographics();
  const { data: deptDist } = useAnalyticsDeptDist();
  const analyticsData = {
    stats: analyticsStats || {},
    demographics: demographics || {},
    deptDist: deptDist || [],
  };

  const { data: globalVacancies = [] } = useVacancies();
  const { data: recruitmentStats = {} } = useRecruitmentStats();
  const { data: globalEmployers = [] } = useEmployers();
  const { data: globalPositions = [] } = useLookups("positions");
  const { data: globalPlacements = [] } = usePlacements();
  const { data: globalTickets = [] } = useTickets();
  const { data: globalTicketTypes = [] } = useLookups("ticket-types");
  const { data: globalAssessments = [] } = useAssessments();
  const { data: globalUsers = [] } = useAllUsers();

  const globalEmployees = employees;

  const { mutateAsync: createTicket } = useCreateTicket();
  const { mutateAsync: updateTicket } = useUpdateTicket();
  const { mutateAsync: deleteTicket } = useDeleteTicket();
  const { mutateAsync: updateTicketStatus } = useUpdateTicketStatus();
  const { mutateAsync: assignTicket } = useAssignTicket();
  const { mutateAsync: unassignTicket } = useUnassignTicket();
  const { mutateAsync: createTicketType } = useCreateTicketType();
  const { mutateAsync: deleteTicketType } = useDeleteTicketType();
  const { mutateAsync: createAssessment } = useCreateAssessment();
  const { mutateAsync: updateAssessment } = useUpdateAssessment();
  const { mutateAsync: deleteAssessment } = useDeleteAssessment();

  return {
    globalAttendance,
    globalLeaves,
    globalAssets,
    globalPayroll,
    analyticsData,
    globalVacancies,
    recruitmentStats,
    globalEmployers,
    globalPositions,
    globalPlacements,
    globalTickets,
    globalTicketTypes,
    globalAssessments,
    globalUsers,
    globalEmployees,
    createTicket,
    updateTicket,
    deleteTicket,
    updateTicketStatus,
    assignTicket,
    unassignTicket,
    createTicketType,
    deleteTicketType,
    createAssessment,
    updateAssessment,
    deleteAssessment,
  };
}
