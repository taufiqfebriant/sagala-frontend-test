import { CheckTable } from "./check-table";
import { ComplexTable } from "./complex-table";
import { DevelopmentTable } from "./development-table";
import { FourColumnTable } from "./four-column-table";

export default function HomePage() {
	return (
		<main className="flex-1 px-5 pb-5 pt-[3.125rem]">
			<h1 className="text-[2.125rem] font-bold text-[#1B254B]">Data Tables</h1>
			<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
				<DevelopmentTable />
				<CheckTable />
				<FourColumnTable />
				<ComplexTable />
			</div>
		</main>
	);
}
