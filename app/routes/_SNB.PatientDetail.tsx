import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, InfoList, SectionHeading } from "~/presentation/designSystem";
import { useGetPatientById } from "~/presentation/hooks/patient/useGetPatientById";
import { useGetAppointmentListByPatientId } from "~/presentation/hooks/appointment/useGetAppointmentListByPatientId";
import { Appointment } from "~/domain/entities/Appointment";
import { DateTimeHelper } from "~/domain/value-objects/DateOfBirth";
import ErrorPage from "./components/common/ErrorPage";
import LoadingPage from "./components/common/LoadingPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import AppointmentTable from "./components/appointment/AppointmentTable";
import EditAppointmentDialog from "./components/appointment/EditAppointmentDialog";
import { useCancelAppointment } from "~/presentation/hooks/appointment/useCancelAppointment";
import { useUpdateAppointment } from "~/presentation/hooks/appointment/useUpdateAppointment";
import ConfirmDialog from "./components/common/ConfirmDialog";
import AddMedicalRecordDialog from "./components/medicalRecord/AddMedicalRecordDialog";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import MedicalRecordTable from "./components/medicalRecord/MedicalRecordTable";
import { useGetMedicalRecordListByPatientId } from "~/presentation/hooks/medicalRecord/useGetMedicalRecordListByPatientId";
import { getUserSession } from "~/presentation/session/userSession";
import { MedicalRecord } from "~/domain/entities/MedicalRecord";

