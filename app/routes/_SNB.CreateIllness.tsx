import React, { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorPage from "./components/common/ErrorPage";
import { useGetStaffList } from "~/presentation/hooks/staff/useGetStaffList";
import { useGetAppointmentById } from "~/presentation/hooks/appointment/useGetAppointmentById";
import { Button, Card, FormField, Input, Select } from "~/presentation/designSystem";
import { Calendar } from "lucide-react";
import { DateTimeHelper } from "~/domain/value-objects/DateOfBirth";
import { faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MultiStaffSelect from "./components/medicalRecord/MultiStaffSelect";
import { useCreateMedicalRecord } from "~/presentation/hooks/medicalRecord/useCreateMedicalRecord";
import { Checkbox } from "app/components/ui/checkbox"
import SelectAcupunctureSourceDialog from "./components/medicalRecord/SelectAcupunctureSourceDialog";
import { useAddIllness } from "~/presentation/hooks/illness/useAddIllness";
import ConfirmDialog from "./components/common/ConfirmDialog";
import { IllnessCategoryEnum, illnessCategoryOptions } from "~/domain/entities/IlllnessCategoryEnum";

const CreateIllness = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);
    const [error, setError] = useState<string>("");
    const [hasAcupuncture, setHasAcupuncture] = useState(false);
    const [isOpen, setIsOpen] = useState(false);




    const { staffs: staffList } = useGetStaffList();
    const { addIllness, loading, error: hookError } = useAddIllness();


    const [formData, setFormData] = useState<{
        Illness_name: string;
        description: string;
        category: IllnessCategoryEnum | "";
    }>({
        Illness_name: "",
        description: "",
        category: "",
    });





    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("Form data being submitted:", formData);
        setIsOpen(true);
    };

    const submitToApi = async () => {
        const result = await addIllness({
            illnessName: formData.Illness_name,
            description: formData.description,
            category: formData.category
        });

        if (result.success) {
            navigate("/IllnessAcupunctureShow");
        } else {
            setError(result.error || "Failed to add illness");
        }
    };


    const handleCloseDialog = () => {
        setIsOpen(false);
    }

    return (
        <div className="p-8">

            <ConfirmDialog
                isOpen={isOpen}
                title={"Confirmation"}
                message={"Are you sure you want to save this illness to the library?"}
                onConfirm={submitToApi}
                onCancel={handleCloseDialog} />
            {/* Actions */}
            <div className="flex items-center gap-3 py-4">

                <Button
                    size="sm"
                    variant="back"
                    onClick={() => navigate(-1)}
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full ">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </span>
                    Back
                </Button>
            </div>

            <Card>

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-800 py-4">
                    Add illness information
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className=" gap-4 py-4 sm:grid-cols-2"
                >
                    <FormField label="Illness name">
                        <Input
                            type="text"
                            id="Illness_name"
                            name="Illness_name"
                            value={formData.Illness_name}
                            onChange={handleChange}
                            required
                        />
                    </FormField>
                    <FormField label="Description">

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm
             focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                        />

                    </FormField>

                    <FormField label="Category">
                        <Select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>

                            {illnessCategoryOptions.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </Select>

                    </FormField>

                    {(error || hookError) && (
                        <p className="text-md text-red-600 sm:col-span-2">
                            {error || hookError}
                        </p>
                    )}

                    <div className="sm:col-span-2 flex justify-end">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>

    );
};

export default CreateIllness;
