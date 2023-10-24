"use client";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import useSWR from "swr";
import { Prisma } from "@prisma/client";
import moment from "moment";
import { useState } from "react";
import { BN } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

import { createOrder, getMintInfo } from "@monaco-protocol/client";

export default function Platform() {
  const { wallet, publicKey } = useWallet();

  return (
    <>
      {!wallet && <ConnectWallet />}
      {wallet && <Story />}
    </>
  );
}

export function ConnectWallet() {
  return (
    <>
      <div className="flex flex-col gap-2 mt-12">
        <p className="text-sm">Connect your wallet</p>
        <p className="text-sm">
          Please connect your wallet 
        </p>
      </div>
    </>
  );
}

export function Story() {
  const { connection } = useConnection();
  const { wallet, publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();

  const [loading, setLoading] = useState(false);

  const [amount, setAmount] = useState(1);

  const { data, isLoading } = useSWR("/api/story/list");

  const storyLines = data?.stories as Prisma.StoryLineGetPayload<{}>[];
  const story = data?.story as Prisma.StoryGetPayload<{}>;

  async function placeBet(type: "yes" | "no") {
    const odds = 2;
    if (!anchorWallet) {
      console.log("no anchor wallet");
      return;
    }
    setLoading(true);

    try {
      const provider = new anchor.AnchorProvider(
        new anchor.web3.Connection(process.env.NEXT_PUBLIC_RPC_URL as string),

        anchorWallet,
        {
          preflightCommitment: "confirmed",
        }
      );

      const program = await anchor.Program.at(
        process.env.NEXT_PUBLIC_PROGRAM_ID as string,
        provider
      );

      const marketTokenPk = new PublicKey(
        process.env.NEXT_PUBLIC_MARKET_TOKEN as string
      );

      const mintInfo = await getMintInfo(program, marketTokenPk);

      let stakedAmount = type === "yes" ? amount : amount / (odds - 1);

      stakedAmount = Math.round(stakedAmount * 100) / 100;

      const forOutcome = type === "yes";

      const stakeInteger = new BN(stakedAmount * 10 ** mintInfo.data.decimals);

      const createOrderResponse = await createOrder(
        program,
        new PublicKey(story.storyMarketAddress),
        0,
        forOutcome,
        odds,
        stakeInteger
      );

      console.log("createOrderResponse", createOrderResponse);

      if (createOrderResponse.success) {
        alert("Bet placed successfully");
      } else {
        alert("Bet failed");
      }
    } catch (e) {
      console.log("something is amiss..", e);
    }

    setLoading(false);
  }

  if (isLoading || !story)
    return (
      <>
        <div className="flex flex-col gap-2 mt-12 pb-32">
          <p className="text-sm">Loading Story</p>
        </div>
      </>
    );

  return (
    <>
      <div className="flex flex-col gap-2 mt-12 pb-32">
        <h1 className="text-2xl font-bold">{story.title}</h1>
        <p className="text-sm">{story.storyQuestion}</p>
        <div className="flex flex-row gap-2 mt-2">
          <input
            value={amount}
            className="rounded-md px-3 py-2 flex items-center hover:text-neutral-200 flex-1 text-center border"
            placeholder="Enter amount"
            onChange={(e) => setAmount(parseInt(e.target.value))}
          />
        </div>
        <div className="flex flex-row gap-2 text-white">
          <button
            disabled={loading}
            onClick={() => placeBet("yes")}
            className="bg-green-500 rounded-md px-3 py-2 flex items-center hover:text-neutral-200 flex-1 text-center"
          >
            {loading ? "Loading..." : "Bet YES"}
          </button>
          <button
            disabled={loading}
            onClick={() => placeBet("no")}
            className="bg-red-500 rounded-md px-3 py-2 flex items-center hover:text-neutral-200 flex-1 text-center"
          >
            {loading ? "Loading..." : "Bet NO"}
          </button>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          {storyLines.map((storyLine) => {
            return (
              <>
                <div className="flex flex-col gap-2 p-5 bg-gray-100 rounded-md">
                  <p className="text-sm">
                    {moment(storyLine.createdAt).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </p>
                  <pre className="text-lg max-w-full whitespace-pre-wrap ">{storyLine.text}</pre>
                </div>
              </>
            );
          })}

          <p className="text-sm font-bold mt-10">New Story Line at :</p>

          <p className="text-sm">
            {moment(storyLines[storyLines.length - 1].createdAt)
              .add(15, "minutes")
              .format("MMMM Do YYYY, h:mm:ss a")}
          </p>

          <p className="text-sm font-bold mt-10">Story Ends :</p>
          <p className="text-sm">
            {moment(story.createdAt)
              .add(1, "days")
              .format("MMMM Do YYYY, h:mm:ss a")}
          </p>
        </div>
      </div>
    </>
  );
}
