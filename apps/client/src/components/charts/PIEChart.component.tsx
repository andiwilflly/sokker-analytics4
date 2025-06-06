"use client";
import { type TPIEChartData } from "@shared/schema/charts.schema.ts";
// @ts-ignore
import * as echarts from "echarts";
import React from "react";

interface IProps {
	chartData: TPIEChartData;
	width: number;
	height: number;
}

export default class PIEChart extends React.Component<IProps> {
	$chart = React.createRef<HTMLDivElement>();
	chartInstance: echarts.ECharts | null = null;

	componentDidMount() {
		this.chartInstance = echarts.init(this.$chart.current);
		this.update();

		window.addEventListener("resize", this.onResize);
	}

	componentDidUpdate(prevProps: IProps) {
		if (prevProps.width !== this.props.width || prevProps.height !== this.props.height) {
			if (this.chartInstance) this.chartInstance.resize(); // resize to new dimensions
		}
	}

	componentWillUnmount() {
		this.chartInstance?.dispose();
		window.removeEventListener("resize", this.onResize);
	}

	onResize = () => {
		this.chartInstance?.resize();
	};

	update = () => {
		this.chartInstance?.clear();

		this.chartInstance?.setOption({
			animation: false,
			tooltip: {
				trigger: "item",
			},
			series: [
				{
					name: "Age Group",
					type: "pie",
					radius: "60%",
					data: this.props.chartData,
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: "rgba(0, 0, 0, 0.5)",
						},
					},
				},
			],
		});
	};

	render() {
		return (
			<>
				<div ref={this.$chart} style={{ width: this.props.width, height: this.props.height }} />
			</>
		);
	}
}
