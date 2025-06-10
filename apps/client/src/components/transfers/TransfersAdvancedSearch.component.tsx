import T, { _t } from "@/components/T.component.tsx";
import Slider from "@/components/elements/Slider.component.tsx";
import store from "@/store.ts";
import SearchSchema, { type ISearch } from "@shared/schema/advancedSearch.schema.ts";
import { action, makeObservable, observable, runInAction, toJS } from "mobx";
import { observer } from "mobx-react";
import { getSnapshot } from "mobx-state-tree";
import React from "react";

interface IProps {}

class TransfersAdvancedSearch extends React.Component<IProps> {
	form: ISearch = {
		name: "",
		fromMs: 0,
		toMs: 0,
		age: [16, 40],
		stamina: [0, 11],
		keeper: [0, 18],
		pace: [0, 18],
		defender: [0, 18],
		technique: [0, 18],
		playmaker: [0, 18],
		passing: [0, 18],
		striker: [0, 18],
	};

	constructor(props: IProps) {
		super(props);
		makeObservable(this, {
			form: observable,
			onPeriodChange: action,
		});

		runInAction(() => {
			// Set initial search values
			const search = getSnapshot(store.transfers.search);
			Object.keys(search).forEach(filterName => {
				const key = filterName as keyof typeof search;
				if (search[key]) this.form[key] = search[key] as never;
			});
		});
		store.searchTransfers();
	}

	onSubmit = (e: any) => {
		e?.preventDefault();
		const { error, data } = SearchSchema.safeParse(this.form);
		if (error) console.error("Validation errors:", error.flatten().fieldErrors);

		store.transfers.search.update(data as ISearch);
		store.searchTransfers();
	};

	onPeriodChange = (values: number | number[]) => {
		const [fromMs, toMs] = values as [number, number];
		this.form.fromMs = fromMs;
		this.form.toMs = toMs;
	};

	renderItem(name: keyof ISearch, label: React.ReactNode, min: number, max: number) {
		const values = this.form[name] as number[];
		return (
			<div>
				<span className="text-xs text-nowrap text-gray-600">
					{label} ({values[0]} - {values[1]})
				</span>
				<Slider
					values={[values[0], values[1]]}
					step={1}
					min={min}
					max={max}
					onChange={changes => {
						const [min, max] = changes as number[];
						runInAction(() => (this.form[name] = [min, max] as never));
					}}
				/>
			</div>
		);
	}

	render() {
		return (
			<form onSubmit={this.onSubmit}>
				<div className="text-nowrap text-xs mb-1">
					<T>Select transfer period</T>
				</div>
				<div className="text-nowrap text-xs text-green-600 mb-1" style={{ fontSize: "10px" }}>
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

				<div className="mb-2">
					<span className="text-xs text-nowrap text-gray-600">Name</span>
					<input
						value={this.form.name}
						placeholder={_t("Search players by name")}
						onChange={(e: any) => runInAction(() => (this.form.name = e.target.value))}
						type="search"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>{this.renderItem("age", <T>Age</T>, 16, 40)}</div>
					<div />

					<div>{this.renderItem("stamina", <T>Stamina</T>, 0, 11)}</div>
					<div>{this.renderItem("keeper", <T>Keeper</T>, 0, 18)}</div>

					<div>{this.renderItem("pace", <T>Pace</T>, 0, 18)}</div>
					<div>{this.renderItem("defender", <T>Defender</T>, 0, 18)}</div>

					<div>{this.renderItem("technique", <T>Technique</T>, 0, 18)}</div>
					<div>{this.renderItem("playmaker", <T>Playmaker</T>, 0, 18)}</div>

					<div>{this.renderItem("passing", <T>Passing</T>, 0, 18)}</div>
					<div>{this.renderItem("striker", <T>Striker</T>, 0, 18)}</div>

					<div />
					<button
						onClick={this.onSubmit}
						className="cursor-pointer bg-green-600 hover:bg-green-500 text-white  py-1 px-4 rounded">
						<T>Search</T>
					</button>
				</div>
			</form>
		);
	}
}

export default observer(TransfersAdvancedSearch);
