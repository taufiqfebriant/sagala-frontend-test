import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Sagala Frontend Test",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${dmSans.className} bg-[#F4F7FE] leading-normal tracking-[-0.5px] text-[#1A202C]`}
			>
				{children}
			</body>
		</html>
	);
}
