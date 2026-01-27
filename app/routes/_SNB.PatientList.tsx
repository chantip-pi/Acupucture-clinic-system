import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import SideNavBar from "./_SNB";
import {
  Button,
  Card,
  Input,
  SectionHeading,
  Table,
} from "~/presentation/designSystem";
import { useGetPatientList } from "~/presentation/hooks/patient/useGetPatientList";
import { Patient } from "~/domain/entities/Patient";
import { DateTimeHelper } from "~/domain/value-objects/DateOfBirth";
import { DateOfBirth } from "~/domain/value-objects/DateOfBirth";
import ErrorPage from "./components/common/ErrorPage";
import LoadingPage from "./components/common/LoadingPage";
import { safeSessionSet } from "~/presentation/session/storageUtils";

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const { patients: patientList, loading, error } = useGetPatientList();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePatientDetail = (patientId: number) => {
    safeSessionSet("currentPatientID", JSON.stringify(patientId));
    navigate("/patientDetail");
  };


  const handleAddPatient = () => {
    navigate("/addPatient");
  };

  const filteredPatients = useMemo(() => {
    return patientList.filter((patient) =>
      patient.nameSurname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phoneNumber.includes(searchTerm) ||
      patient.patientId.toString().includes(searchTerm)
    );
  }, [patientList, searchTerm]);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <ErrorPage message={error} onRetry={() => window.location.reload()} />
    );
  }
  if (!patientList) {
    return (
      <ErrorPage message={"No patient data found"} onRetry={() => window.location.reload()} />
    );
  };

  return (
    <div className="flex min-h-screen bg-surface-muted">
  
      <main className="flex-1 p-8">
        <Card>
          <div className="flex items-center justify-between">
            <SectionHeading title="Patient List" />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddPatient}
              className="flex items-center gap-2"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                <FontAwesomeIcon icon={faUserPlus} />
              </span>
              Add Patient
            </Button>
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

          <Table
            headers={[
              // "Patient ID",
              "Name Surname",
              "Age",
              "Gender",
              "Phone Number",
              "",
            ]}
          >
            {filteredPatients.map((patient: Patient) => (
              <tr
                key={patient.patientId}
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => handlePatientDetail(patient.patientId)}
              >
                {/* <td className="px-4 py-3 text-md text-slate-900">{patient.patientId}</td> */}
                <td className="px-4 py-3 text-md text-slate-900">{patient.nameSurname}</td>
                <td className="px-4 py-3 text-md text-slate-900">
                  {DateTimeHelper.calculateAge(patient.birthday)}
                </td>
                <td className="px-4 py-3 text-md text-slate-900">{patient.gender}</td>
                <td className="px-4 py-3 text-md text-slate-900">{patient.phoneNumber}</td>
                <td className="px-4 py-3">
                  {/* TODO: ทำให้ปุ่มหายไปถ้าคนไข้มี appointment อยู่แล้ว */}
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handlePatientDetail(patient.patientId)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      </main>
    </div>
  );
};

export default PatientList;
