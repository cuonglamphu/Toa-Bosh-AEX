# Toa-Bosh-AEX

Portal báo cáo so sánh kỹ thuật NCC — **ONE Technical Comparison**.

## Trang chủ

**https://cuonglamphu.github.io/Toa-Bosh-AEX/**

Chọn hệ thống để xem báo cáo chi tiết.

## Báo cáo hiện có

| Hệ thống | URL | NCC so sánh |
|----------|-----|-------------|
| **VES/PA** (EN54-16) | [reports/pa/](reports/pa/index.html) | TOA · BOSCH · AEX |
| **CCTV** | [reports/cctv/](reports/cctv/index.html) | Honeywell · Hanwha · AXIS |

## Cấu trúc

```
index.html                    ← Trang chọn báo cáo
reports/shared/               ← CSS/JS dùng chung (PDF, charts, tooltips)
reports/pa/index.html         ← Báo cáo PA
reports/cctv/index.html       ← HTML shell
reports/cctv/cctv.css         ← Style riêng CCTV
reports/cctv/cctv-report.js   ← Logic báo cáo CCTV
data/cctv-data.js             ← Dữ liệu embed (local OK)
data/cctv-insights.js         ← Narrative & thị trường
scripts/parse-cctv-csv.mjs    ← Parse CSV → JSON/JS
```

## Cập nhật dữ liệu CCTV

1. Thay file `data/cctv-comparison.csv`
2. Chạy: `node scripts/parse-cctv-csv.mjs`
3. Push lên `main` → GitHub Pages tự deploy

## Deploy

Push `main` → GitHub Actions (`.github/workflows/pages.yml`)
