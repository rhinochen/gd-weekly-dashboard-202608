const originalRenderLineChart = renderLineChart;
renderLineChart = function (id, previous, current, color, annotation = null) {
  return originalRenderLineChart(id, previous, current, color, id === "casesChart" ? null : annotation);
};

function moneyWan1(value) {
  return (Number(value || 0) / 10000).toLocaleString("zh-TW", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  });
}

function pct(actual, target, digits = 0) {
  if (!target) return 0;
  const value = actual / target * 100;
  return digits ? Number(value.toFixed(digits)) : Math.round(value);
}

function quarterSum(columnIndex, startMonthIndex) {
  return [0,1,2].reduce((sum, offset) => sum + numeric(rows[startMonthIndex + offset]?.[columnIndex]), 0);
}

function updateSeptemberCloseSlide() {
  const row = rows[8] || [];
  const certTarget = 420000;
  const certActual = numeric(row[10]);
  const marketingTarget = 400000;
  const marketingActual = numeric(row[15]);
  const totalTarget = 820000;
  const totalActual = numeric(row[21]);

  const totalRate = pct(totalActual, totalTarget, 1);
  const certRate = pct(certActual, certTarget, 1);
  const marketingRate = pct(marketingActual, marketingTarget, 1);
  const excess = Math.max(0, totalActual - totalTarget);

  const setHtml = (id, value) => { const el = document.querySelector("#" + id); if (el) el.innerHTML = value; };
  const setText = (id, value) => { const el = document.querySelector("#" + id); if (el) el.textContent = value; };

  setHtml("sepTotalActual", `${moneyWan1(totalActual)}<small>萬</small>`);
  setText("sepTotalTargetText", `目標 ${moneyWan1(totalTarget)} 萬｜超標 ${moneyWan1(excess)} 萬`);
  setText("sepTotalRate", `${totalRate}%`);
  setHtml("sepCertActual", `${moneyWan1(certActual)}<small>萬</small>`);
  setText("sepCertTargetText", `目標 ${moneyWan1(certTarget)} 萬｜達成 ${certRate}%`);
  setHtml("sepMarketingActual", `${moneyWan1(marketingActual)}<small>萬</small>`);
  setText("sepMarketingTargetText", `目標 ${moneyWan1(marketingTarget)} 萬｜達成 ${marketingRate}%`);
  setHtml("sepTotalActualCard", `${moneyWan1(totalActual)}<small>萬</small>`);
  setText("sepTotalRateCard", `${moneyWan1(totalTarget)} 萬目標｜${totalRate}%`);
}

function updateOctoberStartSlide() {
  const row = rows[9] || [];
  const certTarget = numeric(row[6]);
  const certActual = numeric(row[10]);
  const marketingTarget = numeric(row[11]);
  const marketingActual = numeric(row[15]);
  const totalTarget = numeric(row[17]);
  const totalActual = numeric(row[21]);
  const totalRate = pct(totalActual, totalTarget, 1);
  const certRate = pct(certActual, certTarget, 1);

  const setHtml = (id, value) => { const el = document.querySelector("#" + id); if (el) el.innerHTML = value; };
  const setText = (id, value) => { const el = document.querySelector("#" + id); if (el) el.textContent = value; };

  setHtml("octTotalActual", `${moneyWan1(totalActual)}<small>萬</small>`);
  setText("octTotalProgress", `10 月總目標 ${moneyWan1(totalTarget)} 萬｜達成 ${totalRate}%`);
  const bar = document.querySelector("#octTotalBar");
  if (bar) bar.style.width = `${Math.min(100,totalRate)}%`;

  setHtml("octCertActual", `${moneyWan1(certActual)}<small>萬</small>`);
  setText("octCertProgress", `調整後目標 ${moneyWan1(certTarget)} 萬｜達成 ${certRate}%`);
  setHtml("octMarketingActual", `${moneyWan1(marketingActual)}<small>萬</small>`);
  setText("octMarketingProgress", `星光＋業配目標 ${moneyWan1(marketingTarget)} 萬｜達成 ${pct(marketingActual, marketingTarget, 1)}%`);
}

