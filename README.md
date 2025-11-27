# 📚 Ôn Thi FE - Final Exam Practice App

Ứng dụng web giúp sinh viên ôn tập và luyện đề thi Final Exam (FE) cho các môn học tại trường. Hỗ trợ nhiều môn học, nhiều đề thi, và theo dõi lịch sử làm bài.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## ✨ Tính năng

### 🎯 Chức năng chính

- **Chọn môn học và đề thi**: Hệ thống phân cấp môn học → đề thi cụ thể
- **Tùy chỉnh số câu hỏi**: Chọn số lượng câu từ 1 đến tối đa của đề
- **Xáo trộn câu hỏi**: Mỗi lần thi câu hỏi được shuffle ngẫu nhiên
- **Hỗ trợ đa dạng loại câu hỏi**:
  - Single choice (A, B, C, D, E, F)
  - Multiple choice (AB, ACD, BDF, ...)
- **Tự động chấm điểm**: Hiển thị đáp án đúng/sai ngay lập tức
- **Tính thời gian**: Theo dõi thời gian làm bài
- **Lịch sử thi**: Lưu trữ và xem lại kết quả các lần thi trước

### 🖼️ Xem ảnh câu hỏi

- Click vào ảnh để phóng to
- Zoom in/out bằng chuột (scroll wheel)
- Pan (kéo thả) để di chuyển ảnh
- Double click để reset zoom

### 📊 Bảng kết quả chi tiết

- Hiển thị từng câu: đáp án đúng, đáp án đã chọn
- Thumbnail ảnh câu hỏi
- Trạng thái: ✓ Đúng, ✗ Sai, ○ Bỏ trống
- Thời gian làm bài
- Điểm số và tỉ lệ phần trăm

## 📁 Cấu trúc dự án

```
felearning/
├── index.html          # Giao diện chính
├── style.css           # CSS styles (Dark/Light theme)
├── script.js           # Logic ứng dụng
├── README.md           # File này
└── data/               # Dữ liệu câu hỏi
    ├── CSD203/
    │   ├── answers/
    │   │   └── answers.json
    │   └── questions/
    │       ├── Question1.png
    │       ├── Question2.webp
    │       └── ...
    ├── DBI202/
    ├── DBI202_FE_SU25/
    ├── DBI202_FE_SU25_B5/
    ├── DBI202_FE_SU25_RE/
    ├── JPD113_SU25_FE/
    ├── JPD113_SU25_RE/
    ├── JPD113_SU25_B5/
    ├── CEA201_SU25_FE/
    ├── CEA201_SU25_RE/
    ├── CEA201_SU25_B5/
    ├── MAS291_C1FA25_FE/
    ├── MAS291_C2FA25_FE/
    ├── OSG202_FA25_FE/
    └── OSG202_SU25_B5_1/
```

## 🚀 Hướng dẫn sử dụng

### 1. Clone hoặc tải project

```bash
git clone https://github.com/yourusername/felearning.git
cd felearning
```

### 2. Mở ứng dụng

Chỉ cần mở file `index.html` bằng trình duyệt web (Chrome, Edge, Firefox, Safari).

```bash
# Hoặc dùng Live Server trong VS Code
# Right click on index.html → Open with Live Server
```

### 3. Bắt đầu làm bài thi

1. **Chọn môn học** từ dropdown đầu tiên
2. **Chọn đề thi** từ dropdown thứ hai (tự động hiện sau khi chọn môn)
3. **Nhập số câu hỏi** muốn làm
4. Click **"Bắt đầu thi"**
5. Chọn đáp án cho từng câu
6. Click **"Tiếp theo"** để sang câu tiếp theo
7. Click **"Hoàn thành"** ở câu cuối cùng
8. Xem kết quả chi tiết

## 📝 Hướng dẫn thêm môn học mới

### Bước 1: Tạo cấu trúc thư mục

```
data/
  TEN_MON_MOI/          # Ví dụ: PRF192, MAE101
    answers/
      answers.json      # hoặc answers.csv
    questions/
      Question1.png
      Question2.webp
      ...
```

### Bước 2: Tạo file đáp án

**Format JSON** (`answers.json`):

```json
[
  {
    "questionid": 1,
    "filename": "Question1.png",
    "answer": "A"
  },
  {
    "questionid": 2,
    "filename": "Question2.webp",
    "answer": "BC"
  }
]
```

