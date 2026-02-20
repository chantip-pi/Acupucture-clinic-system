import { AcupuncturePoint } from "~/domain/entities/AcupuncturePoint";
import { Card, Table } from "~/presentation/designSystem";
import { IMAGE_BASE_URL } from "~/constants/api";


type MeridianShowCardProps = {
    points: AcupuncturePoint[];
    imageBaseUrl?: string; // optional if images stored remotely
};

function MeridianShowCard({
    points,
    imageBaseUrl = IMAGE_BASE_URL + "/",
}: MeridianShowCardProps) {
    // 🧠 Group points by meridian
    const meridianMap = new Map<number, AcupuncturePoint[]>();

    points.forEach((p) => {
        if (!meridianMap.has(p.meridianId)) {
            meridianMap.set(p.meridianId, []);
        }
        meridianMap.get(p.meridianId)!.push(p);
    });

    return (
        <div className="grid grid-cols-2 gap-4 fade-in">
            {[...meridianMap.entries()].map(([meridianId, meridianPoints]) => {
                // Group by image view (region + side + image)
                const viewMap = new Map<string, AcupuncturePoint[]>();

                meridianPoints.forEach((p) => {
                    const key = `${p.region}-${p.side}-${p.image}`;
                    if (!viewMap.has(key)) viewMap.set(key, []);
                    viewMap.get(key)!.push(p);
                });

                return (
                    <Card className="" key={meridianId} padding="sm">
                        {/* Meridian Header */}

                        <div className="flex flex-wrap  gap-6 justify-center">
                            {[...viewMap.entries()].map(([viewKey, viewPoints]) => {
                                const sample = viewPoints[0];
                                const imageUrl = imageBaseUrl + sample.image;

                                return (
                                    <div
                                        key={viewKey}
                                        className="flex flex-col items-center"
                                    >
                                        {/* Region Label */}
                                        <h2 className="text-lg font-semibold text-slate-700 mb-4">
                                            {sample.region} – {sample.side}
                                        </h2>

                                        {/* Image + Markers */}
                                        <div className="relative h-96 w-ful rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
                                            <img
                                                src={imageUrl}
                                                alt={viewKey}
                                                className="h-full object-contain"
                                            />

                                            {/* Marker Layer */}
                                            <div className="absolute inset-0 z-10">
                                                {viewPoints.map((point) => (
                                                    <div
                                                        key={point.acupunctureId}
                                                        className="absolute w-2 h-2 rounded-full bg-teal-500
                                       -translate-x-1/2 -translate-y-1/2"
                                                        style={{
                                                            left: `${point.pointLeft}%`,
                                                            top: `${point.pointTop}%`,
                                                        }}
                                                        title={`${point.acupointCode} - ${point.acupointName}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Point List */}
                                        <div className="py-4">
                                            <Table
                                                headers={[
                                                    "Code",
                                                    "Name",
                                                ]}
                                            >
                                                {viewPoints.map((acupuncture) => (
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
                                                    </tr>
                                                ))}
                                            </Table>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}

export default MeridianShowCard;
