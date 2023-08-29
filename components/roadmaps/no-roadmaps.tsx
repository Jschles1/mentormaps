import { Button } from "../ui/button";
import CreateRoadMapDialog from "./create-roadmap-dialog";

export default function NoRoadmaps() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center flex flex-col items-center gap-4 text-gray font-bold text-[1.125rem]">
        <p className="text-gray">
          You currently do not own or belong to any roadmaps.
        </p>
        <p>
          To join a roadmap as a mentee, you must receive a roadmap invite from
          your mentor. Check &quot;Roadmap Invites&quot; in the menu to see
          pending invites.
        </p>
        <p className="mb-6">
          To create a roadmap as a mentor, click the &quot;+&quot; button above
          or the &quot;Add New Roadmap&quot; button below to get started.
        </p>
        <CreateRoadMapDialog
          triggerClassName="inline-flex items-center justify-center h-12 px-[1.125rem] py-4 text-[0.938rem] bg-dark-lavender focus-within:bg-light-lavender focus:bg-light-lavender active:bg-light-lavender hover:bg-light-lavender text-white rounded-3xl"
          triggerText="+ Add New Roadmap"
        />
      </div>
    </div>
  );
}
