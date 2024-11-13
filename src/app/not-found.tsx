import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex justify-center items-center h-screen w-full gap-4 ">
      <h1 className=" font-semibold text-6xl ">404 </h1>
      <div className="flex flex-col py-4 pl-4 border-l gap-2">
        <span className="">Page not found</span>
        <Link
          href="/"
          className="px-4 py-1 rounded-md bg-blue-500 text-white shadow-md font-semibold text-header flex justify-center transition duration-300 ease-in-out transform hover:scale-105"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}
