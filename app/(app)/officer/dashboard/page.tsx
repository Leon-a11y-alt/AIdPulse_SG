import { AlertBanner } from "@/components/citizen/alert-banner";
import { AreaRanking } from "@/components/citizen/area-ranking";
import { CaseTracking } from "@/components/citizen/case-tracking";
import { UpdatesList } from "@/components/citizen/updates-list";
import { OfficerActions } from "@/components/officer/officer-actions";
import { getHighRiskAlert } from "@/lib/data";

export default function OfficerDashboard() {
  return (
    <div className="space-y-6">
      <AlertBanner alert={getHighRiskAlert()} />
      <OfficerActions />
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <CaseTracking />
        <AreaRanking />
      </div>
      <UpdatesList />
    </div>
  );
}
