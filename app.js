const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1Msn_o--_ByjNIKlBGNxKWIZydtn-omLS/gviz/tq?tqx=out:csv&sheet=ai2026";
const CONTRACT_CSV_URL = "https://docs.google.com/spreadsheets/d/1Msn_o--_ByjNIKlBGNxKWIZydtn-omLS/gviz/tq?tqx=out:csv&sheet=ai2026&range=X1:Z10";
const ALLIANCE_CSV_URL = "https://docs.google.com/spreadsheets/d/1IZWU2rM--6w8KZudei-z5VEqYwifsQlRrqSBBzv81Cg/gviz/tq?tqx=out:csv&gid=804911135";
const AIR_QUALITY_ENDPOINT = "/api/air-quality";
const ANNUAL_TARGET = 14_500_000;
const CERT_ANNUAL_TARGET = 12_000_000;
const CERT_REMAINING_WEIGHTS = {
  7: 1_550_000,
  8: 1_400_000,
  9: 900_000,
  10: 1_050_000,
  11: 2_500_000
};

const fallbackRows = [
  ["1",9,9,8,2,12,400000,112000,569500,329600,407800,500000,0,397300,300000,99500,"1月",900000,112000,966800,629600,507300,"56%"],
  ["2",7,11,9,3,6,350000,126000,215000,520200,484600,500000,235000,581000,375000,199500,"2月",850000,361000,796000,895200,684100,"80%"],
  ["3",15,15,7,12,20,950000,680350,773300,472500,795100,500000,11300,518600,522000,862100,"3月",1450000,691650,1291900,994500,1657200,"114%"],
  ["4",15,23,19,7,11,1050000,355950,715000,907500,1190600,500000,213600,528000,84000,726000,"4月",1550000,569550,1243000,991500,1916600,"124%"],
  ["5",18,12,13,12,20,1400000,552350,1018700,896000,987700,500000,86400,1033500,174500,457500,"5月",1900000,638750,2052200,1070500,1445200,"76%"],
  ["6",16,23,8,11,23,1250000,538150,1049200,448700,1002300,0,48000,387500,898000,447900,"6月",1250000,586150,1436700,1346700,1450200,"116%"],
  ["7",14,10,10,11,14,1200000,496500,900500,481000,423400,0,84000,192800,446000,256500,"7月",1200000,580500,1093300,927000,679900,"57%"],
  ["8",20,"",18,13,21,1400000,603200,961385,870200,"",0,497000,145500,742500,"","8月",1400000,1100200,1106885,1612700,0,"0%"],
  ["9",19,"",16,11,22,1270000,537100,597355,1092000,"",0,236000,580000,253000,"","9月",1270000,773100,1177355,1345000,0,"0%"],
  ["10",14,"",16,6,14,820000,242000,496500,710600,"",0,128000,20100,644000,"","10月",820000,370000,516600,1354600,0,"0%"],
  ["11",17,"",9,17,18,950000,613700,660490,420900,"",0,192400,135000,781000,"","11月",950000,806100,795490,1201900,0,"0%"],
  ["12",36,"",41,26,29,2270000,1047500,1015100,1982470,"",0,1265000,1020000,1287000,"","12月",2270000,2312500,2035100,3269470,0,"0%"]
];

