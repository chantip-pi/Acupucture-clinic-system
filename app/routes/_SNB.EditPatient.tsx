import React, { useEffect, useMemo, useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Card,
  FormField,
  Input,
  SectionHeading,
  Select,
} from "~/presentation/designSystem";
import { Patient } from "~/domain/entities/Patient";
import { useGetPatientById } from "~/presentation/hooks/patient/useGetPatientById";
import { useUpdatePatient } from "~/presentation/hooks/patient/useUpdatePatient";
import { useDeletePatient } from "~/presentation/hooks/patient/useDeletePatient";
import ErrorPage from "./components/common/ErrorPage";
import LoadingPage from "./components/common/LoadingPage";
import ConfirmDialog from "./components/common/ConfirmDialog";

function EditPatient() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDialog, setShowDialog] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { patientId } = (location.state as { patientId?: number } | null) || {};

  const { patient, loading, error } = useGetPatientById(patientId || null);
  const { updatePatient, loading: updateLoading, error: updateError } =
    useUpdatePatient();
  const { deletePatient, loading: deleteLoading, error: deleteError } = useDeletePatient();
  

  const [formData, setFormData] = useState({
    nameSurname: "",
    phoneNumber: "",
    birthday: "",
    gender: "",
    remainingCourse: 0,
    congenitalDisease: "",
    surgeryHistory: "",
  });

  useEffect(() => {
    if (patient && patient.patientId) {
      const formattedBirthday = patient.birthday.split("T")[0];

      setFormData({
        nameSurname: patient.nameSurname,
        phoneNumber: patient.phoneNumber,
        birthday: patient.birthday.split("T")[0],
        gender: patient.gender,
        remainingCourse: patient.remainingCourse,
        congenitalDisease: patient.congenitalDisease || "",
        surgeryHistory: patient.surgeryHistory || "",
      });
    }
  }, [patient]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "remainingCourse" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      if (!validateForm()) return;
  
      console.log("Form data being submitted:", formData);
  
      submitToApi();
    };
  
    const submitToApi = async () => {
      try {
        const dto = {
          patientId: patient!.patientId,
          ...formData,
        };
        const result = await updatePatient(dto);
        if (result.success) {
          console.log("Data successfully saved");
          navigate("/patientList");
        } else {
          setFormError(result.error || "Failed to save patient data.");
        }
      } catch (err) {
        setFormError("Error submitting data. Please try again.");
        console.error("Request error:", err);
      }
    };
  
    const validateForm = () => {
      const { phoneNumber, birthday } = formData;
      const telRegex = /^\d{10}$/;  
  
      if (!telRegex.test(phoneNumber)) {
        setFormError("Telephone number must be 10 digits.");
        return false;
      }
  
      const birthDate = new Date(birthday);
      const today = new Date();
      if (birthDate > today) {
        setFormError("Birthday cannot be in the future.");
        return false;
      }
  
      return true;
    };

  const handleDeletePatient = async () => {
    try {
      await deletePatient(patient!.patientId);
      navigate("/patientList");
    } catch (err) {
      setFormError("Error deleting patient. Please try again.");
    }
  };

  if (loading) return <LoadingPage />;
  if (error)
    return <ErrorPage message={error} onRetry={() => window.location.reload()} />;
  if (!patient)
    return <ErrorPage message="No patient found." />;

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <main className="flex-1 p-8">
        <Card>
          <div className="flex items-center justify-between">
            <SectionHeading title="Edit Patient" />
            <div className="flex items-center gap-3">
              <span className="text-brand text-lg font-semibold">
                {formData.nameSurname}
              </span>
              <Button
                type="button"
                variant="danger"
                size="sm"
                disabled={updateLoading || deleteLoading}
                onClick={() => setShowDialog(true)}
              >
                 Delete
              </Button>
            </div>
          </div>

          <ConfirmDialog
            isOpen={showDialog}
            title={`Delete ${formData.nameSurname}`}
            message="Do you really want to delete this patient?"
            cancelText="Cancel"
            isLoading={updateLoading}
            onConfirm={handleDeletePatient}
            onCancel={() => setShowDialog(false)}
          />

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <FormField label="Name Surname">
              <Input
                type="text"
                name="nameSurname"
                value={formData.nameSurname}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Phone Number">
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Birthday">
              <Input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Gender">
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </FormField>

            <FormField label="Congenital Disease">
              <Input
                type="text"
                name="congenitalDisease"
                value={formData.congenitalDisease}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Surgery History">
              <Input
                type="text"
                name="surgeryHistory"
                value={formData.surgeryHistory}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Remaining Course">
              <Input
                type="number"
                name="remainingCourse"
                value={formData.remainingCourse}
                onChange={handleChange}
                required
              />
            </FormField>

            {(formError || updateError) && (
              <p className="text-md text-red-600 sm:col-span-2">
                {formError || updateError}
              </p>
            )}

            <div className="sm:col-span-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={updateLoading}
              >
                {updateLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}

export default EditPatient;
