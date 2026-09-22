const originalRenderLineChart = renderLineChart;
renderLineChart = function (id, previous, current, color, annotation = null) {
  return originalRenderLineChart(id, previous, current, color, id === "casesChart" ? null : annotation);
};

function updatePendingCertCard() {
  const amount = Number(contractData?.pendingAmount) || 880000;
  const card = document.querySelector('[data-title="認證金額"] .cashflow-card.is-new');
  if (!card) return;
  const main = card.querySelector("strong");
  const note = card.querySelector("p");
  const wanValue = amount / 10000;
  const wanText = wanValue.toLocaleString("zh-TW", { maximumFractionDigits: 1 });
  if (main) main.innerHTML = `${wanText}<small>萬</small>`;
  if (note) note.textContent = `目前待收 ${amount.toLocaleString("zh-TW")}，資料來源：ai2026!Y6。`;
}

function removeSlidesForWeeklyReport() {
  const hiddenTitles = ["9月目標", "特約聯盟"];
  for (let i = slides.length - 1; i >= 0; i -= 1) {
    if (hiddenTitles.includes(slides[i].dataset.title)) {
      slides[i].remove();
      slides.splice(i, 1);
    }
  }
  slides.forEach((slide, index) => {
    const number = slide.querySelector(".section-name span");
    if (number) number.textContent = String(index + 1).padStart(2, "0");
  });
  const dots = document.querySelector("#slideDots");
  if (dots) dots.innerHTML = "";
  activeSlide = 0;
  buildControls();
}

const originalRenderDashboard = renderDashboard;
renderDashboard = function () {
  originalRenderDashboard();
  updatePendingCertCard();
};

removeSlidesForWeeklyReport();
renderDashboard();
status("週報已改為即時同步：認證收入、總收入與待收金額皆由 ai2026 雲端表更新");