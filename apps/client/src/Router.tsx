import Sidebar from "@/components/Sidebar.component.tsx";
import HomePage from "@/components/pages/HomePage.component.tsx";
import React from "react";
import { Route } from "wouter";

class Router extends React.Component {
	render() {
		return (
			<main className="h-full w-full flex">
				<Route path="/">
					<Sidebar />
					<HomePage />
				</Route>
				<Route path="/players">PLAYERS TABLE</Route>
				<Route path="/transfers">hello transfers</Route>
			</main>
		);
	}
}

export default Router;
