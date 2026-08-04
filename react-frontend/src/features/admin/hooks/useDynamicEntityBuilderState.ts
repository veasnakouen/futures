import { useEntityStudioState } from "./entity-builder/useEntityStudioState";
import { useEntityRelationshipsState } from "./entity-builder/useEntityRelationshipsState";
import { useEntityRecordsState } from "./entity-builder/useEntityRecordsState";

export function useDynamicEntityBuilderState() {
  const studio = useEntityStudioState();
  const relationships = useEntityRelationshipsState(studio.selectedEntityKey);
  const records = useEntityRecordsState(studio.selectedEntityKey);

  return {
    ...studio,
    ...relationships,
    ...records,
  };
}
