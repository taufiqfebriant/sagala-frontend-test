import type { Metadata } from "next";
import { Container } from "./components/container";

export const metadata: Metadata = {
	title: "Main Dashboard | Sagala Frontend Test",
};

export default function MainDashboardPage() {
	return <Container title="Main Dashboard" />;
}
