"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import {
	SortingFn,
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
	CalendarGridBody,
	CalendarGridHeader,
	CalendarHeaderCell,
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
	ListBox,
	ListBoxItem,
	Modal,
	ModalOverlay,
	Popover,
	Select,
	SelectValue,
	TextField,
} from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { IconType } from "react-icons";
import { BiSolidDownArrow } from "react-icons/bi";
import {
	IoIosCheckmarkCircle,
	IoIosSearch,
	IoMdCloseCircle,
} from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";
import { InferType, mixed, object, string } from "yup";

type Status = {
	id: string;
	name: string;
	icon: IconType;
	color: string;
};

const status = [
	{
		id: "approved",
		name: "Approved",
		icon: IoIosCheckmarkCircle,
		color: "#01B574",
	},
	{
		id: "disable",
		name: "Disable",
		icon: IoMdCloseCircle,
		color: "#EE5D50",
	},
	{
		id: "error",
		name: "Error",
		icon: RiErrorWarningFill,
		color: "#FFB547",
	},
] satisfies Status[];

type Product = {
	name: string;
	status: Status;
	progress: number;
	date: Date;
};

const defaultData: Product[] = [
	{
		name: "Marketplace",
		status: status[0],
		date: new Date(2021, 0, 12),
		progress: 75.5,
	},
	{
		name: "Venus DB PRO",
		status: status[1],
		date: new Date(2021, 1, 21),
		progress: 35.4,
	},
];

const columnHelper = createColumnHelper<Product>();

const schema = object({
	name: string().label("Name").required().default(""),
	status: string()
		.required()
		.nullable()
		.default(null)
		.test(
			"non-nullable",
			"Status is a required field",
			(value) => value !== null,
		),
	date: mixed<DateValue>()
		.defined()
		.nullable()
		.default(null)
		.test(
			"non-nullable",
			"Date is a required field",
			(value) => value !== null,
		),
	progress: string().label("Progress").required().default(""),
});

type Schema = InferType<typeof schema>;

const sortStatusFn: SortingFn<Product> = (rowA, rowB, _columnId) => {
	const statusA = rowA.original.status.name;
	const statusB = rowB.original.status.name;
	return statusA > statusB ? 1 : statusA < statusB ? -1 : 0;
};

