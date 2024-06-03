"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
	Button,
	Dialog,
	DialogTrigger,
	Modal,
	ModalOverlay,
} from "react-aria-components";
import type { IconType } from "react-icons";
import { GiHamburgerMenu } from "react-icons/gi";
import {
	MdBarChart,
	MdClose,
	MdHome,
	MdOutlineShoppingCart,
} from "react-icons/md";

type Menu = {
	href: string;
	icon: IconType;
	name: string;
};

const menus = [
	{
		href: "/",
		icon: MdHome,
		name: "Main Dashboard",
	},
	{
		href: "/nft-marketplace",
		icon: MdOutlineShoppingCart,
		name: "NFT Marketplace",
	},
	{
		href: "/data-tables",
		icon: MdBarChart,
		name: "Data Tables",
	},
] satisfies Menu[];

type Props = {
	title: string;
	children?: ReactNode;
};

export function Container(props: Props) {
	const pathname = usePathname();

	return (
		<div className="flex">
			<div className="sticky left-0 top-0 hidden h-screen w-full max-w-[17.8125rem] flex-shrink-0 bg-white px-4 pt-[1.5625rem] shadow-[rgba(112,144,176,0.08)_14px_17px_40px_4px] xl:block xl:max-w-[18.75rem]">
				<p className="my-8 text-center font-sans text-[1.5625rem] uppercase leading-none text-[#1B254B]">
					<span className="font-bold">Horizon</span> Free
				</p>

				<div className="flex flex-col gap-y-7">
					<hr />

					<nav>
						<ul>
							{menus.map((menu) => (
								<li key={menu.href}>
									<Link
										href={menu.href}
										className="flex h-[2.875rem] items-center gap-x-[1.125rem] pl-8"
									>
										<menu.icon
											size={20}
											color={pathname === menu.href ? "#422AFB" : "#8F9BBA"}
											className="flex-shrink-0"
										/>
										<p
											className={clsx("flex-1", {
												"text-[#8F9BBA]": pathname !== menu.href,
												"font-bold text-[#2D3748]": pathname === menu.href,
											})}
										>
											{menu.name}
										</p>
										{pathname === menu.href ? (
											<div className="h-9 w-1 flex-shrink-0 rounded-[5px] bg-[#422AFB]" />
										) : null}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>
			</div>

			<div className="flex-1">
				<div className="sticky top-6 z-10 rounded-2xl bg-[rgba(244,247,254,0.2)] px-5 py-3 backdrop-blur-lg backdrop-filter">
					<div className="flex justify-between">
						<div>
							<div className="flex items-center gap-x-2 text-sm text-[#2D3748]">
								<p>Pages</p>
								<p>/</p>
								<p>{props.title}</p>
							</div>

							<h1 className="mt-1 text-[2.125rem] font-bold leading-none text-[#1B254B]">
								{props.title}
							</h1>
						</div>

						<DialogTrigger>
							<Button className="p-2 xl:hidden">
								<GiHamburgerMenu size={24} />
							</Button>

							<ModalOverlay
								className={({ isEntering, isExiting }) =>
									`fixed inset-0 z-10 flex min-h-full items-center overflow-y-auto bg-black/25 text-center ${isEntering ? "duration-300 ease-out animate-in fade-in" : ""} ${isExiting ? "duration-200 ease-in animate-out fade-out" : ""} `
								}
							>
								<Modal
									className={({ isEntering, isExiting }) =>
										`h-screen w-full max-w-[18.75rem] overflow-hidden bg-white p-6 text-left align-middle shadow-xl ${isEntering ? "duration-300 ease-out animate-in zoom-in-95" : ""} ${isExiting ? "duration-200 ease-in animate-out zoom-out-95" : ""} `
									}
								>
									<Dialog className="relative outline-none">
										{({ close }) => (
											<>
												<button
													type="button"
													onClick={close}
													className="absolute -top-10 right-0"
												>
													<MdClose size={24} />
												</button>

												<p className="my-8 text-center font-sans text-[1.5625rem] uppercase leading-none text-[#1B254B]">
													<span className="font-bold">Horizon</span> Free
												</p>

												<div className="flex flex-col gap-y-7">
													<hr />

													<nav>
														<ul>
															{menus.map((menu) => (
																<li key={menu.href}>
																	<Link
																		href={menu.href}
																		className="flex h-[2.875rem] items-center gap-x-[1.125rem] pl-8"
																	>
																		<menu.icon
																			size={20}
																			color={
																				pathname === menu.href
																					? "#422AFB"
																					: "#8F9BBA"
																			}
																			className="flex-shrink-0"
																		/>
																		<p
																			className={clsx("flex-1", {
																				"text-[#8F9BBA]":
																					pathname !== menu.href,
																				"font-bold text-[#2D3748]":
																					pathname === menu.href,
																			})}
																		>
																			{menu.name}
																		</p>
																		{pathname === menu.href ? (
																			<div className="h-9 w-1 flex-shrink-0 rounded-[5px] bg-[#422AFB]" />
																		) : null}
																	</Link>
																</li>
															))}
														</ul>
													</nav>
												</div>
											</>
										)}
									</Dialog>
								</Modal>
							</ModalOverlay>
						</DialogTrigger>
					</div>
				</div>

				{props.children}
			</div>
		</div>
	);
}