let rows = fallbackRows;
let contractData = { newSent: 31, newSigned: 10, newTarget: 10, dualSent: 0, dualSigned: 0 };
let alliancePartners = [
  { region: "新北", designer: "王國珮", company: "Funz房飾-麗正室內裝修規劃企業", period: "6月" },
  { region: "台北", designer: "林郁萱", company: "回醞空間設計有限公司", period: "6月" },
  { region: "新北", designer: "彭聖文", company: "聖禾空間整合有限公司", period: "6月" },
  { region: "新竹", designer: "陳鈺境", company: "若隅室內裝修設計有限公司", period: "6月" },
  { region: "台中", designer: "廖哲偉", company: "皇悅室內裝修設計有限公司", period: "6月" },
  { region: "台中", designer: "郭方雄", company: "室禾室內裝修設計有限公司", period: "6月" },
  { region: "台北", designer: "張苡璿", company: "碩謹室內裝修設計有限公司", period: "6月" },
  { region: "台北", designer: "吳東欣", company: "沐筑室內裝修設計有限公司", period: "6月" },
  { region: "宜蘭", designer: "陳秉誠", company: "禾玥室內裝修空間設計", period: "6月" },
  { region: "高雄", designer: "陳慧貞", company: "禾朵室內設計工作室", period: "6月" },
  { region: "台北", designer: "韋念均", company: "念念國際室內裝修有限公司", period: "6月" },
  { region: "待補", designer: "邱雅琳", company: "宏冠室內裝修⼯程有限公司", period: "7月", pending: true },
  { region: "台北", designer: "李翎", company: "三點水室內裝修設計工作室", period: "7月" },
  { region: "台北", designer: "蔡秋梅", company: "渾天室內裝修設計工程有限公司", period: "7月" },
  { region: "台北", designer: "余珦瑀", company: "木象室內設計有限公司", period: "7月" },
  { region: "台北", designer: "葉政寬", company: "寬本設計有限公司", period: "7月" },
  { region: "新竹", designer: "劉昱興", company: "藝竹青室內裝修有限公司", period: "7月" },
  { region: "台南", designer: "陳冠硯", company: "本木子空間設計制作所", period: "7月" },
  { region: "待補", designer: "林志豪", company: "巧居室內裝修創意製作工程", period: "7月", pending: true },
  { region: "待補", designer: "王彥綸", company: "兆陽室內裝修有限公司", period: "7月", pending: true },
  { region: "待補", designer: "陳皓澤", company: "寬月室內裝修設計股份有限公司", period: "7月", pending: true },
  { region: "台南", designer: "賴青珮", company: "里唯室內裝修有限公司", period: "7月" },
  { region: "台北", designer: "林宏諺", company: "有偶室內裝修股份有限公司", period: "7月", pending: true },
  { region: "高雄", designer: "吳梓樂", company: "金莎室內裝修工程有限公司", period: "7月" },
  { region: "新竹", designer: "陳姿諭", company: "淞雲室內裝修設計有限公司", period: "7月" },
  { region: "待補", designer: "曾稚喻", company: "宸石設計室內裝修企業有限公司", period: "7月", pending: true },
  { region: "新北", designer: "林呂世鈞", company: "綠裝舍室內裝修有限公司", period: "7月" },
  { region: "桃園", designer: "洪漢青", company: "嶼青空間整合工程", period: "7月" },
  { region: "待補", designer: "待補", company: "燊寬", period: "7月", status: "不列入", excluded: true },
  { region: "待補", designer: "待補", company: "巧軒", period: "7月", status: "不列入", excluded: true },
  { region: "高雄", designer: "李屏滙", company: "澄子室內裝修設計有限公司", period: "7月" },
  { region: "桃園", designer: "邱議萱", company: "築序室內裝修有限公司", period: "7月" },
  { region: "台南", designer: "張家賓", company: "祈⾀室內裝修設計有限公司", period: "7月" },
  { region: "台中", designer: "陳建榮", company: "晴點室內裝修設計有限公司", period: "7月" },
  { region: "台北", designer: "林錦賢", company: "原季室內裝修有限公司", period: "7月" },
  { region: "桃園", designer: "王仲平", company: "繹芯空間設計室內裝修股份有限公司", period: "7月" }
];
let activeAllianceRegion = "";
let activeSlide = 0;
let originalTitle = document.title;
const slides = [...document.querySelectorAll(".slide")];
const allianceMapPositions = {
  台北: { x: 70, y: 14 },
  新北: { x: 52, y: 20 },
  宜蘭: { x: 71, y: 30 },
  新竹: { x: 47, y: 32 },
  台中: { x: 43, y: 50 },
  台南: { x: 39, y: 71 },
  高雄: { x: 42, y: 80 },
  待補: { x: 18, y: 88 }
};

function parseCsv(text) {
  const result = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') { field += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(field); field = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(field);
      if (row.some((cell) => cell !== "")) result.push(row);
      row = []; field = "";
    } else field += char;
  }
  if (field || row.length) { row.push(field); result.push(row); }
  return result;
}

function numeric(value) {
  if (typeof value === "number") return value;
  return Number(String(value || "").replace(/[,%\s]/g, "")) || 0;
}

function wan(value) {
  return Math.round(value / 10000);
}

function formatWan(value) {
  return `${wan(value).toLocaleString("zh-TW")} 萬`;
}

function formatMonthWan(monthIndex, value) {
  return `${monthIndex + 1}月${wan(value).toLocaleString("zh-TW")}萬`;
}

