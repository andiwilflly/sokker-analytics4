import store from "@/store.ts";
import { observer } from "mobx-react";
import React from "react";

class SetupApp extends React.Component {
	render() {
		return (
			<div className="text-xl flex flex-col items-center justify-center h-screen w-screen">
				<div>
					Loading...
					<progress
						max={100}
						value={store.appLoadProgress}
						className="w-full h-4 rounded-full overflow-hidden bg-gray-200"
						style={{
							appearance: "none",
							WebkitAppearance: "none",
							MozAppearance: "none",
						}}
					/>
				</div>
			</div>
		);
	}
}

export default observer(SetupApp);
