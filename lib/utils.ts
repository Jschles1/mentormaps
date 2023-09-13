import { RoadmapStatus } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function roadmapStatusTextClass(status: RoadmapStatus) {
  switch (status) {
    case "Pending":
      return "text-gold";
    case "Active":
      return "text-lime";
    case "Completed":
      return "text-lime";
  }
}
