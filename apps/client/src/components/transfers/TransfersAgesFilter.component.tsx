import T from "@/components/T.component.tsx";
import store from "@/store.ts";
import { makeObservable } from "mobx";
import { observer } from "mobx-react";
import React from "react";

interface IProps {}

class TransfersAgesFilter extends React.Component<IProps> {
	constructor(props: IProps) {
		super(props);
		makeObservable(this);
	}

	onAgeSelect = (age: number | React.ReactElement) => () => {
		const selectedAges = store.transfers.filters.all.selectedAges;
		let newAges: number[] = [];

		if (typeof age !== "number") {
			// All
			newAges = selectedAges.length === store.transfers.filters.agesList.length ? [] : store.transfers.filters.agesList;
		} else {
			newAges = selectedAges.includes(age) ? selectedAges.filter(a => a !== age) : [...selectedAges, age];
		}

		store.transfers.filters.update({ selectedAges: newAges });
	};

	render() {
		return (
			<>
				<T>Select Ages</T>
				<div className="mt-1 text-sm" style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
					{[<T>All</T>, ...store.transfers.filters.agesList].map((age, i) => {
						const isSelected = typeof age === "number" && store.transfers.filters.all.selectedAges.includes(age);
						return (
							<div
								className="rounded-md cursor-pointer flex items-center justify-center"
								key={i}
								onClick={this.onAgeSelect(age)}
								style={{
									width: 30,
									height: 30,
									color: isSelected ? "white" : "black",
									background: isSelected ? "#8f8fea" : "transparent",
									border: isSelected ? "1px solid #8f8fea" : "1px dashed #8f8fea",
								}}>
								{age}
							</div>
						);
					})}
				</div>
			</>
		);
	}
}

export default observer(TransfersAgesFilter);