function updateQuarterDiagnosisSlide() {
  const years = [
    { label:"2024", col:8, className:"y2024" },
    { label:"2025", col:9, className:"y2025" },
    { label:"2026", col:10, className:"y2026" }
  ];
  const quarters = [0,3,6,9].map((start, idx) => ({
    label:`Q${idx+1}`,
    values: years.map((year) => quarterSum(year.col, start))
  }));
  const maxValue = Math.max(...quarters.flatMap((q)=>q.values), 1);
  const chart = document.querySelector("#quarterRevenueChart");
  if (chart) {
    chart.innerHTML = quarters.map((quarter) => `
      <div class="quarter-row">
        <b>${quarter.label}</b>
        <div class="quarter-series">
          ${quarter.values.map((value, idx) => {
            const y = years[idx];
            const currentNote = y.label === "2026" && quarter.label === "Q4" ? "＊" : "";
            return `
              <div class="quarter-bar-line ${y.className}">
                <span>${y.label}</span>
                <div class="quarter-track"><i style="width:${Math.max(2,value/maxValue*100)}%"></i></div>
                <strong>${moneyWan1(value)}${currentNote}</strong>
              </div>`;
          }).join("")}
        </div>
      </div>
    `).join("") + '<p style="margin:.5vw 0 0;color:var(--muted);font-size:clamp(8px,.6vw,11px);font-weight:800">＊2026 Q4 僅統計至 10/5，不與完整季度直接比較。</p>';
  }

  const q1_2025 = quarters[0].values[1], q1_2026 = quarters[0].values[2];
  const q2_2025 = quarters[1].values[1], q2_2026 = quarters[1].values[2];
  const q3_2025 = quarters[2].values[1], q3_2026 = quarters[2].values[2];
  const yoy = (a,b) => b ? Math.round((a/b-1)*100) : 0;
  const qText = document.querySelector("#quarterYoYText");
  if (qText) qText.textContent = `Q1 ${yoy(q1_2026,q1_2025)>=0?"+":""}${yoy(q1_2026,q1_2025)}%｜Q2 ${yoy(q2_2026,q2_2025)>=0?"+":""}${yoy(q2_2026,q2_2025)}%｜Q3 ${yoy(q3_2026,q3_2025)}%`;

  const q1_2024 = quarters[0].values[0], q2_2024 = quarters[1].values[0], q3_2024 = quarters[2].values[0];
  const q1q3_2024 = q1_2024 + q2_2024 + q3_2024;
  const q1q3_2025 = q1_2025 + q2_2025 + q3_2025;
  const q1q3_2026 = q1_2026 + q2_2026 + q3_2026;
  const base = q1q3_2024 || 1;
  const ratio2024 = 100;
  const ratio2025 = q1q3_2025 / base * 100;
  const ratio2026 = q1q3_2026 / base * 100;
  const vs2025 = q1q3_2025 ? (q1q3_2026 / q1q3_2025 - 1) * 100 : 0;
  const vs2024 = (q1q3_2026 / base - 1) * 100;
  const q1q3Compare = document.querySelector("#q1q3Compare");
  if (q1q3Compare) {
    q1q3Compare.innerHTML = `
      <div class="q1q3-row is-2024">
        <span>2024</span>
        <div class="q1q3-track"><i style="width:100%"></i></div>
        <strong>${moneyWan1(q1q3_2024)}<small>萬</small></strong>
        <b>${ratio2024.toFixed(0)}%</b>
      </div>
      <div class="q1q3-row is-2025">
        <span>2025</span>
        <div class="q1q3-track"><i style="width:${ratio2025.toFixed(1)}%"></i></div>
        <strong>${moneyWan1(q1q3_2025)}<small>萬</small></strong>
        <b>${ratio2025.toFixed(1)}%</b>
      </div>
      <div class="q1q3-row is-2026">
        <span>2026</span>
        <div class="q1q3-track"><i style="width:${ratio2026.toFixed(1)}%"></i></div>
        <strong>${moneyWan1(q1q3_2026)}<small>萬</small></strong>
        <b>${ratio2026.toFixed(1)}%</b>
      </div>
    `;
  }
  const compareNote = document.querySelector("#q1q3CompareNote");
  if (compareNote) {
    compareNote.textContent = `2026 較 2025 ${vs2025 >= 0 ? "+" : ""}${vs2025.toFixed(1)}%｜較 2024 ${vs2024 >= 0 ? "+" : ""}${vs2024.toFixed(1)}%`;
  }

  const cert2026 = rows.reduce((sum,row)=>sum+numeric(row[10]),0);
  const total2026 = rows.reduce((sum,row)=>sum+numeric(row[21]),0);
  const certEl = document.querySelector("#annualCert2026");
  const totalEl = document.querySelector("#annualTotal2026");
  if (certEl) certEl.innerHTML = `${moneyWan1(cert2026)}<small>萬</small>`;
  if (totalEl) totalEl.innerHTML = `${moneyWan1(total2026)}<small>萬</small>`;

  const annualCertBlock = certEl?.closest("section");
  if (annualCertBlock) {
    const note = annualCertBlock.querySelector("p");
    if (note) note.textContent = `調整後目標 1,040 萬｜目前 ${pct(cert2026,10400000,1)}%`;
  }
}

