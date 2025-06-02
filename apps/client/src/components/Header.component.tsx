import LangSelector from "@/components/parts/LangSelector.component.js";
import { observer } from "mobx-react";
import React from "react";

interface IProps {}

class Header extends React.Component<IProps> {
	static defaultProps = {};

	render() {
		return (
			<header className=" shadow-md px-4 py-2 w-screen flex items-center justify-between">
				<div className="text-xl font-semibold text-gray-800">SOKKER DB</div>
				<div className="flex items-center">
					{/*from:{new Date(store.transfers.fromMs).toLocaleString()}&nbsp;|&nbsp; to:*/}
					{/*{new Date(store.transfers.toMs).toLocaleString()}&nbsp;|&nbsp; transfers: {store.transfers.data.count}&nbsp;|&nbsp;*/}
					<LangSelector />
				</div>
			</header>
		);
	}
}

export default observer(Header);
