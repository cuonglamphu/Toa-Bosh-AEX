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
index.html              ← Trang chọn báo cáo
reports/pa/index.html   ← Báo cáo PA đầy đủ
reports/cctv/index.html ← Báo cáo CCTV (từ CSV REV01)
data/cctv-data.json     ← Dữ liệu parse từ CSV
assets/logo-one.png     ← Logo ONE
```

## Cập nhật dữ liệu CCTV

1. Thay file `data/cctv-comparison.csv`
2. Chạy: `node scripts/parse-cctv-csv.mjs`
3. Push lên `main` → GitHub Pages tự deploy

## Deploy

Push `main` → GitHub Actions (`.github/workflows/pages.yml`)
