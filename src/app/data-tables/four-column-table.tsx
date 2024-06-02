"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useDebounce } from "@uidotdev/usehooks";
import clsx from "clsx";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import {
	Button,
	Calendar,
	CalendarCell,
	CalendarGrid,
	DateInput,
	DatePicker,
	DateSegment,
	DateValue,
	Dialog,
	DialogTrigger,
	FieldError,
	Group,
	Heading,
	Input,
	Label,
	Modal,
	ModalOverlay,
	Popover,
	TextField,
} from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { IoIosSearch } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { InferType, mixed, object, string } from "yup";

type Product = {
	name: string;
	progress: number;
	quantity: number;
	date: Date;
};

const defaultData: Product[] = [
	{
		name: "Marketplace",
		progress: 75.5,
		quantity: 2458,
		date: new Date(2021, 0, 12),
	},
	{
		name: "Venus DB PRO",
		progress: 35.4,
		quantity: 1485,
		date: new Date(2021, 1, 21),
	},
];

const columnHelper = createColumnHelper<Product>();

const schema = object({
	name: string().label("Name").required().default(""),
	progress: string().label("Progress").required().default(""),
	quantity: string().label("Quantity").required().default(""),
	date: mixed<DateValue>()
		.defined()
		.nullable()
		.default(null)
		.test(
			"non-nullable",
			"Date is a required field",
			(value) => value !== null,
		),
});

type Schema = InferType<typeof schema>;

