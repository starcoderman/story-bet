import { NextResponse } from "next/server";
import z from "zod";
import { buildLogout, getUserObject, parseParams } from "@utils/api/apiutil";
import prisma from "@utils/prisma";
import { withSessionRouteNew } from "@utils/session/session";
import { Keypair, PublicKey } from "@solana/web3.js";
import { AnchorAdminSetup } from "@utils/admin/AdminAnchor";
import {
  DEFAULT_PRICE_LADDER,
  MarketType,
  createMarket,
  createMarketWithOutcomesAndPriceLadder,
  openMarket,
  addPricesToOutcome,
  batchAddPricesToOutcomePool,
  getMarket,
} from "@monaco-protocol/admin-client";

export const GET = withSessionRouteNew(async (req) => {
  const eventPubkey = Keypair.generate().publicKey;
  const { program, provider } = await AnchorAdminSetup();

  const createMarketResponse = await createMarketWithOutcomesAndPriceLadder(
    program,
    "Ducks vs Penguins",
    MarketType.EventResultWinner,
    new PublicKey(process.env.NEXT_PUBLIC_MARKET_TOKEN as string),
    // 24 hours from now
    new Date().getTime() + 24 * 60 * 60 * 1000,
    eventPubkey,
    ["YES", "NO"],
    []
  );

  const newStory = await prisma.story.create({
    data: {
      storyNumber: 0,
      title: "Ducks vs Penguins",
      storyQuestion: "Will ducks win the basketball game?",
      storyMarketAddress: createMarketResponse.data.marketPk.toString(),
    },
  });
  const price_ladder = [
    1.001, 1.002, 1.003, 1.004, 1.005, 1.006, 1.007, 1.008, 1.009, 1.01, 1.02,
    1.03, 1.04, 1.05, 1.06, 1.07, 1.08, 1.09, 1.1, 1.11, 1.12, 1.13, 1.14, 1.15,
    1.94, 1.95, 1.96, 1.97, 1.98, 1.99, 2, 2.25, 2.5, 2.75, 3, 3.5, 4, 4.5, 5,
    5.5, 6, 6.5, 7, 7.6, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 33, 34,
    35, 36, 38, 40, 42, 44, 46, 48, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 99,
  ];

  const addPricesResponse = await batchAddPricesToOutcomePool(
    program,
    createMarketResponse.data.marketPk,
    0,
    price_ladder,
    25
  );
  const openMarketResponse = await openMarket(program, createMarketResponse.data.marketPk);


  return NextResponse.json({
    success: true,
  });
});
