import { CheckTable } from "./check-table";
import { ComplexTable } from "./complex-table";
import { DevelopmentTable } from "./development-table";
import { FourColumnTable } from "./four-column-table";

export default function HomePage() {
	return (
		<main className="grid grid-cols-2">
			<DevelopmentTable />
			<CheckTable />
			<FourColumnTable />
			<ComplexTable />
		</main>
	);
}
