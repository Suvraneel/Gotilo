import { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { redis1, redis2 } from "@/utils/db";
import createRoom from "@/huddle01/createRoom";
import { useRouter } from "next/router";
import { useMachingStore } from "@store/matching";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface NFTData {
  name: string;
  cached_image_uri: string;
  collection: {
    address: string;
  };
}

const About: NextPage = () => {
  const [selectedCardsList, setSelectedCardsList] = useState<string[]>([]);
  useEffect(() => {
    console.log(selectedCardsList);
  }, [selectedCardsList]);
  const { push } = useRouter();
  const { publicKey } = useWallet();
  const addPreference = useMachingStore((state) => state.addPreference);
  const preferences = useMachingStore((state) => state.preferences);

  const [supportedTokenAddressesMetadata, setSupportedTokenAddressesMetadata] =
    useState<NFTData[]>();

  const handleCardSelect = (address: string) => {
    if (selectedCardsList.includes(address)) {
      setSelectedCardsList(
        selectedCardsList.filter((item) => item !== address)
      );
    } else {
      setSelectedCardsList([...selectedCardsList, address]);
    }
  };

  const handleSubmit = async () => {
    await mapRoomWithWallet();
    localStorage.setItem("preferences", JSON.stringify(selectedCardsList));
    for (const address of selectedCardsList) {
      const value = (await redis1.get(address)) as string[] | null;
      if (value && publicKey) {
        if (!value.includes(publicKey?.toBase58())) {
          await redis1.set(address, [...value, publicKey?.toBase58()]);
        }
      } else {
        await redis1.set(address, [publicKey?.toBase58()]);
      }
    }
    push("/loader");
  };

  const mapRoomWithWallet = async () => {
    const roomId = await createRoom();
    if (roomId && publicKey) {
      await redis2.set(publicKey?.toBase58(), {
        roomId: roomId,
        partner: null,
      });
    }
  };

  useEffect(() => {
    console.log(preferences);
  }, [selectedCardsList, preferences]);

  useEffect(() => {
    const getNFT = async () => {
      console.log(publicKey?.toBase58());
      const nfts = await fetch('/api/getMatchNFTs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: publicKey?.toBase58(),
        }),
      }).then((res) => res.json());
      setSupportedTokenAddressesMetadata(nfts);
    };
    getNFT();
  }, [publicKey]);

  return (
    <div className='w-full h-full flex flex-col justify-evenly items-center'>
      <div className="w-full h-full p-5 lg:px-40 flex flex-col md:flex-row justify-evenly gap-5 sm:gap-16 items-center pt-32">
        {supportedTokenAddressesMetadata?.map((item: NFTData) => {
          return (
            <div
              key={item.collection.address}
              className={`w-[25vw] aspect-square flex flex-col justify-center items-center relative rounded-lg border transition-all ${selectedCardsList.includes(item.collection.address)
                ? "border-blue-500 border-4 skew-x-6 -skew-y-3 shadow-2xl shadow-blue-700"
                : "border-cardGray-700 hover:border-gray-700"
                } group bg-white p-1 md:p-2`}
              onClick={() => {
                handleCardSelect(item.collection.address)
                addPreference({
                  address: item.collection.address,
                  imageUri: item.cached_image_uri,
                })
              }}
            >
              <div className="relative w-full h-full overflow-clip">
                <Image
                  src={item.cached_image_uri}
                  alt="Logo"
                  loader={({ src }) => src}
                  fill
                  loading="lazy"
                  className="group-hover:scale-125 rounded-lg transition-transform duration-75 object-cover"
                />
              </div>
              <span className="text-black text-sm md:text-xl bg-white font-bold pt-1 md:pt-2">{item.name}</span>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className="flex w-40 items-center justify-center rounded-md py-3 text-slate-100 font-semibold bg-blue-600 group hover:bg-blue-900"
        onClick={handleSubmit}
      >
        Start Searching
        <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
      </button>
    </div>
  );
};

export default About;
