import type { Metadata } from "next";
import { Container } from "../components/container";
import { CheckTable } from "./check-table";
import { ComplexTable } from "./complex-table";
import { DevelopmentTable } from "./development-table";
import { FourColumnTable } from "./four-column-table";

export const metadata: Metadata = {
	title: "Data Tables | Sagala Frontend Test",
};

export default function DataTablesPage() {
	return (
		<Container title="Data Tables">
			<main className="mt-7 grid grid-cols-1 gap-5 px-5 pb-5 md:grid-cols-2">
				<DevelopmentTable />
				<CheckTable />
				<FourColumnTable />
				<ComplexTable />
			</main>
		</Container>
	);
}
