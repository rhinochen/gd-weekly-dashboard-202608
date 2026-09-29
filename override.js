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

function ensureWeeklyStyles() {
  if (document.querySelector("#weekly-report-overrides")) return;
  const style = document.createElement("style");
  style.id = "weekly-report-overrides";
  style.textContent = `
    .goal-split-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: .7vw;
      margin-top: .8vw;
    }
    .goal-split-card {
      padding: .7vw .85vw;
      background: rgba(255,255,255,.04);
      border: 1px solid rgba(255,255,255,.08);
      border-radius: .55vw;
    }
    .goal-split-card.cert { border-left: .32vw solid var(--gold); }
    .goal-split-card.marketing { border-left: .32vw solid var(--blue); }
    .goal-split-card span {
      display: block;
      color: var(--muted);
      font-size: clamp(9px,.7vw,13px);
      font-weight: 900;
    }
    .goal-split-card strong {
      display: block;
      margin: .15vw 0;
      color: var(--white);
      font-size: clamp(17px,1.45vw,27px);
    }
    .goal-split-card b {
      color: var(--green);
      font-size: clamp(9px,.72vw,14px);
    }
    .goal-split-card p {
      margin: .18vw 0 0;
      color: var(--muted);
      font-size: clamp(8px,.62vw,12px);
      font-weight: 780;
    }
    @media print {
      .goal-split-card { background:#fff !important; border-color:#183d35 !important; }
      .goal-split-card strong { color:#10231f !important; }
      .goal-split-card span,.goal-split-card p { color:#314d46 !important; }
      .goal-split-card b { color:#007a55 !important; }
    }
  `;
  document.head.appendChild(style);
}

function formatWanOne(value) {
  return (Number(value || 0) / 10000).toLocaleString("zh-TW", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  });
}

function updateSeptemberGoalBreakdown() {
  ensureWeeklyStyles();
  const monthIndex = getReportMonthIndex();
  if (monthIndex !== 8) return;

  const row = rows[8] || [];
  const certActual = numeric(row[10]);
  const marketingActual = numeric(row[15]);
  const totalActual = numeric(row[21]);
  const certTarget = 870000;
  const marketingTarget = 400000;
  const totalTarget = certTarget + marketingTarget;

  update("reportScopeLabel3", "9 月目前業績｜本月總收入＝認證收入＋行銷收入");
  update("reportScopeLabel4", "9 月目前業績｜總目標 127 萬＝認證 87 萬＋行銷 40 萬");

  const monthlyTarget = document.querySelector("#monthlyTarget");
  const monthlyActual = document.querySelector("#monthlyActual");
  const monthlyRate = document.querySelector("#monthlyRate");
  const monthlyDelta = document.querySelector("#monthlyDelta");
  const monthlyRateBar = document.querySelector("#monthlyRateBar");

  const totalRate = totalTarget ? totalActual / totalTarget : 0;
  if (monthlyTarget) monthlyTarget.textContent = "127 萬";
  if (monthlyActual) monthlyActual.textContent = `${formatWanOne(totalActual)} 萬`;
  if (monthlyRate) monthlyRate.textContent = `${Math.round(totalRate * 100)}%`;
  if (monthlyDelta) monthlyDelta.textContent = `尚差 ${formatWanOne(Math.max(0, totalTarget - totalActual))} 萬`;
  if (monthlyRateBar) monthlyRateBar.style.width = `${Math.min(100, totalRate * 100)}%`;

  const monthlyCard = document.querySelector('[data-title="目標達成率"] .achievement-card:not(.annual)');
  if (!monthlyCard) return;
  let split = monthlyCard.querySelector(".goal-split-grid");
  if (!split) {
    split = document.createElement("div");
    split.className = "goal-split-grid";
    monthlyCard.appendChild(split);
  }

  const certRate = certTarget ? certActual / certTarget : 0;
  const marketingRate = marketingTarget ? marketingActual / marketingTarget : 0;
  split.innerHTML = `
    <div class="goal-split-card cert">
      <span>認證收入目標</span>
      <strong>87 萬</strong>
      <b>目前 ${formatWanOne(certActual)} 萬｜${Math.round(certRate * 100)}%</b>
      <p>認證目標與總收入目標分開追蹤</p>
    </div>
    <div class="goal-split-card marketing">
      <span>行銷收入目標</span>
      <strong>40 萬</strong>
      <b>目前 ${formatWanOne(marketingActual)} 萬｜${Math.round(marketingRate * 100)}%</b>
      <p>總目標 127 萬＝認證 87 萬＋行銷 40 萬</p>
    </div>
  `;
}

