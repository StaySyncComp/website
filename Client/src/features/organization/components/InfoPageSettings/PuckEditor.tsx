import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import type { Data } from "@measured/puck";
import { puckConfig } from "./puck/config";

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
      overrides={{
        headerActions: () => <></>,
      }}
    />
  );
}
