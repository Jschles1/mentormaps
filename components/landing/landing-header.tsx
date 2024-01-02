"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import Logo from "/public/images/logo-light-2.png";

export default function LandingHeader() {
  const { isSignedIn } = useAuth();

  return (
    <div className="bg-white">
      <nav className="h-16 py-5 px-4 flex items-center justify-between mx-auto max-w-screen-xl">
        <Link href="/" className="flex items-center">
          <Image className="block" src={Logo} alt="MentorMaps Logo" />
          <h1 className="text-lg font-bold">MentorMaps</h1>
        </Link>
        <div className="flex items-center gap-x-2">
          <Link href={isSignedIn ? "/roadmaps" : "/sign-up"}>
            <Button className="rounded-full">Get Started</Button>
          </Link>
        </div>
      </nav>
    </div>
  );
}
