"use client";

import { flexRender, type RowData, type Table } from "@tanstack/react-table";
import clsx from "clsx";

type Props<T extends RowData> = {
	table: Table<T>;
};

export function Table<T extends RowData>(props: Props<T>) {
	return (
		<div className="relative overflow-x-auto">
			<table>
				<thead>
					{props.table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th
									className="border-b border-slate-200 text-left text-[0.625rem] font-bold uppercase tracking-wider text-[#A0AEC0] md:text-xs"
									key={header.id}
								>
									{header.isPlaceholder ? null : (
										<div
											className={clsx("py-3 pl-6 pr-[0.625rem]", {
												"cursor-pointer select-none":
													header.column.getCanSort(),
											})}
											onClick={header.column.getToggleSortingHandler()}
											title={
												header.column.getCanSort()
													? header.column.getNextSortingOrder() === "asc"
														? "Sort ascending"
														: header.column.getNextSortingOrder() === "desc"
															? "Sort descending"
															: "Clear sort"
													: undefined
											}
										>
											{flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
										</div>
									)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{props.table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td
									key={cell.id}
									className="min-w-[9.375rem] py-3 pl-6 pr-[0.625rem] text-sm font-bold text-[#1B2559]"
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