function metricWan(value) {
  return `${wan(value).toLocaleString("zh-TW")}<small>萬</small>`;
}

function sumAt(index) {
  return rows.reduce((sum, row) => sum + numeric(row[index]), 0);
}

function sumAtThrough(index, endIndex) {
  return rows.reduce((sum, row, rowIndex) => rowIndex <= endIndex ? sum + numeric(row[index]) : sum, 0);
}

function update(id, content, html = false) {
  const element = document.querySelector(`#${id}`);
  if (!element) return;
  if (html) element.innerHTML = content;
  else element.textContent = content;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char]);
}

function comparison(current, previous) {
  const difference = current - previous;
  const rate = previous ? Math.round((difference / previous) * 100) : 0;
  return { difference, rate };
}

function setComparison(prefix, current, previous, unit = "萬") {
  const result = comparison(current, previous);
  const positive = result.difference >= 0;
  update(`${prefix}Comparison`, `${result.rate > 0 ? "+" : ""}${result.rate}%`);
  const differenceValue = unit === "件" ? Math.abs(result.difference) : Math.abs(wan(result.difference));
  update(`${prefix}ComparisonText`, `較去年同期${positive ? "增加" : "減少"} ${differenceValue.toLocaleString("zh-TW")} ${unit}`);
  document.querySelector(`#${prefix}ComparisonBlock`)?.classList.toggle("is-positive", positive);
}

function getReportMonthIndex() {
  const taipeiParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Taipei",
    month: "numeric",
    day: "numeric"
  }).formatToParts(new Date());
  const taipeiMonth = Number(taipeiParts.find((part) => part.type === "month")?.value || 1);
  const taipeiDay = Number(taipeiParts.find((part) => part.type === "day")?.value || 1);
  const calendarMonthIndex = taipeiDay <= 7 && taipeiMonth > 1 ? taipeiMonth - 2 : taipeiMonth - 1;
  return Math.min(Math.max(calendarMonthIndex, 0), rows.length - 1);
}

