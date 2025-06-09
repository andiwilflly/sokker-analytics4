import PreLoader from "@/components/PreLoader.component";
import { _t } from "@/components/T.component";
import store from "@/store";
import { type TSortBy, type TSortOrder } from "@shared/schema/basic.schema";
import type { ITransfer } from "@shared/schema/transfers.schema";
import countries, { currencyMapping } from "@shared/utils/countries.util";
import { ArrowDown, ArrowDownUp, ArrowUp } from "lucide-react";
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
		page: 0,
		sortBy: "name" as TSortBy,
		sortOrder: "ASC" as TSortOrder,
		pagesCount: 0,
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
			() => `${store.isLoading}|${this.pagination.page}|${this.pagination.sortBy}|${this.pagination.sortOrder}`,
			async () => {
				if (store.isLoading) return;
				this.getTransfers();
			},
			{ name: "@reaction on store.isLoading", fireImmediately: true },
		);
	}

	componentDidUpdate(prevProps: IProps) {
		if (this.props.height !== prevProps.height) this.getTransfers();
	}

	componentWillUnmount() {
		this["@reaction on store.isLoading"]();
	}

	async getTransfers() {
		runInAction(() => (this.pagination.isLoading = true));
		const { data } = await store.transfers.worker.transfers({
			page: this.pagination.page,
			perPage: this.rowsMaxCount,
			sortBy: this.pagination.sortBy,
			sortOrder: this.pagination.sortOrder,
		});
		if (data)
			runInAction(() => {
				this.transfers = data.transfers;
				this.pagination.pagesCount = Math.ceil(data.total / this.rowsMaxCount);
			});
		runInAction(() => (this.pagination.isLoading = false));
	}

	renderTableHead({
		width,
		name,
		isLast,
		sortBy,
	}: {
		width: number | string;
		name: React.ReactNode;
		isLast?: boolean;
		sortBy?: TSortBy;
	}) {
		const isActiveSort = sortBy === this.pagination.sortBy;
		return (
			<th style={{ minWidth: width, width }}>
				<div className={`${isLast ? "" : "border-r border-gray-300"} pr-4 flex justify-between items-center`}>
					<span>{name}</span>
					{sortBy ? (
						isActiveSort ? (
							this.pagination.sortOrder === "ASC" ? (
								<ArrowUp
									onClick={() => runInAction(() => (this.pagination.sortOrder = "DESC"))}
									className={`cursor-pointer ml-2  border ${isActiveSort ? "text-orange-700 border-orange-700" : "text-white border-gray-300"} rounded-full p-1 hover:bg-purple-300`}
								/>
							) : (
								<ArrowDown
									onClick={() => runInAction(() => (this.pagination.sortOrder = "ASC"))}
									className={`cursor-pointer ml-2  border ${isActiveSort ? "text-orange-700 border-orange-700" : "text-white border-gray-300"} rounded-full p-1 hover:bg-purple-300`}
								/>
							)
						) : (
							<ArrowDownUp
								onClick={() => runInAction(() => (this.pagination.sortBy = sortBy!))}
								className="cursor-pointer ml-2 text-white border border-gray-300 rounded-full p-1 hover:bg-purple-300"
							/>
						)
					) : null}
				</div>
			</th>
		);
	}

	render() {
		return (
			<div
				className="relative overflow-y-hidden overflow-x-auto :bordered"
				style={{ width: this.props.width, height: this.props.height }}>
				<table>
					<tbody>
						<tr>
							{this.renderTableHead({ width: 200, name: _t("Name"), sortBy: "name" })}
							{this.renderTableHead({ width: 150, name: _t("Price"), sortBy: "price" })}
							{this.renderTableHead({ width: 200, name: _t("Country"), sortBy: "country" })}
							{this.renderTableHead({ width: 70, name: _t("Age"), sortBy: "age" })}
							{this.renderTableHead({ width: "100%", name: _t("Transfer Date"), sortBy: "transfer_time_ms", isLast: true })}
						</tr>
						{this.transfers.map(transfer => {
							const country = countries.find(country => country.code === transfer.country);
							return (
								<tr key={transfer.id}>
									<td>
										<a href={`https://sokker.org/player/PID/${transfer.pid}`} target="_blank">
											{transfer.name}
										</a>
									</td>
									<td>
										<span className="text-green-600">
											{Intl.NumberFormat(currencyMapping[store.currencyCountry.countryCode].locale, {
												style: "currency",
												currency: store.currency,
												minimumFractionDigits: 0,
												maximumFractionDigits: 0,
											}).format(transfer.price / store.currencyCountry.rate)}
										</span>
									</td>
									<td>
										{country!.icon} {country!.name}
									</td>
									<td>{transfer.age}</td>
									<td>{new Date(transfer.transfer_time_ms).toLocaleString()}</td>
								</tr>
							);
						})}
					</tbody>
				</table>

				<ReactPaginate
					pageCount={this.pagination.pagesCount}
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
