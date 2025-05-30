import TransfersDashboard from "@/components/transfers/dashboard/TransfersDashboard.component.tsx";
import { observer } from "mobx-react";
import React from "react";

interface IProps {}

// TODO: React grid layout
// TODO: Translations for all langs
// TODO: Filters
// TODO: echarts line chart

class HomePage extends React.Component<IProps> {
	static defaultProps = {};

	render() {
		return (
			<>
				<TransfersDashboard />
			</>
		);
	}
}

export default observer(HomePage);
