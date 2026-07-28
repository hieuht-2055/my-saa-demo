// Sun* Kudos live board (mm:2940:13431). VI is the source of truth — every
// string is copied verbatim from the Figma design; EN is the translation.
const kudos: Record<string, string> = {
  // A / A.1 — keyvisual banner + compose and search pills
  "hero.title": "Hệ thống ghi nhận và cảm ơn",
  "hero.logoAlt": "SAA 2025 KUDOS",
  "hero.composePlaceholder": "Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?",
  "hero.searchPlaceholder": "Tìm kiếm profile Sunner",
  "hero.searchSubmit": "Tìm kiếm",

  // B.1 / B.6 / C.1 — section headers
  "section.subtitle": "Sun* Annual Awards 2025",
  "section.highlight": "HIGHLIGHT KUDOS",
  "section.spotlight": "SPOTLIGHT BOARD",
  "section.all": "ALL KUDOS",

  // B.1.1 / B.1.2 — filter dropdowns
  "filter.hashtag": "Hashtag",
  "filter.department": "Phòng ban",
  "filter.all": "Tất cả",
  "filter.clear": "Bỏ lọc",

  // B.3 / C.3 / C.4 — kudos card
  "card.copyLink": "Copy Link",
  "card.viewDetail": "Xem chi tiết",
  "card.senderProfileAria": "Xem trang cá nhân người gửi",
  "card.receiverProfileAria": "Xem trang cá nhân người nhận",
  "card.sentAria": "Đã gửi lời cảm ơn",
  "card.like": "Thả tim",
  "card.unlike": "Bỏ thả tim",
  "card.likeOwnDisabled": "Bạn không thể thả tim cho Kudos của chính mình",
  "card.imageAlt": "Ảnh đính kèm Kudos",
  "card.openImageAria": "Xem ảnh cỡ lớn",
  "card.closeImageAria": "Đóng ảnh",
  "card.hashtagAria": "Lọc theo hashtag",

  // Rank badges + the "hoa thị" tier tooltip (spec B.3.2)
  "badge.new-hero": "New Hero",
  "badge.rising-hero": "Rising Hero",
  "badge.super-hero": "Super Hero",
  "badge.legend-hero": "Legend Hero",
  "starTier.1":
    "Sunner đã nhận được 10 Kudos và bắt đầu lan tỏa năng lượng ấm áp đến mọi người xung quanh.",
  "starTier.2":
    "Sunner đã nhận được 20 Kudos và chứng minh sức ảnh hưởng của mình qua những hành động lan tỏa tích cực mỗi ngày.",
  "starTier.3":
    "Sunner đã nhận được 50 Kudos và trở thành hình mẫu của sự công nhận, sẻ chia và lan tỏa tinh thần Sun*.",

  // B.2.1 / B.2.2 / B.5 — carousel navigation
  "carousel.prev": "Kudos trước",
  "carousel.next": "Kudos tiếp theo",
  "carousel.pageAria": "Vị trí slide hiện tại",

  // B.7 — Spotlight board
  "spotlight.kudosSuffix": "KUDOS",
  "spotlight.searchPlaceholder": "Tìm kiếm",
  "spotlight.panZoom": "Pan/Zoom",
  "spotlight.zoomIn": "Phóng to",
  "spotlight.zoomOut": "Thu nhỏ",
  "spotlight.tickerSuffix": "đã nhận được một Kudos mới",
  "spotlight.loading": "Đang tải bảng Spotlight...",
  "spotlight.empty": "Chưa có dữ liệu",
  "spotlight.receivedAt": "Nhận Kudos lúc",

  // C.2 — feed states
  "feed.empty": "Hiện tại chưa có Kudos nào.",
  "feed.loadingMore": "Đang tải thêm Kudos...",
  "feed.end": "Bạn đã xem hết Kudos.",

  // D.1 — sidebar statistics
  "stats.received": "Số Kudos bạn nhận được:",
  "stats.sent": "Số Kudos bạn đã gửi:",
  "stats.hearts": "Số tim bạn nhận được:",
  "stats.boxOpened": "Số Secret Box bạn đã mở:",
  "stats.boxUnopened": "Số Secret Box chưa mở:",
  "stats.openBox": "Mở Secret Box",
  "stats.multiplierAlt": "Đang trong ngày đặc biệt — mỗi lượt tim được tính x2",

  // D.3 — latest prize recipients
  "prizes.title": "10 SUNNER NHẬN QUÀ MỚI NHẤT",
  "prizes.empty": "Chưa có dữ liệu",

  // Toasts
  "toast.linkCopied": "Link copied — ready to share!",
  "toast.copyFailed": "Không sao chép được link. Vui lòng thử lại.",
  "toast.dismiss": "Đóng thông báo",

  // A.1 — compose dialog (behaviour specified in A.1; drawn on its own frame)
  "compose.title": "Gửi lời cảm ơn",
  "compose.messageLabel": "Lời cảm ơn của bạn",
  "compose.messagePlaceholder": "Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?",
  "compose.hashtagLabel": "Hashtag",
  "compose.submit": "Gửi Kudos",
  "compose.cancel": "Huỷ",
  "compose.close": "Đóng",
  "compose.required": "Vui lòng nhập lời cảm ơn trước khi gửi.",
  "compose.sent": "Đã gửi lời cảm ơn của bạn!",

  // D.1.8 — Secret Box dialog (behaviour specified in D.1.8)
  "secretBox.title": "Secret Box",
  "secretBox.remaining": "Số Secret Box chưa mở:",
  "secretBox.open": "Mở ngay",
  "secretBox.none": "Bạn chưa có Secret Box nào để mở.",
  "secretBox.close": "Đóng",

  // Sunner search validation (spec B.7.3 — max 100 characters)
  "search.required": "Vui lòng nhập từ khoá tìm kiếm.",
  "search.tooLong": "Từ khoá tìm kiếm tối đa 100 ký tự.",
  "search.noResult": "Không tìm thấy Sunner nào khớp với từ khoá.",
};

export default kudos;
