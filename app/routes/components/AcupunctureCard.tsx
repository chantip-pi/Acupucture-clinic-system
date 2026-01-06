import React, { useState } from "react";
import {
  Card,
  SectionHeading,
  Button,
} from "~/presentation/designSystem";

// Import all body part images
import headFront from "/images/head/head_front.png";
import headBack from "/images/head/head_back.png";
import headLeft from "/images/head/head_left.png";
import headRight from "/images/head/head_right.jpg";
import neckFront from "/images/neck/neck_front.png";
import neckBack from "/images/neck/neck_back.png";
import neckLeft from "/images/neck/neck_left.png";
import neckRight from "/images/neck/neck_right.png";
import armsFront from "/images/arm/arm_front.png";
import armsBack from "/images/arm/arm_back.png";
import armsLeft from "/images/arm/arm_left.png";
import armsRight from "/images/arm/arm_right.png";
import torsoFront from "/images/torso/torso_front.png";
import torsoBack from "/images/torso/torso_back.png";
import torsoLeft from "/images/torso/torso_left.png";
import torsoRight from "/images/torso/torso_right.png";
import legsFront from "/images/leg/leg_front.png";
import legsBack from "/images/leg/leg_back.png";
import legsLeft from "/images/leg/leg_left.png";
import legsRight from "/images/leg/leg_right.png";

type BodyPart = "Head" | "Neck" | "Arms" | "Torso" | "Legs";
type ViewSide = "front" | "back" | "left" | "right";

interface AcupuncturePoint {
  id: string;
  name: string;
  x: number;
  y: number;
}

interface SelectedPoint extends AcupuncturePoint {
  bodyPart: BodyPart;
  side: ViewSide;
  key: string;
}

const BODY_PARTS: BodyPart[] = ["Head", "Neck", "Arms", "Torso", "Legs"];

const VIEW_SIDES: { key: ViewSide; label: string }[] = [
  { key: "front", label: "Front" },
  { key: "back", label: "Back" },
  { key: "left", label: "Left" },
  { key: "right", label: "Right" },
];

const defaultViews: Record<ViewSide, boolean> = {
  front: false,
  back: false,
  left: false,
  right: false,
};

const BODY_PART_IMAGES: Record<BodyPart, Record<ViewSide, string>> = {
  Head: {
    front: headFront,
    back: headBack,
    left: headLeft,
    right: headRight,
  },
  Neck: {
    front: neckFront,
    back: neckBack,
    left: neckLeft,
    right: neckRight,
  },
  Arms: {
    front: armsFront,
    back: armsBack,
    left: armsLeft,
    right: armsRight,
  },
  Torso: {
    front: torsoFront,
    back: torsoBack,
    left: torsoLeft,
    right: torsoRight,
  },
  Legs: {
    front: legsFront,
    back: legsBack,
    left: legsLeft,
    right: legsRight,
  },
};

const ACUPUNCTURE_POINTS: Record<
  BodyPart,
  Record<ViewSide, AcupuncturePoint[]>
