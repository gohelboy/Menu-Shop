import chef from "@/Assets/Images/chef_login.webp";
import { ImageIcon, Scan } from "lucide-react";
import Image from "next/image";

const AuthSideSection = () => {
  return (
    <div className="hidden md:block md:w-1/2 bg-gray-900 p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700 to-indigo-800 opacity-90"></div>
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="text-white space-y-6">
          <h2 className="text-3xl font-bold">Transform Menus with AI</h2>
          <p className="text-lg">
            Upload, scan, and generate stunning menu designs in seconds
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
            <Scan className="w-8 h-8 text-purple-300 mb-2" />
            <h3 className="text-white font-semibold mb-1">Smart Scanning</h3>
            <p className="text-purple-200 text-sm">
              Instantly digitize your existing menus
            </p>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
            <ImageIcon className="w-8 h-8 text-indigo-300 mb-2" />
            <h3 className="text-white font-semibold mb-1">AI Generation</h3>
            <p className="text-indigo-200 text-sm">
              Create unique menu items with AI
            </p>
          </div>
        </div>
        <div className="mt-8">
          <div className="relative">
            <Image
              src={chef}
              alt="AI-generated menu sample"
              width={460}
              height={200}
              className="rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSideSection;
