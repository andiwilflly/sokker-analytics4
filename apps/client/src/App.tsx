import Router from "@/Router.tsx";
import Footer from "@/components/Footer.component.tsx";
import Header from "@/components/Header.component.tsx";
import SetupApp from "@/components/SetupApp.component.tsx";
import Sidebar from "@/components/Sidebar.component.tsx";
import store from "@/store.ts";
import { observer } from "mobx-react";

// TODO: firebase hosting give us different file types for json.gz
// TODO: i18n.t
// TODO: WORKERS share indexed DB

function App() {
	return (
		<>
			{store.IS_APP_READY ? (
				<div className="min-h-screen flex flex-col">
					<Header />
					<main className="h-full w-full flex">
						<Sidebar />
						<Router />
					</main>
					<Footer />
				</div>
			) : (
				<SetupApp />
			)}

			<div id="modal-container" />
		</>
	);
}

export default observer(App);
