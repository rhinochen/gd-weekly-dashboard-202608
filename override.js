getReportMonthIndex = () => 8;

const originalRenderLineChart = renderLineChart;
renderLineChart = function renderLineChartWithoutCasesAnnotation(id, previous, current, color, annotation = null) {
  const shouldRemoveAnnotation = id === "casesChart";
  return originalRenderLineChart(id, previous, current, color, shouldRemoveAnnotation ? null : annotation);
};

applyManualReportOverrides = () => {
  rows[8][10] = 82000;
  rows[8][17] = 1270000;
  rows[8][21] = Math.max(Number(rows[8][21]) || 0, 82000);
};

renderDashboard();
status('週報已切換為 2026/09/14 的 9 月目前業績，並移除件數圖表註記');