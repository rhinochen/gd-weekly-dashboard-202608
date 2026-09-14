getReportMonthIndex = () => 8;
applyManualReportOverrides = () => {
  rows[8][10] = 82000;
  rows[8][17] = 1270000;
  rows[8][21] = Math.max(Number(rows[8][21]) || 0, 82000);
};
renderDashboard();
status('週報已切換為 2026/09/14 的 9 月目前業績');