function updateAllianceOverviewSlide() {
  const valid = alliancePartners.filter((item) => !item.excluded && item.company);
  const joined = valid.length;
  const pendingBack = 10;
  const potential = joined + pendingBack;
  const countByRegion = {};
  valid.forEach((item) => {
    const region = item.region || "待補";
    countByRegion[region] = (countByRegion[region] || 0) + 1;
  });
  const ordered = Object.entries(countByRegion).sort((a,b)=>b[1]-a[1]);
  const max = Math.max(...ordered.map(([,count])=>count),1);
  const top4 = ordered.slice(0,4).reduce((sum,[,count])=>sum+count,0);
  const topShare = joined ? Math.round(top4/joined*100) : 0;

  const joinedEl = document.querySelector("#allianceJoinedCount");
  const potentialEl = document.querySelector("#alliancePotentialCount");
  const noteEl = document.querySelector("#allianceTopRegionNote");
  if (joinedEl) joinedEl.innerHTML = `${joined}<small>家</small>`;
  if (potentialEl) potentialEl.innerHTML = `${potential}<small>家</small>`;
  if (noteEl) noteEl.textContent = `前四區 ${top4} 家｜約占 ${topShare}%`;

  const known = ordered.filter(([region]) => region !== "待補");
  const mapPositions = {
    "台北": {x:65, y:10, color:"#ff6f61"},
    "新北": {x:53, y:14, color:"#f6c969"},
    "桃園": {x:43, y:20, color:"#9fd356"},
    "新竹": {x:36, y:29, color:"#62e6ac"},
    "宜蘭": {x:72, y:28, color:"#ff8d7f"},
    "台中": {x:38, y:46, color:"#70b9ff"},
    "台南": {x:30, y:70, color:"#ffd45a"},
    "高雄": {x:30, y:82, color:"#ff9f68"}
  };

  const markers = document.querySelector("#allianceMapMarkers");
  if (markers) {
    markers.innerHTML = known.map(([region,count]) => {
      const pos = mapPositions[region] || {x:50,y:50,color:"#62e6ac"};
      return `<div class="alliance-map-marker" style="left:${pos.x}%;top:${pos.y}%;--marker:${pos.color}">
        <b>${count}</b><span>${region}</span>
      </div>`;
    }).join("");
  }

  const legend = document.querySelector("#allianceRegionLegend");
  if (legend) {
    legend.innerHTML = known.map(([region,count]) => {
      const pos = mapPositions[region] || {color:"#62e6ac"};
      return `<div class="alliance-legend-item">
        <i style="--legend:${pos.color}"></i>
        <span>${region}</span>
        <strong>${count} 家</strong>
      </div>`;
    }).join("");
  }
}

