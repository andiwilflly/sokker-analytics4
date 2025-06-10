import T from "@/components/T.component.tsx";
import Slider from "@/components/elements/Slider.component.tsx";
import SearchSchema, { type ISearch } from "@shared/schema/advancedSearch.schema.ts";
import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";

interface IProps {}

class TransfersAdvancedSearch extends React.Component<IProps> {
	form: ISearch = {
		name: "",
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
		});
	}

	onSubmit = () => {
		const { error, data } = SearchSchema.safeParse(this.form);
		if (error) console.error("Validation errors:", error.flatten().fieldErrors);

		console.log(data);
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
						runInAction(() => (this.form[name] = [min, max] as any));
					}}
				/>
			</div>
		);
	}

	render() {
		return (
			<>
				<div className="grid grid-cols-2 gap-4">
					<div className="w-full">
						<label className="text-sm" htmlFor="name">
							Name
						</label>
						<input id="name" name="name" type="text" />
					</div>

					<div>{this.renderItem("age", <T>Age</T>, 16, 40)}</div>

					<div>{this.renderItem("stamina", <T>Stamina</T>, 0, 11)}</div>
					<div>{this.renderItem("keeper", <T>Keeper</T>, 0, 18)}</div>

					<div>{this.renderItem("pace", <T>Pace</T>, 0, 18)}</div>
					<div>{this.renderItem("defender", <T>Defender</T>, 0, 18)}</div>

					<div>{this.renderItem("technique", <T>Technique</T>, 0, 18)}</div>
					<div>{this.renderItem("playmaker", <T>Playmaker</T>, 0, 18)}</div>

					<div>{this.renderItem("passing", <T>Passing</T>, 0, 18)}</div>
					<div>{this.renderItem("striker", <T>Striker</T>, 0, 18)}</div>

					<button onClick={this.onSubmit} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-4 rounded">
						<T>Search</T>
					</button>
				</div>
			</>
		);
	}
}

export default observer(TransfersAdvancedSearch);
