"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useDebounce } from "@uidotdev/usehooks";
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
	ListBox,
	ListBoxItem,
	Modal,
	Popover,
	Select,
	SelectValue,
	TextField,
} from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { IconType } from "react-icons";
import {
	IoIosCheckmarkCircle,
	IoIosSearch,
	IoMdCloseCircle,
} from "react-icons/io";
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
	name: string().required().default(""),
	status: string()
		.required()
		.nullable()
		.default(null)
		.test("non-nullable", "Date is required", (value) => value !== null),
	date: mixed<DateValue>()
		.defined()
		.nullable()
		.default(null)
		.test("non-nullable", "Date is required", (value) => value !== null),
	progress: string().required().default(""),
});

type Schema = InferType<typeof schema>;

export function ComplexTable() {
	const [data, setData] = useState(defaultData);
	const [globalFilter, setGlobalFilter] = useState("");
	const debouncedGlobalFilter = useDebounce(globalFilter, 500);

	const columns = useMemo(
		() => [
			columnHelper.accessor("name", {
				header: () => "Name",
				cell: (info) => info.getValue(),
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
			}),
			columnHelper.accessor("date", {
				header: () => "Date",
				cell: (info) => dayjs(info.getValue()).format("DD.MMM.YYYY"),
				enableColumnFilter: false,
				enableGlobalFilter: false,
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
			}),
			columnHelper.display({
				id: "actions",
				cell: (props) => (
					<DialogTrigger>
						<Button>Delete</Button>
						<Modal>
							<Dialog role="alertdialog">
								{({ close }) => (
									<>
										<Heading slot="title">Delete Product</Heading>
										<p>
											Are you sure you want to permanently delete this product?
											This action cannot be undone.
										</p>
										<div style={{ display: "flex", gap: 8 }}>
											<Button onPress={close}>Cancel</Button>
											<Button
												onPress={() => {
													setData((prev) => {
														const newData = prev;
														newData.splice(props.row.index, 1);

														return [...newData];
													});

													close();
												}}
											>
												Delete
											</Button>
										</div>
									</>
								)}
							</Dialog>
						</Modal>
					</DialogTrigger>
				),
				enableColumnFilter: false,
				enableGlobalFilter: false,
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
												>
													<Label>Status</Label>
													<Button>
														<SelectValue />
														<span aria-hidden="true">▼</span>
													</Button>
													<FieldError>{fieldState.error?.message}</FieldError>
													<Popover>
														<ListBox>
															{status.map((s) => (
																<ListBoxItem id={s.id} key={s.id}>
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
										className="border-b border-slate-200 py-3 pl-6 pr-[0.625rem] text-left text-[0.625rem] font-bold uppercase tracking-wider text-[#A0AEC0] md:text-xs"
										key={header.id}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
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
