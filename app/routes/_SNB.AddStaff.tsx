import { useNavigate } from "@remix-run/react";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Button,
  Card,
  FormField,
  Input,
  PageShell,
  SectionHeading,
  Select,
} from "~/presentation/designSystem";
import { useAddStaff } from "~/presentation/hooks/staff/useAddStaff";
import { getUserSession } from "~/presentation/session/userSession";
import ErrorPage from "./components/common/ErrorPage";
import LoadingPage from "./components/common/LoadingPage";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    nameSurname: "",
    phoneNumber: "",
    birthday: "",
    gender: "",
    title: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { addStaff, loading, error: hookError } = useAddStaff();
  const [error, setError] = useState<string>("");
  const [isSessionLoaded, setIsSessionLoaded] = useState<boolean>(false);
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
    setIsSessionLoaded(true);
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { phoneNumber, birthday, email, password, confirmPassword } =
      formData;
    const telRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Your email is not in the correct format.");
      return false;
    }

    if (!telRegex.test(phoneNumber)) {
      setError("Telephone number must be 10 digits.");
      return false;
    }

    const birthDate = new Date(birthday);
    const today = new Date();
    if (birthDate > today) {
      setError("Birthday cannot be in the future.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return false;
    }

    return true;
  };

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formattedGender =
      formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1);

    const dataToSubmit = {
      ...formData,
      gender: formattedGender,
    };

    const result = await addStaff({
      nameSurname: formData.nameSurname,
      phoneNumber: formData.phoneNumber,
      birthday: formData.birthday,
      gender: formData.gender,
      title: formData.title,
      email: formData.email,
      password: formData.password,
      username: formData.username,
    });

    if (result.success) {
      navigate("/staffListView");
    } else {
      setError(result.error || "Failed to add staff");
    }
  };

  return (
    <PageShell className="p-8">
        <Card className="w-full">
          <SectionHeading title="Add New staff" />
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 fade-in">
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
                type="tel"
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

            <div className="sm:col-span-1">
              <FormField label="Password">
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </FormField>
            </div>

            <div className="sm:col-span-1">
              <FormField label="Confirm Password">
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </FormField>
            </div>

            {error && <p className="text-md text-red-600 sm:col-span-2">{error}</p>}

            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" variant="primary">
                Sign Up
              </Button>
            </div>
          </form>
        </Card>
      </PageShell>
  );
}

export default SignUp;
