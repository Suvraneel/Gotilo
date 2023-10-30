import {
  useLocalAudio,
  useLocalMedia,
  useLocalVideo,
  usePeerIds,
  useRoom,
  useHuddle01,
} from "@huddle01/react/hooks";
import { FC, useEffect, useState } from "react";
import clsx from "clsx";
import VideoElem from "./Video";
import Image from "next/image";
import { BasicIcons } from "./BasicIcons";
import dynamic from "next/dynamic";

const PeerData = dynamic(() => import("./PeerData"), {
  ssr: false,
});

interface ShowPeersProps {
  displayName: string | undefined;
  avatarUrl: string | undefined;
  camTrack: MediaStreamTrack | null;
  isVideoOn: boolean;
}

const ShowPeers: FC<ShowPeersProps> = ({
  displayName,
  avatarUrl,
  camTrack,
  isVideoOn,
}) => {

  const { peerIds } = usePeerIds();

  return (
    <div className="my-5 flex h-[75vh] items-center justify-center self-stretch">
      <div className="flex h-full grid-cols-2 items-center justify-center gap-10 rounded-lg ">
        <div
          className={clsx(
            Object.values(peerIds).length === 0
              ? "my-5 h-full w-[60vw]"
              : "h-[60vh] w-[40vw]",
            "bg-gray-900",
            "relative flex flex-shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-transparent"
          )}
        >
          {isVideoOn ? (
            <VideoElem track={camTrack} />
          ) : (
            <div className="h-full w-full flex flex-col justify-center items-center">
              <Image
                src="/4.png"
                loader={({ src }) => src}
                unoptimized
                width={100}
                height={100}
                alt="avatar"
                className="mb-16 mt-16 h-32 w-32 rounded-full"
              />
            </div>
          )}
          <div className="bg-black text-slate-100 absolute bottom-1 left-1 rounded-md py-1 px-2 font-lg flex gap-2">
            {`${displayName} (You)`}
            {BasicIcons.ping}
          </div>
        </div>
        {Object.values(peerIds).length > 0 &&
          peerIds.map((peerId) => <PeerData peerId={peerId} />)}
      </div>
    </div>
  );
};

export default ShowPeers;
