import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import type { Data } from "@measured/puck";
import { puckConfig } from "./puck/config";
import { INFO_PAGE_PUCK_UI, INFO_PAGE_VIEWPORTS } from "./puck/viewports";

interface Props {
  data: Data;
  onChange: (data: Data) => void;
  headerTitle: string;
  headerPath: string;
}

export default function PuckEditor({
  data,
  onChange,
  headerTitle,
  headerPath,
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
      overrides={{
        headerActions: () => <></>,
      }}
    />
  );
}
