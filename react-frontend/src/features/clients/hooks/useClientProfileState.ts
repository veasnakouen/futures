import { useClientPortfolioData } from "./useClientPortfolioData";
import { useClientPlacements } from "./useClientPlacements";
import { useClientSupportCases } from "./useClientSupportCases";
import { useClientEducation } from "./useClientEducation";

export function useClientProfileState() {
  const portfolio = useClientPortfolioData();
  const placements = useClientPlacements(portfolio.id, portfolio.fetchProfile);
  const supportCases = useClientSupportCases(
    portfolio.id,
    portfolio.fetchProfile,
    portfolio.data?.socialSupports
  );
  const education = useClientEducation(portfolio.id, portfolio.fetchProfile);

  return {
    ...portfolio,
    ...placements,
    ...supportCases,
    ...education,
    handleAddEducation: (e: React.FormEvent) =>
      education.handleAddEducation(e, placements.isEditMode, placements.editingId),
  };
}
