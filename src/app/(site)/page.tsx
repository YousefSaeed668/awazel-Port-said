import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <div>
      <p className="text-2xl font-bold text-red-500">yousef saeed</p>
    </div>
  );
}
