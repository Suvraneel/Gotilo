import { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { redis1, redis2 } from "@/utils/db";
import createRoom from "@/huddle01/createRoom";
import { useRouter } from "next/router";
import { useMachingStore } from "@store/matching";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

// interface NFTData {
//   name: string;
//   cached_image_uri: string;
//   collection: {
//     address: string;
//   };
// }

interface NFTData {
  name: string;
  image_uri: string;
  contract_address: string;
}

const About: NextPage = () => {
  const [selectedCardsList, setSelectedCardsList] = useState<string[]>([]);
  useEffect(() => {
    console.log(selectedCardsList);
  }, [selectedCardsList]);
  const { push } = useRouter();
  const { address } = useAccount();
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
      if (value && address) {
        if (!value.includes(address)) {
          await redis1.set(address, [...value, address]);
        }
      } else {
        await redis1.set(address, [address]);
      }
    }
    push("/loader");
  };

  const mapRoomWithWallet = async () => {
    const roomId = await createRoom();
    if (roomId && address) {
      await redis2.set(address, {
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
      console.log(address);
      const nfts = await fetch("/api/getMatchNFTs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: address,
        }),
      }).then((res) => res.json());
      setSupportedTokenAddressesMetadata(nfts.nfts);
    };
    getNFT();
  }, [address]);

  useEffect(() => {
    console.log(supportedTokenAddressesMetadata);
  }, [supportedTokenAddressesMetadata]);

  return (
    <div className="w-full h-full flex flex-col justify-evenly items-center">
      <div className="w-full h-full p-5 lg:px-40 flex flex-col md:flex-row justify-evenly gap-5 sm:gap-16 items-center pt-32">
        {supportedTokenAddressesMetadata?.map((item: NFTData) => {
          return (
            <div
              key={item.contract_address}
              className={`w-[25vw] aspect-square flex flex-col justify-center items-center relative rounded-lg border transition-all ${
                selectedCardsList.includes(item.contract_address)
                  ? "border-blue-500 border-4 skew-x-6 -skew-y-3 shadow-2xl shadow-blue-700"
                  : "border-cardGray-700 hover:border-gray-700"
              } group bg-white p-1 md:p-2`}
              onClick={() => {
                handleCardSelect(item.contract_address);
                addPreference({
                  address: item.contract_address,
                  imageUri: item.image_uri,
                });
              }}
            >
              <div className="relative w-full h-full overflow-clip">
                <Image
                  src={item.image_uri}
                  alt="Logo"
                  loader={({ src }) => src}
                  fill
                  loading="lazy"
                  className="group-hover:scale-125 rounded-lg transition-transform duration-75 object-cover"
                />
              </div>
              <span className="text-black text-sm md:text-xl bg-white font-bold pt-1 md:pt-2">
                {item.name}
              </span>
            </div>
          );
        })}
                    <div
              key={1}
              className={`w-[25vw] aspect-square flex flex-col justify-center items-center relative rounded-lg border transition-all ${
                selectedCardsList.includes("0xb24cd494faE4C180A89975F1328Eab2a7D5d8f11")
                  ? "border-blue-500 border-4 skew-x-6 -skew-y-3 shadow-2xl shadow-blue-700"
                  : "border-cardGray-700 hover:border-gray-700"
              } group bg-white p-1 md:p-2`}
              onClick={() => {
                handleCardSelect("0xb24cd494faE4C180A89975F1328Eab2a7D5d8f11");
                addPreference({
                  address: "0xb24cd494faE4C180A89975F1328Eab2a7D5d8f11",
                  imageUri: "https://yt3.googleusercontent.com/Bh5YI5IVd53atK2LaTUudu3hqyrJNL8SSUa3DTWOlmtW69qcE9V5wZmAoNLrHKhNvltKB4rZDQ=s900-c-k-c0x00ffffff-no-rj",
                });
              }}
            >
              <div className="relative w-full h-full overflow-clip">
                <Image
                  src={"https://yt3.googleusercontent.com/Bh5YI5IVd53atK2LaTUudu3hqyrJNL8SSUa3DTWOlmtW69qcE9V5wZmAoNLrHKhNvltKB4rZDQ=s900-c-k-c0x00ffffff-no-rj"}
                  alt="Logo"
                  loader={({ src }) => src}
                  fill
                  loading="lazy"
                  className="group-hover:scale-125 rounded-lg transition-transform duration-75 object-cover"
                />
              </div>
              <span className="text-black text-sm md:text-xl bg-white font-bold pt-1 md:pt-2">
                Dev DAO
              </span>
            </div>
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
