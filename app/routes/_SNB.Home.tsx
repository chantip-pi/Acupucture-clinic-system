import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "@remix-run/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Button,
  Card,
  Input,
  SectionHeading,
  Table,
} from "~/presentation/designSystem";
import { useGetAppointmentList } from "~/presentation/hooks/appointment/useGetAppointmentList";
import { Appointment } from "~/domain/entities/Appointment";
import { DateTimeHelper } from "~/domain/value-objects/DateOfBirth";
import ErrorPage from "./components/common/ErrorPage";
import LoadingPage from "./components/common/LoadingPage";

const AppointmentList: React.FC = () => {
  const navigate = useNavigate();
  const { appointments: appointmentList, loading, error } = useGetAppointmentList();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [specificDate, setSpecificDate] = useState<Date | null>(null);
  const [monthFilter, setMonthFilter] = useState<Date | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleDateFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilter(e.target.value);
    if (e.target.value !== "specific" && e.target.value !== "month") {
      setSpecificDate(null); // Clear specific date when switching to other filters
      setMonthFilter(null); // Clear month filter when switching to other filters
    }
  };

  const handleSpecificDateChange = (date: Date | null) => {
    setSpecificDate(date);
    if (date) {
      setDateFilter("specific"); // Automatically switch to specific date filter
      setMonthFilter(null); // Clear month filter
    }
  };

  const handleMonthFilterChange = (date: Date | null) => {
    setMonthFilter(date);
    if (date) {
      setDateFilter("month"); // Automatically switch to month filter
      setSpecificDate(null); // Clear specific date
    }
  };

  const handleAppointmentDetail = (appointmentId: number) => {
    sessionStorage.setItem("currentAppointmentID", JSON.stringify(appointmentId));
    navigate("/appointmentDetail");
  };

  const handleAddAppointment = () => {
    navigate("/addAppointment");
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
      case "confirmed":
        return "text-blue-600 bg-blue-50 px-2 py-1 rounded";
      case "completed":
        return "text-green-600 bg-green-50 px-2 py-1 rounded";
      case "canceled":
        return "text-red-600 bg-red-50 px-2 py-1 rounded";
      case "no-show":
        return "text-gray-600 bg-gray-50 px-2 py-1 rounded";
      default:
        return "text-slate-600 bg-slate-50 px-2 py-1 rounded";
    }
  };

  const filterByDate = (appointment: Appointment) => {
    if (dateFilter === "all") return true;
    
    const appointmentDate = new Date(appointment.appointmentDateTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (dateFilter) {
      case "today":
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        return appointmentDate >= today && appointmentDate <= todayEnd;
      case "upcoming":
        return appointmentDate >= today;
      case "past":
        return appointmentDate < today;
      case "specific":
        if (!specificDate) return true;
        const selectedDate = new Date(specificDate);
        selectedDate.setHours(0, 0, 0, 0);
        const selectedDateEnd = new Date(selectedDate);
        selectedDateEnd.setHours(23, 59, 59, 999);
        return appointmentDate >= selectedDate && appointmentDate <= selectedDateEnd;
      case "month":
        if (!monthFilter) return true;
        const selectedMonth = new Date(monthFilter);
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth() + 1;
        const monthStart = new Date(year, month - 1, 1);
        const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);
        return appointmentDate >= monthStart && appointmentDate <= monthEnd;
      default:
        return true;
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointmentList.filter((appointment) => {
      const matchesSearch = 
        appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.appointmentId?.toString().includes(searchTerm);
      
      const matchesStatus = 
        statusFilter === "all" || 
        appointment.status?.toLowerCase() === statusFilter.toLowerCase();
      
      const matchesDate = filterByDate(appointment);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointmentList, searchTerm, statusFilter, dateFilter, specificDate, monthFilter]);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <ErrorPage message={error} onRetry={() => window.location.reload()} />
    );
  }

  if (!appointmentList) {
    return (
      <ErrorPage message={"No appointment data found"} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-muted">
      
      <main className="flex-1 p-8">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <SectionHeading title="Appointment List" />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddAppointment}
              className="flex items-center gap-2"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                <FontAwesomeIcon icon={faCalendarPlus} />
              </span>
              Add Appointment
            </Button>
          </div>

          <div className="mb-4 flex gap-4 items-end">
            <div className="w-80">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Search
              </label>
              <Input
                type="text"
                placeholder="Search by patient or doctor name..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="w-48">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="canceled">Cancelled</option>
              </select>
            </div>

            <div className="w-48">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date
              </label>
              <select
                value={dateFilter}
                onChange={handleDateFilter}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="specific">Specific Date</option>
                <option value="month">By Month</option>
              </select>
            </div>

            {dateFilter === "specific" && (
              <div className="w-48">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Select Date
                </label>
                <DatePicker
                  selected={specificDate}
                  onChange={handleSpecificDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:border-brand focus:ring-2 focus:ring-brand/40 focus:outline-none"
                  placeholderText="Select a date"
                  isClearable
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                />
              </div>
            )}

            {dateFilter === "month" && (
              <div className="w-48">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Select Month
                </label>
                <DatePicker
                  selected={monthFilter}
                  onChange={handleMonthFilterChange}
                  dateFormat="MMMM yyyy"
                  showMonthYearPicker
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:border-brand focus:ring-2 focus:ring-brand/40 focus:outline-none"
                  placeholderText="Select a month"
                  isClearable
                />
              </div>
            )}
          </div>

          <div className="mb-2 text-sm text-slate-600">
            Showing {filteredAppointments.length} of {appointmentList.length} appointments
          </div>

          <Table
            headers={[
              "Patient Name",
              "Date & Time",
              "Doctor Name",
              "Reason",
              "Status",
              "",
            ]}
          >
            {filteredAppointments.map((appointment: Appointment) => (
              <tr
                key={appointment.appointmentId}
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => handleAppointmentDetail(appointment.appointmentId)}
              >
                <td className="px-4 py-3 text-md text-slate-900 font-medium">
                  {appointment.patientName}
                </td>
                <td className="px-4 py-3 text-md text-slate-900">
                  {DateTimeHelper.formatDateTime(appointment.appointmentDateTime,'EEEE, d MMMM yyyy HH:mm')}
                </td>
                <td className="px-4 py-3 text-md text-slate-900">
                  {appointment.doctorName}
                </td>
                <td className="px-4 py-3 text-md text-slate-700">
                  {appointment.reason || "-"}
                </td>
                <td className="px-4 py-3 text-md">
                  <span className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAppointmentDetail(appointment.appointmentId);
                    }}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </Table>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No appointments found matching your filters
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default AppointmentList;