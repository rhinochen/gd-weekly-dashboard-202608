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

function updateAssociationWeeklyEmphasis() {
  const brief = document.querySelector('[data-title="協會快報"]');
  if (brief) {
    const memberGrowth = brief.querySelector(".member-growth");
    if (memberGrowth) {
      memberGrowth.innerHTML = `
        <span>本週會員成長</span>
        <div>
          <p><b>較上週增加</b><strong>+5<small>家</small></strong></p>
          <p><b>營隊轉入</b><strong>4<small>家</small></strong></p>
        </div>
        <em class="new-line">累計會員 228 家｜會員人數 254 位；另有李士維加入，74 梯南區持續追蹤。</em>`;
    }

    const eventPanel = brief.querySelector(".event-panel.host-events");
    if (eventPanel) {
      eventPanel.innerHTML = `
        <div class="block-title"><span>本週新增進度</span><strong>年會／TTQS／二日遊</strong></div>
        <div class="event-list">
          <section class="year-event-card">
            <b>年會｜網站報名 39 位</b>
            <p>10/30 台北 W Hotel｜截至 9/21 已報名 39 位。</p>
            <p class="is-new-text">NEXT｜9/22 15:00 第一次場勘；規劃 12 桌 × 10 人，另預備 1 桌。</p>
          </section>
          <section>
            <b>TTQS｜第 1 次正式輔導</b>
            <p>9/09 簽核、9/10 匯款、9/15 初次討論。</p>
            <p class="is-new-text">NEW｜9/21 顧問到協會進行第 1 次諮詢，申請資料正式進入準備期。</p>
          </section>
          <section>
            <b>苗栗二日遊｜訂金 $57,380</b>
            <p class="is-new-text">NEW｜兩筆訂金已支付；會員價 $7,000／位、協會補助 $2,800／位。</p>
            <p>30 位｜15 間雙人房；持續確認交通、住宿、餐飲、保險及參訪。</p>
          </section>
        </div>`;
    }
  }

  const focus = document.querySelector('[data-title="協會重點"]');
  if (focus) {
    const meta = focus.querySelector(".page-meta strong");
    if (meta) meta.textContent = "年會 39 位｜會員 228 家｜南區 23 位全員到齊｜TTQS 第 1 次輔導";

    const guildList = focus.querySelector(".guild-list");
    if (guildList) {
      guildList.innerHTML = `
        <p class="is-new">新增合作｜山林希家具 9/16 拜訪理事長，後續合作方案洽談中</p>
        <p>可追蹤｜北市公會 10/15 年會，理事長已報名參加</p>
        <p>待回覆｜新北、桃園公會</p>
        <p class="is-paused">暫緩｜台中、台南本年度尚無法排程</p>
        <p class="is-new">改策略｜高雄後續採個別交流</p>`;
    }

    const weeklyBlock = focus.querySelector(".focus-board-panel");
    if (weeklyBlock) {
      weeklyBlock.innerHTML = `
        <div class="block-title"><span>本週新增進度</span><strong>TTQS｜苗栗二日遊</strong></div>
        <div class="board-date-grid">
          <div><span>TTQS 輔導</span><strong>第 1<small>次</small></strong></div>
          <div><span>二日遊訂金</span><strong>5.7<small>萬</small></strong></div>
        </div>
        <div class="board-notes">
          <p class="is-new-text">TTQS｜9/21 顧問第 1 次到協會諮詢，申請資料正式進入準備期。</p>
          <p class="is-new-text">苗栗二日遊｜兩筆訂金合計 $57,380；會員 $7,000／位、協會補助 $2,800／位。</p>
          <p>廣州設計週｜35 人已滿額，後續列入近期工作持續追蹤。</p>
        </div>`;
    }

    const timeline = focus.querySelector(".timeline-list");
    if (timeline) {
      timeline.innerHTML = `
        <p><b>09/21</b><span>年會網站報名 39 位</span></p>
        <p><b>09/21</b><span>TTQS 顧問第 1 次到協會諮詢</span></p>
        <p><b>09/17</b><span>南區分享會完成｜23 位全員到齊</span></p>
        <p><b>09/16</b><span>山林希家具拜訪｜合作方案洽談中</span></p>
        <p><b>09/22</b><span>年會第一次場勘｜W Hotel</span></p>
        <p><b>11/26</b><span>協會二日遊｜訂金合計 $57,380</span></p>
        <p><b>12/07</b><span>廣州設計週｜35 人已滿額</span></p>`;
    }
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
  updateAssociationWeeklyEmphasis();
};

removeSlidesForWeeklyReport();
renderDashboard();
status("週報已更新：本週協會重點改為年會 39 位、會員 +5、南區 23 位、TTQS、二日遊訂金與新合作");