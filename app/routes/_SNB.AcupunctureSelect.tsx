import React from "react";
import {
  PageShell,
} from "~/presentation/designSystem";

import AcupunctureCard from "./components/AcupunctureCard";

function AcupunctureSelect() {

  return (
    <PageShell className="p-8">
      <AcupunctureCard />
    </PageShell>
  );
}

export default AcupunctureSelect;
