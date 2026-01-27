import React from "react";
import { Button, Table } from "~/presentation/designSystem";
import { DateTimeHelper } from "~/domain/value-objects/DateOfBirth";
import { Appointment } from "~/domain/entities/Appointment";

type Status = Appointment["status"];

interface AppointmentTableProps {
  appointments: Appointment[];
  onEdit?: (appointment: Appointment) => void;
  onRowClick?: (appointment: Appointment) => void;
  allowEditStatuses?: Status[];
  emptyMessage?: string;
}

const statusBadge = (status: Status) => {
  switch (status?.toLowerCase()) {
    case "scheduled":
    case "confirmed":
      return "text-blue-600 bg-blue-50 px-2 py-1 rounded";
    case "completed":
      return "text-green-600 bg-green-50 px-2 py-1 rounded";
    case "canceled":
      return "text-red-600 bg-red-50 px-2 py-1 rounded";
    case "no-show":
      return "text-gray-600 bg-gray-50 px-2 py-1 rounded";
    default:
      return "text-slate-600 bg-slate-50 px-2 py-1 rounded";
  }
};



const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
  onEdit,
  onRowClick,
  allowEditStatuses = ["scheduled"],
  emptyMessage = "No appointments found",
}) => {
  return (
    <>
      <Table
        headers={[
          "Patient Name",
          "Date & Time",
          "Doctor Name",
          "Reason",
          "Status",
          "",
        ]}
      >
        {appointments.map((appointment) => {
          const canEdit =
            !!onEdit &&
            allowEditStatuses
              .map((status) => status.toLowerCase())
              .includes((appointment.status || "").toLowerCase());

          return (
            <tr
              key={appointment.appointmentId}
              className={onRowClick ? "cursor-pointer hover:bg-slate-50" : ""}
              onClick={() => onRowClick?.(appointment)}
            >
              <td className="px-4 py-3 text-md text-slate-900 font-medium">
                {appointment.patientName}
              </td>
              <td className="px-4 py-3 text-md text-slate-900">
                {DateTimeHelper.formatDateTime(
                  appointment.appointmentDateTime,
                  "EEEE, d MMMM yyyy HH:mm",
                )}
              </td>
              <td className="px-4 py-3 text-md text-slate-900">
                {appointment.doctorName}
              </td>
              <td className="px-4 py-3 text-md text-slate-700">
                {appointment.reason || "-"}
              </td>
              <td className="px-4 py-3 text-md">
                <span className={statusBadge(appointment.status)}>
                  {appointment.status}
                </span>
              </td>
              <td className="px-4 py-3">
                {canEdit && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(appointment);
                    }}
                  >
                    Edit
                  </Button>
                )}
              </td>
            </tr>
          );
        })}
      </Table>

      {appointments.length === 0 && (
        <div className="text-center py-8 text-slate-500">{emptyMessage}</div>
      )}
    </>
  );
};

export default AppointmentTable;

