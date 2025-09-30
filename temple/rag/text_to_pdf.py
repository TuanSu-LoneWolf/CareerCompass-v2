from fpdf import FPDF
import os

class CareerBook(FPDF):
    def header(self):
        self.set_font('DejaVu', 'B', 16)
        self.cell(0, 10, 'Sách Hướng nghiệp Toàn diện', ln=True, align='C')
        self.ln(5)

    def chapter_title(self, num, title):
        self.set_font('DejaVu', 'B', 14)
        self.cell(0, 10, f'{num}. {title}', ln=True)
        self.ln(2)

    def chapter_subtitle(self, num, title):
        """Dùng cho các ngành nghề, số nhỏ hơn chương"""
        self.set_font('DejaVu', 'B', 12)
        self.cell(0, 8, f'{num}. {title}', ln=True)
        self.ln(1)

    def chapter_body(self, text):
        self.set_font('DejaVu', '', 12)
        self.multi_cell(0, 7, text)
        self.ln()

def generate_career_book(
    filename='D:\\Tuan Su\\05_Projects\\CareerCompass\\back-end\\Data\\rag\\Sach_HuongNghiep.pdf',
    industries=None
):
    if industries is None:
        industries = []

    # Tạo thư mục nếu chưa tồn tại
    os.makedirs(os.path.dirname(filename), exist_ok=True)

    pdf = CareerBook()
    # Thêm font DejaVu hỗ trợ tiếng Việt
    pdf.add_font('DejaVu', '', 'DejaVuSans.ttf', uni=True)
    pdf.add_font('DejaVu', 'B', 'DejaVuSans-Bold.ttf', uni=True)

    pdf.add_page()

    # Chương 1: Giới thiệu chung
    pdf.chapter_title(1, "Giới thiệu về hướng nghiệp")
    pdf.chapter_body(
        "Hướng nghiệp là quá trình giúp cá nhân nhận biết bản thân, khám phá năng lực, sở thích, "
        "giá trị nghề nghiệp và tìm ra ngành nghề phù hợp, từ đó lập kế hoạch phát triển sự nghiệp lâu dài. "
        "Sách này sẽ cung cấp thông tin chi tiết về các ngành nghề phổ biến, lời khuyên chuyên gia, "
        "và hướng dẫn hành động thực tế."
    )

    # Chương 2: Các yếu tố quan trọng
    pdf.chapter_title(2, "Các yếu tố quan trọng khi lựa chọn nghề nghiệp")
    pdf.chapter_body(
        "- Tự nhận thức: sở thích, năng lực, giá trị cá nhân.\n"
        "- Hiểu biết ngành nghề: mô tả công việc, cơ hội, triển vọng.\n"
        "- Môi trường và cơ hội: xu hướng thị trường, công nghệ, nhu cầu xã hội.\n"
        "- Kỹ năng mềm và chuyên môn: lập trình, ngoại ngữ, quản lý, sáng tạo."
    )

    # Chương 3: Công cụ đánh giá
    pdf.chapter_title(3, "Công cụ đánh giá nghề nghiệp")
    pdf.chapter_body(
        "- MBTI: đánh giá tính cách 16 loại.\n"
        "- RIASEC: 6 nhóm sở thích nghề nghiệp.\n"
        "- Trắc nghiệm năng lực, trí tuệ và EQ.\n"
        "- Tham khảo thông tin nghề nghiệp từ trường, hiệp hội nghề, báo cáo thị trường."
    )

    # Chương 4: Ngành nghề chi tiết
    pdf.chapter_title(4, "Chi tiết các ngành nghề")
    for i, ind in enumerate(industries, start=1):
        pdf.chapter_subtitle(i, ind['name'])
        pdf.chapter_body(f"Giới thiệu: {ind.get('description','')}")
        pdf.chapter_body(f"Lời khuyên: {ind.get('advice','')}")
        pdf.chapter_body(f"Hành động: {ind.get('actions','')}")

    # Chương 5: Kết luận
    pdf.chapter_title(5, "Kết luận")
    pdf.chapter_body(
        "Hướng nghiệp là một quá trình liên tục. Người học cần đánh giá lại định hướng định kỳ, "
        "cập nhật kiến thức, và sẵn sàng điều chỉnh kế hoạch nếu thấy không phù hợp. "
        "Tham khảo chuyên gia hướng nghiệp và các nguồn thông tin uy tín là rất cần thiết."
    )

    # Xuất file PDF
    pdf.output(filename)
    print(f"Sách hướng nghiệp đã được tạo: {filename}")


