import PreLoader from "@/components/PreLoader.component.tsx";
import T from "@/components/T.component.tsx";
import ChartTypeRenderer from "@/components/charts/ChartTypeRenderer.component";
import TransfersDashboardItemModal from "@/components/transfers/dashboard/TransfersDashboardItemModal.component.tsx";
import store from "@/store";
import { CircleX, Settings } from "lucide-react";
import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import ReactDOM from "react-dom";

interface IProps {
	i: string;
	width: number;
	height: number;
}

class TransfersDashboardItem extends React.Component<IProps> {
	titleHeight = 25;
	padding = 10;

	isEditModalOpen = false;

	constructor(props: IProps) {
		super(props);

		makeObservable(this, {
			isEditModalOpen: observable,
		});
	}

	get item() {
		return store.transfers.grid.all.get(this.props.i)!;
	}

	render() {
		if (!this.item) return "[no such widget]";

		return (
			<div className=":grid-item text-xs :bordered" style={{ width: this.props.width, height: this.props.height }}>
				<div className=":grid-title flex justify-between">
					<div className=":grid-draggable-handler overflow-hidden text-ellipsis whitespace-nowrap">
						<T>Transfers per</T>
						&nbsp;<span className="text-orange-600">{this.item.selectedX}</span>
						&nbsp;<T>for</T>
						&nbsp;<span className="text-blue-700">{this.item.selectedY.join(", ")}</span>
					</div>

					<div className="flex mr-1">
						<button
							onClick={() => {
								runInAction(() => (this.isEditModalOpen = true));
							}}
							className="cursor-pointer text-white mr-2">
							<Settings className="text-white" size={17} />
						</button>

						<button onClick={() => store.transfers.grid.removeItem(this.props.i)} className="cursor-pointer text-white">
							<CircleX className="text-red-700" size={18} />
						</button>
					</div>
				</div>

				<ChartTypeRenderer
					i={this.props.i}
					width={this.props.width - this.padding * 2}
					height={this.props.height - (this.titleHeight + this.padding * 2)}
				/>

				{store.isLoading ? (
					<div className="fixed inset-0 pointer-events-none flex items-center justify-center">
						<PreLoader />
					</div>
				) : null}

				{this.isEditModalOpen &&
					ReactDOM.createPortal(
						<TransfersDashboardItemModal i={this.props.i} onClose={() => runInAction(() => (this.isEditModalOpen = false))} />,
						window.document.getElementById("modal-container")!,
					)}
			</div>
		);
	}
}

export default observer(TransfersDashboardItem);