export function FourColumnTable() {
	const [data, setData] = useState(defaultData);
	const [globalFilter, setGlobalFilter] = useState("");
	const debouncedGlobalFilter = useDebounce(globalFilter, 500);

	const columns = useMemo(
		() => [
			columnHelper.accessor("name", {
				header: () => "Name",
				cell: (info) => info.getValue(),
				sortingFn: "alphanumeric",
			}),
			columnHelper.accessor("progress", {
				header: () => "Progress",
				cell: (info) => `${info.getValue()}%`,
				enableColumnFilter: false,
				enableGlobalFilter: false,
				sortingFn: "basic",
			}),
			columnHelper.accessor("quantity", {
				header: () => "Quantity",
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
				enableGlobalFilter: false,
				sortingFn: "basic",
			}),
			columnHelper.accessor("date", {
				header: () => "Date",
				cell: (info) => dayjs(info.getValue()).format("DD.MMM.YYYY"),
				enableColumnFilter: false,
				enableGlobalFilter: false,
				sortingFn: "datetime",
			}),
			columnHelper.display({
				id: "actions",
				header: () => "Actions",
				cell: (props) => (
					<DialogTrigger>
						<Button>
							<MdDelete className="text-red-500" size={20} />
						</Button>

						<ModalOverlay
							className={({ isEntering, isExiting }) =>
								`fixed inset-0 z-10 flex min-h-full items-center justify-center overflow-y-auto bg-black/25 p-4 text-center backdrop-blur ${isEntering ? "animate-in fade-in duration-300 ease-out" : ""} ${isExiting ? "animate-out fade-out duration-200 ease-in" : ""} `
							}
						>
							<Modal
								className={({ isEntering, isExiting }) =>
									`w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl ${isEntering ? "animate-in zoom-in-95 duration-300 ease-out" : ""} ${isExiting ? "animate-out zoom-out-95 duration-200 ease-in" : ""} `
								}
							>
								<Dialog role="alertdialog" className="relative outline-none">
									{({ close }) => (
										<>
											<Heading
												slot="title"
												className="my-0 text-2xl font-semibold leading-6 text-slate-700"
											>
												Delete Product
											</Heading>
											<p className="mt-3 text-slate-500">
												Are you sure you want to permanently delete this
												product? This action cannot be undone.
											</p>
											<div className="mt-6 flex justify-end gap-2">
												<Button
													className="pressed:bg-slate-300 inline-flex cursor-default justify-center rounded-md border border-solid border-transparent bg-slate-200 px-5 py-2 font-[inherit] text-base font-semibold text-slate-800 outline-none ring-blue-500 ring-offset-2 transition-colors hover:border-slate-300 focus-visible:ring-2"
													onPress={close}
												>
													Cancel
												</Button>
												<Button
													onPress={() => {
														setData((prev) => {
															const newData = prev;
															newData.splice(props.row.index, 1);

															return [...newData];
														});

														close();
													}}
													className="pressed:bg-red-600 inline-flex cursor-default justify-center rounded-md border border-solid border-transparent bg-red-500 px-5 py-2 font-[inherit] text-base font-semibold text-white outline-none ring-blue-500 ring-offset-2 transition-colors hover:border-red-600 focus-visible:ring-2"
												>
													Delete
												</Button>
											</div>
										</>
									)}
								</Dialog>
							</Modal>
						</ModalOverlay>
					</DialogTrigger>
				),
				enableColumnFilter: false,
				enableGlobalFilter: false,
				enableSorting: false,
			}),
		],
		[],
	);

	const table = useReactTable({
		data,
		columns,
		state: {
			globalFilter: debouncedGlobalFilter,
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		globalFilterFn: "includesString",
	});

	const form = useForm<Schema>({
		resolver: yupResolver(schema),
		defaultValues: schema.getDefault(),
	});

	return (
		<div className="flex flex-col gap-y-5 rounded-[20px] bg-white py-5">
			<div className="flex flex-col gap-y-4 px-[1.5625rem]">
				<div className="flex items-center justify-between gap-x-4">
					<h2 className="text-[1.375rem] font-bold leading-[100%] text-[#1B2559]">
						4-Column Table
					</h2>

					<DialogTrigger>
						<Button
							type="button"
							className="h-10 flex-shrink-0 rounded-[70px] bg-[#11047A] px-6 text-sm font-medium text-white shadow-[rgba(112,144,176,0.08)_45px_76px_113px_7px]"
						>
							Add Product
						</Button>

						<Modal>
							<Dialog>
								{({ close }) => (
									<form
										onSubmit={form.handleSubmit((data) => {
											setData((prev) => [
												{
													name: data.name,
													progress: Number(data.progress),
													quantity: Number(data.quantity),
													date: dayjs(
														data.date?.toString(),
														"YYYY-MM-DD",
													).toDate(),
												},
												...prev,
											]);

											close();
										})}
									>
										<Heading slot="title">Add Product</Heading>
										<Controller
											control={form.control}
											name="name"
											render={(renderProps) => (
												<TextField
													{...renderProps.field}
													isInvalid={renderProps.fieldState.invalid}
													autoFocus
												>
													<Label>Name</Label>
													<Input />
													<FieldError>
														{renderProps.fieldState.error?.message}
													</FieldError>
												</TextField>
											)}
										/>

										<Controller
											control={form.control}
											name="progress"
											render={(renderProps) => (
												<TextField
													{...renderProps.field}
													isInvalid={renderProps.fieldState.invalid}
												>
													<Label>Progress</Label>
													<Input />
													<FieldError>
														{renderProps.fieldState.error?.message}
													</FieldError>
												</TextField>
											)}
										/>

										<Controller
											control={form.control}
											name="quantity"
											render={(renderProps) => (
												<TextField
													{...renderProps.field}
													isInvalid={renderProps.fieldState.invalid}
												>
													<Label>Quantity</Label>
													<Input />
													<FieldError>
														{renderProps.fieldState.error?.message}
													</FieldError>
												</TextField>
											)}
										/>

										<Controller
											control={form.control}
											name="date"
											render={(renderProps) => (
												<DatePicker
													{...renderProps.field}
													isInvalid={renderProps.fieldState.invalid}
												>
													<Label>Date</Label>
													<Group>
														<DateInput>
															{(segment) => <DateSegment segment={segment} />}
														</DateInput>
														<Button>▼</Button>
													</Group>
													<FieldError>
														{renderProps.fieldState.error?.message}
													</FieldError>
													<Popover>
														<Dialog>
															<Calendar>
																<header>
																	<Button slot="previous">◀</Button>
																	<Heading />
																	<Button slot="next">▶</Button>
																</header>
																<CalendarGrid>
																	{(date) => <CalendarCell date={date} />}
																</CalendarGrid>
															</Calendar>
														</Dialog>
													</Popover>
												</DatePicker>
											)}
										/>

										<Button type="submit">Submit</Button>
									</form>
								)}
							</Dialog>
						</Modal>
					</DialogTrigger>
				</div>

				<div className="flex items-center overflow-hidden rounded-2xl bg-[#F4F7FE]">
					<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center">
						<IoIosSearch size={20} color="#2D3748" />
					</div>

					<input
						type="text"
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
						className="h-10 flex-1 bg-inherit pr-5 focus-visible:outline-none"
						placeholder="Search..."
					/>
				</div>
			</div>

			<div className="relative overflow-x-auto">
				<table>
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
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
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<td
										className="min-w-[9.375rem] py-3 pl-6 pr-[0.625rem] text-sm font-bold text-[#1B2559]"
										key={cell.id}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