function updateWeeklyHighlightSlide() {
  const slide = document.querySelector('[data-title="本週重點"]');
  if (!slide) return;
  const meta = slide.querySelector(".page-meta strong");
  if (meta) meta.textContent = "2026/10/05｜一頁掌握最新進度";
  const header = slide.querySelector(".weekly-highlight-header");
  if (header) header.innerHTML = `
    <div>
      <span>WEEKLY HIGHLIGHTS</span>
      <h2>這週，最重要的 6 件事</h2>
    </div>
    <strong>年會 102／120｜會員 232 家｜TTQS 10/20 評核｜苗栗 14 位</strong>
  `;

  const grid = slide.querySelector(".weekly-highlight-grid");
  if (!grid) return;
  grid.innerHTML = `
    <article class="weekly-highlight-card is-gold">
      <div class="weekly-highlight-top"><span>01｜2026 綠裝修年度盛會</span><b>85%</b></div>
      <strong class="weekly-highlight-number">102<small>位</small></strong>
      <h3>目前掌握人數</h3>
      <p>網站報名 90 位</p>
      <p class="weekly-highlight-em">＋邀請貴賓 12 位</p>
      <p>120 席目標｜尚差 18 位｜10/20 報名截止</p>
    </article>

    <article class="weekly-highlight-card is-red">
      <div class="weekly-highlight-top"><span>02｜TTQS</span><b>評核排定</b></div>
      <strong class="weekly-highlight-number">10/20</strong>
      <h3>14:00–17:00 正式評核</h3>
      <p>10/5–10/14 彙整指標資料</p>
      <p class="weekly-highlight-em">10/15 提交第一版線上數位評核</p>
      <p>參與：理事長、Shawn、Gary、Mark、Joanne</p>
    </article>

    <article class="weekly-highlight-card is-green">
      <div class="weekly-highlight-top"><span>03｜會員成長</span><b>+3 家</b></div>
      <strong class="weekly-highlight-number">232<small>家</small></strong>
      <h3>會員總數</h3>
      <p>會員人數 258 位</p>
      <p class="weekly-highlight-em">較 9/23 增加 3 家、2 位</p>
      <p>個人會員 206 家｜團體會員 26 家</p>
    </article>

    <article class="weekly-highlight-card is-blue">
      <div class="weekly-highlight-top"><span>04｜苗栗二日遊</span><b>報名中</b></div>
      <strong class="weekly-highlight-number">14<small>位</small></strong>
      <h3>目前報名</h3>
      <p>目標 30 位｜15 間雙人房</p>
      <p class="weekly-highlight-em">訂金 $57,380 已付款</p>
      <p>11/26–11/27｜寶元紀之丘</p>
    </article>

    <article class="weekly-highlight-card is-gold">
      <div class="weekly-highlight-top"><span>05｜北1區</span><b>NEW</b></div>
      <strong class="weekly-highlight-number">11月</strong>
      <h3>獎勵活動暫訂</h3>
      <p>11/12 或 11/19（四）</p>
      <p class="weekly-highlight-em">15:00–18:00</p>
      <p>會員 $500｜非會員 $1,500</p>
    </article>

    <article class="weekly-highlight-card is-green">
      <div class="weekly-highlight-top"><span>06｜帳務</span><b>完成</b></div>
      <strong class="weekly-highlight-number">9/30</strong>
      <h3>帳務處理進度</h3>
      <p>送金單完成</p>
      <p class="weekly-highlight-em">年會費用對帳＋名額確認</p>
      <p>二日遊參與名單＋費用確認</p>
    </article>
  `;
}