function PatientDetail() {


  const navigate = useNavigate();
  const location = useLocation();

  const { patientId } = (location.state as { patientId?: number } | null) || {};
  const resolvedPatientId: number | null =
    typeof patientId === "number" ? patientId : null;

  const { updateAppointment, loading: updateAppointmentLoading, error: updateAppointmentError } = useUpdateAppointment();
  const { cancelAppointment, loading: cancelAppointmentLoading, error: cancelAppointmentError } = useCancelAppointment();
  const { patient: patientData, loading, error } = useGetPatientById(resolvedPatientId);
  const { appointments, loading: appointmentLoading, error: appointmentError } = useGetAppointmentListByPatientId(resolvedPatientId);
  const { medicalRecords } = useGetMedicalRecordListByPatientId(resolvedPatientId);

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editDate, setEditDate] = useState<Date | null>(null);
  const [editReason, setEditReason] = useState<string>("");
  const [formError, setFormError] = useState<string>("");
  const [showAddMedicalRecordDialog, setShowAddMedicalRecordDialog] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState<boolean>(false);
  const [isManager, setIsManager] = useState<boolean>(false);
  const [isDoctor, setIsDoctor] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const session = getUserSession();
    if (!session) {
      setIsLoggedIn(false);
      setIsManager(false);
      setIsSessionLoaded(true);
      setSessionError("No user information found. Please log in again.");
      return;
    }

    setIsLoggedIn(true);
    setIsManager(session.title?.toLowerCase() === "manager");
    setIsDoctor(session.title?.toLowerCase() === "doctor");
    setIsSessionLoaded(true);
  }, []);

 
  const checkAccess = (action: () => void) => {
    if (!isManager && !isDoctor) {
      alert("You don't have access to this action.");
      return;
    }

    action();
  };

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    const now = new Date();

    // Then sort by status priority, then by appointment date
    return appointments.sort((a, b) => {
      // Status priority: scheduled (1) > completed (2) > cancelled/canceled (3) > others (4)
      const getStatusPriority = (status: string | undefined): number => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower === 'scheduled') return 1;
        if (statusLower === 'completed') return 2;
        if (statusLower === 'cancelled' || statusLower === 'canceled') return 3;
        return 4;
      };

      const statusA = getStatusPriority(a.status);
      const statusB = getStatusPriority(b.status);

      // First sort by status priority
      if (statusA !== statusB) {
        return statusA - statusB;
      }

      // If same status, sort by appointment date (closest to now first)
      const dateA = new Date(a.appointmentDateTime).getTime();
      const dateB = new Date(b.appointmentDateTime).getTime();
      const nowTime = now.getTime();

      // Calculate absolute difference from now
      const diffA = Math.abs(dateA - nowTime);
      const diffB = Math.abs(dateB - nowTime);

      return diffA - diffB;
    });
  }, [appointments,]);

  if (loading || appointmentLoading) {
    return <LoadingPage />;
  }

  if (error || appointmentError || sessionError) {
    return <ErrorPage message={error || appointmentError || sessionError || "An error occurred"} onRetry={() => window.location.reload()} />;
  }


  if (!patientData) {
    return (
      <ErrorPage message={"No patient data found"} onRetry={() => window.location.reload()} />
    );
  };

  if (!appointments) {
    return (
      <ErrorPage message={"No appointmet data found"} onRetry={() => window.location.reload()} />
    );
  };

  const handleEdit = (patientId: number) => {
    checkAccess(() => navigate("/editPatient", {
      state: { patientId },
    }));
  };


  const handleUpdateAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setEditDate(new Date(appointment.appointmentDateTime));
    setEditReason(appointment.reason || "");
    setFormError("");
    setShowEditDialog(true);
  };

  const handleCloseDialog = () => {
    setShowEditDialog(false);
    setSelectedAppointment(null);
    setEditDate(null);
    setEditReason("");
    setFormError("");
    setShowAddMedicalRecordDialog(false);
  };

  const handleSubmitUpdateAppointment = async () => {
    if (!selectedAppointment) return;

    setFormError("");

    // Validation
    if (!editDate) {
      setFormError("Please select an appointment date");
      return;
    }
    if (!editReason.trim()) {
      setFormError("Please provide a reason for the appointment");
      return;
    }

    const appointmentDate = editDate.toISOString();

    const result = await updateAppointment({
      appointmentId: selectedAppointment.appointmentId,
      appointmentDateTime: appointmentDate,
      patientId: selectedAppointment.patientId,
      doctorId: selectedAppointment.doctorId,
      reason: editReason.trim(),
      status: selectedAppointment.status,
      patientName: selectedAppointment.patientName,
      doctorName: selectedAppointment.doctorName,
    });

    if (result.success) {
      handleCloseDialog();
      window.location.reload(); // Refresh the appointment list
    } else {
      setFormError(result.error || "Failed to update appointment");
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    setFormError("");

    const result = await cancelAppointment({
      appointmentId: selectedAppointment.appointmentId,
      appointmentDateTime: selectedAppointment.appointmentDateTime,
      patientId: selectedAppointment.patientId,
      doctorId: selectedAppointment.doctorId,
      reason: selectedAppointment.reason,
      status: "canceled",
      patientName: selectedAppointment.patientName,
      doctorName: selectedAppointment.doctorName,
    });

    if (result.success) {
      handleCloseDialog();
      window.location.reload();
    } else {
      setFormError(result.error || "Failed to cancel appointment");
    }
  };


  // Handle starting a medical record (appointment is optional)
  const handleStartMedicalRecord = (recordData: {
    appointmentId?: number;
    doctorId: number;
    patientId: number;
    dateTime: string;
    patientName: string;
    doctorName: string;
  }) => {
    checkAccess(() => navigate("/createMedicalRecord", {
      state: {
        appointmentId: recordData.appointmentId,
        doctorId: recordData.doctorId,
        patientId: recordData.patientId,
        dateTime: recordData.dateTime,
        patientName: recordData.patientName,
        doctorName: recordData.doctorName
      },
    }));
  };

  if (!isSessionLoaded) {
    return <LoadingPage />;
  }
  if (!isLoggedIn) {
    const handleGoBack = () => {
      window.history.back();
    };
  }


  return (
    <div className="flex min-h-screen bg-surface-muted">
      <EditAppointmentDialog
        isOpen={showEditDialog}
        onEditAppointment={handleSubmitUpdateAppointment}
        onCancelAppointment={() => setShowConfirmDialog(true)}
        onClose={handleCloseDialog}
        selectedPatientName={selectedAppointment?.patientName || ""}
        selectedDoctorName={selectedAppointment?.doctorName || ""}
        selectedDate={editDate}
        reason={editReason}
        formError={formError}
        onDateChange={setEditDate}
        onReasonChange={setEditReason}
        isLoading={updateAppointmentLoading}
      />

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title={"Cancel Appointment"}
        message="Do you really want to cancel this appointment?"
        cancelText="No"
        confirmText="Yes"
        isLoading={updateAppointmentLoading}
        onConfirm={handleCancelAppointment}
        onCancel={() => setShowConfirmDialog(false)}
      />

      <AddMedicalRecordDialog
        isOpen={showAddMedicalRecordDialog}
        onClose={handleCloseDialog}
        appointments={filteredAppointments}
        patient={{
          id: patientData.patientId,
          nameSurname: patientData.nameSurname,
        }}
        doctors={[]}
        onStartMedicalRecord={handleStartMedicalRecord}
      />

      <main className="flex-1 p-8 space-y-8">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="back"
            onClick={() => navigate("/patientList")}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full ">
              <FontAwesomeIcon icon={faArrowLeft} />
            </span>
            Back
          </Button>
        </div>
        <Card className="fade-in">
          <div className="flex items-center justify-between">
            <SectionHeading title="Patient Detail" />
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleEdit(patientData.patientId)}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                  <FontAwesomeIcon icon={faPenToSquare} />
                </span>
                Edit
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <InfoList
              items={[
                {
                  label: "Name Surname",
                  value: patientData.nameSurname ?? "N/A",
                },
                { label: "Gender", value: patientData.gender ?? "N/A" },
                {
                  label: "Age",
                  value: patientData
                    ? DateTimeHelper.calculateAge(patientData.birthday)
                    : "N/A",
                },
                {
                  label: "Phone Number",
                  value: patientData.phoneNumber ?? "N/A",
                },

                {
                  label: "Congenital Disease",
                  value: patientData.congenitalDisease ?? "N/A",
                },
                {
                  label: "Surgery History",
                  value: patientData.surgeryHistory ?? "N/A",
                },
                {
                  label: "Remaining Course",
                  value: String(patientData.remainingCourse ?? "0"),
                },
              ]}
            />
          </div>
        </Card>

        <Card className="fade-in">
          <SectionHeading title="Appointment History" />
          <AppointmentTable
            appointments={filteredAppointments}
            onEdit={handleUpdateAppointment}
            allowEditStatuses={["scheduled"]}
            emptyMessage="No appointments found."
          />
        </Card>

        <Card className="fade-in">
          <div className="flex items-center justify-between mb-4">
            <SectionHeading title="Medical Records" />
            {(isManager || isDoctor) && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAddMedicalRecordDialog(true)}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                  <FontAwesomeIcon icon={faPenToSquare} />
                </span>
                Add Medical Record
              </Button>
            )}
          </div>

          <MedicalRecordTable
            medicalRecords={medicalRecords}
            onRowClick={(medicalRecord) =>
              navigate("/medicalRecordDetail", {
                state: { medicalRecordId: medicalRecord.recordId },
              })
            }
            onEdit={(medicalRecord) =>
              navigate("/medicalRecordDetail", {
                state: { medicalRecordId: medicalRecord.recordId },
              })
            }
          />
        </Card>
      </main>
    </div>
  );
}




export default PatientDetail;
