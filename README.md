# GD Weekly Dashboard - GitHub Pages 上線包

這是一個從 `20260810_v1_營運週會儀表板分享版` 整理出的 GitHub Pages 靜態上線包。

## 內容

- `index.html`
- `styles.css`
- `app.js`
- 圖片素材
- `.nojekyll`

## GitHub Pages 設定

1. 建立 GitHub repository，建議名稱：`gd-weekly-dashboard-202608`
2. 將本資料夾內所有檔案上傳到 repo 根目錄
3. 到 GitHub repo：Settings → Pages
4. Source 選擇：Deploy from a branch
5. Branch 選擇：main，Folder 選擇：/root
6. 儲存後等待 GitHub Pages 發布

發布後網址通常會是：
`https://<你的GitHub帳號>.github.io/gd-weekly-dashboard-202608/`

## 注意

此版本為靜態網站，會保留 Google Sheets CSV 連動。原本 Codex/Sites 的 `/api/air-quality` 伺服器端 API 在 GitHub Pages 不會存在，因此空品資訊可能會顯示暫無資料。主要週會數據與簡報頁面不受影響。
