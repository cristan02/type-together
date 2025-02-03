import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className=" h-full w-full flex justify-center items-center">
      <LoaderCircle className=" animate-spin text-blue-500" />
    </div>
  );
};

export { Loading };
