import { redis1, redis2 } from "@utils/db";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { useMachingStore } from "@store/matching";
import { useMeetPersistStore } from "@store/meet";
import Image from "next/image";

interface PreferenceNFT {
  imageUri: string;
  address: string;
}

interface RoomsInterface {
  roomId: string;
  partner: string | null;
}

const Loader = () => {
  const {
    matchedAddress,
    setMatchedAddress,
    preferences: selectedPreferences,
    setMatchedRoomId,
    setMatchedPFP,
    matchedPFP,
  } = useMachingStore();
  const { publicKey } = useWallet();
  const { push } = useRouter();
  const setAvatarUrl = useMeetPersistStore((state) => state.setAvatarUrl);

  const getPreferredMatchNFT = async (preferences: string[]) => {
    let maxPreference: string | null = null;
    let maxLength = 0;
    for (const preference of preferences) {
      const value = (await redis1.get(preference)) as string[] | null;
      if (value && value.length > maxLength) {
        maxPreference = preference;
        maxLength = value.length;
      }
    }
    return maxPreference;
  };

  const getMatchedAddress = async (preferences: string[]) => {
    const preferredMatchNFT = await getPreferredMatchNFT(preferences);
    // find imageUrl of the preferredMatchNFT from preferences
    const imageUrl = selectedPreferences.find(
      (item) => item.address === preferredMatchNFT
    )?.imageUri;
    if (imageUrl) {
      setAvatarUrl(imageUrl);
    }
    console.log("Preferred Match NFT Collection is", preferredMatchNFT);
    if (preferredMatchNFT) {
      let isMatched = false;
      let counter = 0;
      const startMatching = async () => {
        const checkIfRoomExists = (await redis2.get(
          publicKey?.toBase58() as string
        )) as RoomsInterface | null;

        if (
          checkIfRoomExists?.partner !== null &&
          checkIfRoomExists?.roomId !== null
        ) {
          push(`/room/${checkIfRoomExists?.roomId}`);
          return;
        }

        let value = (await redis1.get(preferredMatchNFT)) as string[] | null;

        console.log("The addresses in the pool", value);

        const availablePartners = value?.filter(
          (item) => item !== publicKey?.toBase58()
        );

        if (availablePartners) {
          const roomPartner = availablePartners[0];

          if (roomPartner) {
            isMatched = true;

            setMatchedAddress(roomPartner);

            console.log("we are matching with", roomPartner);

            // put all the other addresses back in the pool

            const restAddresses = availablePartners.slice(1);

            await redis1.set(preferredMatchNFT, restAddresses);

            const roomId = await redis2.get(publicKey?.toBase58() as string);

            setMatchedRoomId((roomId as RoomsInterface).roomId);

            await redis2.set(roomPartner, {
              roomId: (roomId as RoomsInterface).roomId,
              partner: publicKey?.toBase58(),
              pfp: imageUrl,
            });

            await redis2.set(publicKey?.toBase58() as string, {
              roomId: (roomId as RoomsInterface).roomId,
              partner: roomPartner,
              pfp: matchedPFP,
            });

            console.log("We are still here");

            if ((roomId as RoomsInterface).roomId !== null) {
              push(`/room/${(roomId as RoomsInterface).roomId}`);
              return;
            }
          }
        } else {
          console.log("No available partners");
        }
      };

      if (counter < 5) {
        setInterval(() => {
          if (!isMatched) {
            startMatching();
            counter++;
            console.log(`Testing for ${counter} times`);
          }
        }, 5000);
      } else {
        alert("No available partners");
        push("/");
      }

      return matchedAddress;
    }
  };

  useEffect(() => {
    const preferences = localStorage.getItem("preferences");
    if (preferences) {
      const parsedPreferences = JSON.parse(preferences);
      console.log("Parsed Preferences", parsedPreferences);
      console.log("Matched Address", matchedAddress);
      if (matchedAddress === "") {
        getMatchedAddress(parsedPreferences);
      }
    }
  }, []);

  return (
    <div className="h-full w-full flex flex-col justify-evenly items-center mt-20">
      <Image
        width={100}
        height={90}
        src={"/loader.gif"}
        className="w-1/2 aspect-auto"
        alt="loading"
      />
      <div className="w-full h-full flex flex-row justify-center items-center gap-5">
        <Image
          width={10}
          height={10}
          src={"/magnifying_glass.gif"}
          className="w-20 h-20"
          alt="mag_glass"
        />
        <p className="text-4xl font-bold text-white uppercase animate-pulse">
          Finding matches...
        </p>
      </div>
    </div>
  );
};

export default Loader;
