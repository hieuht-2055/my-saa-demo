// Sun* Kudos live board (mm:2940:13431) — English translation of the VI source
// in ../vi/kudos.ts. Brand words ("Kudos", "Sunner", "Secret Box", "Copy Link",
// the rank badges) and the copy-confirmation toast stay as designed.
const kudos: Record<string, string> = {
  "hero.title": "Recognition & thank-you system",
  "hero.logoAlt": "SAA 2025 KUDOS",
  "hero.composePlaceholder": "Who would you like to thank and recognise today?",
  "hero.searchPlaceholder": "Search for a Sunner profile",
  "hero.searchSubmit": "Search",

  "section.subtitle": "Sun* Annual Awards 2025",
  "section.highlight": "HIGHLIGHT KUDOS",
  "section.spotlight": "SPOTLIGHT BOARD",
  "section.all": "ALL KUDOS",

  "filter.hashtag": "Hashtag",
  "filter.department": "Department",
  "filter.all": "All",
  "filter.clear": "Clear filter",

  "card.copyLink": "Copy Link",
  "card.viewDetail": "View details",
  "card.senderProfileAria": "View the sender's profile",
  "card.receiverProfileAria": "View the recipient's profile",
  "card.sentAria": "Kudos sent",
  // Fallback name when a kudos was sent anonymously without one (spec G).
  "card.anonymous": "Anonymous sender",
  "card.like": "Give a heart",
  "card.unlike": "Remove your heart",
  "card.likeOwnDisabled": "You cannot give a heart to your own Kudos",
  "card.imageAlt": "Kudos attachment",
  "card.openImageAria": "Open full-size image",
  "card.closeImageAria": "Close image",
  "card.hashtagAria": "Filter by hashtag",

  "badge.new-hero": "New Hero",
  "badge.rising-hero": "Rising Hero",
  "badge.super-hero": "Super Hero",
  "badge.legend-hero": "Legend Hero",
  "starTier.1":
    "This Sunner has received 10 Kudos and is starting to spread warm energy to everyone around them.",
  "starTier.2":
    "This Sunner has received 20 Kudos and proves their influence through positive actions every day.",
  "starTier.3":
    "This Sunner has received 50 Kudos and has become a role model of recognition, sharing and the Sun* spirit.",

  "carousel.prev": "Previous Kudos",
  "carousel.next": "Next Kudos",
  "carousel.pageAria": "Current slide position",

  "spotlight.kudosSuffix": "KUDOS",
  "spotlight.searchPlaceholder": "Search",
  "spotlight.panZoom": "Pan/Zoom",
  "spotlight.zoomIn": "Zoom in",
  "spotlight.zoomOut": "Zoom out",
  "spotlight.tickerSuffix": "received a new Kudos",
  "spotlight.loading": "Loading the Spotlight board...",
  "spotlight.empty": "No data yet",
  "spotlight.receivedAt": "Kudos received at",

  "feed.empty": "There are no Kudos yet.",
  "feed.loadingMore": "Loading more Kudos...",
  "feed.end": "You have reached the end of the feed.",

  "stats.received": "Kudos you received:",
  "stats.sent": "Kudos you sent:",
  "stats.hearts": "Hearts you received:",
  "stats.boxOpened": "Secret Boxes you opened:",
  "stats.boxUnopened": "Secret Boxes still closed:",
  "stats.openBox": "Open Secret Box",
  "stats.multiplierAlt": "Special day in progress — every heart counts double",

  "prizes.title": "10 SUNNERS WHO JUST RECEIVED A GIFT",
  "prizes.empty": "No data yet",

  "toast.linkCopied": "Link copied — ready to share!",
  "toast.copyFailed": "Could not copy the link. Please try again.",
  "toast.dismiss": "Dismiss notification",

  "compose.title": "Send a thank-you and recognition to a teammate",
  "compose.close": "Close",
  "compose.requiredMark": "*",

  "compose.recipientLabel": "Recipient",
  "compose.recipientPlaceholder": "Search",
  "compose.recipientDropdownAria": "Recipient suggestions",

  "compose.toolbarBoldAria": "Bold",
  "compose.toolbarItalicAria": "Italic",
  "compose.toolbarStrikethroughAria": "Strikethrough",
  "compose.toolbarNumberListAria": "Numbered list",
  "compose.toolbarLinkAria": "Insert link",
  "compose.toolbarQuoteAria": "Quote",
  "compose.linkPromptLabel": "Enter a link URL",
  "compose.linkPromptPlaceholder": "https://example.com",
  "compose.linkPromptOpenNewTab": "Open in a new tab",
  "compose.linkPromptConfirm": "Insert link",

  "compose.contentPlaceholder": "Write your thank-you and recognition for a teammate here!",
  "compose.mentionHint": "You can type “@ + name” to mention a colleague",
  "compose.mentionDropdownAria": "Mention suggestions",
  "compose.contentCounterAria": "Characters typed",

  // mm:1688:10448 — "Danh hiệu", the one required field with no spec row.
  "compose.titleLabel": "Title",
  "compose.titlePlaceholder": "Award your teammate a title",
  "compose.titleHint":
    "For example: The one who motivates me.\nThe title is shown as your Kudos heading.",
  "compose.titleDropdownAria": "Title options",
  "compose.hashtagLabel": "Hashtag",
  "compose.maxCount": "Up to 5",
  "compose.hashtagDropdownAria": "Hashtag list",
  "compose.hashtagRemoveAria": "Remove hashtag",

  "compose.imageLabel": "Image",
  "compose.imageRemoveAria": "Remove image",

  "compose.anonymousLabel": "Send this thank-you and recognition anonymously",
  "compose.anonymousNameLabel": "Anonymous display name",
  "compose.anonymousNamePlaceholder": "Enter the name you want to display",

  "compose.cancel": "Cancel",
  "compose.submit": "Send",
  "compose.submitting": "Sending...",
  "compose.sent": "Your thank-you has been sent!",

  "compose.errors.required": "This field is required.",
  "compose.errors.max": "You've reached the maximum allowed.",
  "compose.errors.type": "This file type isn't supported.",

  // Server-action failures (app/_kudos/kudos-actions.ts). Shown in the toast.
  "action.signedOut": "Your session has expired. Please sign in again.",
  "action.invalid": "Please fill in every required field.",
  "action.tooManyHashtags": "Up to 5 hashtags.",
  "action.selfKudos": "You cannot send a Kudos to yourself.",
  "action.createFailed": "Could not send the Kudos. Please try again.",
  "action.likeFailed": "Could not save your heart. Please try again.",

  "secretBox.title": "Secret Box",
  "secretBox.remaining": "Secret Boxes still closed:",
  "secretBox.open": "Open now",
  "secretBox.none": "You have no Secret Box to open yet.",
  "secretBox.close": "Close",

  "search.required": "Please enter a search keyword.",
  "search.tooLong": "Search keywords are limited to 100 characters.",
  "search.noResult": "No Sunner matches that keyword.",
};

export default kudos;
