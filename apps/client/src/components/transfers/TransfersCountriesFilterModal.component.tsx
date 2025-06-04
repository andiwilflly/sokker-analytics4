import T from "@/components/T.component.tsx";
import store from "@/store.ts";
import countriesUtil from "@shared/utils/countries.util.ts";
import { observer } from "mobx-react";
import React from "react";

interface IProps {
	selectedCountries: Array<number>;
	onClose: () => void;
}

class TransfersCountriesFilterModal extends React.Component<IProps> {
	onSelectCountry = (countryCode: number) => () => {
		const selectedCountries = store.transfers.filters.all.selectedCountries;
		let newCountries: number[] = [];

		newCountries = selectedCountries.includes(countryCode)
			? selectedCountries.filter(a => a !== countryCode)
			: [...selectedCountries, countryCode];

		store.transfers.filters.update({
			selectedCountries: newCountries,
		});
	};

	render() {
		return (
			<>
				<div className="z-1000 fixed inset-0 flex items-center justify-center">
					{/* Backdrop */}
					<div className="fixed inset-0 bg-black bg-opacity-40" onClick={this.props.onClose} />

					{/* Modal container */}

					<div
						className="bg-white z-1000 relative rounded-lg shadow-xl p-4 overflow-hidden"
						style={{ width: "90vw", height: "90vh" }}>
						<h2 className="text-lg font-semibold mb-4">
							<T>Select Countries</T>
							<br />
						</h2>

						{/* Modal content */}
						<div className="flex flex-wrap content-start gap-2 overflow-y-auto h-[calc(90vh-9rem)]">
							<div
								style={{
									backgroundColor: this.props.selectedCountries.length ? "transparent" : "#8f8fea",
								}}
								onClick={() =>
									store.transfers.filters.update({
										selectedCountries: [],
									})
								}
								className="cursor-pointer border border-gray-300 rounded p-0.5 pl-1 pr-1 text-sm">
								🌐&nbsp;<T>Select all</T>
							</div>

							{countriesUtil.map(country => (
								<div
									key={country.code}
									onClick={this.onSelectCountry(country.code)}
									style={{
										height: 26,
										color: this.props.selectedCountries.includes(country.code) ? "white" : "black",
										backgroundColor: this.props.selectedCountries.includes(country.code) ? "#8f8fea" : "transparent",
									}}
									className="cursor-pointer border border-gray-300 rounded p-0.5 pl-1 pr-1 text-sm">
									{country.icon} {country.name}
								</div>
							))}
						</div>

						<div className="mt-4 text-right">
							<button
								onClick={this.props.onClose}
								className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-4 rounded">
								<T>Apply</T>
							</button>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default observer(TransfersCountriesFilterModal);
