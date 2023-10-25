import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { ReactNode } from "react";
import { WagmiConfig, createConfig } from "wagmi";

interface Props {
  children: ReactNode;
}

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.ALCHEMY_ID ?? '', // provide a default value
    walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID ?? '', // provide a default value

    // Required
    appName: "Converse",

    // Optional
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const WalletContextProvider = ({ children }: Props) => {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default WalletContextProvider;