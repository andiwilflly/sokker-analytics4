import { observer } from "mobx-react";
import React from "react";

const TransfersDashboardGrid = React.lazy(() => import("@/components/transfers/dashboard/TransfersDashboardGrid.component"));

interface IProps {}

class TransfersDashboard extends React.Component<IProps> {
	render() {
		return (
			<div className="p-2 pl-0 min-h-full w-full flex flex-col">
				<TransfersDashboardGrid />
			</div>
		);
	}
}

export default observer(TransfersDashboard);