> = {
  Head: {
    front: [
      { id: "GV20", name: "Baihui", x: 37, y: 30 },
      { id: "EX-HN3", name: "Yintang", x: 42, y: 58 },
      { id: "ST8", name: "Touwei (L)", x: 32, y: 42 },
      { id: "ST8R", name: "Touwei (R)", x: 52, y: 40 },
      { id: "GB14", name: "Yangbai (L)", x: 35, y: 50 },
      { id: "GB14R", name: "Yangbai (R)", x: 50, y: 50 },
    ],
    back: [
      { id: "GV16", name: "Fengfu", x: 54, y: 58 },
      { id: "GB20", name: "Fengchi (L)", x: 42, y: 64 },
      { id: "GB20R", name: "Fengchi (R)", x: 65, y: 63 },
      { id: "BL10", name: "Tianzhu (L)", x: 48, y: 65 },
      { id: "BL10R", name: "Tianzhu (R)", x: 59, y: 64 },
    ],
    left: [
      { id: "GB8", name: "Shuaigu", x: 30, y: 30 },
      { id: "TE23", name: "Sizhukong", x: 25, y: 35 },
      { id: "GB2", name: "Tinghui", x: 20, y: 45 },
    ],
    right: [
      { id: "GB8R", name: "Shuaigu", x: 70, y: 30 },
      { id: "TE23R", name: "Sizhukong", x: 75, y: 35 },
      { id: "GB2R", name: "Tinghui", x: 80, y: 45 },
    ],
  },
  Neck: {
    front: [
      { id: "CV23", name: "Lianquan", x: 50, y: 40 },
      { id: "CV22", name: "Tiantu", x: 50, y: 55 },
      { id: "ST9", name: "Renying (L)", x: 40, y: 35 },
      { id: "ST9R", name: "Renying (R)", x: 60, y: 35 },
    ],
    back: [
      { id: "GV15", name: "Yamen", x: 50, y: 30 },
      { id: "GV14", name: "Dazhui", x: 50, y: 65 },
      { id: "BL10", name: "Tianzhu (L)", x: 42, y: 40 },
      { id: "BL10R", name: "Tianzhu (R)", x: 58, y: 40 },
    ],
    left: [
      { id: "TE16", name: "Tianyou", x: 25, y: 45 },
      { id: "GB12", name: "Wangu", x: 20, y: 55 },
    ],
    right: [
      { id: "TE16R", name: "Tianyou", x: 75, y: 45 },
      { id: "GB12R", name: "Wangu", x: 80, y: 55 },
    ],
  },
  Arms: {
    front: [
      { id: "LI11", name: "Quchi (L)", x: 25, y: 30 },
      { id: "LI11R", name: "Quchi (R)", x: 75, y: 30 },
      { id: "LI10", name: "Shousanli (L)", x: 23, y: 40 },
      { id: "LI10R", name: "Shousanli (R)", x: 77, y: 40 },
      { id: "PC6", name: "Neiguan (L)", x: 30, y: 55 },
      { id: "PC6R", name: "Neiguan (R)", x: 70, y: 55 },
      { id: "LI4", name: "Hegu (L)", x: 20, y: 75 },
      { id: "LI4R", name: "Hegu (R)", x: 80, y: 75 },
    ],
    back: [
      { id: "TE10", name: "Tianjing (L)", x: 25, y: 35 },
      { id: "TE10R", name: "Tianjing (R)", x: 75, y: 35 },
      { id: "SI8", name: "Xiaohai (L)", x: 23, y: 32 },
      { id: "SI8R", name: "Xiaohai (R)", x: 77, y: 32 },
      { id: "TE5", name: "Waiguan (L)", x: 30, y: 55 },
      { id: "TE5R", name: "Waiguan (R)", x: 70, y: 55 },
    ],
    left: [
      { id: "LI11L", name: "Quchi", x: 40, y: 30 },
      { id: "LI10L", name: "Shousanli", x: 38, y: 40 },
      { id: "LI4L", name: "Hegu", x: 35, y: 75 },
    ],
    right: [
      { id: "LI11RL", name: "Quchi", x: 60, y: 30 },
      { id: "LI10RL", name: "Shousanli", x: 62, y: 40 },
      { id: "LI4RL", name: "Hegu", x: 65, y: 75 },
    ],
  },
  Torso: {
    front: [
      { id: "CV17", name: "Danzhong", x: 50, y: 25 },
      { id: "CV12", name: "Zhongwan", x: 50, y: 40 },
      { id: "CV6", name: "Qihai", x: 50, y: 55 },
      { id: "CV4", name: "Guanyuan", x: 50, y: 65 },
      { id: "ST25", name: "Tianshu (L)", x: 42, y: 50 },
      { id: "ST25R", name: "Tianshu (R)", x: 58, y: 50 },
    ],
    back: [
      { id: "GV14", name: "Dazhui", x: 50, y: 20 },
      { id: "BL13", name: "Feishu (L)", x: 45, y: 30 },
      { id: "BL13R", name: "Feishu (R)", x: 55, y: 30 },
      { id: "BL20", name: "Pishu (L)", x: 45, y: 45 },
      { id: "BL20R", name: "Pishu (R)", x: 55, y: 45 },
      { id: "BL23", name: "Shenshu (L)", x: 45, y: 60 },
      { id: "BL23R", name: "Shenshu (R)", x: 55, y: 60 },
    ],
    left: [
      { id: "GB24", name: "Riyue", x: 30, y: 40 },
      { id: "LV13", name: "Zhangmen", x: 25, y: 50 },
    ],
    right: [
      { id: "GB24R", name: "Riyue", x: 70, y: 40 },
      { id: "LV13R", name: "Zhangmen", x: 75, y: 50 },
    ],
  },
  Legs: {
    front: [
      { id: "ST31", name: "Biguan (L)", x: 35, y: 20 },
      { id: "ST31R", name: "Biguan (R)", x: 65, y: 20 },
      { id: "ST36", name: "Zusanli (L)", x: 35, y: 35 },
      { id: "ST36R", name: "Zusanli (R)", x: 65, y: 35 },
      { id: "SP10", name: "Xuehai (L)", x: 38, y: 25 },
      { id: "SP10R", name: "Xuehai (R)", x: 62, y: 25 },
      { id: "SP6", name: "Sanyinjiao (L)", x: 40, y: 60 },
      { id: "SP6R", name: "Sanyinjiao (R)", x: 60, y: 60 },
      { id: "LV3", name: "Taichong (L)", x: 40, y: 80 },
      { id: "LV3R", name: "Taichong (R)", x: 60, y: 80 },
    ],
    back: [
      { id: "BL40", name: "Weizhong (L)", x: 35, y: 40 },
      { id: "BL40R", name: "Weizhong (R)", x: 65, y: 40 },
      { id: "BL57", name: "Chengshan (L)", x: 35, y: 60 },
      { id: "BL57R", name: "Chengshan (R)", x: 65, y: 60 },
      { id: "BL60", name: "Kunlun (L)", x: 38, y: 75 },
      { id: "BL60R", name: "Kunlun (R)", x: 62, y: 75 },
    ],
    left: [
      { id: "GB34", name: "Yanglingquan", x: 32, y: 45 },
      { id: "SP9", name: "Yinlingquan", x: 38, y: 45 },
      { id: "GB39", name: "Xuanzhong", x: 35, y: 65 },
    ],
    right: [
      { id: "GB34R", name: "Yanglingquan", x: 68, y: 45 },
      { id: "SP9R", name: "Yinlingquan", x: 62, y: 45 },
      { id: "GB39R", name: "Xuanzhong", x: 65, y: 65 },
    ],
  },
};

