"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";

const features = [
  {
    emoji: "👩‍🏫",
    name: "Be a Mentor, Be a Mentee — Your Choice!",
    description:
      "With MentorPath, you're in control. Choose to guide others as a mentor, seek guidance as a mentee, or even do both in different roadmaps!",
  },
  {
    emoji: "🎯",
    name: "Create Personalized Roadmaps",
    description:
      "Customize your growth journey with step-by-step milestones that guide you toward your ultimate goal.",
  },
  {
    emoji: "👥",
    name: "Mentorship that Matters",
    description:
      "Secure connections with experienced mentors who provide valuable insights, resources, and encouragement.",
  },
  {
    emoji: "✅",
    name: "Real-time Progress Tracking",
    description:
      "See where you stand in your roadmap. Update your progress and get real-time feedback from your mentors.",
  },
  {
    emoji: "🔔",
    name: "Instant Notifications",
    description:
      "Never miss an update. Get instant notifications for new mentor invitations, completed milestones, and more.",
  },
];

export default function LandingContent() {
  const { isSignedIn } = useAuth();
  return (
    <div>
      <div className="px-10 pb-20">
        <h2 className="text-center text-4xl text-black-darkest font-extrabold mb-10">
          Accelerate Your Journey to Success!
        </h2>
        <div className="flex flex-col md:flex-row md:flex-wrap items-stretch justify-center gap-x-2 gap-y-2">
          {features.map((item) => (
            <Card
              key={item.description}
              className="bg-white border-none text-black-darkest md:basis-1/3 lg:basis-1/4 lg:h-[16rem]"
            >
              <CardHeader className="flex flex-col justify-between h-full">
                <CardTitle className="flex items-center gap-x-2">
                  <div className="flex items-center gap-x-4">
                    <span className="text-lg block">{item.emoji}</span>
                    <p className="text-lg">{item.name}</p>
                  </div>
                </CardTitle>
                <CardContent className="pt-4 px-0 text-gray">
                  {item.description}
                </CardContent>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="px-10 pb-20">
        <h2 className="text-center text-4xl text-black-darkest font-extrabold mb-10">
          How It Works:
        </h2>

        <Card className="bg-white border-none text-black-darkest">
          <CardHeader className="flex flex-col justify-between h-full">
            <CardContent className="">
              <ol className="list-decimal text-black-darkest flex flex-col gap-y-4">
                <li>
                  <div className="font-bold">Sign Up:</div>
                  <div className="text-gray">
                    Create your free MentorPath account.
                  </div>
                </li>
                <li>
                  <div className="font-bold">Choose Your Role:</div>
                  <div className="text-gray">
                    Decide if you want to guide as a mentor or get invited as a
                    mentee.
                  </div>
                </li>
                <li>
                  <div className="font-bold">For Mentors:</div>
                  <div className="text-gray mb-2">
                    Create a roadmap, set milestones, and invite your mentee to
                    join your journey.
                  </div>

                  <div className="font-bold">For Mentees:</div>
                  <div className="text-gray">
                    Wait for an invitation from a mentor to join a specific
                    roadmap.
                  </div>
                </li>
                <li>
                  <div className="font-bold">Collaborate:</div>
                  <div className="text-gray">
                    Once the mentor and mentee are matched, work together to set
                    or review milestones on the roadmap.
                  </div>
                </li>
                <li>
                  <div className="font-bold">Track Progress:</div>
                  <div className="text-gray">
                    Complete milestones, get real-time feedback, and watch as
                    you or your mentee moves closer to the end goal.
                  </div>
                </li>
              </ol>
            </CardContent>
          </CardHeader>
        </Card>

        <div className="text-black-darkest font-bold py-20 md:py-36 text-center space-y-5">
          <p className="text-black-darkest">
            Ready to Take the Next Step in Your Journey?
          </p>
          <div>
            <Link href={isSignedIn ? "/roadmaps" : "/sign-up"}>
              <Button className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
                Start MentorPath For Free
              </Button>
            </Link>
          </div>
          <div className="text-black-darkest text-xs md:text-sm font-normal">
            No credit card required.
          </div>
        </div>
      </div>
    </div>
  );
}
