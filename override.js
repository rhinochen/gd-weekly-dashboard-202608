getReportMonthIndex = () => 8;

const originalRenderLineChart = renderLineChart;
renderLineChart = function (id, previous, current, color, annotation = null) {
  return originalRenderLineChart(id, previous, current, color, id === "casesChart" ? null : annotation);
};

applyManualReportOverrides = () => {
  rows[8][10] = 82000;
  rows[8][17] = 1270000;
  rows[8][21] = 338400;
};

function updatePendingCertCard() {
  const amount = 818000;
  const card = document.querySelector('[data-title="認證金額"] .cashflow-card.is-new');
  if (!card) return;
  const main = card.querySelector("strong");
  const note = card.querySelector("p");
  if (main) main.innerHTML = "81.8<small>萬</small>";
  if (note) note.textContent = "目前待收 818,000，對標 ai2026 的 Y6 欄位。";
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
status("週報已更新，暫時移除 9 月目標與特約聯盟頁");