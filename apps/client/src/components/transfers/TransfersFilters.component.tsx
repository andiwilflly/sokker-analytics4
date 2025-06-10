import T from "@/components/T.component";
import Slider from "@/components/elements/Slider.component";
import TransfersAgesFilter from "@/components/transfers/TransfersAgesFilter.component";
import TransfersCountriesFilter from "@/components/transfers/TransfersCountriesFilter.component";
import store from "@/store";
import type { IFilters } from "@shared/schema/filters.schema";
import { action, makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";

interface IProps {}

class TransfersFilters extends React.Component<IProps> {
	form: IFilters = {
		fromMs: 0,
		toMs: 0,
		minSS: 0,
		maxSS: 100,
		minPrice: 0,
		maxPrice: 46875000, // 300 mln UAH
		selectedAges: [],
		selectedCountries: [],
	};

	constructor(props: IProps) {
		super(props);
		makeObservable(this, {
			form: observable,
			onPeriodChange: action,
			onPriceChange: action,
			onSSChange: action,
		});

		runInAction(() => {
			// Set initial filters values
			const filters = store.transfers.filters.all;
			Object.keys(filters).forEach(filterName => {
				const key = filterName as keyof typeof filters;
				if (filters[key]) this.form[key] = filters[key] as any;
			});
		});

		store.filterTransfers();
	}

	onPeriodChange = (values: number | number[]) => {
		const [fromMs, toMs] = values as [number, number];
		this.form.fromMs = fromMs;
		this.form.toMs = toMs;
		store.transfers.filters.update({ fromMs: fromMs, toMs: toMs });
	};

	onPriceChange = (values: number | number[]) => {
		const [minPrice, maxPrice] = values as [number, number];
		this.form.minPrice = minPrice;
		this.form.maxPrice = maxPrice;
		store.transfers.filters.update({ minPrice, maxPrice });
	};

	onSSChange = (values: number | number[]) => {
		const [minSS, maxSS] = values as [number, number];
		this.form.minSS = minSS;
		this.form.maxSS = maxSS;
		store.transfers.filters.update({ minSS, maxSS });
	};

	render() {
		return (
			<>
				<div className="text-nowrap mb-1">
					<T>Select transfer period</T>
				</div>
				<div className="text-nowrap text-green-600 mb-1" style={{ fontSize: "10px" }}>
					({new Date(this.form.fromMs).toLocaleString()}
					&nbsp;-&nbsp;
					{new Date(this.form.toMs).toLocaleString()})
				</div>

				<Slider
					values={[this.form.fromMs, this.form.toMs]}
					step={1000}
					min={store.transfers.fromMs}
					max={store.transfers.toMs}
					onChange={this.onPeriodChange}
				/>

				<div className="text-nowrap mb-1 mt-5">
					<T>Transfers price</T>
				</div>
				<div className="text-nowrap text-green-600 mb-1" style={{ fontSize: "10px" }}>
					({store.formatPrice(this.form.minPrice)} - {store.formatPrice(this.form.maxPrice)})
				</div>

				<Slider
					values={[this.form.minPrice, this.form.maxPrice]}
					step={1000}
					min={0}
					max={46875000}
					onChange={this.onPriceChange}
				/>

				<div className="text-nowrap mb-1 mt-5">
					<T>Sum skill</T>{" "}
					<span className="text-green-600">
						({this.form.minSS} - {this.form.maxSS})
					</span>
				</div>

				<Slider values={[this.form.minSS, this.form.maxSS]} min={0} max={100} step={1} onChange={this.onSSChange} />

				<div className="mt-4">
					<TransfersAgesFilter />
				</div>

				<div className="mt-4">
					<TransfersCountriesFilter />
				</div>
			</>
		);
	}
}

export default observer(TransfersFilters);