export function ComplexTable() {
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
			columnHelper.accessor("status", {
				header: () => "Status",
				cell: (info) => {
					const status = info.getValue();
					return (
						<div className="flex items-center gap-x-[0.3125rem]">
							<status.icon color={status.color} size={24} /> {status.name}
						</div>
					);
				},
				enableColumnFilter: false,
				enableGlobalFilter: false,
				sortingFn: sortStatusFn,
			}),
			columnHelper.accessor("date", {
				header: () => "Date",
				cell: (info) => dayjs(info.getValue()).format("DD.MMM.YYYY"),
				enableColumnFilter: false,
				enableGlobalFilter: false,
				sortingFn: "datetime",
			}),
			columnHelper.accessor("progress", {
				header: () => "Progress",
				cell: (info) => (
					<div className="h-2 w-full rounded-full bg-[#EFF4FB]">
						<div
							className="h-2 rounded-full bg-[#422AFB]"
							style={{ width: `${info.getValue()}%` }}
						/>
					</div>
				),
				enableColumnFilter: false,
				enableGlobalFilter: false,
				sortingFn: "basic",
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
								`fixed inset-0 z-10 flex min-h-full items-center justify-center overflow-y-auto bg-black/25 p-4 text-center backdrop-blur ${isEntering ? "duration-300 ease-out animate-in fade-in" : ""} ${isExiting ? "duration-200 ease-in animate-out fade-out" : ""} `
							}
						>
							<Modal
								className={({ isEntering, isExiting }) =>
									`w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl ${isEntering ? "duration-300 ease-out animate-in zoom-in-95" : ""} ${isExiting ? "duration-200 ease-in animate-out zoom-out-95" : ""} `
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
													className="inline-flex cursor-default justify-center rounded-md border border-solid border-transparent bg-slate-200 px-5 py-2 font-[inherit] text-base font-semibold text-slate-800 outline-none ring-blue-500 ring-offset-2 transition-colors hover:border-slate-300 focus-visible:ring-2 pressed:bg-slate-300"
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
													className="inline-flex cursor-default justify-center rounded-md border border-solid border-transparent bg-red-500 px-5 py-2 font-[inherit] text-base font-semibold text-white outline-none ring-blue-500 ring-offset-2 transition-colors hover:border-red-600 focus-visible:ring-2 pressed:bg-red-600"
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
						Complex Table
					</h2>

					<DialogTrigger
						onOpenChange={(isOpen) => {
							if (!isOpen) {
								setTimeout(() => {
									form.reset({
										name: "",
										status: null,
										date: null,
										progress: "",
									});
								}, 500);
							}
						}}
					>
						<Button
							type="button"
							className="h-10 flex-shrink-0 rounded-[70px] bg-[#11047A] px-6 text-sm font-medium text-white shadow-[rgba(112,144,176,0.08)_45px_76px_113px_7px]"
						>
							Add Product
						</Button>

						<ModalOverlay
							className={({ isEntering, isExiting }) =>
								`fixed inset-0 z-10 flex min-h-full items-center justify-center overflow-y-auto bg-black/25 p-4 text-center backdrop-blur ${isEntering ? "duration-300 ease-out animate-in fade-in" : ""} ${isExiting ? "duration-200 ease-in animate-out fade-out" : ""} `
							}
						>
							<Modal
								className={({ isEntering, isExiting }) =>
									`w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl ${isEntering ? "duration-300 ease-out animate-in zoom-in-95" : ""} ${isExiting ? "duration-200 ease-in animate-out zoom-out-95" : ""} `
								}
							>
								<Dialog className="relative outline-none">
									{({ close }) => (
										<form
											onSubmit={form.handleSubmit((data) => {
												const relatedStatus = status.find(
													(s) => s.id === data.status,
												);

												if (!relatedStatus) {
													close();
													return;
												}

												setData((prev) => [
													{
														name: data.name,
														status: relatedStatus,
														progress: Number(data.progress),
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
											<Heading
												slot="title"
												className="my-0 text-2xl font-semibold leading-6 text-slate-700"
											>
												Add Product
											</Heading>

											<div className="mt-4 flex flex-col gap-y-4">
												<Controller
													control={form.control}
													name="name"
													render={(renderProps) => (
														<TextField
															{...renderProps.field}
															isInvalid={renderProps.fieldState.invalid}
															autoFocus
															className="flex flex-col gap-1"
														>
															<Label className="w-fit cursor-default text-sm font-medium text-gray-500">
																Name
															</Label>
															<Input className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500" />
															<FieldError className="text-sm text-red-600">
																{renderProps.fieldState.error?.message}
															</FieldError>
														</TextField>
													)}
												/>

												<Controller
													control={form.control}
													name="status"
													render={({
														field: { onChange, value, disabled, ...restField },
														fieldState,
													}) => (
														<Select
															{...restField}
															onSelectionChange={onChange}
															selectedKey={value}
															isDisabled={disabled}
															isInvalid={fieldState.invalid}
															className="group flex flex-col gap-1"
														>
															<Label className="w-fit cursor-default text-sm font-medium text-gray-500">
																Status
															</Label>
															<Button className="flex w-full min-w-[150px] cursor-default items-center gap-4 rounded-lg border border-black/10 bg-gray-50 py-2 pl-3 pr-2 text-start shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] transition">
																<SelectValue className="flex-1 text-sm placeholder-shown:italic" />
																<BiSolidDownArrow
																	aria-hidden
																	className="h-4 w-4 group-disabled:text-gray-200 forced-colors:text-[ButtonText] forced-colors:group-disabled:text-[GrayText]"
																/>
															</Button>
															<FieldError className="text-sm text-red-600">
																{fieldState.error?.message}
															</FieldError>
															<Popover className="min-w-[--trigger-width] rounded-xl border border-black/10 bg-white bg-clip-padding text-slate-700 shadow-2xl forced-colors:bg-[Canvas]">
																<ListBox className="max-h-[inherit] overflow-auto p-1 outline-none [clip-path:inset(0_0_0_0_round_.75rem)]">
																	{status.map((s) => (
																		<ListBoxItem
																			id={s.id}
																			key={s.id}
																			className="group flex cursor-default select-none items-center gap-4 rounded-lg py-2 pl-3 pr-1 text-sm outline outline-0 forced-color-adjust-none"
																		>
																			{s.name}
																		</ListBoxItem>
																	))}
																</ListBox>
															</Popover>
														</Select>
													)}
												/>

												<Controller
													control={form.control}
													name="date"
													render={(renderProps) => (
														<DatePicker
															{...renderProps.field}
															isInvalid={renderProps.fieldState.invalid}
															className="group flex flex-col gap-1"
														>
															<Label className="w-fit cursor-default text-sm font-medium text-gray-500">
																Date
															</Label>
															<Group className="group flex h-9 w-auto min-w-[208px] items-center overflow-hidden rounded-lg border-2 bg-white forced-colors:bg-[Field]">
																<DateInput className="block min-w-[150px] flex-1 px-2 py-1.5 text-sm">
																	{(segment) => (
																		<DateSegment
																			className="inline rounded p-0.5 text-gray-800 caret-transparent outline outline-0 forced-color-adjust-none type-literal:px-0 forced-colors:text-[ButtonText]"
																			segment={segment}
																		/>
																	)}
																</DateInput>
																<Button className="px-2">
																	<BiSolidDownArrow />
																</Button>
															</Group>
															<FieldError className="text-sm text-red-600">
																{renderProps.fieldState.error?.message}
															</FieldError>
															<Popover className="rounded-xl border border-black/10 bg-white bg-clip-padding text-slate-700 shadow-2xl forced-colors:bg-[Canvas]">
																<Dialog className="relative max-h-[inherit] overflow-auto p-6 outline outline-0 [[data-placement]>&]:p-4">
																	<Calendar>
																		<header className="flex w-full items-center gap-1 px-1 pb-4">
																			<Button slot="previous">◀</Button>
																			<Heading className="mx-2 flex-1 text-center text-xl font-semibold text-zinc-900" />
																			<Button slot="next">▶</Button>
																		</header>
																		<CalendarGrid>
																			<CalendarGridHeader>
																				{(day) => (
																					<CalendarHeaderCell className="text-xs font-semibold text-gray-500">
																						{day}
																					</CalendarHeaderCell>
																				)}
																			</CalendarGridHeader>
																			<CalendarGridBody>
																				{(date) => (
																					<CalendarCell
																						date={date}
																						className="flex h-9 w-9 cursor-default items-center justify-center rounded-full text-sm forced-color-adjust-none"
																					/>
																				)}
																			</CalendarGridBody>
																		</CalendarGrid>
																	</Calendar>
																</Dialog>
															</Popover>
														</DatePicker>
													)}
												/>

												<Controller
													control={form.control}
													name="progress"
													render={(renderProps) => (
														<TextField
															{...renderProps.field}
															isInvalid={renderProps.fieldState.invalid}
															className="flex flex-col gap-1"
														>
															<Label className="w-fit cursor-default text-sm font-medium text-gray-500">
																Progress
															</Label>
															<Input className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500" />
															<FieldError className="text-sm text-red-600">
																{renderProps.fieldState.error?.message}
															</FieldError>
														</TextField>
													)}
												/>
											</div>

											<div className="mt-6 flex justify-end gap-2">
												<Button
													className="inline-flex cursor-default justify-center rounded-md border border-solid border-transparent bg-slate-200 px-5 py-2 font-[inherit] text-base font-semibold text-slate-800 outline-none ring-blue-500 ring-offset-2 transition-colors hover:border-slate-300 focus-visible:ring-2 pressed:bg-slate-300"
													onPress={close}
												>
													Cancel
												</Button>

												<Button
													type="submit"
													className="inline-flex cursor-default justify-center rounded-md border border-solid border-transparent bg-[#11047A] px-5 py-2 font-[inherit] text-base font-semibold text-white outline-none ring-blue-500 ring-offset-2 transition-colors hover:border-red-600 focus-visible:ring-2"
												>
													Submit
												</Button>
											</div>
										</form>
									)}
								</Dialog>
							</Modal>
						</ModalOverlay>
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