function renderDashboard() {
  const monthIndex = getReportMonthIndex();
  const row = rows[monthIndex];
  const month = monthIndex + 1;
  const date = new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    month: "numeric",
    day: "numeric"
  }).format(new Date());
  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Taipei",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const taipeiMonthNow = Number(dateParts.find((part) => part.type === "month")?.value || 1);
  const dateMonth = dateParts.find((part) => part.type === "month")?.value || "06";
  const dateDay = dateParts.find((part) => part.type === "day")?.value || "16";
  const monthLabel = `2026 年 ${month} 月`;
  const isCurrentMonthReport = month === taipeiMonthNow;
  const scopeLabel = isCurrentMonthReport ? `${month} 月目前業績` : `${month} 月完整結算`;
  update("todayDateLarge", `${dateMonth}/${dateDay}`);
  ["reportMonthLabel","reportMonthLabel2","reportMonthLabel3","reportMonthLabel4"].forEach((id) => update(id, monthLabel));
  update("reportScopeLabel1", scopeLabel);
  update("reportScopeLabel2", scopeLabel);
  update("reportScopeLabel3", `${scopeLabel}｜包含認證收入與既有長期合作 IP 收入`);
  update("reportScopeLabel4", `${scopeLabel}與後續目標`);

  const currentCases = numeric(row[2]);
  const previousCases = numeric(row[3]);
  const currentCert = numeric(row[10]);
  const previousCert = numeric(row[9]);
  const currentMarketing = numeric(row[15]);
  const previousMarketing = numeric(row[14]);
  const currentTotal = numeric(row[21]);
  const previousTotal = numeric(row[20]);
  const monthlyTarget = numeric(row[17]);
  const annualActual = sumAtThrough(21, monthIndex);
  const monthlyRate = monthlyTarget ? currentTotal / monthlyTarget : 0;
  const annualRate = annualActual / ANNUAL_TARGET;
  const nextMonthIndex = Math.min(monthIndex + 1, rows.length - 1);
  const certActualThrough = sumAtThrough(10, monthIndex);
  const certRemaining = Math.max(0, CERT_ANNUAL_TARGET - certActualThrough);
  const certRemainingWan = wan(certRemaining);
  const certRemainingRows = rows
    .map((item, index) => ({ item, index, weight: numeric(item[6]) || CERT_REMAINING_WEIGHTS[index] }))
    .filter(({ index, weight }) => index >= nextMonthIndex && weight > 0);
  const certRemainingWeightSum = certRemainingRows.reduce((sum, item) => sum + item.weight, 0);
  const certTargets = certRemainingRows.map(({ index, weight }) => {
    const adjustedWan = certRemainingWeightSum ? Math.round(certRemainingWan * (weight / certRemainingWeightSum)) : 0;
    return {
      monthIndex: index,
      adjusted: adjustedWan * 10000
    };
  });
  const nextCertTarget = certTargets[0]?.adjusted || 0;

  update("monthCases", `${currentCases}<small>件</small>`, true);
  update("lastYearMonthCases", `${previousCases}<small>件</small>`, true);
  update("monthCasesNote", `截至 ${date}`);
  setComparison("case", currentCases, previousCases, "件");

  update("monthCertRevenue", metricWan(currentCert), true);
  update("lastYearMonthCertRevenue", metricWan(previousCert), true);
  setComparison("cert", currentCert, previousCert);

  update("monthTotalRevenue", metricWan(currentTotal), true);
  update("lastYearCertBaseline", metricWan(previousTotal), true);
  update("lastYearTotalBreakdown", `認證 ${wan(previousCert)} 萬＋行銷 ${wan(previousMarketing)} 萬`);
  setComparison("total", currentTotal, previousTotal);
  const certDiff = wan(currentCert - previousCert);
  const marketingDiff = wan(currentMarketing - previousMarketing);
  update("totalComparisonText", `較去年總收入${currentTotal >= previousTotal ? "多" : "少"} ${Math.abs(wan(currentTotal - previousTotal))} 萬｜認證 ${certDiff >= 0 ? "+" : ""}${certDiff}、行銷 ${marketingDiff >= 0 ? "+" : ""}${marketingDiff} 萬`);

  update("monthlyRate", `${Math.round(monthlyRate * 100)}%`);
  update("annualRate", `${Math.round(annualRate * 100)}%`);
  update("monthlyActual", formatWan(currentTotal));
  update("monthlyTarget", formatWan(monthlyTarget));
  update("annualActual", formatWan(annualActual));
  update("monthlyDelta", `尚差 ${formatWan(Math.max(0, monthlyTarget - currentTotal))}`);
  update("annualDelta", `尚差 ${formatWan(Math.max(0, ANNUAL_TARGET - annualActual))}`);
  document.querySelector("#monthlyRateBar").style.width = `${Math.min(100, monthlyRate * 100)}%`;
  document.querySelector("#annualRateBar").style.width = `${Math.min(100, annualRate * 100)}%`;

  const currentMask = rows.map((item, index) => index <= monthIndex ? numeric(item[2]) : null);
  const certMask = rows.map((item, index) => index <= monthIndex ? wan(numeric(item[10])) : null);
  const totalMask = rows.map((item, index) => index <= monthIndex ? wan(numeric(item[21])) : null);
  renderLineChart("casesChart", rows.map((item) => numeric(item[3])), currentMask, "green", {
    monthIndex: 5,
    title: "活動帶動",
    value: "11 件",
    note: "6月底抽獎券活動",
    dx: 26,
    dy: -82
  });
  renderLineChart("certChart", rows.map((item) => wan(numeric(item[9]))), certMask, "gold");
  renderLineChart("totalChart", rows.map((item) => wan(numeric(item[20]))), totalMask, "blue");
  renderContractData();
}

function renderContractData() {
  renderAlliancePartners();
}

function parseContractData(parsed) {
  const values = parsed.map((row) => row.map((cell) => String(cell).trim()));
  const sentRow = values.find((row) => row[0] === "傳送合約");
  const signedRow = values.find((row) => row[0] === "回簽");
  const targetRow = values.find((row) => row[0] === "目標");
  if (!sentRow || !signedRow || !targetRow) throw new Error("簽約資料不完整");
  return {
    newSent: numeric(sentRow[1]),
    newSigned: numeric(signedRow[1]),
    newTarget: numeric(targetRow[1]),
    dualSent: numeric(sentRow[2]),
    dualSigned: numeric(signedRow[2])
  };
}

function parseAlliancePartners(parsed) {
  return parsed
    .slice(1)
    .filter((row) => numeric(row[0]) > 0 && String(row[4] || "").trim())
    .filter((row) => String(row[1] || "").trim() !== "不列入")
    .map((row, index) => ({
      number: numeric(row[0]) || index + 1,
      status: String(row[1] || "").trim(),
      region: normalizeRegion(row[2]),
      designer: String(row[3] || "待補").trim(),
      company: String(row[4] || "").trim(),
      period: getAlliancePeriod(numeric(row[0]) || index + 1),
      pending: String(row[1] || "").trim() === "資料待補"
    }));
}

