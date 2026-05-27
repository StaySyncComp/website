import { Render } from "@measured/puck";
import "@measured/puck/puck.css";
import type { Data } from "@measured/puck";
import { puckConfig } from "@/features/organization/components/InfoPageSettings/puck/config";

export default function PublicPuckRender({ data }: { data: Data }) {
  return <Render config={puckConfig} data={data} />;
}