function updateAssociationWeeklyEmphasis() {
  const brief = document.querySelector('[data-title="協會快報"]');
  if (brief) {
    const meta = brief.querySelector(".page-meta strong");
    if (meta) meta.textContent = "秘書工作日誌摘要｜更新至 2026/10/05";

    const memberPanel = brief.querySelector(".member-panel");
    if (memberPanel) {
      const main = memberPanel.querySelector(":scope > strong");
      const trend = memberPanel.querySelector(".member-trend-label");
      const weekly = memberPanel.querySelector(".member-weekly-grid");
      const structure = memberPanel.querySelector(".member-structure");
      const growth = memberPanel.querySelector(".member-growth");
      if (main) main.innerHTML = '232<small>家</small>';
      if (trend) trend.textContent = "統計截至 2026/10/05｜較 9/23 增加 3 家";
      if (weekly) weekly.innerHTML = '<div><span>會員人數</span><strong>258<small>位</small></strong></div><div><span>團體會員</span><strong>26<small>家</small></strong></div>';
      if (structure) structure.innerHTML = '<p><span>個人會員</span><strong>206<small>家</small></strong></p><p><span>廣州設計週</span><strong>35<small>位</small></strong></p><p><span>苗栗二日遊</span><strong>14<small>位</small></strong></p>';
      if (growth) growth.innerHTML = '<span>本期重點</span><div><p><b>會員增加</b><strong>+3<small>家</small></strong></p><p><b>會員人數</b><strong>258<small>位</small></strong></p></div><em class="new-line">年會、TTQS 與二日遊進入 10 月執行期。</em>';
    }

    const regionCards = [...brief.querySelectorAll(".region-card")];
    const north1 = regionCards.find((card)=>card.querySelector("b")?.textContent.includes("北1區"));
    if (north1) north1.innerHTML = '<div><b>北1區</b><span>11月暫訂</span></div><strong>北1區獎勵活動</strong><p>11/12 或 11/19 15:00–18:00；會員 $500／非會員 $1,500。</p>';
    const south = regionCards.find((card)=>card.querySelector("b")?.textContent.includes("南區"));
    if (south) south.innerHTML = '<div><b>南區</b><span>12/23 暫訂</span></div><strong>南區獎勵活動</strong><p>14:30 Open House＋廠商分享；17:30 晚餐活動。</p>';

    const eventPanel = brief.querySelector(".event-panel.host-events");
    if (eventPanel) eventPanel.innerHTML = `
      <div class="block-title"><span>本週新增進度</span><strong>年會／TTQS／二日遊</strong></div>
      <div class="event-list">
        <section><b>年會｜目前掌握 102 位</b><p>網站報名 90 位＋邀請貴賓 12 位；120 席達成 85%。</p><p class="is-new-text">NEXT｜10/6、10/13 更新報名；10/20 截止。</p></section>
        <section><b>TTQS｜10/20 正式評核</b><p>10/5–10/14 彙整指標資料，10/15 提交第一版。</p><p class="is-new-text">評核時間 10/20 14:00–17:00。</p></section>
        <section><b>苗栗二日遊｜目前 14 位</b><p>目標 30 位；訂金 $57,380 已付款。</p><p class="is-new-text">11/26–11/27｜持續確認交通、住宿、餐飲與保險。</p></section>
      </div>
    `;
  }

  const focus = document.querySelector('[data-title="協會重點"]');
  if (focus) {
    const title = focus.querySelector(".section-name strong");
    if (title) title.textContent = "協會重點專案";
    const meta = focus.querySelector(".page-meta strong");
    if (meta) meta.textContent = "年會 102／120｜TTQS 10/20｜苗栗 14／30";

    const annual = focus.querySelector(".annual-meeting-panel");
    if (annual) annual.innerHTML = `
      <div class="block-title"><span>一、2026 綠裝修年度盛會</span><strong>目前掌握 102 位｜85%</strong></div>
      <div class="annual-hero"><span>10/30</span><div><b>2026/10/30（五）18:00–22:00</b><strong>主題：綠見未來｜台北 W Hotel</strong><em>網站報名 90 位＋邀請貴賓 12 位</em></div></div>
      <div class="annual-price-grid">
        <section><span>席次目標</span><strong>120<small>位</small></strong></section>
        <section><span>目前掌握</span><strong>102<small>位</small></strong></section>
        <section><span>達成率</span><strong>85<small>%</small></strong></section>
        <section><span>尚差</span><strong>18<small>位</small></strong></section>
      </div>
      <div class="annual-cost-card"><span>招募節點</span><strong>10/6、10/13 更新｜10/20 截止</strong><p>各區區長協助聯繫；快譯通、光引科技贊助貴賓已報名。</p></div>
    `;

    const guild = focus.querySelector(".guild-panel");
    if (guild) guild.innerHTML = `
      <div class="block-title"><span>TTQS 申請案</span><strong>10/20 正式評核</strong></div>
      <div class="guild-list">
        <p class="is-new">10/05–10/14｜提供指標資料給李老師彙整</p>
        <p>10/15｜提交第一版資料（線上數位評核）</p>
        <p class="is-new">10/20 14:00–17:00｜協會正式評核</p>
        <p>參與｜理事長、Shawn、Gary、Mark、Joanne</p>
      </div>
    `;

    const share = focus.querySelector(".share-panel");
    if (share) share.innerHTML = `
      <div class="block-title"><span>六區下一步</span><strong>北1區＋南區</strong></div>
      <h3>獎勵活動規劃</h3>
      <div class="share-info-grid">
        <p><b>北1區</b><span>11/12 或 11/19｜15:00–18:00</span></p>
        <p><b>南區</b><span>12/23｜14:30 Open House＋17:30 晚餐</span></p>
        <p><b>費用</b><span>會員 $500｜非會員 $1,500</span></p>
        <p class="is-new"><b>NEW</b><span>北1區新增活動規劃</span></p>
      </div>
    `;

    const board = focus.querySelector(".focus-board-panel");
    if (board) board.innerHTML = `
      <div class="block-title"><span>參訪活動</span><strong>苗栗二日遊｜廣州設計週</strong></div>
      <div class="board-date-grid">
        <div><span>苗栗二日遊</span><strong>14<small>/30 位</small></strong></div>
        <div><span>廣州設計週</span><strong>35<small>位滿額</small></strong></div>
      </div>
      <div class="board-notes">
        <p class="is-new-text">苗栗｜11/26–11/27；訂金 $57,380 已付款，持續招募。</p>
        <p>廣州｜12/7–12/10，35 位已滿額。</p>
        <p>帳務已處理至 9/30；年會與二日遊費用持續對帳。</p>
      </div>
    `;

    const timeline = focus.querySelector(".timeline-list");
    if (timeline) timeline.innerHTML = `
      <p><b>10/06</b><span>年會報名資訊更新</span></p>
      <p><b>10/13</b><span>年會報名資訊更新</span></p>
      <p><b>10/15</b><span>TTQS 提交第一版｜北市公會年會</span></p>
      <p><b>10/20</b><span>TTQS 正式評核｜年會報名截止</span></p>
      <p><b>10/30</b><span>2026 綠裝修年度盛會</span></p>
      <p><b>11/26</b><span>苗栗二日遊</span></p>
      <p><b>12/07</b><span>廣州設計週</span></p>
    `;
  }
}