function updateWeeklyHighlightSlide() {
  const slide = document.querySelector('[data-title="本週重點"]');
  if (!slide) return;

  const meta = slide.querySelector(".page-meta strong");
  if (meta) meta.textContent = "2026/09/23｜一頁掌握最新進度";

  const header = slide.querySelector(".weekly-highlight-header");
  if (header) {
    header.innerHTML = `
      <div>
        <span>WEEKLY HIGHLIGHTS</span>
        <h2>這週，最重要的 6 件事</h2>
      </div>
      <strong>年會 Attendee 63｜會員 229 家｜TTQS 已送件｜南區 12/23</strong>
    `;
  }

  const grid = slide.querySelector(".weekly-highlight-grid");
  if (!grid) return;
  grid.innerHTML = `
    <article class="weekly-highlight-card is-gold">
      <div class="weekly-highlight-top">
        <span>01｜2026 綠裝修年度盛會</span>
        <b>報名推進</b>
      </div>
      <strong class="weekly-highlight-number">63<small>位</small></strong>
      <h3>會員端 Attendee 總數</h3>
      <p>報名單數 58 筆</p>
      <p class="weekly-highlight-em">貴賓確認出席 11 位</p>
      <p>10/30 台北 W Hotel｜規劃 12 桌 × 10 人＋預備 1 桌</p>
    </article>

    <article class="weekly-highlight-card is-blue">
      <div class="weekly-highlight-top">
        <span>02｜年會場勘</span>
        <b>9/22</b>
      </div>
      <strong class="weekly-highlight-number">9/22</strong>
      <h3>第一次場勘</h3>
      <p>各組組長參與</p>
      <p class="weekly-highlight-em">場地：台北 W Hotel</p>
      <p>後續持續確認飯店、製作物、桌次與現場分工</p>
    </article>

    <article class="weekly-highlight-card is-green">
      <div class="weekly-highlight-top">
        <span>03｜會員成長</span>
        <b>+1 家</b>
      </div>
      <strong class="weekly-highlight-number">229<small>家</small></strong>
      <h3>會員總數</h3>
      <p>會員人數 256 位</p>
      <p class="weekly-highlight-em">較 9/21 增加 1 家、2 位</p>
      <p>個人會員 202 家｜團體會員 27 家</p>
    </article>

    <article class="weekly-highlight-card is-red">
      <div class="weekly-highlight-top">
        <span>04｜TTQS 申請</span>
        <b>已送件</b>
      </div>
      <strong class="weekly-highlight-name">申請文件已寄出</strong>
      <h3>9/23 完成寄件</h3>
      <p>9/21 顧問第 1 次到協會諮詢</p>
      <p class="weekly-highlight-em">NEXT｜9/24 全球提供 2025/01–2026/09 課程資訊</p>
      <p>持續依排程準備 TTQS 申請資料</p>
    </article>

    <article class="weekly-highlight-card is-gold">
      <div class="weekly-highlight-top">
        <span>05｜南區下一步</span>
        <b>暫訂</b>
      </div>
      <strong class="weekly-highlight-number">12/23</strong>
      <h3>南區獎勵活動</h3>
      <p>14:30 Open House＋廠商分享</p>
      <p class="weekly-highlight-em">17:30 晚餐活動</p>
      <p>會員 $500｜非會員 $1,500</p>
    </article>

    <article class="weekly-highlight-card is-green">
      <div class="weekly-highlight-top">
        <span>06｜年會贊助貴賓</span>
        <b>邀請中</b>
      </div>
      <strong class="weekly-highlight-number">2<small>位</small></strong>
      <h3>快譯通股份有限公司</h3>
      <p>黃秀玲｜行企部經理</p>
      <p class="weekly-highlight-em">郭至綸｜產品經理</p>
      <p>由特助烊豫進行贊助貴賓邀請</p>
    </article>
  `;
}

