getReportMonthIndex = () => 7;
applyManualReportOverrides = () => { rows[8][10] = 82000; rows[8][17] = 1270000; rows[8][21] = Math.max(Number(rows[8][21]) || 0, 82000); };
renderDashboard();