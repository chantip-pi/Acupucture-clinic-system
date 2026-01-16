import React, { useEffect, useMemo, useState } from "react";
import SideNavBar from "./_SNB";
import {
  Button,
  Card,
  InfoList,
  SectionHeading,
} from "~/presentation/designSystem";
import { useGetStaffByUsername } from "~/presentation/hooks/staff/useGetStaffByUsername";
import { getUserSession } from "~/presentation/session/userSession";
import { getSelectedStaffUsername, setSelectedStaffUsername } from "~/presentation/session/staffSelectionSession";
import ErrorPage from "./components/common/ErrorPage";
import LoadingPage from "./components/common/LoadingPage";
import { DateTimeHelper } from "~/domain/value-objects/DateOfBirth";
import { useNavigate } from "@remix-run/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";

function StaffDetail() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState<boolean>(false);
  const [isManager, setIsManager] = useState<boolean>(false);
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

    const selectedUsername = getSelectedStaffUsername();
    if (selectedUsername) {
      setUsername(selectedUsername);
    } else {
      setUsername(session.username);
    }

    setIsSessionLoaded(true);
  }, []);

  const { staff, loading, error } = useGetStaffByUsername(username);
  const errorMessage = useMemo(() => sessionError ?? error, [sessionError, error]);
  const age = useMemo(() => {
    if (!staff) return "";
    return String(DateTimeHelper.calculateAge(staff.birthday));
  }, [staff]);

  // While we haven't loaded the session on the client yet, keep UI consistent
  if (!isSessionLoaded) {
    return <LoadingPage />;
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
    return (
      <ErrorPage message={"No staff data found"} onRetry={() => window.location.reload()} />
    );
  };

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

  const ensureManager = (action: () => void) => {
    if (!isManager) {
      alert("You don't have access to this action.");
      return;
    }

    action();
  };

  const handleEditStaff = (username: string) => {
    ensureManager(() => {
      setSelectedStaffUsername(username);
      navigate("/editStaff");
    });
  };


  return (
    <div className="flex min-h-screen bg-surface-muted">

      <main className="flex-1 p-8">
        <Card>
        <div className="flex items-center justify-between">
          <SectionHeading title="Staff Details" />
          <div className="flex items-center gap-3">
              {isManager && (<Button
                variant="secondary"
                size="sm"
                onClick={() => handleEditStaff(staff.username)}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                  <FontAwesomeIcon icon={faPenToSquare} />
                </span>
                Edit
              </Button>)}
              </div>
              </div>
          <div className="mt-4">
            {loading && !errorMessage ? (
              <p>Loading...</p>
            ) : errorMessage ? (
              <p>{errorMessage}</p>
            ) : staff ? (
              <InfoList
                items={[
                  { label: "Username", value: staff.username },
                  { label: "Name Surname", value: staff.nameSurname },
                  { label: "Phone Number", value: staff.phoneNumber },
                  { label: "Age", value: age },
                  { label: "Gender", value: staff.gender },
                  { label: "Role", value: staff.title },
                  { label: "Email", value: staff.email },
                ]}
              />
            ) : (
              <p>No staff data available.</p>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}


export default StaffDetail;
