import HomePage from "@/components/pages/HomePage.component.tsx";
import React from "react";
import { Route } from "wouter";

class Router extends React.Component {
	render() {
		return (
			<>
				<Route path="/">
					<HomePage />
				</Route>
				<Route path="/transfers">hello transfers</Route>
			</>
		);
	}
}

export default Router;
