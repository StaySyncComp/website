import type { Data } from "@measured/puck";
import { v4 as uuidv4 } from "uuid";
import { emptyPuckData } from "./config";

type ContentItem = Data["content"][number];
type ContentItemWithLegacyId = ContentItem & { id?: string };

function generateBlockId(type: string): string {
  return `${type}-${uuidv4()}`;
}

function normalizeContentItem(
  item: ContentItem,
  seenIds: Set<string>
): ContentItem {
  const legacy = item as ContentItemWithLegacyId;
  const props = { ...item.props } as ContentItem["props"] & { id?: string };

  if (!props.id && legacy.id) {
    props.id = legacy.id;
  }

  if (!props.id || seenIds.has(props.id)) {
    props.id = generateBlockId(item.type);
  }
  seenIds.add(props.id);

  return {
    type: item.type,
    props,
  };
}

/** Ensures every Puck block has a unique `props.id` (required for selection/editing). */
export function normalizePuckData(raw: unknown): Data {
  if (
    !raw ||
    typeof raw !== "object" ||
    !("content" in raw) ||
    !Array.isArray((raw as Data).content)
  ) {
    return emptyPuckData as Data;
  }

  const data = raw as Data;
  const seenIds = new Set<string>();

  const content = data.content.map((item) =>
    normalizeContentItem(item, seenIds)
  );

  let zones: Data["zones"] | undefined;
  if (data.zones) {
    zones = {};
    for (const [zoneKey, zoneContent] of Object.entries(data.zones)) {
      zones[zoneKey] = zoneContent.map((item) =>
        normalizeContentItem(item, seenIds)
      );
    }
  }

  return {
    ...data,
    content,
    ...(zones ? { zones } : {}),
    root: data.root ?? emptyPuckData.root,
  };
}
