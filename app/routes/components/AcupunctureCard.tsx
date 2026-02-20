import { Card } from "~/presentation/designSystem";
import { AcupunctureCardProps } from "~/domain/entities/AcupuncturePoint";

function AcupunctureCard({
  bodyPart,
  side,
  label,
  meridiansForView,
  visiblePoints,
  allPoints,
  selectedPoints,
  visibleMeridianIds,
  imageUrl,
  onPointClick,
  onMeridianToggle,
}: AcupunctureCardProps) {
  const isPointSelected = (acupunctureId: number): boolean => {
    const pointKey = `${bodyPart}-${side}-${acupunctureId}`;
    return selectedPoints.some((p) => p.key === pointKey);
  };
  return (
    <Card padding="sm">
      <p className="mb-2 text-sm font-medium text-slate-600">{label}</p>

      <div className="flex flex-row gap-4">
        <div className="relative h-96 w-full rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
          {imageUrl ? (
            <div className="relative h-full">
              {/* IMAGE */}
              <img
                key={imageUrl}
                src={imageUrl}
                alt={`${bodyPart} ${label}`}
                className="h-full object-contain"
              />

              {/* MARKER LAYER (same size as image) */}
              <div className="absolute inset-0">
                {visiblePoints.map((point) => {
                  const selected = isPointSelected(point.acupunctureId);

                  return (
                    <div
                      key={`${point.acupointCode}-${point.meridianId}`}
                      onClick={() => onPointClick(point)}
                      className={`absolute cursor-pointer transition-all
                        ${
                          selected
                            ? "bg-blue-500 ring-2 ring-blue-600"
                            : "bg-red-500 hover:bg-red-600"
                        }
                        rounded-full w-2 h-2
                        -translate-x-1/2 -translate-y-1/2
                      `}
                      style={{
                        left: `${point.pointLeft}%`,
                        top: `${point.pointTop}%`,
                      }}
                      title={`${point.acupointCode} - ${point.acupointName} (${point.meridianName})`}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-sm">
              No image available for this view
            </div>
          )}
        </div>

        {/* Meridian selection card */}
        {meridiansForView.length > 0 && (
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 w-1/5">
            <p className="mb-2 text-md font-semibold text-center">Meridian</p>
            <div className="flex flex-col gap-2">
              {meridiansForView.map((meridian) => {
                const isVisible = visibleMeridianIds.has(meridian.meridianId);
                const pointsForMeridian = allPoints.filter(
                  (p) => p.meridianId === meridian.meridianId,
                );
                const selectedCountForMeridian = selectedPoints.filter(
                  (p) => p.meridianId === meridian.meridianId,
                ).length;

                return (
                  <label key={meridian.meridianId}>
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => onMeridianToggle(meridian.meridianId)}
                      title={`${pointsForMeridian.length} points, ${selectedCountForMeridian} selected`}
                    ></input>

                    {meridian.meridianName}
                    {selectedCountForMeridian > 0 && !isVisible && (
                      <span className="ml-1 text-red-600">
                        ({selectedCountForMeridian})
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default AcupunctureCard;
