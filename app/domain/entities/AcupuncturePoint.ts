import type { Meridian } from "~/domain/entities/Meridian";

export interface AcupuncturePoint {
  acupunctureId: number;
  acupointCode: string;
  acupointName: string;
  locationId: number;
  pointLeft: number;
  pointTop: number;
  meridianId: number;
  meridianName: string;
  region: string;
  side: string;
  image: string;
}

export interface SelectedPoint extends AcupuncturePoint {
  region: string;
  side: string;
  key: string;
}

export interface AcupunctureCardProps {
  bodyPart: string;
  side: string;
  label: string;
  meridiansForView: Meridian[];
  visiblePoints: AcupuncturePoint[];
  allPoints: AcupuncturePoint[];
  selectedPoints: SelectedPoint[];
  visibleMeridianIds: Set<number>;
  imageUrl: string | null;
  onPointClick: (point: AcupuncturePoint) => void;
}

export interface AcupunctureShowCardProps {
  recordId?: number;
  illnessId?: number;
  visibleMeridians: Record<string, Set<number>>;
  onMeridianToggle: (region: string, side: string, meridianId: number) => void;
}

export interface ShowCardRegionViewProps {
  regionSideKey: string;
  region: string;
  side: string;
  allPoints: AcupuncturePoint[];
  visibleMeridianIds: Set<number>;
  onMeridianToggle: (region: string, side: string, meridianId: number) => void;
}

export interface RegionSideViewProps {
  region: string;
  side: string;
  meridianId: number;
  meridianName: string;
  points: AcupuncturePoint[];
  selectedPoints: SelectedPoint[];
  handlePointClick: (
    point: AcupuncturePoint,
    region: string,
    side: string
  ) => void;
}