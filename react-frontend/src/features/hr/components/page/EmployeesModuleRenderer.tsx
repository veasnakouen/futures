import React from "react";
import WorkforceDirectory from "@/features/hr/components/WorkforceDirectory";
import AttendanceModule from "@/features/hr/components/AttendanceModule";
import LeavesModule from "@/features/hr/components/LeavesModule";
import AnalyticsModule from "@/features/hr/components/AnalyticsModule";
import PayrollModule from "@/features/hr/components/PayrollModule";
import AssetsModule from "@/features/hr/components/AssetsModule";
import RecruitmentModule from "@/features/hr/components/RecruitmentModule";
import StructureModule from "@/features/hr/components/StructureModule";
import TrainingModule from "@/features/hr/components/TrainingModule";
import ComplianceModule from "@/features/hr/components/ComplianceModule";
import TimeOffOverview from "@/features/hr/components/TimeOffOverview";
import IntegrationModule from "@/features/hr/components/IntegrationModule";
import AutomationModule from "@/features/hr/components/AutomationModule";
import EngagementModule from "@/features/hr/components/EngagementModule";
import PortalModule from "@/features/hr/components/PortalModule";
import ManagerModule from "@/features/hr/components/ManagerModule";
import SchedulingModule from "@/features/hr/components/SchedulingModule";
import RetentionModule from "@/features/hr/components/RetentionModule";
import SuccessionModule from "@/features/hr/components/SuccessionModule";
import SupportModule from "@/features/hr/components/SupportModule";
import ReportsModule from "@/features/hr/components/ReportsModule";
import WellnessModule from "@/features/hr/components/WellnessModule";

interface Props {
  state: any;
}

export default function EmployeesModuleRenderer({ state }: Props) {
  const {
    activeModule,
    viewMode,
    setViewMode,
    search,
    setSearch,
    deptFilter,
    setDeptFilter,
    statusFilter,
    setStatusFilter,
    contractFilter,
    setContractFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    queryLoading,
    employees,
    totalPages,
    totalElements,
    handleViewDetails,
    handleEdit,
    handleDelete,
    openImportModal,
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
  } = state;

  switch (activeModule) {
    case "directory":
      return (
        <WorkforceDirectory
          viewMode={viewMode}
          setViewMode={setViewMode}
          search={search}
          setSearch={setSearch}
          deptFilter={deptFilter}
          setDeptFilter={setDeptFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          contractFilter={contractFilter}
          setContractFilter={setContractFilter}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          queryLoading={queryLoading}
          employees={employees}
          totalPages={totalPages}
          totalElements={totalElements}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onOpenImportUsers={openImportModal}
        />
      );

    case "attendance":
      return (
        <AttendanceModule
          globalAttendance={globalAttendance}
          onManualLog={() => state.setIsManualAttendanceOpen(true)}
          onOpenDeviceManager={() => state.setIsDeviceModalOpen(true)}
        />
      );

    case "leaves":
      return (
        <LeavesModule
          globalLeaves={globalLeaves}
          onUpdateStatus={() => { }}
        />
      );

    case "timeoff":
      return <TimeOffOverview />;

    case "analytics":
      return <AnalyticsModule analyticsData={analyticsData} />;

    case "payroll":
      return (
        <PayrollModule
          payrollData={globalPayroll}
          employeesData={globalEmployees}
          onProcessPayroll={async () => { }}
          onUpdateSalary={async () => { }}
        />
      );

    case "assets":
      return (
        <AssetsModule
          globalAssets={globalAssets}
          employees={globalEmployees}
          onReturn={async () => { }}
          onAssign={async () => { }}
          onRegister={async () => { }}
          onUpdate={async () => { }}
          onDelete={async () => { }}
        />
      );

    case "recruitment":
      return (
        <RecruitmentModule
          vacancies={globalVacancies}
          stats={recruitmentStats}
          candidates={[]}
          employers={globalEmployers}
          positions={globalPositions}
          placements={globalPlacements}
          onAddVacancy={async () => { }}
          onUpdateVacancy={async () => { }}
          onDeleteVacancy={async () => { }}
          onAddCandidate={async () => { }}
          onUpdateCandidate={async () => { }}
          onDeleteCandidate={async () => { }}
          onPlaceCandidate={async () => { }}
        />
      );

    case "structure":
      return <StructureModule employeesData={globalEmployees} positionsData={globalPositions} />;

    case "training":
      return <TrainingModule employeesData={globalEmployees} />;

    case "compliance":
      return <ComplianceModule />;

    case "portal":
      return <PortalModule />;

    case "manager":
      return <ManagerModule />;

    case "scheduling":
      return <SchedulingModule />;

    case "retention":
      return <RetentionModule />;

    case "succession":
      return <SuccessionModule />;

    case "wellness":
      return <WellnessModule />;

    case "automation":
      return <AutomationModule />;

    case "engagement":
      return <EngagementModule />;

    case "integrations":
      return <IntegrationModule />;

    case "support":
      return (
        <SupportModule
          tickets={globalTickets}
          ticketTypes={globalTicketTypes}
          users={globalUsers}
          onCreateTicket={createTicket}
          onUpdateTicket={updateTicket}
          onDeleteTicket={deleteTicket}
          onUpdateTicketStatus={updateTicketStatus}
          onAssignTicket={assignTicket}
          onUnassignTicket={unassignTicket}
          onCreateTicketType={createTicketType}
          onDeleteTicketType={deleteTicketType}
        />
      );

    case "reports":
      return <ReportsModule employees={globalEmployees} attendance={globalAttendance} payroll={globalPayroll} />;

    default:
      return null;
  }
}
