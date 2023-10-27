import type { NextApiRequest, NextApiResponse } from "next";

interface APIData {
  success: boolean;
  message: string;
  data: any;
}

interface NFTData {
  name: string;
  image_uri: string;
  contract_address: string;
}

const testingAddresses = [
  "0x8b0ba677CD4A9833128796fe3AD90Db2076596d1",
  "0x4aB65FEb7Dc1644Cabe45e00e918815D3acbFa0a",
];

const collections = [
  {
    collection_name: "DeGods",
    collection_address: "0x8821bee2ba0df28761afff119d66390d594cd280",
    collection_chain_id: 1,
  },
  {
    collection_name: "Beanz",
    collection_address: "0x306b1ea3ecdf94aB739F1910bbda052Ed4A9f949",
    collection_chain_id: 1,
  },
  {
    collection_name: "Azuki",
    collection_address: "0xED5AF388653567Af2F388E6224dC7C4b3241C544",
    collection_chain_id: 1,
  },
  {
    collection_name: "Milady Maker",
    collection_address: "0x5af0d9827e0c53e4799bb226655a1de152a425a5",
    collection_chain_id: 1,
  },
  {
    collection_name: "Pudgy Penguins",
    collection_address: "0xBd3531dA5CF5857e7CfAA92426877b022e612cf8",
    collection_chain_id: 1,
  },
  {
    collection_name: "Doodles",
    collection_address: "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
    collection_chain_id: 1,
  },
  {
    collection_name: "Ethereum Name Service",
    collection_address: "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",
    collection_chain_id: 1,
  },
] as collectionData[];

interface collectionData {
  collection_name: string;
  collection_address: string;
  collection_chain_id: number;
}

const matchNFTs = async (req: NextApiRequest, res: NextApiResponse) => {
  // const address = "2pgp7NaXWqycNJ7kaFF9uvs2MQ1hd3dG2Gh27VUUzxcA";
  // const { walletAddress } = req.body;
  const walletAddress = "0x7Df70b612040c682d1cb2e32017446e230FcD747";

  const chain_id = 1;
  // const url = "https://api.shyft.to/sol/v1/nft/read_all?network=mainnet-beta&address=" + walletAddress;
  const url = `https://api.chainbase.online/v1/account/nfts?chain_id=${chain_id}&address=${walletAddress}&page=1&limit=100`;

  const response = await fetch(url, {
    headers: {
      "X-API-KEY": process.env.CHAINBASE_API_KEY ?? "",
    },
  });
  const data = (await response.json()) as APIData;
  const nfts: NFTData[] = data.data;

  const filteredNFTs = nfts.filter((nft: any) => {
    return collections.some((collection) => {
      if (nft.contract_address === collection.collection_address) {
        console.log(
          "Address",
          walletAddress,
          "has",
          collection.collection_name
        );
        return true;
      }
    });
  });

  // //remove nfts with same collection address
  // filteredNFTs = filteredNFTs?.filter(
  //   (nft: NFTData, index: number, self: NFTData[]) =>
  //     index ===
  //     self.findIndex((t) => t.collection.address === nft.collection.address)
  // );

  // if (!filteredNFTs) {
  //   return res.status(404).json({ message: "No NFTs found" });
  // }
  // return res.status(200).json(filteredNFTs);
};

export default matchNFTs;
