import { CheckTable } from "./check-table";
import { DevelopmentTable } from "./development-table";
import { FourColumnTable } from "./four-column-table";

export default function HomePage() {
	return (
		<main>
			<DevelopmentTable />
			<CheckTable />
			<FourColumnTable />
		</main>
	);
}
