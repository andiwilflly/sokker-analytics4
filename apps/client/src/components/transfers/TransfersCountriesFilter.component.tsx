import T from "@/components/T.component.tsx";
import TransfersCountriesFilterModal from "@/components/transfers/TransfersCountriesFilterModal.component.tsx";
import store from "@/store";
import { action, makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import ReactDOM from "react-dom";

interface IProps {}

class TransfersCountriesFilter extends React.Component<IProps> {
	isModalOpen = false;

	constructor(props: IProps) {
		super(props);
		makeObservable(this, {
			isModalOpen: observable,
			handleToggleModal: action,
		});
	}

	get selectedCountries(): number[] {
		return store.transfers.filters.all.selectedCountries;
	}

	handleToggleModal = () => {
		this.isModalOpen = !this.isModalOpen;
	};

	render() {
		return (
			<>
				<button
					className="mt-3 text-sm cursor-pointer bg-orange-600 hover:bg-orange-700 text-white font-semibold py-1 px-2 rounded"
					onClick={this.handleToggleModal}>
					<T>Selected Countries</T>&nbsp;({this.selectedCountries.length ? this.selectedCountries.length : "All"})
				</button>

				{this.isModalOpen &&
					ReactDOM.createPortal(
						<TransfersCountriesFilterModal onClose={this.handleToggleModal} selectedCountries={this.selectedCountries} />,
						window.document.getElementById("modal-container")!,
					)}
			</>
		);
	}
}

export default observer(TransfersCountriesFilter);
