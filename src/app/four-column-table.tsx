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
	Modal,
	Popover,
	TextField,
} from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
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
	name: string().required().default(""),
	progress: string().required().default(""),
	quantity: string().required().default(""),
	date: mixed<DateValue>()
		.defined()
		.nullable()
		.default(null)
		.test("non-nullable", "Date is required", (value) => value !== null),
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
			}),
			columnHelper.accessor("progress", {
				header: () => "Progress",
				cell: (info) => `${info.getValue()}%`,
				enableColumnFilter: false,
				enableGlobalFilter: false,
			}),
			columnHelper.accessor("quantity", {
				header: () => "Quantity",
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
				enableGlobalFilter: false,
			}),
			columnHelper.accessor("date", {
				header: () => "Date",
				cell: (info) => dayjs(info.getValue()).format("DD.MMM.YYYY"),
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
		<>
			<div className="flex items-center">
				<h2>4-Column Table</h2>

				<DialogTrigger>
					<Button>Add Product</Button>

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
		</>
	);
}
