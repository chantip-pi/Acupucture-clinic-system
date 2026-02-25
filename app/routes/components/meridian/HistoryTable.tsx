import React, { useMemo } from "react";
import { Table } from "~/presentation/designSystem";
import { CustomMarker } from "~/domain/entities/CustomMarker";

interface HistoryTableProps {
  markers: CustomMarker[];
  setMarkers: (markers: CustomMarker[]) => void;
}

function HistoryTable({ markers, setMarkers }: HistoryTableProps) {
  const handleMarkerDelete = (id: string | number) => {
    setMarkers(
      markers.filter((marker) =>
        marker.acupointCode
          ? marker.acupointCode !== id
          : marker.acupointName !== id,
      ),
    );
  };

  const sortedMarkers = useMemo(() => {
    return [...markers].sort((a, b) => {
      const codeA = a.acupointCode ?? "";
      const codeB = b.acupointCode ?? "";

      return codeA.localeCompare(codeB, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
  }, [markers]);

  return (
    <div style={{ margin: "2rem 0" }}>
      <h3>Marker History</h3>
      <Table
        headers={["Top", "Left", "Acupuncture Code", "Acupuncture Name", ""]}
      >
        {sortedMarkers.map((marker, index) => (
          <tr
            key={`${marker.acupointCode ?? marker.acupointName}-${index}`}
            className="cursor-pointer hover:bg-slate-50"
          >
            <td className="px-4 py-3">
              {parseFloat(String(marker.top)).toFixed(3)}
            </td>
            <td className="px-4 py-3">
              {parseFloat(String(marker.left)).toFixed(3)}
            </td>

            <td className="px-4 py-3">{marker.acupointCode ?? "-"}</td>

            <td className="px-4 py-3">{marker.acupointName ?? "-"}</td>

            <td className="px-4 py-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkerDelete(
                    marker.acupointCode ?? marker.acupointName!,
                  );
                }}
                className="text-slate-400 hover:text-red-500 transition"
                aria-label="Delete marker"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
                  alt="delete"
                  className="w-5 h-5"
                />
              </button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

export default HistoryTable;
