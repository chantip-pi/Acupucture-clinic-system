import { useLocation, useNavigate } from "react-router-dom";
import {
  PageShell,
  Button,
} from "~/presentation/designSystem";
import IllnessAcupunctureShowCard from "./components/IllnessAcupunctureShowCard";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MedicalRecordIllnessShowPage() {
  const { state } = useLocation();
  const recordId = state?.recordId;
  const navigate = useNavigate();

  return (
    <PageShell className="p-8">
      <div className="flex items-center gap-3 py-4">
        <Button size="sm" type="button" variant="back" onClick={() => navigate(-1)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full">
            <FontAwesomeIcon icon={faArrowLeft} />
          </span>
          Back
        </Button>
      </div>

      <IllnessAcupunctureShowCard recordId={recordId} />
    </PageShell>
  );
}

export default MedicalRecordIllnessShowPage;