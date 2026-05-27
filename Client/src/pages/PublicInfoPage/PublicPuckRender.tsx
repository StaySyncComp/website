import { Render } from "@measured/puck";
import "@measured/puck/puck.css";
import type { Data } from "@measured/puck";
import { publicPuckConfig } from "@/features/organization/components/InfoPageSettings/puck/config";

export default function PublicPuckRender({ data }: { data: Data }) {
  return <Render config={publicPuckConfig} data={data} />;
}
