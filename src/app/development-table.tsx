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
	Checkbox,
	CheckboxGroup,
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
import type { IconType } from "react-icons";
import { IoLogoAndroid, IoLogoApple, IoLogoWindows } from "react-icons/io";
import { MdCheck } from "react-icons/md";
import { InferType, array, mixed, object, string } from "yup";

type Technology = {
	id: string;
	name: string;
	icon: IconType;
};

const technologies = [
	{
		id: "apple",
		name: "Apple",
		icon: IoLogoApple,
	},
	{
		id: "android",
		name: "Android",
		icon: IoLogoAndroid,
	},
	{
		id: "windows",
		name: "Windows",
		icon: IoLogoWindows,
	},
] satisfies Technology[];

type Product = {
	name: string;
	technologies: Technology[];
	progress: number;
	date: Date;
};

const defaultData: Product[] = [
	{
		name: "Marketplace",
		technologies,
		date: new Date(2021, 0, 12),
		progress: 75.5,
	},
	{
		name: "Venus DB PRO",
		technologies: [technologies[0]],
		date: new Date(2021, 1, 21),
		progress: 35.4,
	},
];

const columnHelper = createColumnHelper<Product>();

const schema = object({
	name: string().required().default(""),
	technologies: array().of(string().required()).min(1).default([]),
	date: mixed<DateValue>()
		.defined()
		.nullable()
		.default(null)
		.test("non-nullable", "Date is required", (value) => value !== null),
	progress: string().required().default(""),
});

type Schema = InferType<typeof schema>;

export function DevelopmentTable() {
	const [data, setData] = useState(defaultData);
	const [globalFilter, setGlobalFilter] = useState("");
	const debouncedGlobalFilter = useDebounce(globalFilter, 500);

	const columns = useMemo(
		() => [
			columnHelper.accessor("name", {
				header: () => "Name",
				cell: (info) => info.getValue(),
			}),
			columnHelper.accessor("technologies", {
				header: () => "Tech",
				cell: (info) => (
					<div className="flex items-center">
						{info.getValue().map((technology) => (
							<technology.icon key={technology.id} />
						))}
					</div>
				),
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
							style={{ width: info.getValue() }}
						/>
					</div>
				),
				enableColumnFilter: false,
				enableGlobalFilter: false,
			}),
			columnHelper.display({
				id: "actions",
				cell: (props) => {
					return (
						<>
							<DialogTrigger>
								<Button>Delete</Button>
								<Modal>
									<Dialog role="alertdialog">
										{({ close }) => (
											<>
												<Heading slot="title">Delete Product</Heading>
												<p>
													Are you sure you want to permanently delete this
													product? This action cannot be undone.
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
						</>
					);
				},
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
				<h2>Development Table</h2>

				<DialogTrigger>
					<Button>Add Product</Button>

					<Modal>
						<Dialog>
							{({ close }) => (
								<form
									onSubmit={form.handleSubmit((data) => {
										const relatedTechnologies = technologies.filter(
											(technology) => data.technologies.includes(technology.id),
										);

										setData((prev) => [
											{
												name: data.name,
												technologies: relatedTechnologies,
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
										name="technologies"
										render={(renderProps) => (
											<CheckboxGroup
												{...renderProps.field}
												isInvalid={renderProps.fieldState.invalid}
											>
												<Label>Tech</Label>

												{technologies.map((technology) => (
													<Checkbox key={technology.id} value={technology.id}>
														{({ isSelected }) => (
															<div className="flex items-center">
																<div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition">
																	{isSelected ? <MdCheck /> : null}
																</div>
																{technology.name}
															</div>
														)}
													</Checkbox>
												))}

												<FieldError>
													{renderProps.fieldState.error?.message}
												</FieldError>
											</CheckboxGroup>
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
		</>
	);
}