function getAlliancePeriod(number) {
  if (number <= 11) return "6月";
  if (number <= 36) return "7月";
  return "8月";
}

function normalizeRegion(value) {
  const region = String(value || "").trim();
  if (!region) return "待補";
  return region
    .replace(/^臺南市$/, "台南")
    .replace(/^台南市$/, "台南")
    .replace(/^臺中市$/, "台中")
    .replace(/^台中市$/, "台中")
    .replace(/^臺北市$/, "台北")
    .replace(/^台北市$/, "台北")
    .replace(/^新北市$/, "新北")
    .replace(/^新竹市$/, "新竹")
    .replace(/^新竹縣$/, "新竹")
    .replace(/^高雄市$/, "高雄")
    .replace(/^宜蘭縣$/, "宜蘭");
}

function renderAlliancePartners() {
  const mapTarget = document.querySelector("#allianceMapPoints");
  const listTarget = document.querySelector("#allianceRegionList");

  const augustTarget = 10;
  const includedPartners = alliancePartners.filter((partner) => !partner.excluded && partner.status !== "不列入");
  const augustSigned = includedPartners.filter((partner) => partner.period === "8月").length;
  const totalSigned = includedPartners.length;
  update("allianceSummaryText", `8 月目標 ${augustTarget} 位｜目前已簽 ${augustSigned} 位｜累計合作 ${totalSigned} 位`);
  update("allianceAugustTarget", `${augustTarget}<small>位</small>`, true);
  update("allianceAugustSigned", `${augustSigned}<small>位</small>`, true);
  update("allianceAugustNote", augustSigned > 0 ? "含資料待補，排除不列入" : "目前尚未新增 8 月回簽");
  update("allianceTotalSigned", `${totalSigned}<small>位</small>`, true);
  if (!mapTarget || !listTarget) return;

  const grouped = includedPartners.reduce((accumulator, partner) => {
    const region = partner.region || "待補";
    if (!accumulator[region]) accumulator[region] = [];
    accumulator[region].push(partner);
    return accumulator;
  }, {});
  const regions = Object.entries(grouped)
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], "zh-Hant"));
  if (!activeAllianceRegion || !grouped[activeAllianceRegion]) activeAllianceRegion = regions[0]?.[0] || "";

  mapTarget.innerHTML = regions.map(([region, partners], index) => {
    const fallback = { x: 18 + (index % 3) * 19, y: 76 + Math.floor(index / 3) * 8 };
    const position = allianceMapPositions[region] || fallback;
    return `
      <button class="alliance-map-point ${region === activeAllianceRegion ? "is-active" : ""}" style="left:${position.x}%;top:${position.y}%;" type="button" data-region="${escapeHtml(region)}">
        <strong>${partners.length}</strong>
        <span>${escapeHtml(region)}</span>
      </button>
    `;
  }).join("");

  mapTarget.querySelectorAll(".alliance-map-point").forEach((button) => {
    button.addEventListener("click", () => {
      activeAllianceRegion = button.dataset.region;
      renderAlliancePartners();
    });
  });

  const selected = grouped[activeAllianceRegion] || [];
  update("selectedRegionTitle", `${activeAllianceRegion}合作名單`);
  update("selectedRegionCount", `${selected.length} 間`);
  listTarget.innerHTML = selected.map((partner) => {
    const statusText = partner.pending ? "資料待補｜尚未補齊剩餘資料" : `${partner.period}簽約`;
    return `
    <section class="alliance-region-card ${partner.period === "7月" ? "is-july" : ""} ${partner.pending ? "is-pending" : ""}">
      <strong>${escapeHtml(partner.company)}</strong>
      <span>${escapeHtml(statusText)}｜${escapeHtml(partner.designer)}</span>
    </section>
  `;
  }).join("");
}

