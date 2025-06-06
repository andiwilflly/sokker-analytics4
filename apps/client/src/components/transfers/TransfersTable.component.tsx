import PreLoader from "@/components/PreLoader.component.tsx";
import store from "@/store.ts";
import type { ITransfer } from "@shared/schema/transfers.schema.ts";
import { ArrowUp } from "lucide-react";
import { type IReactionDisposer, makeObservable, observable, reaction, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import ReactPaginate from "react-paginate";

interface IProps {
	width: number;
	height: number;
}

class TransfersTable extends React.Component<IProps> {
	"@reaction on store.isLoading"!: IReactionDisposer;

	rowHeight = 30.5;
	transfers: ITransfer[] = [];
	pagination = {
		isLoading: false,
		page: 1,
	};

	constructor(props: IProps) {
		super(props);
		makeObservable(this, {
			transfers: observable,
			pagination: observable,
		});
	}

	get rowsMaxCount(): number {
		return Math.ceil(this.props.height / this.rowHeight) - 3;
	}

	componentDidMount() {
		this["@reaction on store.isLoading"] = reaction(
			() => `${store.isLoading}|${this.pagination.page}`,
			async () => {
				if (store.isLoading) return;
				runInAction(() => (this.pagination.isLoading = true));
				const { data } = await store.transfers.worker.transfers({ page: this.pagination.page, perPage: this.rowsMaxCount });
				if (data) runInAction(() => (this.transfers = data.transfers));
				runInAction(() => (this.pagination.isLoading = false));
			},
			{ name: "@reaction on store.isLoading", fireImmediately: true },
		);
	}

	componentWillUnmount() {
		this["@reaction on store.isLoading"]();
	}

	renderTableHead({
		width,
		name,
		isLast,
		isSortable,
	}: {
		width: number | string;
		name: React.ReactNode;
		isLast?: boolean;
		isSortable?: boolean;
	}) {
		return (
			<th>
				<div
					style={{ minWidth: width, width }}
					className={`${isLast ? "" : "border-r border-gray-300"} pr-4 flex justify-between items-center`}>
					<span>{name}</span>
					{isSortable ? (
						<ArrowUp className="cursor-pointer ml-2 text-white border border-gray-300 rounded-full p-1 hover:bg-purple-300" />
					) : null}
				</div>
			</th>
		);
	}

	render() {
		console.log(this.rowsMaxCount);
		return (
			<div className="relative overflow-hidden :bordered" style={{ width: this.props.width, height: this.props.height }}>
				<table>
					<thead>
						<tr>
							{this.renderTableHead({ width: 100, name: "ID", isSortable: true })}
							{this.renderTableHead({ width: 170, name: "Name", isSortable: true })}
							{this.renderTableHead({ width: 100, name: "Country", isSortable: true })}
							{this.renderTableHead({ width: "100%", name: "Age", isSortable: true, isLast: true })}
						</tr>
					</thead>
					<tbody>
						{this.transfers.map(transfer => {
							return (
								<tr key={transfer.id}>
									<td>{transfer.id}</td>
									<td>{transfer.name}</td>
									<td>{transfer.country}</td>
									<td>{transfer.age}</td>
								</tr>
							);
						})}
					</tbody>
				</table>

				<ReactPaginate
					pageCount={45}
					pageRangeDisplayed={3}
					marginPagesDisplayed={1}
					onPageChange={({ selected }) => runInAction(() => (this.pagination.page = selected))}
					previousLabel="<"
					nextLabel=">"
					breakLabel="..."
					containerClassName=":pagination flex justify-end m-2"
					activeClassName=":pagination-active"
					disabledClassName=":pagination-disabled"
				/>

				{store.isLoading || this.pagination.isLoading ? (
					<div className="absolute inset-0 pointer-events-none flex items-center justify-center">
						<PreLoader />
					</div>
				) : null}
			</div>
		);
	}
}

export default observer(TransfersTable);
