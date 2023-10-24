import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export async function AnchorAdminSetup() {
  const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID as string);
  const adminKeyPair = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(process.env.MONACO_ADMIN_KEY as string))
  );

  const provider = new anchor.AnchorProvider(
    new anchor.web3.Connection(process.env.NEXT_PUBLIC_RPC_URL as string),
    new anchor.Wallet(adminKeyPair),
    {
      preflightCommitment: "confirmed",
    }
  );

  const program = await anchor.Program.at(programId, provider);

  return { program, provider };
}

export const MarketToken = new PublicKey(
  process.env.NEXT_PUBLIC_MARKET_TOKEN as string
);
