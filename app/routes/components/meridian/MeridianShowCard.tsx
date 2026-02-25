import { AcupuncturePoint } from "~/domain/entities/AcupuncturePoint";
import { Card, Table } from "~/presentation/designSystem";
import { IMAGE_BASE_URL } from "~/constants/api";

type MeridianShowCardProps = {
  points: AcupuncturePoint[];
  imageBaseUrl?: string;
};

function MeridianShowCard({
  points,
  imageBaseUrl = IMAGE_BASE_URL + "/",
}: MeridianShowCardProps) {
  const viewMap = new Map<string, AcupuncturePoint[]>();

  points.forEach((p) => {
    const region = p.region?.trim().toLowerCase();
    const side = p.side?.trim().toLowerCase();

    const key = `${region}-${side}`;

    if (!viewMap.has(key)) viewMap.set(key, []);
    viewMap.get(key)!.push(p);
  });

  return (
    <div className="grid grid-cols-2 gap-4 fade-in">
      {[...viewMap.entries()].map(([viewKey, viewPoints]) => {
        const sample = viewPoints[0];
        const imageUrl = imageBaseUrl + sample.image;

        const sortedPoints = [...viewPoints].sort((a, b) =>
          a.acupointCode.localeCompare(b.acupointCode, undefined, {
            numeric: true,
            sensitivity: "base",
          }),
        );

        return (
          <Card key={viewKey} padding="sm">
            <div className="flex flex-col items-center">
              {/* Region Label */}
              <h2 className="text-lg font-semibold text-slate-700 mb-4">
                {sample.region} – {sample.side}
              </h2>

              {/* Image + Markers */}
              <div className="relative h-96 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
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
                <Table headers={["Code", "Name"]}>
                  {sortedPoints.map((acupuncture) => (
                    <tr
                      key={acupuncture.acupunctureId}
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
          </Card>
        );
      })}
    </div>
  );
}

export default MeridianShowCard;
