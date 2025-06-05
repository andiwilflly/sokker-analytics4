import Router from "@/Router.tsx";
import Footer from "@/components/Footer.component.tsx";
import Header from "@/components/Header.component.tsx";
import SetupApp from "@/components/SetupApp.component.tsx";
import store from "@/store";
import { observer } from "mobx-react";
import React from "react";

class App extends React.Component {
	render() {
		return (
			<>
				{store.IS_APP_READY ? (
					<div className="min-h-screen flex flex-col">
						<Header />
						<Router />
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
