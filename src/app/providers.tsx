"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { type ReactNode } from "react";

type Props = {
	children: ReactNode;
};

export const Providers = (props: Props) => {
	return (
		<>
			{props.children}
			<ProgressBar
				height="4px"
				color="#422AFB"
				options={{ showSpinner: false }}
				shallowRouting
			/>
		</>
	);
};
