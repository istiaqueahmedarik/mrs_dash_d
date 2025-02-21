'use client'
import RosTopicSubscriber from "@/components/component/RosCam";
import { Main } from "../components/component/home";
import Image from "next/image";
import dynamic from "next/dynamic";

export default function Home() {
 
  return (
    <div className="w-full h-screen ml-[5rem]">
      <Main />
      <div className="flex justify-center items-center">
        </div>
    </div>
  );
}
