import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import SideNavBar from "./_SNB";
import { useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import {
  Button,
  Card,
  Input,
  SectionHeading,
  Table,
} from "~/presentation/designSystem";
import { DateTimeHelper } from "~/domain/value-objects/DateOfBirth";
import { useGetStaffList } from "~/presentation/hooks/staff/useGetStaffList";
import { Staff } from "~/domain/entities/Staff";
import { getUserSession } from "~/presentation/session/userSession";
import { setSelectedStaffUsername } from "~/presentation/session/staffSelectionSession";
import ErrorPage from "~/routes/components/common/ErrorPage";
import LoadingPage from "./components/common/LoadingPage";
import { DateOfBirth } from "~/domain/value-objects/DateOfBirth";

const StaffListView: React.FC = () => {
  const { staffList, loading, error } = useGetStaffList();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isManager, setIsManager] = useState<boolean>(false);
  const [hasCheckedSession, setHasCheckedSession] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const session = getUserSession();
    if (!session) {
      setIsLoggedIn(false);
      setIsManager(false);
      setHasCheckedSession(true);
      return;
    }

    setIsLoggedIn(true);
    setIsManager(session.title?.toLowerCase() === "manager");
    setHasCheckedSession(true);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getStaffName = (staff: Staff): string => {
    return staff.nameSurname || (staff as unknown as { staff_name?: string }).staff_name || "";
  };

  const filteredStaff = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return staffList;

    return staffList.filter((staff) => {
      const name = getStaffName(staff).toLowerCase();
      const phoneMatch = staff.phoneNumber.includes(searchTerm);
      const idMatch = staff.staffId.toString().includes(searchTerm);
      const usernameMatch = staff.username.toLowerCase().includes(term);
      return name.includes(term) || phoneMatch || idMatch || usernameMatch;
    });
  }, [staffList, searchTerm]);

  const ensureManager = (action: () => void) => {
    if (!isManager) {
      alert("You don't have access to this action.");
      return;
    }

    action();
  };


  const handleAddNewStaff = () => {
    ensureManager(() => {
      navigate("/addStaff");
    });
  };

  const handleClickList = (username: string) => {
    setSelectedStaffUsername(username);
    navigate("/staffDetail");
  };
  // If we haven't checked the session yet, show loading
  if (!hasCheckedSession) {
    return (
      <div className="flex min-h-screen bg-surface-muted">
    
        <div className="flex-1 p-8">
          <LoadingPage />
        </div>
      </div>
    );
  }

  // If user is not logged in at all, show a standalone access-denied page
  if (!isLoggedIn) {
    const handleGoBack = () => {
      window.history.back();
    };

    return (
      <div className="flex min-h-screen bg-surface-muted">
    
        <div className="flex-1 p-8">
          <ErrorPage
            message="You don't have access to this page."
            onRetry={handleGoBack}
          />
        </div>
      </div>
    );
  }

  // If user is not a manager, show an access-denied error page with a back button
  

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <main className="flex-1 p-8">
        <Card>
          <div className="flex items-center justify-between">
            <SectionHeading title="Staff List" />
            {isManager && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAddNewStaff}
                className="flex items-center gap-2"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                  <FontAwesomeIcon icon={faUserPlus} />
                </span>
                Add Staff
              </Button>
            )}
          </div>

          <div className="mb-4 flex justify-start">
            <div className="w-80">
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          {loading ? (
            <LoadingPage />
          ) : error ? (
            <ErrorPage message={error} />
          ) : (
            <Table
              headers={[
                "Username",
                "Name",
                "Age",
                "Gender",
                "Role",
                "Phone Number",
                "Email",
                ...(isManager ? [""] : []),
              ]}
            >
              {filteredStaff.map((staff) => (
                <tr
                  key={staff.staffId}
                  className="cursor-pointer hover:bg-slate-50"
                >
                  <td
                    className="px-4 py-3 text-md text-slate-900"
                    onClick={() => handleClickList(staff.username)}
                  >
                    {staff.username}
                  </td>
                  <td
                    className="px-4 py-3 text-md text-slate-900"
                    onClick={() => handleClickList(staff.username)}
                  >
                    {getStaffName(staff)}
                  </td>
                  <td
                    className="px-4 py-3 text-md text-slate-900"
                    onClick={() => handleClickList(staff.username)}
                  >
                    {DateTimeHelper.calculateAge(staff.birthday)}
                  </td>
                  <td
                    className="px-4 py-3 text-md text-slate-900"
                    onClick={() => handleClickList(staff.username)}
                  >
                    {staff.gender}
                  </td>
                  <td
                    className="px-4 py-3 text-md text-slate-900"
                    onClick={() => handleClickList(staff.username)}
                  >
                    {staff.title}
                  </td>
                  <td
                    className="px-4 py-3 text-md text-slate-900"
                    onClick={() => handleClickList(staff.username)}
                  >
                    {staff.phoneNumber}
                  </td>
                  <td
                    className="px-4 py-3 text-md text-slate-900"
                    onClick={() => handleClickList(staff.username)}
                  >
                    {staff.email}
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      </main>
    </div>
  );
};

export default StaffListView;
