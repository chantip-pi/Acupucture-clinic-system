import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddIllness } from "~/presentation/hooks/illness/useAddIllness";
import { useAddIllnessAcupuncture } from "~/presentation/hooks/illnessAcupuncture/useAddIllnessAcupuncture";
import { useGetMeridianList } from "~/presentation/hooks/meridian/useGetMeridianList";
import { useGetMeridianRegion } from "~/presentation/hooks/meridian/useGetMeridianRegion";
import { useGetMeridianSidesByRegion } from "~/presentation/hooks/meridian/useGetMeridianSidesByRegion";
import { Button, Card, FormField, Input, Select, Table } from "~/presentation/designSystem";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmDialog from "./components/common/ConfirmDialog";
import { IllnessCategoryEnum, illnessCategoryOptions } from "~/domain/entities/IlllnessCategoryEnum";
import { AcupuncturePoint, SelectedPoint } from "~/domain/entities/AcupuncturePoint";
import MultiSelectDropdown from "./components/MultiSelectDropdown";
import RegionSideView from "./components/RegionSideView";

const CreateIllness = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);

    // Hooks for illness creation
    const { addIllness, loading: illnessLoading, error: illnessError } = useAddIllness();

    // Hooks for acupuncture selection
    const { meridians, loading: meridiansLoading } = useGetMeridianList();
    const { regions, loading: regionsLoading } = useGetMeridianRegion();
    const { addIllnessAcupuncture, loading: acupunctureLoading } = useAddIllnessAcupuncture();

    // Form state
    const [formData, setFormData] = useState<{
        Illness_name: string;
        description: string;
        category: IllnessCategoryEnum | "";
    }>({
        Illness_name: "",
        description: "",
        category: "",
    });

    // Acupuncture selection state
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedPoints, setSelectedPoints] = useState<SelectedPoint[]>([]);
    const [visibleMeridians, setVisibleMeridians] = useState<Record<string, Set<number>>>({});
    const [viewsByRegion, setViewsByRegion] = useState<Record<string, Record<string, boolean>>>({});

    const { sidesByRegion } = useGetMeridianSidesByRegion(selectedRegions);

    const loading = illnessLoading || meridiansLoading || regionsLoading || acupunctureLoading;

    const getRegionName = (regionObj: any): string | null => {
        if (typeof regionObj === "string") return regionObj;
        if (typeof regionObj?.region === "string") return regionObj.region;
        if (typeof regionObj?.regionName === "string") return regionObj.regionName;
        if (typeof regionObj?.name === "string") return regionObj.name;
        if (typeof regionObj?.value === "string") return regionObj.value;

        return null;
    };

    // Initialize visible meridians
    useEffect(() => {
        if (meridians.length > 0) {
            const initial: Record<string, Set<number>> = {};
            meridians.forEach((m) => {
                const key = `${m.region.toLowerCase()}-${m.side.toLowerCase()}`;
                if (!initial[key]) initial[key] = new Set();
                initial[key].add(m.meridianId);
            });
            setVisibleMeridians(initial);
        }
    }, [meridians]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const toggleRegion = (region: string) => {
        const normalized = region.toLowerCase();
        setSelectedRegions((prev) =>
            prev.includes(normalized)
                ? prev.filter((r) => r !== normalized)
                : [...prev, normalized]
        );
    };

    const toggleView = (region: string, side: string) => {
        setViewsByRegion((prev) => ({
            ...prev,
            [region]: {
                ...prev[region],
                [side]: !prev[region]?.[side],
            },
        }));
    };

    const toggleMeridianVisibility = (
        region: string,
        side: string,
        meridianId: number
    ) => {
        const key = `${region.toLowerCase()}-${side.toLowerCase()}`;
        setVisibleMeridians((prev) => {
            const newSet = new Set(prev[key] || []);
            if (newSet.has(meridianId)) {
                newSet.delete(meridianId);
            } else {
                newSet.add(meridianId);
            }
            return { ...prev, [key]: newSet };
        });
    };

    const handlePointClick = (
        point: AcupuncturePoint,
        region: string,
        side: string
    ) => {
        const pointKey = `${region}-${side}-${point.acupunctureId}`;
        const existingIndex = selectedPoints.findIndex((p) => p.key === pointKey);

        if (existingIndex >= 0) {
            setSelectedPoints(selectedPoints.filter((_, i) => i !== existingIndex));
        } else {
            setSelectedPoints([
                ...selectedPoints,
                {
                    ...point,
                    key: pointKey,
                },
            ]);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsOpen(true);
    };

    const submitToApi = async () => {
        try {
            // Step 1: Create the illness
            const result = await addIllness({
                illnessName: formData.Illness_name,
                description: formData.description,
                category: formData.category,
            });

            if (result.success) {
                const newIllnessId = result.success.illnessId;

                // Step 2: Add all selected acupuncture points
                if (selectedPoints.length > 0) {
                    for (const point of selectedPoints) {
                        await addIllnessAcupuncture({
                            illnessId: newIllnessId,
                            acupunctureId: point.acupunctureId,
                        });
                    }
                }

                // Navigate to the show page
                navigate("/IllnessAcupunctureShow", {
                    state: {
                        illnessId: newIllnessId,
                    },
                });
            } else {
                setError(result.error || "Failed to add illness");
                setIsOpen(false);
            }
        } catch (err) {
            setError("An error occurred while saving");
            setIsOpen(false);
        }
    };

    const handleCloseDialog = () => {
        setIsOpen(false);
    };

    return (
        <div className="p-8">
            <ConfirmDialog
                isOpen={isOpen}
                title={"Confirmation"}
                message={`Are you sure you want to save this illness${selectedPoints.length > 0 ? ` with ${selectedPoints.length} acupuncture point${selectedPoints.length !== 1 ? 's' : ''}` : ''} to the library?`}
                onConfirm={submitToApi}
                onCancel={handleCloseDialog}
            />

            {/* Back Button */}
            <div className="flex items-center gap-3 py-4">
                <Button size="sm" variant="back" onClick={() => navigate(-1)}>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </span>
                    Back
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Illness Information Card */}
                <Card>
                    <h2 className="text-xl font-semibold text-gray-800 py-4">
                        Add Illness Information
                    </h2>

                    <div className="space-y-4">
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
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
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
                    </div>

                    {/* Acupuncture Points Selection  */}

                    <h2 className="text-xl font-semibold text-gray-800 py-4">
                        Select Acupuncture Points (Optional)
                    </h2>

                    {meridiansLoading || regionsLoading ? (
                        <div className="py-8 text-center text-gray-500">
                            Loading acupuncture data...
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Region multi-select dropdown */}
                            <div className="mb-6">
                                <MultiSelectDropdown
                                    choices={regions}
                                    selectedChoices={selectedRegions}
                                    onToggleChoice={toggleRegion}
                                    getChoiceName={getRegionName}
                                    dropdownPlaceholder="body parts"
                                />
                            </div>

                            {/* Selected regions */}
                            {selectedRegions.map((region) => {
                                const sidesForRegion = sidesByRegion[region] || [];
                                return (
                                    <div key={region} className="space-y-4 border-t pt-4">
                                        <h3 className="text-lg font-medium text-gray-700">
                                            {region.charAt(0).toUpperCase() + region.slice(1)}
                                        </h3>

                                        {/* Side selector */}
                                        <div className="mb-4 flex flex-wrap gap-2">
                                            {sidesForRegion.map((side) => (
                                                <Button
                                                type="button"
                                                    key={side}
                                                    size="sm"
                                                    variant={
                                                        viewsByRegion[region]?.[side] ? "primary" : "secondary"
                                                    }
                                                    onClick={() => toggleView(region, side)}
                                                >
                                                    {side && typeof side === "string"
                                                        ? side.charAt(0).toUpperCase() + side.slice(1)
                                                        : ""}
                                                </Button>
                                            ))}
                                        </div>


                                        {/* Images with meridian selection */}
                                        <div className="flex flex-col gap-4">
                                            {sidesForRegion
                                                .filter((side) => viewsByRegion[region]?.[side])
                                                .map((side) => (
                                                    <div key={side} className="space-y-4">
                                                        <RegionSideView
                                                            region={region}
                                                            side={side}
                                                            selectedPoints={selectedPoints}
                                                            visibleMeridians={visibleMeridians}
                                                            handlePointClick={handlePointClick}
                                                            setSelectedPoints={setSelectedPoints}
                                                            toggleMeridianVisibility={toggleMeridianVisibility}
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Selected points indicator */}
                            {selectedPoints.length > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-blue-800 font-medium">
                                        {selectedPoints.length} Acupuncture point{selectedPoints.length !== 1 ? "s" : ""} selected
                                    </p>
                                </div>
                            )}

                            {/* All selected points summary table */}
                            {selectedPoints.length > 0 && (
                                <div>
                                    <h3 className="mb-3 text-lg font-semibold text-slate-900">
                                        All Selected Points
                                    </h3>
                                    <Table
                                        headers={[
                                            "Region",
                                            "Side",
                                            "Acupuncture Code",
                                            "Acupuncture Name",
                                            "Meridian",
                                            "Actions",
                                        ]}
                                    >
                                        {selectedPoints.map((point) => (
                                            <tr key={point.key} className="hover:bg-slate-50">
                                                <td className="px-4 py-2 text-sm text-slate-900">
                                                    {point.region && typeof point.region === "string"
                                                        ? point.region.charAt(0).toUpperCase() +
                                                        point.region.slice(1)
                                                        : ""}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-slate-600 capitalize">
                                                    {point.side && typeof point.side === "string"
                                                        ? point.side.charAt(0).toUpperCase() + point.side.slice(1)
                                                        : ""}
                                                </td>
                                                <td className="px-4 py-2 text-sm font-medium text-slate-900">
                                                    {point.acupointCode}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-slate-600">
                                                    {point.acupointName}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-slate-600">
                                                    {point.meridianName}
                                                </td>
                                                <td className="px-4 py-2 text-sm">
                                                    <button
                                                        onClick={() =>
                                                            setSelectedPoints(
                                                                selectedPoints.filter((p) => p.key !== point.key),
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </Table>
                                </div>
                            )}
                        </div>
                    )}

                          {/* Error Display */}
                {(error || illnessError) && (
                    <p className="text-md text-red-600">{error || illnessError}</p>
                )}

                {/* Submit Button */}
                <div className="flex justify-end py-8">
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </div>
                </Card>


          
            </form>
        </div>
    );
};

export default CreateIllness;