import { observer } from "mobx-react";
import React from "react";

class SetupApp extends React.Component {
	render() {
		return (
			<div className="text-xl flex flex-col items-center justify-center h-screen w-screen">
				<div>Loading...</div>
			</div>
		);
	}
}

export default observer(SetupApp);
