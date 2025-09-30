"use Client";
import { ArrowLeft, Search } from "lucide-react";

const MobileNavBar = ({ goBack, title }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* <div className="flex items-center space-x-3"> */}
        <ArrowLeft
          className="w-6 h-6 text-blue-500 cursor-pointer"
          onClick={goBack}
        />
        <h1 className="text-lg font-semibold text-black">{title}</h1>
        {/* </div> */}
        <Search className="w-6 h-6 text-gray-400 cursor-pointer" />
      </div>
    </div>
  );
};
export default MobileNavBar;
