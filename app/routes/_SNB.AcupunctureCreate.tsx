import React from "react";
import {
  PageShell,
} from "~/presentation/designSystem";

import AcupunctureMarker from "./components/AcupunctureMarker";

function AcupunctureCreate() {

  return (
    <PageShell className="p-8">
      <AcupunctureMarker />
    </PageShell>
  );
}

export default AcupunctureCreate;
