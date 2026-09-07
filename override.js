(() => {
  const REPORT_MONTH_INDEX = 7; // 9月第一次週會主簡報鎖定 8 月底完整結算
  const SEPTEMBER_CERT_TARGET = 1_270_000;
  const SEPTEMBER_CERT_ACTUAL = 82_000;
  const numberValue = (value) => Number(String(value || "").replace(/[,%\s]/g, "")) || 0;
  const toWan = (value) => Math.round(numberValue(value) / 10000);
  const formatWan = (value) => `${toWan(value).toLocaleString("zh-TW")} 萬`;
  const formatWanDecimal = (value) => `${(numberValue(value) / 10000).toLocaleString("zh-TW", { maximumFractionDigits: 1 })}`;

  try {
    getReportMonthIndex = () => REPORT_MONTH_INDEX;

    const originalApplyManualReportOverrides = applyManualReportOverrides;
    applyManualReportOverrides = function applyAugustAndSeptemberOverrides() {
      if (typeof originalApplyManualReportOverrides === "function") originalApplyManualReportOverrides();
      const septemberRow = rows?.[8];
      if (septemberRow) {
        septemberRow[10] = SEPTEMBER_CERT_ACTUAL;
        septemberRow[17] = SEPTEMBER_CERT_TARGET;
        septemberRow[21] = Math.max(numberValue(septemberRow[21]), SEPTEMBER_CERT_ACTUAL);
      }
    };

    const updateSeptemberSlide = () => {
      const rate = SEPTEMBER_CERT_TARGET ? SEPTEMBER_CERT_ACTUAL / SEPTEMBER_CERT_TARGET : 0;
      update("septemberCertTarget", `${toWan(SEPTEMBER_CERT_TARGET).toLocaleString("zh-TW")}<small>萬</small>`, true);
      update("septemberCertActual", `${formatWanDecimal(SEPTEMBER_CERT_ACTUAL)}<small>萬</small>`, true);
      update("septemberCertRate", `${Math.round(rate * 100)}%`);
      update("septemberCertRateLarge", `${Math.round(rate * 100)}%`);
      update("septemberCertDelta", `尚差 ${formatWan(Math.max(0, SEPTEMBER_CERT_TARGET - SEPTEMBER_CERT_ACTUAL))}`);
      update("septemberProgressText", `82,000 ÷ 1,270,000 = ${(rate * 100).toFixed(1)}%｜四捨五入呈現 ${Math.round(rate * 100)}%`);
      document.querySelector("#septemberRateBar")?.style.setProperty("width", `${Math.min(100, rate * 100)}%`);
    };

    const originalRenderDashboard = renderDashboard;
    renderDashboard = function renderDashboardWithSeptemberSlide() {
      originalRenderDashboard();
      updateSeptemberSlide();
    };

    renderDashboard();
    status("主簡報已鎖定 8 月完整結算，9 月目標另頁呈現");
  } catch (error) {
    console.warn("override failed", error);
  }
})();
