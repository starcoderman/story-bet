import SEO from "@utils/SEO";
import Link from "next/link";

export const metadata = SEO({
  title: "Title For Page",
  description: "Description for page",
});

export default function Home() {
  return (
    <>
      <div className="mx-auto container w-full border-b border-neutral-200 text-white flex flex-row py-4">
        <p className="text-2xl font-bold text-black">Story Bet</p>
        <div className="flex flex-row ml-auto">
          <Link
            href="/platform"
            className="bg-black rounded-md px-3 py-2 flex items-center hover:text-neutral-200"
          >
            <span className="text-white hover:text-neutral-200">Platform</span>
          </Link>
        </div>
      </div>
    </>
  );
}
