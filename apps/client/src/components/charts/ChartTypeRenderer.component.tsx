import type GridItemModel from "@/models/transfers/grid/GridItem.model";
import store from "@/store";
import type { TPIEChartData } from "@shared/schema/charts.schema.ts";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import type { Instance } from "mobx-state-tree";
import React from "react";

const LazyLineChart = React.lazy(() => import("@/components/charts/LineChart.component"));
const PIEChartLazy = React.lazy(() => import("@/components/charts/PIEChart.component"));

interface IProps {
	i: string;
	width: number;
	height: number;
}

class ChartTypeRenderer extends React.Component<IProps> {
	get item(): Instance<typeof GridItemModel> {
		return store.transfers.grid.all.get(this.props.i)!;
	}

	render() {
		switch (this.item.chartType) {
			case "pie":
				console.log(toJS(this.item.getChartData<TPIEChartData>()));
				return <PIEChartLazy title="PIE" chartData={this.item.getChartData<TPIEChartData>()} />;
			case "line":
			case "bar":
				return (
					<LazyLineChart
						width={this.props.width}
						height={this.props.height}
						chartData={this.item.getChartData<ILineChartData>()}
						reactionString={store.isLoading + this.item.chartType + this.item.selectedY.join() + this.item.selectedX}
						formatY={this.item.formatY}
					/>
				);
			default:
				return `[no such chart ${this.item.chartType}]`;
		}
	}
}

export default observer(ChartTypeRenderer);