function renderLineChart(id, previous, current, color, annotation = null) {
  const target = document.querySelector(`#${id}`);
  const width = 1100;
  const height = 300;
  const pad = { left: 40, right: 22, top: 38, bottom: 38 };
  const values = [...previous, ...current.filter((value) => value !== null)];
  const max = Math.max(...values, 1);
  const step = max > 100 ? 50 : max > 30 ? 10 : 5;
  const ceiling = Math.ceil(max / step) * step;
  const x = (index) => pad.left + index * ((width - pad.left - pad.right) / 11);
  const y = (value) => height - pad.bottom - (value / ceiling) * (height - pad.top - pad.bottom);
  const path = (valuesToPlot) => valuesToPlot
    .map((value, index) => value === null ? null : `${index === 0 || valuesToPlot[index - 1] === null ? "M" : "L"} ${x(index)} ${y(value)}`)
    .filter(Boolean).join(" ");
  const grid = [0,.25,.5,.75,1].map((ratio) => {
    const gy = pad.top + ratio * (height - pad.top - pad.bottom);
    return `<line class="grid-line" x1="${pad.left}" y1="${gy}" x2="${width-pad.right}" y2="${gy}"/>
      <text class="axis-label" x="0" y="${gy+4}">${Math.round(ceiling*(1-ratio))}</text>`;
  }).join("");
  const labels = rows.map((row,index) => `<text class="axis-label" x="${x(index)}" y="${height-8}" text-anchor="middle">${row[0]}月</text>`).join("");
  const previousMarks = previous.map((value,index) => `
    <circle class="dot-previous" cx="${x(index)}" cy="${y(value)}" r="3.5"/>
    <text class="value-previous" x="${x(index)}" y="${y(value)-10}" text-anchor="middle">${value}</text>`).join("");
  const currentMarks = current.map((value,index) => value === null ? "" : `
    <circle class="dot-current" cx="${x(index)}" cy="${y(value)}" r="5.5"/>
    <text class="value-current" x="${x(index)}" y="${y(value)-13}" text-anchor="middle">${value}</text>`).join("");
  const annotationMarkup = annotation && current[annotation.monthIndex] !== null ? (() => {
    const value = current[annotation.monthIndex];
    const ax = x(annotation.monthIndex);
    const ay = y(value);
    const boxX = Math.max(pad.left + 6, Math.min(width - pad.right - 188, ax + annotation.dx));
    const boxY = Math.max(pad.top + 2, ay + annotation.dy);
    return `
      <g class="chart-annotation">
        <path d="M ${boxX + 4} ${boxY + 46} L ${ax + 9} ${ay - 5}" />
        <rect x="${boxX}" y="${boxY}" width="176" height="54" rx="12" />
        <text class="annotation-title" x="${boxX + 15}" y="${boxY + 21}">${escapeHtml(annotation.title)}</text>
        <text class="annotation-value" x="${boxX + 93}" y="${boxY + 23}">${escapeHtml(annotation.value)}</text>
        <text class="annotation-note" x="${boxX + 15}" y="${boxY + 41}">${escapeHtml(annotation.note)}</text>
      </g>
    `;
  })() : "";

  target.style.setProperty("--series-color", `var(--${color})`);
  target.innerHTML = `<svg viewBox="0 0 ${width} ${height}" aria-label="每月趨勢圖">
    ${grid}${labels}
    <path class="series-previous" d="${path(previous)}"/>
    ${previousMarks}
    <path class="series-current" d="${path(current)}"/>
    ${currentMarks}
    ${annotationMarkup}
  </svg>`;
}

function buildControls() {
  const dots = document.querySelector("#slideDots");
  update("totalSlides", slides.length);
  slides.forEach((slide,index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `前往第 ${index+1} 頁：${slide.dataset.title}`);
    button.addEventListener("click", () => showSlide(index));
    dots.append(button);
  });
  showSlide(0);
}

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide,slideIndex) => slide.classList.toggle("is-active", slideIndex === activeSlide));
  [...document.querySelectorAll("#slideDots button")].forEach((dot,dotIndex) => dot.classList.toggle("is-active", dotIndex === activeSlide));
  update("currentSlide", activeSlide + 1);
}

function status(message, warning = false) {
  const element = document.querySelector("#dataStatus");
  element.textContent = message;
  element.classList.toggle("is-warning", warning);
  element.classList.remove("is-hidden");
  window.setTimeout(() => element.classList.add("is-hidden"), 2400);
}

function setAirQuality(text, level = "muted") {
  const element = document.querySelector("#airQualityText");
  if (!element) return;
  element.textContent = text;
  element.classList.toggle("is-moderate", level === "moderate");
  element.classList.toggle("is-unhealthy", level === "unhealthy");
  element.classList.toggle("is-muted", level === "muted");
}

