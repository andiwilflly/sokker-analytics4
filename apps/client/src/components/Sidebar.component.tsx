import TransfersFilters from "@/components/transfers/TransfersFilters.component";
import { observer } from "mobx-react";
import React from "react";

interface IProps {}

class Sidebar extends React.Component<IProps> {
	static defaultProps = {};

	render() {
		return (
			<>
				<TransfersFilters />
			</>
		);
	}
}

export default observer(Sidebar);
