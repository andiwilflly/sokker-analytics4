// @ts-ignore
import { BarChart, LineChart } from "echarts/charts";
// @ts-ignore
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
// @ts-ignore
import { CanvasRenderer } from "echarts/renderers";

// @ts-ignore
echarts.use([LineChart, BarChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent, CanvasRenderer]);

export default echarts as any;
