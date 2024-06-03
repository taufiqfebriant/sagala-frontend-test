import type { Metadata } from "next";
import { Container } from "../components/container";

export const metadata: Metadata = {
	title: "NFT Marketplace | Sagala Frontend Test",
};

export default function NftMarketplacePage() {
	return <Container title="NFT Marketplace" />;
}
