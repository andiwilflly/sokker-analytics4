import { observer } from "mobx-react";
import React from "react";

const TransfersDashboardGrid = React.lazy(() => import("@/components/transfers/dashboard/TransfersDashboardGrid.component.tsx"));

interface IProps {}

class TransfersDashboard extends React.Component<IProps> {
	render() {
		// TODO: Currencies
		// TODO: Make part of each chart
		// TODO: Implement react grid layout
		// TODO: We need ability to see what transfers we show, like table,
		//  because sometimes data is confused, so we need to see table
		return (
			<div className="p-2 pl-0 min-h-full w-full flex flex-col">
				<TransfersDashboardGrid />
			</div>
		);
	}
}

export default observer(TransfersDashboard);