function AcupunctureCard() {
  const [selectedParts, setSelectedParts] = useState<BodyPart[]>(["Head"]);
  const [selectedPoints, setSelectedPoints] = useState<SelectedPoint[]>([]);

  const [viewsByPart, setViewsByPart] = useState<
    Record<BodyPart, Record<ViewSide, boolean>>
  >({
    Head: { ...defaultViews, front: true },
    Neck: { ...defaultViews },
    Arms: { ...defaultViews },
    Torso: { ...defaultViews },
    Legs: { ...defaultViews },
  });

  const toggleBodyPart = (part: BodyPart) => {
    setSelectedParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const toggleView = (part: BodyPart, view: ViewSide) => {
    setViewsByPart((prev) => ({
      ...prev,
      [part]: {
        ...prev[part],
        [view]: !prev[part][view],
      },
    }));
  };

  const handlePointClick = (
    point: AcupuncturePoint,
    bodyPart: BodyPart,
    side: ViewSide
  ) => {
    const pointKey = `${bodyPart}-${side}-${point.id}`;
    const existingIndex = selectedPoints.findIndex((p) => p.key === pointKey);

    if (existingIndex >= 0) {
      setSelectedPoints(selectedPoints.filter((_, i) => i !== existingIndex));
    } else {
      setSelectedPoints([
        ...selectedPoints,
        {
          key: pointKey,
          bodyPart,
          side,
          ...point,
        },
      ]);
    }
  };

  const isPointSelected = (
    pointId: string,
    bodyPart: BodyPart,
    side: ViewSide
  ) => {
    const pointKey = `${bodyPart}-${side}-${pointId}`;
    return selectedPoints.some((p) => p.key === pointKey);
  };

  const handleSave = async () => {
    // In a real app, you would save to a database here:
    // await fetch('/api/acupuncture-sessions', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ points: selectedPoints })
    // });

    console.log("Saving points:", selectedPoints);
    alert(`Saved ${selectedPoints.length} acupuncture points to database`);
  };

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <main className="flex-1 p-8">
        <Card>
          <SectionHeading
            title="Acupuncture Point Selection"
            description="Select body parts and views to mark acupuncture points"
          />

          {/* Selected points counter */}
          {selectedPoints.length > 0 && (
            <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
              {selectedPoints.length} point{selectedPoints.length !== 1 ? "s" : ""}{" "}
              selected
            </div>
          )}

          {/* Body part selector */}
          <div className="mb-6 flex flex-wrap gap-3">
            {BODY_PARTS.map((part) => (
              <Button
                key={part}
                size="sm"
                variant={selectedParts.includes(part) ? "primary" : "secondary"}
                onClick={() => toggleBodyPart(part)}
              >
                {part}
              </Button>
            ))}
          </div>

          {/* Selected body parts */}
          <div className="space-y-10">
            {selectedParts.map((part) => (
              <div key={part}>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                  {part}
                </h3>

                {/* View selector */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {VIEW_SIDES.map(({ key, label }) => (
                    <Button
                      key={key}
                      size="sm"
                      variant={viewsByPart[part][key] ? "primary" : "ghost"}
                      onClick={() => toggleView(part, key)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>

                {/* Image with clickable points */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {VIEW_SIDES.filter(({ key }) => viewsByPart[part][key]).map(
                    ({ key, label }) => {
                      const points = ACUPUNCTURE_POINTS[part][key];
                      const imageSource = BODY_PART_IMAGES[part][key];
                      return (
                        <Card key={key} padding="sm">
                          <p className="mb-2 text-sm font-medium text-slate-600">
                            {label}
                          </p>

                          <div className="relative h-96 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50">
                            {/* Background image */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <img
                                src={imageSource}
                                alt={`${part} ${label}`}
                                className="h-full w-full object-contain"
                              />
                            </div>

                            {/* SVG overlay for points */}
                            <svg
                              viewBox="0 0 100 100"
                              className="absolute inset-0 h-full w-full"
                              preserveAspectRatio="none"
                            >
                              {points.map((point) => {
                                const selected = isPointSelected(
                                  point.id,
                                  part,
                                  key
                                );
                                return (
                                  <g
                                    key={point.id}
                                    onClick={() =>
                                      handlePointClick(point, part, key)
                                    }
                                    className="cursor-pointer"
                                  >
                                    {/* Clickable area */}
                                    <circle
                                      cx={point.x}
                                      cy={point.y}
                                      r="4"
                                      fill="transparent"
                                      className="hover:fill-teal-200 hover:fill-opacity-30"
                                    />
                                    {/* Visible point */}
                                    <circle
                                      cx={point.x}
                                      cy={point.y}
                                      r="1.5"
                                      fill={selected ? "#0d9488" : "#60a5fa"}
                                      stroke={selected ? "#0f766e" : "#3b82f6"}
                                      strokeWidth="0.3"
                                      className="transition-all"
                                    />
                                    {selected && (
                                      <circle
                                        cx={point.x}
                                        cy={point.y}
                                        r="2.5"
                                        fill="none"
                                        stroke="#0d9488"
                                        strokeWidth="0.3"
                                      />
                                    )}
                                  </g>
                                );
                              })}
                            </svg>
                          </div>

                          {/* Point list below image */}
                          <div className="mt-3 max-h-32 overflow-y-auto">
                            <p className="mb-2 text-xs font-medium text-slate-500">
                              Available Points:
                            </p>
                            <div className="space-y-1">
                              {points.map((point) => {
                                const selected = isPointSelected(
                                  point.id,
                                  part,
                                  key
                                );
                                return (
                                  <button
                                    key={point.id}
                                    onClick={() =>
                                      handlePointClick(point, part, key)
                                    }
                                    className={`w-full rounded px-2 py-1 text-left text-xs transition-colors ${
                                      selected
                                        ? "bg-teal-100 text-teal-700"
                                        : "hover:bg-slate-100 text-slate-600"
                                    }`}
                                  >
                                    <span className="font-medium">
                                      {point.id}
                                    </span>{" "}
                                    - {point.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </Card>
                      );
                    }
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Button variant="primary" onClick={handleSave}>
              Save Selected Points ({selectedPoints.length})
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default AcupunctureCard;