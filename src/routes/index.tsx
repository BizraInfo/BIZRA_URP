import { createFileRoute } from "@tanstack/react-router";
import { Face } from "@/components/urp/Face";
import { Ecosystem } from "@/components/urp/Ecosystem";
import { DefinitionOfDone, Ledger, Membrane, Resources } from "@/components/urp/Rest";
import { Equation } from "@/components/urp/Equation";
import { Manifest } from "@/components/urp/Manifest";
import { MissionWalk } from "@/components/urp/MissionWalk";
import { Shell } from "@/components/urp/Shell";
import { Topology } from "@/components/urp/Topology";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <Shell>
      <Face />
      <Manifest />
      <Equation />
      <Topology />
      <Ecosystem />
      <MissionWalk />
      <Resources />
      <Membrane />
      <Ledger />
      <DefinitionOfDone />
    </Shell>
  );
}
