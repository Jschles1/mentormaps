import { LinkIcon } from "lucide-react";
import Link from "next/link";

export default function MilestoneMenteeSolution({
  menteeSolutionComment,
  menteeSolutionUrl,
  isMentor,
}: {
  menteeSolutionComment: string | null;
  menteeSolutionUrl: string | null;
  isMentor: boolean;
}) {
  const titleText = isMentor ? "Mentee Solution" : "Your Solution";
  return (
    <div className="mt-4 flex flex-col gap-y-4">
      <div>
        <p className="text-xs text-gray">{titleText}</p>
        <p className="text-sm text-black-darkest font-bold">
          {menteeSolutionComment || "N/A"}
        </p>
      </div>
      <div>
        <p className="text-xs text-gray mb-2">Solution URL</p>
        {menteeSolutionUrl ? (
          <div className="max-w-full overflow-hidden flex items-center gap-x-2">
            <div className="flex flex-1 items-center gap-x-2 px-4 py-4 relative bg-lighter-blue-gray rounded-md ">
              <LinkIcon className="text-dark-lavender" size={16} />
              <Link
                href={menteeSolutionUrl}
                target="_blank"
                className="text-xs underline flex-1 text-black-darkest text-bold overflow-x-hidden break-words max-w-[calc(100vw-11rem)]"
              >
                {menteeSolutionUrl}
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-sm text-black-darkest font-bold">
            &quot;N/A&quot;
          </p>
        )}
      </div>
    </div>
  );
}
