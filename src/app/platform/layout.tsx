"use client";
import SEO from "@utils/SEO";
import dynamic from "next/dynamic";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
require("@solana/wallet-adapter-react-ui/styles.css");

import { useMemo } from "react";
import Link from "next/link";
import { SWRConfig } from "swr";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const WalletDisconnectButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletDisconnectButton,
  { ssr: false }
);

export default function Layout({ children }: { children: React.ReactNode }) {
  const wallets = useMemo(
    () => [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ["https://api.devnet.solana.com"]
  );

  return (
    <>
      <SWRConfig
        value={{
          refreshInterval: 3000,
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <div className="mx-auto container w-full border-b border-neutral-200 text-white flex flex-row py-4">
                <div className="flex flex-row  gap-3 items-center">
                  <Link href="/" className="text-2xl font-bold text-black">
                    Story Bet
                  </Link>
                </div>
                <div className="flex flex-row ml-auto gap-3">
                  <WalletMultiButtonDynamic />
                  <WalletDisconnectButtonDynamic />
                </div>
              </div>
              <div className="mx-auto container w-full py-2">{children}</div>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </SWRConfig>
    </>
  );
}