function airQualityLevel(aqi) {
  if (!aqi) return "muted";
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "moderate";
  return "unhealthy";
}

function airQualityStatus(aqi) {
  if (!aqi) return "";
  if (aqi <= 50) return "良好";
  if (aqi <= 100) return "普通";
  if (aqi <= 150) return "對敏感族群不健康";
  if (aqi <= 200) return "對所有族群不健康";
  if (aqi <= 300) return "非常不健康";
  return "危害";
}

function shortAirTime(value) {
  const match = String(value || "").match(/(\d{4})[-/](\d{2})[-/](\d{2})\s+(\d{2}):(\d{2})/);
  return match ? `${match[4]}:${match[5]}` : "";
}

async function syncAirQuality() {
  try {
    if (!["http:", "https:"].includes(window.location.protocol)) {
      setAirQuality("請用 localhost 開啟", "muted");
      return;
    }
    const response = await fetch(`${AIR_QUALITY_ENDPOINT}?_=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`AQI HTTP ${response.status}`);
    const record = await response.json();
    const aqi = numeric(record.aqi);
    if (!aqi) throw new Error("AQI missing");
    const site = record.site || "中山";
    const statusText = record.status || airQualityStatus(aqi);
    const time = shortAirTime(record.time);
    setAirQuality(`${time ? `${time} ` : ""}${site}｜AQI ${aqi} ${statusText}`, airQualityLevel(aqi));
  } catch (error) {
    setAirQuality("空品讀取受限", "muted");
  }
}

function archiveDateString() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  return formatter.format(new Date()).replaceAll("-", "");
}

async function downloadWeeklyPdf() {
  await syncSheet();
  originalTitle = document.title;
  document.title = `營運部週會會報_${archiveDateString()}`;
  status("請在列印視窗選擇儲存為 PDF");
  window.setTimeout(() => window.print(), 120);
}

window.addEventListener("afterprint", () => {
  document.title = originalTitle;
});

async function syncSheet() {
  try {
    const cacheBuster = Date.now();
    const response = await fetch(`${SHEET_CSV_URL}&_=${cacheBuster}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const parsed = parseCsv(await response.text());
    const dataRows = parsed
      .filter((row) => /^(?:[1-9]|1[0-2])$/.test(String(row[0]).trim()))
      .slice(0,12);
    if (dataRows.length !== 12) throw new Error("月份資料不完整");
    rows = dataRows;

    const [contractResult, allianceResult] = await Promise.allSettled([
      fetch(`${CONTRACT_CSV_URL}&_=${cacheBuster}`, { cache: "no-store" }),
      fetch(`${ALLIANCE_CSV_URL}&_=${cacheBuster}`, { cache: "no-store" })
    ]);
    if (contractResult.status === "fulfilled" && contractResult.value.ok) {
      const contractParsed = parseCsv(await contractResult.value.text());
      contractData = parseContractData(contractParsed);
    }
    if (allianceResult.status === "fulfilled" && allianceResult.value.ok) {
      const allianceParsed = parseCsv(await allianceResult.value.text());
      alliancePartners = parseAlliancePartners(allianceParsed);
    }
    renderDashboard();
    status("ai2026 已同步");
  } catch (error) {
    renderDashboard();
    status("目前使用最近備份資料", true);
  }
}

document.querySelector("#prevButton").addEventListener("click", () => showSlide(activeSlide-1));
document.querySelector("#nextButton").addEventListener("click", () => showSlide(activeSlide+1));
document.querySelector("#fullscreenButton").addEventListener("click", async () => {
  if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
  else await document.exitFullscreen();
});
document.querySelector("#downloadPdfButton").addEventListener("click", downloadWeeklyPdf);
document.addEventListener("keydown", (event) => {
  if (["ArrowRight","PageDown"," "].includes(event.key)) { event.preventDefault(); showSlide(activeSlide+1); }
  if (["ArrowLeft","PageUp"].includes(event.key)) { event.preventDefault(); showSlide(activeSlide-1); }
  if (event.key.toLowerCase() === "f") document.querySelector("#fullscreenButton").click();
  if (event.key.toLowerCase() === "p" && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    downloadWeeklyPdf();
  }
});

buildControls();
renderDashboard();
syncSheet();
syncAirQuality();
window.setInterval(syncSheet,60_000);
window.setInterval(syncAirQuality, 10 * 60_000);
