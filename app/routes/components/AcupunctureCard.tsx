import { Card } from "~/presentation/designSystem";
import { AcupunctureCardProps } from "~/domain/entities/AcupuncturePoint";

function AcupunctureCard({
  bodyPart,
  side,
  label,
  visiblePoints,
  selectedPoints,
  imageUrl,
  onPointClick,
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
      </div>
    </Card>
  );
}

export default AcupunctureCard;
