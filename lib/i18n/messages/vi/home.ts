// Home screen (hero, root-further, event info, awards preview, kudos).
// Populated by the home-content i18n pass.
const home: Record<string, string> = {
  // Hero — event date/venue/livestream info (mm:2167:9053).
  'hero.eventTimeLabel': 'Thời gian: ',
  'hero.eventDate': '26/12/2025',
  'hero.venueLabel': 'Địa điểm:',
  'hero.venueValue': 'Âu Cơ Art Center',
  'hero.livestream': 'Tường thuật trực tiếp qua sóng Livestream',

  // Hero CTA pair (mm:2167:9062).
  'cta.aboutAwards': 'ABOUT AWARDS',
  'cta.aboutKudos': 'ABOUT KUDOS',

  // Root Further theme copy (mm:3204:10152) — not yet wired to a client
  // component in this pass; keys reserved for that follow-up.
  'rootFurther.para1':
    'Đứng trước bối cảnh thay đổi như vũ bão của thời đại AI và yêu cầu ngày càng cao từ khách hàng, Sun* lựa chọn chiến lược đa dạng hóa năng lực để không chỉ nỗ lực trở thành tinh anh trong lĩnh vực của mình, mà còn hướng đến một cái đích cao hơn, nơi mọi Sunner đều là “problem-solver” - chuyên gia trong việc giải quyết mọi vấn đề, tìm lời giải cho mọi bài toán của dự án, khách hàng và xã hội.',
  'rootFurther.para2':
    'Lấy cảm hứng từ sự đa dạng năng lực, khả năng phát triển linh hoạt cùng tinh thần đào sâu để bứt phá trong kỷ nguyên AI, “Root Further” đã được chọn để trở thành chủ đề chính thức của Lễ trao giải Sun* Annual Awards 2025.',
  'rootFurther.para3':
    'Vượt ra khỏi nét nghĩa bề mặt, “Root Further” chính là hành trình chúng ta không ngừng vươn xa hơn, cắm rễ mạnh hơn, chạm đến những tầng “địa chất” ẩn sâu để tiếp tục tồn tại, vươn lên và nuôi dưỡng đam mê kiến tạo giá trị luôn cháy bỏng của người Sun*. Mượn hình ảnh bộ rễ liên tục đâm sâu vào lòng đất, mạnh mẽ len lỏi qua từng lớp “trầm tích” để thẩm thấu những gì tinh tuý nhất, người Sun* cũng đang “hấp thụ” dưỡng chất từ thời đại và những thử thách của thị trường để làm mới mình mỗi ngày, mở rộng năng lực và mạnh mẽ “bén rễ” vào kỷ nguyên AI - một tầng “địa chất” hoàn toàn mới, phức tạp và khó đoán, nhưng cũng hội tụ vô vàn tiềm năng cùng cơ hội.',
  'rootFurther.quoteEn': 'A tree with deep roots fears no storm',
  'rootFurther.quoteVi': '(Cây sâu bén rễ, bão giông chẳng nề - Ngạn ngữ Anh)',
  'rootFurther.para4a':
    'Trước giông bão, chỉ những tán cây có bộ rễ đủ mạnh mới có thể trụ vững. Một tổ chức với những cá nhân tự tin vào năng lực đa dạng, sẵn sàng kiến tạo và đón nhận thử thách, làm chủ sự thay đổi là tổ chức không chỉ vững vàng trước biến động, mà còn khai thác được mọi lợi thế, chinh phục các thách thức của thời cuộc. Không đơn thuần là tên gọi của chương mới trên hành trình phát triển tổ chức, “Root Further” còn như một lời cổ vũ, động viên mỗi chúng ta hãy dám tin vào bản thân, dám đào sâu, khai mở mọi tiềm năng, dám phá bỏ giới hạn, dám trở thành phiên bản đa nhiệm và xuất sắc nhất của mình. Bởi trong thời đại AI, đa dạng năng lực và tận dụng sức mạnh thời cuộc chính là điều kiện tiên quyết để trường tồn.',
  'rootFurther.para4b':
    'Không ai biết trước ẩn sâu trong “lòng đất” của ngành công nghệ và thị trường hiện đại còn biết bao tầng “địa chất” bí ẩn. Chỉ biết rằng khi “Root Further” đã trở thành tinh thần cội rễ, chúng ta sẽ không sợ hãi, mà càng thấy háo hức trước bất cứ vùng vô định nào trên hành trình tiến về phía trước. Vì ta luôn tin rằng, trong chính những miền vô tận đó, là bao điều kỳ diệu và cơ hội vươn mình đang chờ ta.',

  // Awards preview section header (mm:2167:9069).
  'awardsSection.subtitle': 'Sun* annual awards 2025',
  'awardsSection.heading': 'Hệ thống giải thưởng',

  // Award card shared "details" link (mm:I2167:9075;214:1023).
  'card.details': 'Chi tiết',

  // Award card copy, keyed by slug (mm:5005:14974).
  'card.top-talent.title': 'Top Talent',
  'card.top-talent.description': 'Vinh danh top cá nhân xuất sắc trên mọi phương diện',
  'card.top-project.title': 'Top Project',
  'card.top-project.description':
    'Vinh danh dự án xuất sắc trên mọi phương diện, dự án có doanh thu nổi bật',
  'card.top-project-leader.title': 'Top Project Leader',
  'card.top-project-leader.description':
    'Vinh danh người quản lý truyền cảm hứng và dẫn dắt dự án bứt phá, ',
  'card.best-manager.title': 'Best Manager',
  'card.best-manager.description':
    'Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm',
  'card.signature-2025-creator.title': 'Signature 2025 - Creator',
  'card.signature-2025-creator.description':
    'Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm',
  'card.mvp.title': 'MVP (Most Valuable Person)',
  'card.mvp.description': 'Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm',

  // Sun* Kudos promo card (mm:3390:10349).
  'kudos.label': 'Phong trào ghi nhận',
  'kudos.title': 'Sun* Kudos',
  'kudos.new': 'ĐIỂM MỚI CỦA SAA 2025',
  'kudos.body':
    'Hoạt động ghi nhận và cảm ơn đồng nghiệp - lần đầu tiên được diễn ra dành cho tất cả Sunner. Hoạt động sẽ được triển khai vào tháng 11/2025, khuyến khích người Sun* chia sẻ những lời ghi nhận, cảm ơn đồng nghiệp trên hệ thống do BTC công bố. Đây sẽ là chất liệu để Hội đồng Heads tham khảo trong quá trình lựa chọn người đạt giải.',
  'kudos.cta': 'Chi tiết',
}

export default home