# Ví dụ dữ liệu ngành nghề
industries_data = [
    {
        'name': 'Công nghệ thông tin',
        'description': "Ngành Công nghệ thông tin bao gồm lập trình phần mềm, AI, phân tích dữ liệu, an ninh mạng và quản trị hệ thống. Yêu cầu tư duy logic và khả năng giải quyết vấn đề.",
        'career_opportunities': "Lập trình viên, kỹ sư dữ liệu, chuyên viên AI, quản trị mạng, chuyên gia bảo mật.",
        'advice': "Học kiến thức cơ bản về lập trình, cấu trúc dữ liệu, thuật toán, theo dõi xu hướng công nghệ mới.",
        'actions': "Tham gia thực tập tại công ty CNTT, hackathon, dự án mã nguồn mở."
    },
    {
        'name': 'Y tế',
        'description': "Ngành Y tế bao gồm bác sĩ, y tá, dược sĩ, kỹ thuật viên xét nghiệm, chuyên viên y sinh. Ngành nghề quan trọng trong chăm sóc sức khỏe cộng đồng.",
        'career_opportunities': "Bác sĩ chuyên khoa, y tá, dược sĩ, kỹ thuật viên phòng thí nghiệm, nghiên cứu viên y sinh.",
        'advice': "Tập trung kiến thức sinh học, hóa học, giải phẫu, y học lâm sàng.",
        'actions': "Thực tập bệnh viện, tham gia nghiên cứu y khoa, học kỹ năng giao tiếp với bệnh nhân."
    },
    {
        'name': 'Ngành ẩm thực',
        'description': "Ngành ẩm thực bao gồm đầu bếp, quản lý nhà hàng, nghiên cứu ẩm thực, phát triển thực đơn và dịch vụ ăn uống.",
        'career_opportunities': "Đầu bếp chuyên nghiệp, quản lý nhà hàng, chuyên viên phát triển thực đơn, nghiên cứu ẩm thực.",
        'advice': "Học kỹ năng chế biến, quản lý nhà hàng, sáng tạo món ăn, nắm vững kiến thức dinh dưỡng và vệ sinh an toàn thực phẩm.",
        'actions': "Thực tập tại nhà hàng, học nghề, tham gia các cuộc thi ẩm thực."
    },
    {
        'name': 'Kinh doanh & Marketing',
        'description': "Ngành Kinh doanh & Marketing bao gồm quản trị doanh nghiệp, chiến lược marketing, sales, thương mại điện tử và phân tích thị trường.",
        'career_opportunities': "Quản lý dự án, chuyên viên marketing, phân tích thị trường, quản lý thương hiệu, digital marketing.",
        'advice': "Hiểu thị trường, học kỹ năng giao tiếp, lập kế hoạch, phân tích dữ liệu.",
        'actions': "Thực tập công ty, tham gia dự án marketing, phát triển chiến lược thương hiệu."
    },
    {
        'name': 'Tài chính & Ngân hàng',
        'description': "Ngành Tài chính & Ngân hàng bao gồm kế toán, kiểm toán, phân tích tài chính, ngân hàng, quản lý đầu tư.",
        'career_opportunities': "Nhân viên ngân hàng, chuyên viên phân tích tài chính, kiểm toán viên, quản lý đầu tư, tư vấn tài chính.",
        'advice': "Học toán, phân tích dữ liệu, hiểu thị trường tài chính, cập nhật kiến thức kinh tế.",
        'actions': "Thực tập ngân hàng, làm báo cáo tài chính, tham gia khóa học chuyên môn."
    },
    {
        'name': 'Luật',
        'description': "Ngành Luật bao gồm luật sư, tư vấn pháp lý, công chứng, thẩm phán, chuyên viên pháp chế. Đòi hỏi tư duy logic, phân tích chính xác.",
        'career_opportunities': "Luật sư, tư vấn pháp lý, công chứng viên, thẩm phán, chuyên viên pháp chế doanh nghiệp.",
        'advice': "Nắm vững luật pháp, rèn kỹ năng phân tích và biện luận.",
        'actions': "Thực tập văn phòng luật, tham gia phiên tòa giả định, đọc tài liệu chuyên ngành."
    },
    {
        'name': 'Ngôn ngữ & Biên phiên dịch',
        'description': "Ngành Ngôn ngữ & Biên phiên dịch bao gồm giảng dạy ngoại ngữ, phiên dịch, biên dịch, nghiên cứu ngôn ngữ.",
        'career_opportunities': "Giáo viên ngoại ngữ, phiên dịch viên, biên tập viên, chuyên viên nghiên cứu ngôn ngữ.",
        'advice': "Học giỏi ngoại ngữ, luyện kỹ năng nghe – nói – đọc – viết, hiểu văn hóa và ngữ cảnh.",
        'actions': "Tham gia giao tiếp, phiên dịch sự kiện, học thêm ngôn ngữ thứ 2 hoặc 3."
    },
    {
        'name': 'Khoa học & Nghiên cứu',
        'description': "Ngành Khoa học & Nghiên cứu bao gồm vật lý, hóa học, sinh học, nghiên cứu môi trường và công nghệ sinh học.",
        'career_opportunities': "Nhà nghiên cứu, kỹ sư phòng lab, chuyên viên phân tích dữ liệu khoa học, giảng viên đại học.",
        'advice': "Học kiến thức chuyên môn vững, luyện tư duy phản biện, cập nhật tiến bộ khoa học mới.",
        'actions': "Tham gia dự án nghiên cứu, thực hành phòng lab, viết báo cáo khoa học."
    },
    {
        'name': 'Thiết kế & Nghệ thuật',
        'description': "Ngành Thiết kế & Nghệ thuật bao gồm thiết kế đồ họa, thiết kế thời trang, hội họa, âm nhạc và điện ảnh.",
        'career_opportunities': "Nhà thiết kế đồ họa, nghệ sĩ, nhạc sĩ, đạo diễn, chuyên viên sáng tạo quảng cáo.",
        'advice': "Rèn kỹ năng sáng tạo, học công cụ thiết kế, cập nhật xu hướng nghệ thuật và thị trường.",
        'actions': "Thực hành dự án cá nhân, tham gia triển lãm, học kỹ năng chuyên môn."
    },
    {
        'name': 'Du lịch & Khách sạn',
        'description': "Ngành Du lịch & Khách sạn bao gồm quản trị khách sạn, hướng dẫn viên du lịch, tổ chức sự kiện.",
        'career_opportunities': "Quản lý khách sạn, hướng dẫn viên du lịch, quản lý tour, chuyên viên tổ chức sự kiện.",
        'advice': "Hiểu văn hóa, kỹ năng giao tiếp, ngoại ngữ tốt và quản lý dịch vụ.",
        'actions': "Thực tập tại khách sạn, hướng dẫn tour, tham gia tổ chức sự kiện thực tế."
    },
    {
        'name': 'Giáo dục & Sư phạm',
        'description': "Ngành Giáo dục & Sư phạm bao gồm giáo viên mầm non, tiểu học, trung học, giảng viên đại học và đào tạo kỹ năng.",
        'career_opportunities': "Giáo viên các cấp, giảng viên đại học, chuyên viên đào tạo, phát triển chương trình học.",
        'advice': "Học kiến thức chuyên môn, phát triển kỹ năng giảng dạy, quản lý lớp học và giao tiếp học sinh.",
        'actions': "Thực tập giảng dạy, tham gia các khóa học sư phạm, phát triển phương pháp giảng dạy sáng tạo."
    },
    {
        'name': 'Truyền thông & Báo chí',
        'description': "Ngành Truyền thông & Báo chí bao gồm nhà báo, biên tập viên, PR, truyền hình, phát thanh và digital media.",
        'career_opportunities': "Nhà báo, biên tập viên, chuyên viên PR, social media manager, producer truyền hình.",
        'advice': "Phát triển kỹ năng viết, thuyết trình, phân tích thông tin và xử lý tình huống.",
        'actions': "Thực tập tại tòa soạn, tham gia dự án PR, tạo content cho các kênh truyền thông."
    },
    {
        'name': 'Thể thao & Giáo dục thể chất',
        'description': "Ngành Thể thao & Giáo dục thể chất bao gồm huấn luyện viên, chuyên gia dinh dưỡng thể thao, quản lý thể thao.",
        'career_opportunities': "Huấn luyện viên, PT, chuyên viên dinh dưỡng thể thao, quản lý phòng gym, tổ chức sự kiện thể thao.",
        'advice': "Rèn luyện thể chất, học kiến thức chuyên môn, quản lý đội nhóm và kỹ năng giao tiếp.",
        'actions': "Tham gia huấn luyện, tổ chức giải đấu, thực tập phòng gym hoặc trung tâm thể thao."
    },
    {
        'name': 'Kiến trúc & Xây dựng',
        'description': "Ngành Kiến trúc & Xây dựng bao gồm kiến trúc sư, kỹ sư xây dựng, thiết kế nội thất và quy hoạch đô thị.",
        'career_opportunities': "Kiến trúc sư, kỹ sư xây dựng, chuyên viên thiết kế nội thất, quy hoạch đô thị.",
        'advice': "Học vững kiến thức kỹ thuật, mỹ thuật, phần mềm thiết kế và quy chuẩn xây dựng.",
        'actions': "Thực tập công trình, tham gia dự án thiết kế, rèn kỹ năng bản vẽ và quản lý dự án."
    },
    {
        'name': 'Nông nghiệp & Thủy sản',
        'description': "Ngành Nông nghiệp & Thủy sản bao gồm canh tác, chăn nuôi, nuôi trồng thủy sản, nghiên cứu nông học.",
        'career_opportunities': "Kỹ sư nông nghiệp, chuyên viên nuôi trồng thủy sản, nghiên cứu viên nông học, quản lý trang trại.",
        'advice': "Học kiến thức nông học, kỹ thuật canh tác, quản lý đất và môi trường.",
        'actions': "Thực tập trang trại, tham gia dự án nghiên cứu, học công nghệ nông nghiệp."
    },
    {
        'name': 'Công nghệ môi trường',
        'description': "Ngành Công nghệ môi trường bao gồm quản lý chất thải, xử lý nước, kiểm soát ô nhiễm, nghiên cứu bảo vệ môi trường.",
        'career_opportunities': "Kỹ sư môi trường, chuyên viên quan trắc, nhà nghiên cứu môi trường, tư vấn bảo vệ môi trường.",
        'advice': "Học kiến thức môi trường, hóa học, phân tích dữ liệu và chính sách bảo vệ môi trường.",
        'actions': "Thực tập phòng thí nghiệm môi trường, tham gia dự án nghiên cứu, lập báo cáo và đề xuất giải pháp."
    },
    {
        'name': 'Công nghệ điện & điện tử',
        'description': "Ngành này bao gồm thiết kế, vận hành, bảo trì các hệ thống điện, điện tử, tự động hóa, robotics.",
        'career_opportunities': "Kỹ sư điện, kỹ sư điện tử, chuyên viên tự động hóa, robotics engineer.",
        'advice': "Học toán, vật lý, mạch điện, lập trình và công nghệ tự động hóa.",
        'actions': "Thực tập tại công ty điện tử, tham gia dự án robotics, rèn kỹ năng thiết kế mạch và lập trình."
    },
    {
        'name': 'Công nghệ cơ khí & Tự động hóa',
        'description': "Ngành Cơ khí & Tự động hóa bao gồm thiết kế máy, robot, hệ thống cơ điện tử, sản xuất công nghiệp.",
        'career_opportunities': "Kỹ sư cơ khí, kỹ sư tự động hóa, chuyên viên bảo trì máy móc, quản lý sản xuất.",
        'advice': "Học vật lý, cơ học, CAD, lập trình PLC và kỹ năng vận hành máy móc.",
        'actions': "Thực tập nhà máy, tham gia dự án thiết kế máy, học kỹ năng quản lý sản xuất."
    },
    {
        'name': 'Điện ảnh & Sản xuất truyền hình',
        'description': "Ngành này bao gồm đạo diễn, quay phim, biên tập phim, sản xuất chương trình truyền hình.",
        'career_opportunities': "Đạo diễn, quay phim, biên tập viên, nhà sản xuất chương trình, chuyên viên hậu kỳ.",
        'advice': "Học kỹ năng quay, dựng, kịch bản, ánh sáng và âm thanh.",
        'actions': "Tham gia dự án phim, thực tập tại studio, học phần mềm dựng phim."
    },
    {
        'name': 'Âm nhạc & Biểu diễn nghệ thuật',
        'description': "Ngành Âm nhạc & Biểu diễn bao gồm nhạc sĩ, ca sĩ, diễn viên, biên đạo múa, quản lý sự kiện nghệ thuật.",
        'career_opportunities': "Ca sĩ, nhạc sĩ, diễn viên, biên đạo, quản lý chương trình biểu diễn.",
        'advice': "Rèn kỹ năng biểu diễn, lý thuyết âm nhạc, tập luyện thường xuyên.",
        'actions': "Tham gia buổi biểu diễn, dự án nghệ thuật, học kỹ năng sáng tác và biểu diễn."
    },
    {
        'name': 'Tâm lý học & Trị liệu',
        'description': "Ngành Tâm lý học & Trị liệu bao gồm tư vấn tâm lý, trị liệu tâm thần, nghiên cứu hành vi và phát triển con người.",
        'career_opportunities': "Chuyên viên tư vấn tâm lý, nhà trị liệu, nhà nghiên cứu hành vi, giảng viên tâm lý học.",
        'advice': "Học kiến thức tâm lý học, phát triển kỹ năng giao tiếp và lắng nghe.",
        'actions': "Thực tập tại trung tâm tư vấn, tham gia nghiên cứu hành vi, học kỹ năng trị liệu."
    },
    {
        'name': 'Công nghệ sinh học',
        'description': "Ngành Công nghệ sinh học bao gồm nghiên cứu gene, sinh học phân tử, y sinh và phát triển sản phẩm sinh học.",
        'career_opportunities': "Nhà nghiên cứu sinh học, kỹ sư sinh học, chuyên viên y sinh, phát triển sản phẩm biotech.",
        'advice': "Học sinh học, hóa sinh, nghiên cứu thí nghiệm, cập nhật công nghệ mới.",
        'actions': "Tham gia phòng lab, dự án nghiên cứu, viết báo cáo khoa học."
    },
    {
        'name': 'Thiết kế nội thất & Trang trí',
        'description': "Ngành Thiết kế nội thất & Trang trí bao gồm thiết kế không gian sống, văn phòng, thương mại.",
        'career_opportunities': "Nhà thiết kế nội thất, kiến trúc sư nội thất, chuyên viên trang trí, quản lý dự án thiết kế.",
        'advice': "Học thiết kế, mỹ thuật, phần mềm CAD, phong cách kiến trúc.",
        'actions': "Thực tập dự án, tham gia triển lãm, rèn kỹ năng vẽ và thiết kế."
    },
    {
        'name': 'Kỹ thuật xây dựng dân dụng & công nghiệp',
        'description': "Ngành này bao gồm xây dựng công trình dân dụng, cầu đường, kết cấu thép, bê tông, và quản lý dự án xây dựng.",
        'career_opportunities': "Kỹ sư xây dựng, giám sát công trình, quản lý dự án, kỹ sư kết cấu.",
        'advice': "Học vật liệu xây dựng, kết cấu, CAD, quản lý dự án.",
        'actions': "Thực tập công trình, tham gia dự án xây dựng, học kỹ năng giám sát."
    },
    {
        'name': 'An ninh mạng & Bảo mật thông tin',
        'description': "Ngành này bao gồm bảo mật hệ thống, chống xâm nhập, kiểm thử bảo mật, quản lý rủi ro thông tin.",
        'career_opportunities': "Chuyên viên bảo mật, hacker mũ trắng, quản lý rủi ro IT, kiểm thử hệ thống.",
        'advice': "Học lập trình, hệ thống mạng, phân tích rủi ro, cập nhật kiến thức bảo mật.",
        'actions': "Tham gia dự án bảo mật, thi CTF, thực tập IT Security."
    },
    {
        'name': 'Data Science & Trí tuệ nhân tạo',
        'description': "Ngành này bao gồm phân tích dữ liệu, học máy, AI, mô hình dự báo và ứng dụng trong doanh nghiệp.",
        'career_opportunities': "Data scientist, AI engineer, ML engineer, analyst, nghiên cứu AI.",
        'advice': "Học toán, thống kê, lập trình Python/R, học thuật toán ML/AI.",
        'actions': "Thực tập dự án ML/AI, Kaggle competitions, nghiên cứu dữ liệu."
    },
    {
        'name': 'Thương mại điện tử & Kinh doanh số',
        'description': "Ngành này bao gồm kinh doanh online, digital marketing, quản lý sàn thương mại điện tử.",
        'career_opportunities': "Quản lý sàn, digital marketer, content creator, phân tích dữ liệu khách hàng.",
        'advice': "Hiểu nền tảng TMĐT, marketing online, SEO, kỹ năng phân tích số liệu.",
        'actions': "Thực tập TMĐT, chạy chiến dịch marketing online, dự án bán hàng số."
    },
    {
        'name': 'Thiết kế game & Multimedia',
        'description': "Ngành này bao gồm thiết kế game, đồ họa 3D, animation, interactive media và VR/AR.",
        'career_opportunities': "Game designer, animator, 3D artist, developer VR/AR, producer game.",
        'advice': "Học lập trình, thiết kế đồ họa, animation, sáng tạo nội dung tương tác.",
        'actions': "Tham gia dự án game, thực tập studio, tạo portfolio game/multimedia."
    },
    {
        'name': 'Logistics & Quản lý chuỗi cung ứng',
        'description': "Ngành Logistics & Supply Chain bao gồm quản lý kho, vận chuyển, phân phối, tối ưu hóa chuỗi cung ứng.",
        'career_opportunities': "Chuyên viên logistics, quản lý kho, supply chain analyst, quản lý vận tải.",
        'advice': "Học quản lý, vận hành, phân tích dữ liệu và tối ưu hóa quy trình.",
        'actions': "Thực tập tại công ty logistics, dự án cải tiến quy trình, học phần mềm quản lý."
    },
    {
        'name': 'Khoa học xã hội & Nhân văn',
        'description': "Ngành này bao gồm xã hội học, nhân học, lịch sử, nghiên cứu văn hóa, nghiên cứu xã hội.",
        'career_opportunities': "Nhà nghiên cứu, giảng viên, chuyên viên nghiên cứu chính sách, viết sách/báo.",
        'advice': "Học kiến thức xã hội, kỹ năng phân tích, viết báo cáo, nghiên cứu trường hợp.",
        'actions': "Tham gia nghiên cứu thực địa, viết bài nghiên cứu, thực tập viện nghiên cứu."
    },
    {
        'name': 'Môi trường & Năng lượng tái tạo',
        'description': "Ngành này bao gồm phát triển năng lượng sạch, quản lý môi trường, kỹ thuật năng lượng tái tạo.",
        'career_opportunities': "Kỹ sư năng lượng tái tạo, chuyên viên môi trường, nghiên cứu viên, tư vấn năng lượng.",
        'advice': "Học vật lý, kỹ thuật, môi trường, cập nhật công nghệ xanh.",
        'actions': "Thực tập dự án năng lượng, nghiên cứu giải pháp sạch, viết báo cáo môi trường."
    },
    {
        'name': 'Dịch vụ & chăm sóc khách hàng',
        'description': "Ngành dịch vụ khách hàng bao gồm quản lý chăm sóc khách hàng, tư vấn dịch vụ, hỗ trợ người dùng.",
        'career_opportunities': "Chuyên viên chăm sóc khách hàng, quản lý dịch vụ, tư vấn viên, hỗ trợ kỹ thuật.",
        'advice': "Học kỹ năng giao tiếp, giải quyết vấn đề, quản lý quan hệ khách hàng.",
        'actions': "Thực tập call center, dự án chăm sóc khách hàng, học kỹ năng CRM."
    }
]


if __name__ == "__main__":
    generate_career_book(industries=industries_data)
