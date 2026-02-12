import { useLocation, useNavigate, useParams } from "react-router-dom";
import ErrorPage from "./components/common/ErrorPage";
import { useGetMedicalRecordById } from "~/presentation/hooks/medicalRecord/useGetMedicalRecordById";
import { Button, Card } from "~/presentation/designSystem";
import { Calendar } from "lucide-react";
import { DateTimeHelper } from "~/domain/value-objects/DateOfBirth";
import { faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetAppointmentById } from "~/presentation/hooks/appointment/useGetAppointmentById";
import LoadingPage from "./components/common/LoadingPage";
import { useGetMedicalRecordAcupunctureById } from "~/presentation/hooks/medicalRecordAcupuncture.ts/useGetMedicalRecordAcupunctureById";

const MedicalRecordDetail = () => {
  const { state } = useLocation();
  const { medicalRecordId } = (state as { medicalRecordId?: number }) || {};
  const { acupunctureRecords } = useGetMedicalRecordAcupunctureById( medicalRecordId || null );

  if (!medicalRecordId) {
    return (
      <ErrorPage
        message="Medical record not found."
        onRetry={() => window.history.back()}
      />
    );
  }

  const navigate = useNavigate();
  const { medicalRecord, loading, error } = useGetMedicalRecordById(medicalRecordId);
  const { appointment } = useGetAppointmentById( medicalRecord?.appointmentId ?? null );

  if (loading) {
    return <LoadingPage />;
  }

  if (error || !medicalRecord) {
    return (
      <div
        className="page-background"
        style={{
          backgroundColor: "#DCE8E9",
          width: "100%",
          minHeight: "100vh",
          padding: "50px",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ErrorPage
          message={error || "Medical record not found."}
          onRetry={() => window.history.back()}
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Actions */}
      <div className="flex items-center gap-3 py-4">
        <Button size="sm" variant="back" onClick={() => navigate(-1)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full">
            <FontAwesomeIcon icon={faArrowLeft} />
          </span>
          Back
        </Button>
      </div>

      <Card>
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 py-4">
          Medical Record - {medicalRecord.patientName}
        </h2>

        {/* Appointment Information section */}
        {appointment && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4 mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Appointment Information
            </h3>

            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-3 h-3" />
                <span className="text-sm">Scheduled:</span>
                <span className="font-medium text-slate-900">
                  {DateTimeHelper.formatDateTime(
                    new Date(appointment.appointmentDateTime),
                  )}
                </span>
              </div>
              <div className="pt-3  border-slate-200 flex items-center gap-2 text-sm">
                <FontAwesomeIcon
                  icon={faUser}
                  className="h-4 w-4 text-slate-900"
                />

                <span className="text-slate-600">Doctor:</span>

                <span className="font-semibold text-slate-900">
                  {appointment.doctorName}
                </span>
              </div>
              {appointment.reason && (
                <div className="pt-2 border-t border-slate-200">
                  <div className="text-sm text-slate-500 mb-1">Reason</div>
                  <div className="text-slate-700">{appointment.reason}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Visit Information section */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4 mb-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Visit Information
          </h3>

          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-3 h-3" />
              <span className="text-sm">Visit Date:</span>
              <span className="font-medium text-slate-900">
                {DateTimeHelper.formatDateTime(
                  new Date(medicalRecord.dateTime),
                )}
              </span>
            </div>

            <div className="pt-3 border-slate-200 flex items-center gap-2 text-sm">
              <FontAwesomeIcon
                icon={faUser}
                className="h-4 w-4 text-slate-900"
              />
              <span className="text-slate-600">Doctor:</span>
              <span className="font-semibold text-slate-900">
                {medicalRecord.doctorName}
              </span>
            </div>
          </div>
        </div>

        {/* Assignees Section */}
        {medicalRecord.assignees && medicalRecord.assignees.length > 0 && (
          <div className="mb-4">
            <label className="text-l font-medium text-gray-700 mb-2 block">
              Assigned Staff
            </label>
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <div className="flex flex-wrap gap-2">
                {medicalRecord.assigneesNames.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Medical Record Details */}
        <div className="space-y-4">
          <div>
            <label className="text-l font-medium text-gray-700 mb-2 block">
              Suggest
            </label>
            <div className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-gray-700 whitespace-pre-wrap">
              {medicalRecord.diagnosis}
            </div>
          </div>

          <div>
            <label className="text-l font-medium text-gray-700 mb-2 block">
              Symptoms
            </label>
            <div className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-gray-700 whitespace-pre-wrap">
              {medicalRecord.symptoms}
            </div>
          </div>

          <div>
            <label className="text-l font-medium text-gray-700 mb-2 block">
              Medical Prescriptions
            </label>
            <div className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-gray-700 whitespace-pre-wrap">
              {medicalRecord.prescriptions}
            </div>
          </div>

          <div>
            <label className="text-l font-medium text-gray-700 mb-2 block">
              Doctor's Remarks
            </label>
            <div className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-gray-700 whitespace-pre-wrap">
              {medicalRecord.remarks}
            </div>
          </div>
        </div>

        <div className="py-4">
          {acupunctureRecords && acupunctureRecords.length > 0 && (
            <Button
              variant="secondary"
              onClick={() =>
                navigate("/acupunctureShowPage", {
                  state: { recordId: medicalRecord.recordId },
                })
              }
            >
              Show Acupuncture
            </Button>
          )}
        </div>
        
      </Card>
    </div>
  );
};

export default MedicalRecordDetail;
