import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState, FormEvent } from "react";
import SideNavBar from "./_SNB";
import {
  Button,
  Card,
  FormField,
  Input,
  PageShell,
  SectionHeading,
  Select,
} from "~/presentation/designSystem";
import { useGetStaffByUsername } from "~/presentation/hooks/staff/useGetStaffByUsername";
import ErrorPage from "./components/common/ErrorPage";
import LoadingPage from "./components/common/LoadingPage";
import ConfirmDialog from "./components/common/ConfirmDialog";
import { useUpdateStaff } from "~/presentation/hooks/staff/useUpdateStaff";
import { useDeleteStaff } from "~/presentation/hooks/staff/useDeleteStaff";

import { Staff } from "~/domain/entities/Staff";
import { getStaffByUsernameUseCase } from "~/infrastructure/di/container";
import { getUserSession } from "~/presentation/session/userSession";

function EditStaff() {
  const navigate = useNavigate();
  const location = useLocation();

  // Load selected username based on navigation state after hydration
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);
  const [isManager, setIsManager] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const session = getUserSession();
    if (!session) {
      setIsLoggedIn(false);
      setIsManager(false);
      setIsSessionLoaded(true);
      return;
    }

    setIsLoggedIn(true);
    setIsManager(session.title?.toLowerCase() === "manager");
    
    const state = location.state as { username?: string } | null;
    const username = state?.username ?? session.username;
    setSelectedUsername(username);
    setIsSessionLoaded(true);
  }, []);

  const { staff, loading, error } = useGetStaffByUsername(selectedUsername);
  const { updateStaff, loading: updateLoading, error: updateError } =
    useUpdateStaff();
  const { deleteStaff, loading: deleteLoading, error: deleteError } =
    useDeleteStaff();

  const [formError, setFormError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    nameSurname: "",
    phoneNumber: "",
    birthday: "",
    gender: "",
    title: "",
    email: "",
  });

  // When staff data is loaded, populate the form
  useEffect(() => {
    if (staff && staff.staffId) {
      const formattedBirthday = staff.birthday.split("T")[0];

      setFormData({
        username: staff.username,
        nameSurname: staff.nameSurname,
        phoneNumber: staff.phoneNumber,
        birthday: formattedBirthday,
        gender: staff.gender,
        title: staff.title,
        email: staff.email,
      });
    }
  }, [staff]);

  // While we haven't loaded the session on the client yet, keep UI consistent
  if (!isSessionLoaded) {
    return <LoadingPage />;
  }

  // If user is not logged in, show access denied page without sidebar
  if (!isLoggedIn) {
    const handleGoBack = () => {
      window.history.back();
    };

    return (
      <div className="page-background" style={{ backgroundColor: "#DCE8E9", width: "100%", minHeight: "100vh", padding: "50px", boxSizing: "border-box", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <ErrorPage
          message="You don't have access to this page."
          onRetry={handleGoBack}
        />
      </div>
    );
  }

  // If user is not a manager, block access with error page without sidebar
  if (!isManager) {
    const handleGoBack = () => {
      window.history.back();
    };

    return (
      <div className="page-background" style={{ backgroundColor: "#DCE8E9", width: "100%", minHeight: "100vh", padding: "50px", boxSizing: "border-box", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <ErrorPage
          message="You don't have access to this page."
          onRetry={handleGoBack}
        />
      </div>
    );
  }

  // If no staff is selected or user has no permission, block access
  if (!selectedUsername || selectedUsername.toLowerCase() === "guest") {
    return <ErrorPage message="No staff selected or no permission." />;
  }

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <ErrorPage message={error} onRetry={() => window.location.reload()} />
    );
  }

  if (!staff) {
    return <ErrorPage message="No staff selected or staff not found." />;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const formattedValue =
      name === "gender"
        ? value.charAt(0).toUpperCase() + value.slice(1)
        : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

  const checkUsernameAvailability = async () => {
    try {
      // If username hasn't changed, it's always valid
      if (formData.username === staff.username) {
        return true;
      }

      // Check if another staff member already uses this username
      try {
        const existingStaff: Staff | null =
          await getStaffByUsernameUseCase.execute(formData.username);

        if (existingStaff && existingStaff.staffId !== staff.staffId) {
          setFormError(
            "Username already taken. Please choose another username.",
          );
          return false;
        }

        return true;
      } catch {
        // If lookup fails (e.g. user not found), treat as available
        return true;
      }
    } catch (error) {
      setFormError("Error checking username availability. Please try again.");
      console.error(error);
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const isUsernameAvailable = await checkUsernameAvailability();
    if (!isUsernameAvailable) return;

    console.log("Form data being submitted:", formData);

    submitToApi();
  };

  const submitToApi = async () => {
    try {
      // Prepare DTO for update
      const dto = {
        staffId: staff.staffId,
        password: staff.password,
        ...formData,
      };
      const result = await updateStaff(dto);
      if (result.success) {
        console.log("Data successfully saved");
        navigate("/staffListView");
      } else {
        setFormError(result.error || "Failed to save staff data.");
      }
    } catch (err) {
      setFormError("Error submitting data. Please try again.");
      console.error("Request error:", err);
    }
  };

  const validateForm = () => {
    const { phoneNumber, birthday, email } = formData;
    const telRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setFormError("Your email is not the right pattern.");
      return false;
    }

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

  const handleDeleteUser = async () => {
    try {
      await deleteStaff(staff.staffId);
      navigate("/staffListView");
    } catch (err) {
      setFormError("Error deleting staff. Please try again.");
    }
  };

  return (
    <PageShell className="p-8">
        <Card className="w-full">
          <div className="flex items-center justify-between">
            <SectionHeading title="Edit Staff" />
            <div className="flex items-center gap-3">
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
            message="Do you really want to delete this user?"
            cancelText="Cancel"
            isLoading={updateLoading}
            onConfirm={handleDeleteUser}
            onCancel={() => setShowDialog(false)}
          />

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <FormField label="Username">
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Name">
              <Input
                type="text"
                id="nameSurname"
                name="nameSurname"
                value={formData.nameSurname}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Phone number">
              <Input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Birthday">
              <Input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Gender">
              <Select
                id="gender"
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

            <FormField label="Role">
              <Select
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="Staff">Staff</option>
                <option value="Doctor">Doctor</option>
              </Select>
            </FormField>

            <FormField label="Email">
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
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
      </PageShell>
  );
}

export default EditStaff;
