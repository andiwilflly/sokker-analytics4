import React from "react";
import { Route } from "wouter";

const LazyHomePage = React.lazy(() => import("@/components/pages/HomePage.component"));
const LazySidebar = React.lazy(() => import("@/components/Sidebar.component"));

// index.js
// 491.81 kB
// 438.27 kB
// 438.08 kB
// 189.66 kB
// 177.22 kB
// 2.11 kB
class Router extends React.Component {
	render() {
		return (
			<main className="h-full w-full flex">
				<Route path="/">
					<LazySidebar />
					<LazyHomePage />
				</Route>
			</main>
		);
	}
}

export default Router;
