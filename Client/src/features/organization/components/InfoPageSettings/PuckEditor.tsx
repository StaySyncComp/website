import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import "./infoPagePreview.css";
import type { Data } from "@measured/puck";
import { puckConfig } from "./puck/config";
import { INFO_PAGE_PUCK_UI, INFO_PAGE_VIEWPORTS } from "./puck/viewports";
import InfoPagePreview from "./InfoPagePreview";
import type { PreviewMode } from "./PreviewModeSwitch";

interface Props {
  data: Data;
  onChange: (data: Data) => void;
  headerTitle: string;
  headerPath: string;
  previewMode: PreviewMode;
}

export default function PuckEditor({
  data,
  onChange,
  headerTitle,
  headerPath,
  previewMode,
}: Props) {
  return (
    <Puck
      config={puckConfig}
      data={data}
      onChange={onChange}
      headerTitle={headerTitle}
      headerPath={headerPath}
      viewports={INFO_PAGE_VIEWPORTS}
      ui={INFO_PAGE_PUCK_UI}
      iframe={
        previewMode === "mobile" ? { enabled: false } : { enabled: true }
      }
      overrides={{
        preview: ({ children }) => (
          <InfoPagePreview mode={previewMode}>{children}</InfoPagePreview>
        ),
      }}
    />
  );
}
