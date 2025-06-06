import T from "@/components/T.component.tsx";
import TransfersTable from "@/components/transfers/TransfersTable.component.tsx";
import { action, makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";

const LazyTransfersDashboard = React.lazy(() => import("@/components/transfers/dashboard/TransfersDashboard.component"));

interface IProps {}

class HomePage extends React.Component<IProps> {
	static defaultProps = {};

	activeTab: 0 | 1 = 1;

	constructor(props: IProps) {
		super(props);
		makeObservable(this, {
			activeTab: observable,
			setActiveTab: action,
		});
	}

	setActiveTab = (activeTab: 0 | 1) => {
		this.activeTab = activeTab;
	};

	renderTab(tabIndex: 0 | 1, children: React.ReactElement) {
		return (
			<div
				className="w-full h-full"
				style={{
					opacity: this.activeTab === tabIndex ? "1" : "0",
					pointerEvents: this.activeTab === tabIndex ? "auto" : "none",
					position: this.activeTab === tabIndex ? "inherit" : "absolute",
					top: this.activeTab === tabIndex ? "inherit" : -100000,
				}}>
				{children}
			</div>
		);
	}

	render() {
		return (
			<div className="flex flex-col h-full w-full pt-2 pr-2">
				<div className="flex">
					<button
						className={`pb-2 cursor-pointer text-sm mr-4 font-medium border-b-2 ${
							this.activeTab === 0
								? "border-violet-500 text-violet-600"
								: "text-gray-500 hover:text-gray-700 border-transparent"
						}`}
						onClick={() => this.setActiveTab(0)}>
						<T>Dashboard</T>
					</button>
					<button
						className={`pb-2 cursor-pointer text-sm font-medium border-b-2 ${
							this.activeTab === 1
								? "border-violet-500 text-violet-600"
								: "text-gray-500 hover:text-gray-700 border-transparent"
						}`}
						onClick={() => this.setActiveTab(1)}>
						<T>Players list</T>
					</button>
				</div>

				{/* Content */}
				<div className="mt-2 relative w-full" style={{ height: "calc(100vh - 147px)" }}>
					{this.renderTab(0, <LazyTransfersDashboard />)}
					{this.renderTab(1, <AutoSizer>{({ width, height }) => <TransfersTable width={width} height={height} />}</AutoSizer>)}
				</div>
			</div>
		);
	}
}

export default observer(HomePage);
