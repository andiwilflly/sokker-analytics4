import store from "@/store";
import { observer } from "mobx-react";
import React from "react";

class SetupApp extends React.Component {
	render() {
		return (
			<div className="text-xl flex flex-col items-center justify-center h-screen w-screen">
				<div>Loading...</div>

				<div className="w-screen">
					<div className="text-nowrap absolute bottom-7 pl-3 text-sm">
						Load <b>{new Intl.NumberFormat("en-US").format(store.loading.loaded)}</b> bites of{" "}
						<b>{new Intl.NumberFormat("en-US").format(store.loading.total)}</b> bites &nbsp;({store.loading.progress}%)
					</div>
					<div className="absolute bottom-0 h-7 w-screen bg-gray-400">
						<div className="h-full bg-green-600 transition-all duration-500" style={{ width: `${store.loading.progress}%` }} />
					</div>
				</div>
			</div>
		);
	}
}

export default observer(SetupApp);