function removeSlidesForWeeklyReport() {
  const hiddenTitles = ["認證件數","認證金額","總收入","目標達成率","9月目標","特約聯盟"];
  for (let i = slides.length - 1; i >= 0; i -= 1) {
    if (hiddenTitles.includes(slides[i].dataset.title)) {
      slides[i].remove();
      slides.splice(i, 1);
    }
  }
  slides.forEach((slide, index) => {
    const number = slide.querySelector(".section-name span");
    if (number) number.textContent = String(index + 1).padStart(2, "0");
    slide.classList.toggle("is-active", index === 0);
  });
  const dots = document.querySelector("#slideDots");
  if (dots) dots.innerHTML = "";
  activeSlide = 0;
  buildControls();
}

const originalRenderDashboard = renderDashboard;
renderDashboard = function () {
  try {
    originalRenderDashboard();
  } catch (error) {
    console.warn("Base dashboard render skipped for hidden legacy slides:", error);
  }
  updateSeptemberCloseSlide();
  updateOctoberStartSlide();
  updateQuarterDiagnosisSlide();
  updateAllianceOverviewSlide();
  updateWeeklyHighlightSlide();
  updateAssociationWeeklyEmphasis();
};

removeSlidesForWeeklyReport();
renderDashboard();
status("週報已更新：9 月結算、10 月起跑、認證季度診斷、特約聯盟與 10/5 協會進度");