import React from "react";
import { useNavigate } from "@remix-run/react";
import {
  PageShell,
  SectionHeading,
  Button,
} from "~/presentation/designSystem";

import AcupunctureCard from "./components/AcupunctureCard";

function AcupunctureSelect() {
  const navigate = useNavigate();

  return (
    <PageShell className="p-8">
      {/* Main content */}
      <AcupunctureCard />
    </PageShell>
  );
}

export default AcupunctureSelect;
