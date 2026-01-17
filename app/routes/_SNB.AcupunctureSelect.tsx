import React from "react";
import {
  PageShell,
} from "~/presentation/designSystem";

import AcupunctureMarker from "./components/AcupunctureMarker";

function AcupunctureSelect() {

  return (
    <PageShell className="p-8">
      {/* Main content */}
      <AcupunctureMarker />
    </PageShell>
  );
}

export default AcupunctureSelect;
