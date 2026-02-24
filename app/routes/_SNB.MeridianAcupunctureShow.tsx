import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    PageShell,
    SectionHeading,
    Card,
    Table,
    Button,
} from "~/presentation/designSystem";
import { useGetAcupunctureList } from "~/presentation/hooks/acupuncture/useGetAcupunctureList";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ErrorPage from "./components/common/ErrorPage";
import LoadingPage from "./components/common/LoadingPage";
import { useGetMeridianById } from "~/presentation/hooks/meridian/useGetMeridianById";
import { useGetAcupunctureByMeridianName } from "~/presentation/hooks/acupuncture/useGetAcupunctureByMeridianName";
import MeridianShowCard from "./components/meridian/MeridianShowCard";
import { useGetMeridianRegion } from "~/presentation/hooks/meridian/useGetMeridianRegion";
import { useGetMeridianSidesByRegion } from "~/presentation/hooks/meridian/useGetMeridianSidesByRegion";

function MeridianAcupunctureShow() {
    const { state } = useLocation();
    const location = useLocation();
    const navigate = useNavigate();

    const meridianName = location.state?.meridianName;

    if (!meridianName) {
        return (
            <ErrorPage
                message="No meridian data found"
                onRetry={() => navigate("/meridianLibrary")}
            />
        );
    }

    const {
        acupunctures = [],
        loading: meridianAcupunctureLoading,
    } = useGetAcupunctureByMeridianName(meridianName);

    // Loading
    if (meridianAcupunctureLoading) {
        return <LoadingPage />;
    }

    return (
        <PageShell className="p-8">
            <div className="flex items-center gap-3 py-4">
                <Button size="sm" variant="back" onClick={() => navigate('/meridianLibrary')}>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </span>
                    Back
                </Button>
            </div>

            <Card>
                <SectionHeading title={meridianName} />
                {/* All acupunctures summary table */}
                {acupunctures.length > 0 && (
                    <div className="mt-6">
                        <h3 className="mb-3 text-lg font-semibold text-slate-900">
                            Acupuncture Points
                        </h3>
                        <Table
                            headers={[
                                "Code",
                                "Name",
                                "Region",
                                "Side",
                            ]}
                        >
                            {acupunctures.map((acupuncture) => (
                                <tr
                                    key={`${acupuncture.region}-${acupuncture.side}-${acupuncture.acupunctureId}`}
                                    className="hover:bg-slate-50"
                                >
                                    <td className="px-4 py-2 text-sm font-medium text-slate-900">
                                        {acupuncture.acupointCode}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-slate-600">
                                        {acupuncture.acupointName}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-slate-900">
                                        {acupuncture.region && typeof acupuncture.region === "string"
                                            ? acupuncture.region.charAt(0).toUpperCase() +
                                            acupuncture.region.slice(1)
                                            : ""}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-slate-600 capitalize">
                                        {acupuncture.side && typeof acupuncture.side === "string"
                                            ? acupuncture.side.charAt(0).toUpperCase() + acupuncture.side.slice(1)
                                            : ""}
                                    </td>
                                </tr>
                            ))}
                        </Table>
                        <div className="py-4">
                            <MeridianShowCard points={acupunctures} />
                        </div>
                    </div>
                )}
            </Card>
        </PageShell>
    );
}

export default MeridianAcupunctureShow;
