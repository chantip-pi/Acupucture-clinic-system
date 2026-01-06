import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "@remix-run/react";
import { useAddPatient } from "~/presentation/hooks/patient/useAddPatient";

function AddPatient() {
  const [formData, setFormData] = useState({
    nameSurname: "",
    phoneNumber: "",
    birthday: "",
    gender: "",
    appointmentDate: "",
    remainingCourse: 0,
    firstVistDate: new Date().toISOString().slice(0, 10),
  });
  const { addPatient, loading, error: hookError } = useAddPatient();
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "remainingCourse" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.appointmentDate) {
      setError("You need to provide an appointment date.");
      return;
    }

    const result = await addPatient({
      nameSurname: formData.nameSurname,
      phoneNumber: formData.phoneNumber,
      birthday: formData.birthday,
      gender: formData.gender,
      // appointmentDate: new Date(formData.appointmentDate).toISOString(),
      remainingCourse: formData.remainingCourse,
      // firstVistDate: formData.firstVistDate,
    });

    if (result.success) {
      navigate("/patientList");
    } else {
      setError(result.error || "Failed to add patient");
    }
  };

  return (
    <div className="flex flex-row w-[78svw]">
      <div className="flex flex-row justify-center items-start w-[75svw] h-screen pt-10 pb-7 ">
        <div className="p-6 border border-gray-300 h-[90svh] rounded-3xl bg-white shadow-lg w-[40svw]">
          <div className="flex flex-row justify-between mb-6">
            <h1 className="text-[#1FA1AF] text-2xl">Add New Patient</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="nameSurname" className="block mb-1">
                Name Surname:
              </label>
              <input
                type="text"
                id="nameSurname"
                name="nameSurname"
                value={formData.nameSurname}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-300 text-md rounded-3xl"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block mb-1">
                Telephone:
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-300 text-md rounded-3xl"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="birthday" className="block mb-1">
                Birthday:
              </label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-300 text-md rounded-3xl"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="gender" className="block mb-1">
                Gender:
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-300 text-md rounded-3xl"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="appointmentDate" className="block mb-1">
                Appointment Date & Time:
              </label>
              <input
                type="datetime-local"
                id="appointmentDate"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-300 text-md rounded-3xl"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="remainingCourse" className="block mb-1">
                Course Count:
              </label>
              <input
                type="number"
                id="remainingCourse"
                name="remainingCourse"
                value={formData.remainingCourse}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-300 text-md rounded-3xl"
                required
              />
            </div>

            {(error || hookError) && <p className="text-red-500">{error || hookError}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-36 py-2 bg-[#1FA1AF] text-white font-bold rounded-lg disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPatient;
