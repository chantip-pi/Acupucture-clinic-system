import React from "react";
import { Button, Table } from "~/presentation/designSystem";
import { DateTimeHelper } from "~/domain/value-objects/DateOfBirth";
import { MedicalRecord } from "~/domain/entities/MedicalRecord";


interface MedicalRecordTableProps {
  medicalRecords: MedicalRecord[];
  onEdit?: (medicalRecord: MedicalRecord) => void;
  onRowClick?: (medicalRecord: MedicalRecord) => void;
  emptyMessage?: string;
}

const MedicalRecordTable: React.FC<MedicalRecordTableProps> = ({
  medicalRecords,
  onEdit,
  onRowClick,
  emptyMessage = "No medical records found",
}) => {
  return (
    <>
      <Table
        headers={[
          "Doctor",
          "Date",
          "Time",
          "",
        ]}
      >
        {medicalRecords.map((medicalRecord) => {
          

          return (
            <tr
              key={medicalRecord.recordId}
              className={onRowClick ? "cursor-pointer hover:bg-slate-50" : ""}
              onClick={() => onRowClick?.(medicalRecord)}
            >
              <td className="px-4 py-3 text-md text-slate-900 font-medium">
                {medicalRecord.doctorName}
              </td>
              <td className="px-4 py-3 text-md text-slate-900">
                {DateTimeHelper.formatDateTime(
                  medicalRecord.dateTime,
                  "EEE, d MMM yyyy",
                )}
              </td>
              <td className="px-4 py-3 text-md text-slate-900">
                {DateTimeHelper.formatDateTime(
                  medicalRecord.dateTime,
                  "HH:mm",
                )}
              </td>
             
              <td className="px-4 py-3">
               
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(medicalRecord);
                    }}
                  >
                    Edit
                  </Button>
                
              </td>
            </tr>
          );
        })}
      </Table>

      {medicalRecords.length === 0 && (
        <div className="text-center py-8 text-slate-500">{emptyMessage}</div>
      )}
    </>
  );
};

export default MedicalRecordTable;