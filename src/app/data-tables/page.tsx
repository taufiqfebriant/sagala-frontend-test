import { CheckTable } from "./check-table";
import { ComplexTable } from "./complex-table";
import { DevelopmentTable } from "./development-table";
import { FourColumnTable } from "./four-column-table";

export default function DataTablesPage() {
	return (
		<div className="flex-1">
			<div className="sticky top-6 z-10 rounded-2xl bg-[rgba(244,247,254,0.2)] px-5 py-3 backdrop-blur-lg backdrop-filter">
				<div className="flex items-center gap-x-2 text-sm text-[#2D3748]">
					<p>Pages</p>
					<p>/</p>
					<p>Data Tables</p>
				</div>

				<h1 className="mt-1 text-[2.125rem] font-bold leading-none text-[#1B254B]">
					Data Tables
				</h1>
			</div>

			<main className="mt-7 grid grid-cols-1 gap-5 px-5 pb-5 md:grid-cols-2">
				<DevelopmentTable />
				<CheckTable />
				<FourColumnTable />
				<ComplexTable />
			</main>
		</div>
	);
}
