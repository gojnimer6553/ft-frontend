import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/) // split by one or more spaces
    .slice(0, 2) // take first two words
    .map((word) => word[0]?.toUpperCase() ?? "") // take first letter, uppercase
    .join("");
}

export { getInitials, cn };