function updateAssociationWeeklyEmphasis() {
  const brief = document.querySelector('[data-title="協會快報"]');
  if (brief) {
    const meta = brief.querySelector(".page-meta strong");
    if (meta) meta.textContent = "秘書工作日誌摘要｜更新至 2026/09/23";

    const memberPanel = brief.querySelector(".member-panel");
    if (memberPanel) {
      const main = memberPanel.querySelector(":scope > strong");
      const trend = memberPanel.querySelector(".member-trend-label");
      const weekly = memberPanel.querySelector(".member-weekly-grid");
      const structure = memberPanel.querySelector(".member-structure");
      const growth = memberPanel.querySelector(".member-growth");

      if (main) main.innerHTML = '229<small>家</small>';
      if (trend) trend.textContent = "統計截至 2026/09/23｜較 9/21 增加 1 家";
      if (weekly) weekly.innerHTML = `
        <div><span>會員人數</span><strong>256<small>位</small></strong></div>
        <div><span>團體會員</span><strong>27<small>家</small></strong></div>
      `;
      if (structure) structure.innerHTML = `
        <p><span>個人會員</span><strong>202<small>家</small></strong></p>
        <p><span>待轉帳</span><strong>2<small>位</small></strong></p>
        <p><span>本週新增</span><strong>+1<small>家</small></strong></p>
      `;
      if (growth) growth.innerHTML = `
        <span>本週會員變化</span>
        <div>
          <p><b>會員家數</b><strong>229<small>家</small></strong></p>
          <p><b>會員人數</b><strong>256<small>位</small></strong></p>
        </div>
        <em class="new-line">NEW｜新天新地國際有限公司 9/23 加入團體會員；林秉廷、鄭曉真待轉帳。</em>
      `;
    }

    const southCard = [...brief.querySelectorAll(".region-card")].find((card) => card.querySelector("b")?.textContent.includes("南區"));
    if (southCard) {
      southCard.className = "region-card is-next";
      southCard.innerHTML = `
        <div><b>南區</b><span>12/23 暫訂</span></div>
        <strong>南區獎勵活動</strong>
        <p>14:30 Open House＋廠商分享、17:30 晚餐；9/17 分享會 23 位全員到齊。</p>
      `;
    }

    const eventPanel = brief.querySelector(".event-panel.host-events");
    if (eventPanel) {
      eventPanel.innerHTML = `
        <div class="block-title"><span>本週新增進度</span><strong>年會／TTQS／南區</strong></div>
        <div class="event-list">
          <section class="year-event-card">
            <b>年會｜會員端 Attendee 63 位</b>
            <p>報名單數 58 筆｜貴賓確認出席 11 位。</p>
            <p class="is-new-text">NEW｜9/22 第一次場勘；贊助貴賓邀請同步推進。</p>
          </section>
          <section>
            <b>TTQS｜9/23 申請文件已寄出</b>
            <p>9/21 顧問第 1 次到協會諮詢。</p>
            <p class="is-new-text">NEXT｜9/24 全球提供 2025/01–2026/09 課程資訊。</p>
          </section>
          <section>
            <b>南區｜12/23 獎勵活動暫訂</b>
            <p>14:30 Open House＋廠商分享｜17:30 晚餐活動。</p>
            <p class="is-new-text">會員 $500／非會員 $1,500。</p>
          </section>
        </div>
      `;
    }
  }

  const focus = document.querySelector('[data-title="協會重點"]');
  if (focus) {
    const meta = focus.querySelector(".page-meta strong");
    if (meta) meta.textContent = "年會 Attendee 63｜會員 229 家｜TTQS 已送件｜南區 12/23";

    const annual = focus.querySelector(".annual-meeting-panel");
    if (annual) {
      const titleStrong = annual.querySelector(".block-title strong");
      if (titleStrong) titleStrong.textContent = "Attendee 63 位｜9/22 第一次場勘";

      const priceGrid = annual.querySelector(".annual-price-grid");
      if (priceGrid) priceGrid.innerHTML = `
        <section><span>會員</span><strong>$1,000<small>/位</small></strong></section>
        <section><span>第 2 位貴賓</span><strong>$2,000<small>/位</small></strong></section>
        <section class="is-new-box"><span>Attendee 總數</span><strong>63<small>位</small></strong></section>
        <section><span>貴賓確認出席</span><strong>11<small>位</small></strong></section>
      `;

      const costCard = annual.querySelector(".annual-cost-card");
      if (costCard) costCard.innerHTML = `
        <span>目前進度</span>
        <strong>報名單數 58 筆｜Attendee 63 位</strong>
        <p>9/22 第一次場勘；規劃 12 桌 × 10 人，另預備 1 桌；快譯通贊助貴賓邀請同步進行。</p>
      `;
    }

    const share = focus.querySelector(".share-panel");
    if (share) share.innerHTML = `
      <div class="block-title"><span>12/23 南區獎勵活動</span><strong>暫訂｜下一步</strong></div>
      <h3>Open House＋廠商分享＋晚餐活動</h3>
      <div class="share-info-grid">
        <p><b>下午場</b><span>14:30 Open House＋廠商分享</span></p>
        <p><b>晚餐</b><span>17:30 晚餐活動</span></p>
        <p><b>費用</b><span>會員 $500｜非會員 $1,500</span></p>
        <p><b>上次成果</b><span>9/17 南區分享會 23 位全員到齊</span></p>
        <p class="is-new"><b>NEW</b><span>12/23 南區獎勵活動進入暫訂規劃</span></p>
      </div>
    `;

    const weeklyBlock = focus.querySelector(".focus-board-panel");
    if (weeklyBlock) weeklyBlock.innerHTML = `
      <div class="block-title"><span>本週新增進度</span><strong>TTQS｜會員</strong></div>
      <div class="board-date-grid">
        <div><span>TTQS</span><strong>已送件</strong></div>
        <div><span>會員總數</span><strong>229<small>家</small></strong></div>
      </div>
      <div class="board-notes">
        <p class="is-new-text">TTQS｜9/23 申請文件已寄出；9/24 全球提供課程資訊。</p>
        <p class="is-new-text">會員｜較 9/21 增加 1 家、2 位；新天新地國際 9/23 加入團體會員。</p>
        <p>廣州設計週 35 人已滿額、苗栗二日遊訂金 $57,380，維持既有進度。</p>
      </div>
    `;

    const timeline = focus.querySelector(".timeline-list");
    if (timeline) timeline.innerHTML = `
      <p><b>09/23</b><span>TTQS 申請文件寄出</span></p>
      <p><b>09/23</b><span>新天新地國際加入團體會員</span></p>
      <p><b>09/22</b><span>年會第一次場勘｜各組組長</span></p>
      <p><b>09/23</b><span>年會 Attendee 63｜貴賓確認 11</span></p>
      <p><b>09/24</b><span>全球提供 2025/01–2026/09 課程資訊</span></p>
      <p><b>10/30</b><span>2026 綠裝修年度盛會｜綠見未來</span></p>
      <p><b>12/23</b><span>南區獎勵活動｜暫訂</span></p>
    `;
  }
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
  updateSeptemberGoalBreakdown();
  updateWeeklyHighlightSlide();
  updateAssociationWeeklyEmphasis();
};

removeSlidesForWeeklyReport();
renderDashboard();
status("週報已更新：9 月總目標 127 萬＝認證 87 萬＋行銷 40 萬；協會進度更新至 9/23");