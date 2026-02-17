import React, { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorPage from "./components/common/ErrorPage";
import { useGetStaffList } from "~/presentation/hooks/staff/useGetStaffList";
import { useGetAppointmentById } from "~/presentation/hooks/appointment/useGetAppointmentById";
import { Button, Card, FormField, Select } from "~/presentation/designSystem";
import { Calendar } from "lucide-react";
import { DateTimeHelper } from "~/domain/value-objects/DateOfBirth";
import { faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MultiStaffSelect from "./components/medicalRecord/MultiStaffSelect";
import { useCreateMedicalRecord } from "~/presentation/hooks/medicalRecord/useCreateMedicalRecord";
import { useAddMedicalRecordAcupuncture } from "~/presentation/hooks/medicalRecordAcupuncture.ts/useAddMedicalRecordAcupuncture";
import { Checkbox } from "app/components/ui/checkbox";
import SelectAcupunctureSourceDialog from "./components/medicalRecord/SelectAcupunctureSourceDialog";
import AcupunctureSelect from "./components/AcupunctureSelect";
import { SelectedPoint } from "~/domain/entities/AcupuncturePoint";
import LoadingPage from "./components/common/LoadingPage";

const CreateMedicalRecord = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);
  const [error, setError] = useState<string>("");
  const [hasAcupuncture, setHasAcupuncture] = useState(false);
  const [isSelectSourceOpen, setIsSelectSourceOpen] = useState(false);
  const [showAcupunctureSelect, setShowAcupunctureSelect] = useState(false);
  const [selectedAcupuncturePoints, setSelectedAcupuncturePoints] = useState<
    SelectedPoint[]
  >([]);

  if (!state) {
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
          message="No medical record data provided. Please navigate from the patient details page."
          onRetry={() => window.history.back()}
        />
      </div>
    );
  }

  const {
    appointmentId,
    doctorId,
    patientId,
    dateTime,
    doctorName,
    patientName,
  } = state as {
    appointmentId?: number;
    doctorId: number;
    patientId: number;
    dateTime: string;
    doctorName: string;
    patientName: string;
  };

  const { staffs: staffList } = useGetStaffList();
  const { appointment, loading: appointmentLoading, error: appointmentError } = useGetAppointmentById(appointmentId ?? null);
  const {
    createMedicalRecord,
    loading: createMedicalRecordLoading,
    error: createMedicalRecordError,
  } = useCreateMedicalRecord();
  const { addMedicalRecordAcupuncture, loading: acupunctureLoading, error: acupunctureError } =
    useAddMedicalRecordAcupuncture();


  const isLoading =
    acupunctureLoading ||
    createMedicalRecordLoading;

  const hasError =
    acupunctureError ||
    createMedicalRecordError;


  if (isLoading) {
    return <LoadingPage />;
  }

  if (hasError) {
    return (
      <ErrorPage
        message="Something went wrong. please try again."
        onRetry={() => window.history.back()}
      />
    );
  }

  const [formData, setFormData] = useState({
    appointmentId: appointmentId,
    doctorId: doctorId,
    patientId: patientId,
    dateTime: dateTime,
    diagnosis: "",
    symptoms: "",
    prescriptions: "",
    remarks: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStaffChange = (staffIds: number[]) => {
    setSelectedStaffIds(staffIds);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form data being submitted:", formData);

    submitToApi();
  };

  const submitToApi = async () => {
    // First create the medical record
    const result = await createMedicalRecord({
      appointmentId: formData.appointmentId || null,
      doctorId: formData.doctorId,
      patientId: formData.patientId,
      dateTime: formData.dateTime,
      diagnosis: formData.diagnosis,
      symptoms: formData.symptoms,
      prescriptions: formData.prescriptions,
      remarks: formData.remarks,
      assignees: selectedStaffIds,
    });

    if (result.success) {
      // If acupuncture points are selected, save them
      if (
        hasAcupuncture &&
        selectedAcupuncturePoints.length > 0 &&
        result.recordId
      ) {
        try {
          for (const point of selectedAcupuncturePoints) {
            await addMedicalRecordAcupuncture({
              recordId: result.recordId,
              acupunctureId: point.acupunctureId,
            });
          }
          console.log(
            `Saved ${selectedAcupuncturePoints.length} acupuncture points`,
          );
        } catch (error) {
          console.error("Error saving acupuncture points:", error);
          setError(
            "Medical record saved but failed to save acupuncture points",
          );
          return;
        }
      }
      navigate(-1);
    } else {
      setError(result.error || "Failed to create medical record");
    }
  };

  const handlePickLibrary = () => {
    //TODO: navigate to select from library
    handleCloseDialog();
  };

  const handlePickManual = () => {
    setShowAcupunctureSelect(true);
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setIsSelectSourceOpen(false);
  };

  const handleAcupuncturePointsChange = (points: SelectedPoint[]) => {
    setSelectedAcupuncturePoints(points);
  };

  return (
    <div className="p-8">
      <SelectAcupunctureSourceDialog
        onClose={handleCloseDialog}
        isOpen={isSelectSourceOpen}
        onPickLibrary={handlePickLibrary}
        onPickManual={handlePickManual}
      />

      {/* Actions */}
      <div className="flex items-center gap-3 py-4">
        <Button size="sm" variant="back" onClick={() => navigate(-1)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full ">
            <FontAwesomeIcon icon={faArrowLeft} />
          </span>
          Back
        </Button>
      </div>

      <Card>
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 py-4">
          {`${patientName}'s Medical Record`}
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

              <div className="pt-2 border-t border-slate-200">
                <div className="text-sm text-slate-500 mb-1">Reason</div>
                <div className="text-slate-700">{appointment.reason}</div>
              </div>
            </div>
          </div>
        )}

        {/* Visit Information section */}

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4 ">
          <h3 className="text-sm font-semibold text-slate-900">
            Visit Information
          </h3>

          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-3 h-3" />
              <span className="text-sm">Visit:</span>
              <span className="font-medium text-slate-900">
                {DateTimeHelper.formatDateTime(new Date(dateTime))}
              </span>
            </div>

            <div className="pt-3  border-slate-200 flex items-center gap-2 text-sm">
              <FontAwesomeIcon
                icon={faUser}
                className="h-4 w-4 text-slate-900"
              />

              <span className="text-slate-600">Doctor:</span>

              <span className="font-semibold text-slate-900">{doctorName}</span>
            </div>
          </div>
        </div>

        {/* Staff Selection */}
        <label className="text-l font-medium text-gray-700 mb-2 block py-2">
          Assignees
        </label>
        <MultiStaffSelect
          staffList={staffList}
          selectedStaffIds={selectedStaffIds}
          onStaffChange={handleStaffChange}
        />

        <form onSubmit={handleSubmit} className=" gap-4 py-4 sm:grid-cols-2">
          <FormField label="Diagnosis">
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              required
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm
             focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </FormField>

          <FormField label="Symptoms">
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm
             focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </FormField>

          <FormField label="Medical prescriptions">
            <textarea
              name="prescriptions"
              value={formData.prescriptions}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm
             focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </FormField>

          <FormField label="Doctor's remarks">
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm
             focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </FormField>

          {(error || createMedicalRecordError || acupunctureError) && (
            <p className="text-md text-red-600 sm:col-span-2">
              {error || createMedicalRecordError || acupunctureError}
            </p>
          )}
          <span className="flex items-center gap-2 py-4">
            <Checkbox
              className="data-[state=checked]:bg-brand data-[state=checked]:text-white data-[state=checked]:border-0"
              checked={hasAcupuncture}
              onCheckedChange={(checked) => setHasAcupuncture(checked === true)}
            />
            <span>Have Acupuncture Point</span>
          </span>

          {/* Acupuncture Select Component */}
          {showAcupunctureSelect && (
            <div className="mt-8">
              <AcupunctureSelect
                selectedPoints={selectedAcupuncturePoints}
                onSelectedPointsChange={handleAcupuncturePointsChange}
                hideShell={true}
                hideSaveButton={true}
              />
            </div>
          )}

          <div className="sm:col-span-2 flex justify-end pt-4">
            {!hasAcupuncture ? (
              <Button
                type="submit"
                variant="primary"
                disabled={createMedicalRecordLoading || acupunctureLoading}
              >
                {createMedicalRecordLoading ? "Saving..." : "Save"}
              </Button>
            ) : !showAcupunctureSelect ? ( //TODO: implement this part to work with illness acupuncture too
              <Button
                type="button"
                variant="primary"
                disabled={createMedicalRecordLoading}
                onClick={() => setIsSelectSourceOpen(true)}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                disabled={createMedicalRecordLoading || acupunctureLoading}
              >
                {createMedicalRecordLoading || acupunctureLoading ? "Saving..." : "Save All"}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateMedicalRecord;
