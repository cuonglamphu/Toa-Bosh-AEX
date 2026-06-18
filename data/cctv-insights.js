window.CCTV_INSIGHTS = {

  references: [

    { source: 'Technical comparison.CCTV.REV01.csv', type: 'BOQ Submittal', note: '48 tiêu chí · 4 nhóm thiết bị · cột Comply chính thức' },

    { source: 'Omdia Video Surveillance & Analytics 2024', type: 'Thị trường', note: 'AXIS & Hanwha Vision thuộc nhóm leader toàn cầu về IP camera & VMS' },

    { source: 'Frost & Sullivan APAC Physical Security 2023', type: 'Thị trường', note: 'Tăng trưởng vertical sân bay + logistics; edge AI là driver chính' },

    { source: 'ICAO Doc 8973 / Annex 17', type: 'Chuẩn cảng HK', note: 'Yêu cầu giám sát perimeter, checkpoint, integration với ACS/FIDS' },

    { source: 'ACI Airport Security Guidelines', type: 'Vertical', note: 'Khuyến nghị redundancy NVR, cyber hardening, audit trail 90+ ngày' },

    { source: 'ONVIF Profile S · G · T · M', type: 'Tích hợp', note: 'Profile S streaming · G recording · T analytics · M metadata — baseline mở cho VMS' },

    { source: 'Milestone XProtect / Genetec Security Center', type: 'VMS', note: 'Ecosystem VMS thường gặp tại dự án hạ tầng VN — ảnh hưởng TCO license' },

    { source: 'Vietnam Infrastructure CCTV Benchmark 2024–25', type: 'Benchmark VN', note: 'Ưu tiên spec-match BOQ, local support, bảo hành 3–5 năm tại site' }

  ],

  market: [

    { vendor: 'Honeywell', execution: 8.2, vision: 7.8, quadrant: 'Enterprise Integrator', globalShare: '~4%', apacRank: 'Top 5 integrator', note: 'Mạnh tích hợp BMS/PSIM tại dự án hạ tầng; camera OEM qua Honeywell Security · quen ecosystem Milestone tại VN' },

    { vendor: 'Hanwha Vision', execution: 8.5, vision: 8.0, quadrant: 'AI Vision Leader', globalShare: '~6%', apacRank: 'Top 3 camera APAC', note: 'Wisenet AI, SUNAPI; tăng trưởng mạnh APAC & airport vertical · TCO camera cạnh tranh' },

    { vendor: 'AXIS', execution: 8.8, vision: 8.6, quadrant: 'Platform Leader', globalShare: '~8%', apacRank: 'Reference ONVIF', note: 'ACS + Object Analytics + Zipstream; chuẩn ONVIF reference · premium CAPEX, OPEX license rõ ràng' }

  ],

  marketDimensions: [

    { dimension: 'Open platform / ONVIF', honeywell: 7.0, hanwha: 8.5, axis: 9.5, note: 'AXIS là reference implementation; Hanwha SUNAPI bổ sung; Honeywell thiên ecosystem đóng hơn' },

    { dimension: 'Năng lực AI trên camera', honeywell: 7.5, hanwha: 9.0, axis: 8.5, note: 'Hanwha Wisenet AI (fall, mask, line-cross); AXIS Object Analytics; Honeywell SMD/face' },

    { dimension: 'Tích hợp VMS / PSIM', honeywell: 8.5, hanwha: 8.0, axis: 9.0, note: 'Honeywell mạnh khi CĐT đã chọn Honeywell building stack; AXIS ACS scale enterprise' },

    { dimension: 'Vertical sân bay / hạ tầng', honeywell: 8.0, hanwha: 8.5, axis: 8.5, note: 'Cả ba đều có reference APAC; Hanwha tăng share tại HK mới mở rộng' },

    { dimension: 'Cyber & hardening', honeywell: 8.0, hanwha: 8.0, axis: 9.0, note: 'AXIS signed firmware, TPM options; cả ba hỗ trợ HTTPS/TLS — cần policy CĐT' },

    { dimension: 'TCO 10 năm (camera + license)', honeywell: 7.5, hanwha: 8.5, axis: 7.0, note: 'Hanwha CAPEX camera thấp hơn; AXIS license ACS/VMS có thể +15–25% OPEX' },

    { dimension: 'Hỗ trợ & SLA tại VN', honeywell: 8.5, hanwha: 8.0, axis: 7.5, note: 'Honeywell network integrator dày tại dự án BMS; Hanwha tăng đội field APAC' },

    { dimension: 'Khả năng mở rộng channel', honeywell: 8.0, hanwha: 8.5, axis: 9.0, note: 'AXIS S1264 tier 850Mbps; Hanwha XRN 520Mbps; Honeywell H4 NVR enterprise' }

  ],

  marketTrends: [

    { trend: 'Edge AI trên camera (giảm tải server)', impact: 'Cao', horizon: '2024–2027', note: 'Fall detection, loitering, PPE — giảm false alarm perimeter sân bay' },

    { trend: 'Cyber hardening & zero-trust camera', impact: 'Cao', horizon: 'Ongoing', note: 'Signed firmware, certificate rotation — bắt buộc theo ACI/ICAO audit' },

    { trend: 'Multi-sensor & panoramic thay bullet rời', impact: 'Trung bình', horizon: '2025+', note: 'Giảm POE port & cable tại apron/wide FOV — cần align BOQ Phase 2' },

    { trend: 'Cloud/hybrid VMS (không thay NVR core)', impact: 'Trung bình', horizon: '2026+', note: 'Backup metadata, health monitoring — NVR on-prem vẫn là baseline cảng HK VN' },

    { trend: 'Open API (SUNAPI, VAPIX, Milestone MIP)', impact: 'Cao', horizon: 'Hiện tại', note: 'Tích hợp FIDS, ACS, PIDS — tránh vendor lock-in khi đổi VMS' },

    { trend: 'TCO pressure & local content', impact: 'Cao', horizon: 'VN 2024–25', note: 'CĐT ưu tiên spec-match + bảo hành site; premium platform cần business case' }

  ],

  verticalAirport: [

    { criterion: 'Perimeter & apron (WDR, IR 50m+)', honeywell: 'HC35/PQZ series — đạt BOQ', hanwha: 'XNO/PNO AI — IR mạnh', axis: 'P1487-LE / Q1656 — Zipstream tiết kiệm storage' },

    { criterion: 'Checkpoint / terminal (face, crowd)', honeywell: 'Face analytics SMD', hanwha: 'Wisenet AI mask/face', axis: 'Object Analytics + Scene Intelligence' },

    { criterion: 'Elevator / cabin (compact dome)', honeywell: 'HC35W45R — baseline BOQ', hanwha: 'XNV-6081R compact', axis: '⚠ REV01 liệt kê model Honeywell — cần làm rõ' },

    { criterion: 'NVR redundancy & retention 90d+', honeywell: 'H4 Pro enterprise', hanwha: 'XRN-6420 80TB tier', axis: 'S1264 850Mbps — partial HDMI cần KVM' },

    { criterion: 'Tích hợp ACS / FIDS / PSIM', honeywell: 'Mạnh qua Honeywell Pro-Watch', hanwha: 'ONVIF + SUNAPI', axis: 'ACS native + ONVIF G/T' }

  ],

  marketInsights: [

    {

      title: 'Bối cảnh thị trường CCTV hạ tầng VN',

      summary: 'Thị trường IP camera APAC tăng ~8–10%/năm (Omdia/Frost). Dự án cảng HK như Gia Bình ưu tiên spec-match BOQ và khả năng audit TVGS hơn là ranking toàn cầu thuần túy.',

      bullets: [

        'Ba vendor đều nằm nhóm có thể triển khai enterprise — khác biệt nằm ở ecosystem, TCO và rủi ro submittal',

        'Quyết định 15–20 năm: camera + NVR + license VMS + tích hợp ACS — không chỉ điểm Comply REV01',

        'Benchmark VN: local support, spare part, biên bản partial trước LOA quan trọng hơn Magic Quadrant'

      ]

    },

    {

      title: 'Honeywell — Enterprise Integrator',

      summary: 'Honeywell không chỉ là camera OEM mà là nhà tích hợp building + security. Phù hợp khi CĐT đã chuẩn hóa Honeywell/Milestone tại campus hoặc các dự án hạ tầng do EPC quen ecosystem.',

      bullets: [

        'Execution cao tại VN nhờ mạng lưới integrator và quen thủ tục BOQ hạ tầng',

        'REV01: HN35640800NR 47/48 full — partial duy nhất I-11 (2×1GbE, thiếu 10GbE SFP+)',

        'Stack đồng nhất HC35W45R + HC60WB5R — không lẫn brand như AXIS elevator section'

      ]

    },

    {

      title: 'Hanwha Vision — AI & TCO cân bằng',

      summary: 'Hanwha tăng share mạnh APAC nhờ Wisenet AI và giá camera cạnh tranh. Omdia xếp nhóm leader; phù hợp dự án cần analytics đa kịch bản mà vẫn kiểm soát CAPEX.',

      bullets: [

        'XRN-6420RB 520Mbps + 80TB vượt baseline NVR; XND-8080RV/XNO-A8084R Wisenet AI fall/mask/tracking',

        'SUNAPI + ONVIF Profile-S — linh hoạt VMS third-party hơn Honeywell Milestone stack',

        'REV01: 4 partial (I-9 phân quyền, I-11 cổng, I-12 alarm, IV-5 WiseIR 50m) — chuẩn hóa XRN-6420RB* trước LOA'

      ]

    },

    {

      title: 'AXIS — Platform Leader dài hạn',

      summary: 'AXIS dẫn về open platform, cyber posture và ACS scale. CAPEX/OPEX premium nhưng giảm rủi ro lock-in khi tích hợp PSIM/FIDS multi-vendor.',

      bullets: [

        'S1264 Rack 850Mbps + 64 ACS licenses; P1487-LE Zipstream giảm storage 30–50% retention 90+ ngày',

        'ONVIF Profile S/G/T/M + Object Analytics — baseline tích hợp PSIM/FIDS cross-vendor',

        'Red flag REV01: Section III elevator toàn HC35W45R* (Honeywell) — audit bắt buộc dù 48/48 Comply full'

      ]

    },

    {

      title: 'Luận điểm tích hợp VMS & PSIM',

      summary: 'Cảng HK thường chạy VMS độc lập (Milestone, Genetec) hoặc module PSIM. ONVIF Profile S/G/T là điều kiện cần — không đủ nếu CĐT yêu cầu deep integration (LPR, FIDS event).',

      bullets: [

        'AXIS: ACS native nếu chọn single-vendor; ONVIF G/T nếu giữ VMS hiện hữu',

        'Hanwha: Wisenet WAVE hoặc third-party qua ONVIF — cân bằng chi phí',

        'Honeywell: lợi thế nếu Pro-Watch/BMS cùng nhà — otherwise đánh giá lock-in'

      ]

    },

    {

      title: 'TCO & rủi ro ẩn 10 năm',

      summary: 'BOQ Phase 1.1 chưa có giá — cần mô hình TCO: camera + NVR + storage + license analytics + tích hợp + bảo trì. Partial spec có thể chuyển thành VO cao nếu không làm rõ trước LOA.',

      bullets: [

        'Hanwha: CAPEX camera thấp nhất trong ba; kiểm tra license WAVE nếu dùng',

        'AXIS: license ACS theo channel/analytics — scale Phase 2 cần forecast',

        'Honeywell: ít deviation — nhưng module SFP+ 10GbE hoặc biên bản thay thế phải có giá sớm'

      ]

    }

  ],

  marketNarrative: 'Trên biểu đồ Execution–Vision, AXIS nằm góc Platform Leader (open API, cyber, ACS); Hanwha ở vùng AI Vision Leader với execution APAC mạnh; Honeywell là Enterprise Integrator — vision thấp hơn nhưng execution thực địa tại VN cao. Không có vendor "thắng" tuyệt đối: Honeywell an toàn BOQ, Hanwha cân bằng AI/TCO, AXIS đầu tư nền tảng dài hạn. REV01 chứng minh cả ba đạt kỹ thuật trên giấy — quyết định CĐT nên cộng thêm vertical sân bay, TCO và rủi ro submittal (đặc biệt elevator AXIS & 4 partial Hanwha).',

  narratives: {

    hook: 'Dự án CCTV Gia Bình Phase 1.1 không chỉ là cuộc đua thông số — đây là quyết định nền tảng vận hành 15–20 năm cho một cảng hàng không quốc tế. Ba vendor đều cam kết đạt BOQ trên giấy, nhưng câu hỏi thực sự là: ai giữ được tính toàn vẹn submittal khi tích hợp VMS, mở rộng camera và audit PCCC?',

    finding1: 'NVR chiếm trọng số 35% — điểm nghẽn nằm ở cổng 10GbE SFP+ và chuẩn hóa submittal. Honeywell và Hanwha bị partial tại mục connection ports; AXIS được ghi full trên REV01 dù submittal chỉ liệt kê 2×1GbE — cần làm rõ với TVGS.',

    finding2: 'Camera chiếm 65% trọng số còn lại. Cả ba đều mạnh analytics và 5MP, nhưng Hanwha có thêm 3 partial ở NVR. AXIS elevator section dùng model Honeywell (HC35W45R*) — red flag về tính nhất quán submittal.',

    finding3: 'Tham chiếu Omdia/Frost 2024: thị trường APAC dịch chuyển sang edge AI và cyber hardening — cả ba vendor đều có lộ trình, khác tốc độ và TCO.',

    finding4: 'Vertical sân bay (ICAO/ACI): redundancy NVR, retention dài, tích hợp ACS/FIDS quan trọng hơn điểm radar marketing. Honeywell mạnh integrator; Hanwha AI; AXIS open platform.',

    finding5: 'Benchmark VN: CĐT thường chấp nhận 1–2 partial nếu có biên bản kỹ thuật — nhưng 4 partial (Hanwha) hoặc submittal lẫn brand (AXIS elevator) là rủi ro phê duyệt cao hơn deviation giá.'

  },

  scenarios: [

    {

      title: 'Kịch bản A — An toàn phê duyệt BOQ',

      vendor: 'Honeywell',

      border: 'border-brand-600',

      bg: 'bg-red-50/40',

      text: 'Chọn Honeywell khi ưu tiên ít deviation nhất so baseline thiết kế và quen vận hành tại các dự án hạ tầng VN. Chấp nhận 1 partial (10GbE) — yêu cầu NCC bổ sung SFP+ module hoặc biên bản thay thế được TVGS chấp thuận trước LOA.'

    },

    {

      title: 'Kịch bản B — AI & mở rộng APAC',

      vendor: 'Hanwha Vision',

      border: 'border-orange-400',

      bg: 'bg-orange-50/40',

      text: 'Chọn Hanwha khi CĐT coi trọng analytics AI (fall detection, mask, auto-tracking) và TCO camera. Điều kiện: làm rõ 4 mục partial NVR + chuẩn hóa model code XRN-6420 trước ký hợp đồng.'

    },

    {

      title: 'Kịch bản C — Nền tảng enterprise dài hạn',

      vendor: 'AXIS',

      border: 'border-violet-500',

      bg: 'bg-violet-50/40',

      text: 'Chọn AXIS khi chiến lược dài hạn là ACS + Object Analytics + ONVIF mở. REV01 ghi 10/10 nhưng bắt buộc audit lại elevator submittal và license ACS scale — tránh chi phí ẩn khi tăng channel.'

    }

  ],

  conclusion: {

    verdict: 'Phê duyệt có điều kiện — không khuyến nghị ký LOA trực tiếp trên REV01 hiện tại',

    primary: {

      scenario: 'A',

      vendor: 'Honeywell',

      rationale: 'Khoảng cách Comply so với AXIS chỉ 0,1 điểm (9,9 vs 10,0) nhưng rủi ro submittal thấp nhất trong ba phương án: một partial duy nhất (cổng 10GbE NVR), không có red flag lẫn brand, và execution thực địa tại dự án hạ tầng VN mạnh nhất. Phù hợp khi CĐT ưu tiên tiến độ phê duyệt TVGS và spec-match BOQ Phase 1.1.'

    },

    alternatives: [

      {

        scenario: 'C',

        vendor: 'AXIS',

        when: 'Khi chiến lược 15–20 năm hướng tới ACS, Zipstream tiết kiệm storage retention 90+ ngày, và ONVIF Profile S/G/T/M làm baseline tích hợp PSIM/FIDS.'

      },

      {

        scenario: 'B',

        vendor: 'Hanwha Vision',

        when: 'Khi CĐT chấp nhận đổi lấy Wisenet AI và TCO camera thấp hơn — với điều kiện đóng toàn bộ 4 partial trước ký hợp đồng.'

      }

    ],

    rankingNote: 'Xếp hạng Comply REV01 (trọng số I–IV): AXIS 10,0 → Honeywell 9,9 → Hanwha 9,58. Thứ tự điểm không đồng nghĩa thứ tự khuyến nghị: AXIS dẫn trên giấy nhưng mang red flag submittal thang máy (model Honeywell HC35W45R* thay vì AXIS); Hanwha lùi do 4 partial tập trung ở NVR (35% trọng số) và bullet IR; Honeywell cân bằng nhất giữa điểm cao và rủi ro phê duyệt.',

    marketSynthesis: 'Trên nền Omdia/Frost APAC, AXIS định vị Platform Leader (open API, cyber, ACS scale); Hanwha AI Vision Leader với execution APAC và TCO camera cạnh tranh; Honeywell Enterprise Integrator — vision thấp hơn nhưng tích hợp BMS/PSIM và mạng lưới integrator VN dày. Cả ba đều triển khai được vertical sân bay (ICAO Annex 17, ACI redundancy) — khác biệt nằm ở ecosystem lock-in, license OPEX 10 năm và mức độ làm sạch submittal trước TVGS.',

    actionItems: [

      { vendor: 'Honeywell', item: 'Bổ sung module SFP+ 10GbE hoặc biên bản thay thế cổng kết nối NVR (I-11) — kèm báo giá VO và chữ ký TVGS.' },

      { vendor: 'Hanwha', item: 'Đóng 4 partial: phân quyền tài khoản (I-9), cổng kết nối (I-11), cảnh báo alarm (I-12), tiêu cự/IR bullet (IV-5); chuẩn hóa model XRN-6420RB* trên toàn bộ submittal.' },

      { vendor: 'AXIS', item: 'Thay toàn bộ elevator submittal (Section III) — hiện liệt kê model Honeywell HC35W45R*; bổ sung model AXIS cabin dome hợp lệ và datasheet độc lập.' },

      { vendor: 'AXIS', item: 'Forecast license ACS theo channel Phase 2; xác nhận giải pháp KVM cho NVR (không HDMI built-in) trong thiết kế phòng giám sát.' },

      { vendor: 'Tất cả', item: 'Mô hình TCO 10 năm: camera + NVR + storage + VMS/analytics license + tích hợp ACS/FIDS + SLA bảo trì site Gia Bình.' },

      { vendor: 'Tất cả', item: 'Xác nhận ONVIF Profile S/G/T baseline và kế hoạch cyber hardening (signed firmware, TLS) theo ACI audit trail 90+ ngày.' }

    ],

    riskIfWrong: 'Chọn vendor chưa đóng gap submittal sẽ chuyển rủi ro kỹ thuật thành VO và delay LOA: Honeywell — chi phí module 10GbE và lock-in ecosystem khi đổi VMS sau này; Hanwha — 4 partial chưa làm rõ có thể phát sinh thay đổi NVR/storage lớn khi TVGS audit; AXIS — elevator submittal lẫn brand là rủi ro compliance cao nhất, có thể bị từ chối dù Comply 10/10, cộng thêm OPEX license ACS không forecast sẽ vượt ngân sách Phase 2.'

  }

};


