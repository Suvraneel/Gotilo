import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import styles from "./itsamatch.module.css";
import Realistic from "@components/Confetti";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { redis2 } from "@utils/db";
import { useMeetPersistStore } from "@store/meet";
import { useMachingStore } from "@store/matching";

interface RoomsDataInterface {
  roomId: string;
  partner: string | null;
  pfp?: string;
}

const ItsAMatch = () => {
  const { push } = useRouter();
  const avatarUrl = useMeetPersistStore((state) => state.avatarUrl);
  const matchedAddress = useMachingStore((state) => state.matchedAddress);
  const roomId = useMachingStore((state) => state.matchedRoomId);
  const [partnerAvatarUrl, setPartnerAvatarUrl] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await redis2.get(matchedAddress);
      if (data) {
        setPartnerAvatarUrl((data as RoomsDataInterface).pfp || "");
      }
    };
    fetchData();
    setTimeout(() => {
      push(`/room/${roomId}`)
    }, 7500);
  }, []);

  return (
    <div className="w-full h-full flex flex-col sm:flex-row justify-evenly items-center mt-32">
      <div className="w-[50vw] h-[70vh] rounded-lg">
        <div className="w-full h-full bg-black rounded-md flex flex-col items-center justify-evenly">
          <Realistic />
          <h1 className="text-white text-3xl font-bold">It&apos;s a Match!</h1>
          <div className="flex justify-evenly items-center w-full h-full relative">
            <div className="w-1/3 aspect-square relative">
              <Image
                src={avatarUrl}
                loader={({ src }) => src}
                alt="itsamatch"
                fill
                className={`rounded-full ${styles.animate_left_to_center} bg-cover`}
              />
            </div>
            <h1 className={`text-8xl font-thin ${styles.stamp}`}>X</h1>
            <div className="w-1/3 aspect-square relative">
              <Image
                src={partnerAvatarUrl.length > 0 ? partnerAvatarUrl : "/default-avatar.svg"} 
                loader={({ src }) => src}
                alt="itsamatch"
                fill
                className={`rounded-full ${styles.animate_right_to_center} bg-cover`}
              />
            </div>
          </div>
          <button
            type="button"
            className="flex w-40 items-center justify-center rounded-md py-3 text-slate-100 bg-blue-600 group hover:bg-blue-900"
          >
            Start Meeting
            <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItsAMatch;