**Format CSV** (`answers.csv`):

```csv
questionid,filename,answer
1,Question1.png,A
2,Question2.webp,BC
3,Question3.jpg,D
```

### Bước 3: Cập nhật code

**File `script.js`**:

```javascript
// Thêm vào questionsData
const questionsData = {
  // ...existing code...
  TEN_MON_MOI: [], // ← Thêm dòng này
};

// Thêm vào examStructure
const examStructure = {
  // ...existing code...
  TEN_MON_CHINH: [{ value: "TEN_MON_MOI", label: "Tên đầy đủ - Mô tả" }],
};
```

**File `index.html`**:

```html
<select id="subjectSelect" class="form-control">
  <!-- ...existing code... -->
  <option value="TEN_MON_CHINH">Tên môn học mới</option>
</select>
```

### Bước 4: Kiểm tra

1. Mở app trong trình duyệt
2. Chọn môn mới từ dropdown
3. Kiểm tra ảnh hiển thị đúng
4. Làm thử một vài câu
5. Xem kết quả

## 🎨 Tùy chỉnh giao diện

### Dark/Light Mode

App tự động theo theme của hệ điều hành. Chỉnh trong `style.css`:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #1a1a1a;
    --color-text: #e0e0e0;
    /* ... */
  }
}
```

### Màu sắc

Thay đổi biến CSS trong `:root`:

```css
:root {
  --color-primary: #3b82f6; /* Màu chủ đạo */
  --color-success: #10b981; /* Màu xanh (đúng) */
  --color-danger: #ef4444; /* Màu đỏ (sai) */
}
```

## 🔧 Công nghệ sử dụng

- **HTML5**: Cấu trúc trang web
- **CSS3**:
  - CSS Variables
  - CSS Grid & Flexbox
  - Media Queries (Responsive)
  - Dark/Light theme
- **JavaScript (Vanilla)**:
  - ES6+ syntax
  - Async/Await
  - LocalStorage API
  - Fetch API

## 📊 Format dữ liệu hỗ trợ

### Ảnh câu hỏi

- ✅ PNG (`.png`)
- ✅ JPG/JPEG (`.jpg`, `.jpeg`)
- ✅ WebP (`.webp`)

### File đáp án

- ✅ JSON (`.json`)
- ✅ CSV (`.csv`)

### Loại câu hỏi

- ✅ Single choice: `"A"`, `"B"`, `"C"`, `"D"`, `"E"`, `"F"`
- ✅ Multiple choice: `"AB"`, `"ACD"`, `"BDF"`, ...

## 📱 Responsive Design

App hoạt động tốt trên:

- 💻 Desktop (1920x1080+)
- 💻 Laptop (1366x768)
- 📱 Tablet (768x1024)
- 📱 Mobile (375x667+)

## 🐛 Xử lý lỗi

### Lỗi không tải được câu hỏi

- Kiểm tra file `answers.json` hoặc `answers.csv` tồn tại
- Kiểm tra format JSON hợp lệ (dùng JSONLint)
- Mở Console (F12) để xem lỗi chi tiết

### Lỗi không hiển thị ảnh

- Kiểm tra tên file trong JSON khớp với file thực tế
- Kiểm tra đường dẫn: `data/TEN_MON/questions/`
- File ảnh phải có extension (`.png`, `.jpg`, `.webp`)

### Lỗi LocalStorage

- Xóa cache trình duyệt
- Chế độ Incognito có thể chặn LocalStorage
- Storage limit: ~5-10MB

## 📈 Tính năng sắp tới

- [ ] Chế độ thi theo thời gian (countdown timer)
- [ ] Export kết quả ra PDF
- [ ] Chế độ học thuộc (flashcard)
- [ ] Thống kê chi tiết theo môn/đề
- [ ] Chế độ ôn tập câu sai
- [ ] Chia sẻ kết quả qua link

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón!

1. Fork project
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phát hành dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 👤 Tác giả

**Your Name**

- GitHub: [Cahoii](https://github.com/Cahoii)
- Email: tangth023@gmail.com

## 🙏 Lời cảm ơn

- Cảm ơn tất cả sinh viên đã đóng góp dữ liệu câu hỏi
- Cảm ơn cộng đồng đã support và feedback

---

⭐️ Nếu project hữu ích, hãy cho một star nhé!
