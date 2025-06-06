import Footer from "@/components/Footer.component";
import Header from "@/components/Header.component";
import SetupApp from "@/components/SetupApp.component";
import store from "@/store";
import { observer } from "mobx-react";
import React from "react";

const LazyRouter = React.lazy(() => import("@/Router"));

class App extends React.Component {
	render() {
		return (
			<>
				{store.IS_APP_READY ? (
					<div className="min-h-screen flex flex-col">
						<Header />
						<LazyRouter />
						<Footer />
					</div>
				) : (
					<SetupApp />
				)}

				<div id="modal-container" />
			</>
		);
	}
}

export default observer(App);
