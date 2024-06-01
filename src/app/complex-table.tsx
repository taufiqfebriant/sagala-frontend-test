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
import { IoIosCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import { RiErrorWarningFill } from "react-icons/ri";
import { InferType, mixed, object, string } from "yup";

type Status = {
	id: string;
	name: string;
	icon: IconType;
};

const status = [
	{
		id: "approved",
		name: "Approved",
		icon: IoIosCheckmarkCircle,
	},
	{
		id: "disable",
		name: "Disable",
		icon: IoMdCloseCircle,
	},
	{
		id: "error",
		name: "Error",
		icon: RiErrorWarningFill,
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
						<div className="flex items-center">
							<status.icon /> {status.name}
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
					<div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
						<div
							className="h-2.5 rounded-full bg-blue-600"
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
		<div>
			<div className="flex items-center">
				<h2>Complex Table</h2>

				<DialogTrigger>
					<Button>Add Product</Button>

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

			<input
				type="text"
				value={globalFilter}
				onChange={(e) => setGlobalFilter(e.target.value)}
			/>

			<table>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id}>
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
								<td key={cell.id}>
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
