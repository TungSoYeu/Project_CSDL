# Dự Án Quản Lý Dữ Liệu Sinh Viên (Frontend)

Đây là một ứng dụng frontend được xây dựng bằng React và Vite, dùng để quản lý thông tin điểm, sinh viên, giáo viên, lớp học và môn học.

Link giao diện: https://d005-2402-800-61cf-bf4b-e057-7f50-9330-65a1.ngrok-free.app/

## Mục Lục

- [Tổng Quan](#tổng-quan)
- [Tính Năng Chính](#tính-năng-chính)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Hướng Dẫn Cài Đặt và Chạy Dự Án](#hướng-dẫn-cài-đặt-và-chạy-dự-án)
- [Hướng Dẫn Sử Dụng](#hướng-dẫn-sử-dụng)
- [Đóng Góp](#đóng-góp)

## Tổng Quan

Ứng dụng này cung cấp một giao diện người dùng trực quan để quản lý các khía cạnh khác nhau của một hệ thống giáo dục nhỏ. Người dùng có thể xem, thêm, (và sau này là sửa, xóa) thông tin liên quan đến điểm số, danh sách sinh viên, giáo viên, các lớp học và các môn học được giảng dạy.

## Tính Năng Chính

Hiện tại, ứng dụng bao gồm các trang quản lý sau:

* **Trang Score (Điểm số):**
    * Hiển thị danh sách điểm của sinh viên.
    * Lọc điểm theo khoảng giá trị.
    * Sắp xếp điểm (nguyên bản, từ cao đến thấp, từ thấp đến cao).
    * Thêm điểm mới thông qua một popup modal.
    * Chỉnh sửa và xóa điểm thông qua một popup modal.
    * Phân trang cho danh sách điểm.
    * Tìm kiếm điểm dựa trên các trường như Student ID, Subject ID, Class ID (thông qua dropdown ở Header).
* **Trang Student (Sinh viên):**
    * Hiển thị danh sách sinh viên với các thông tin: Avatar, Full Name, Student ID, DOB, Major.
    * Giao diện thẻ tương tự trang Score.
    * Nút "Add Student" và popup modal để thêm sinh viên mới.
    * Phân trang cho danh sách sinh viên.
    * Tìm kiếm sinh viên dựa trên Full Name, Student ID, DOB, Major (thông qua dropdown ở Header).
* **Trang Teacher (Giáo viên):**
    * Hiển thị danh sách giáo viên với Avatar, Full Name, Teacher ID.
    * Nút "Add Teacher" và popup modal để thêm giáo viên mới.
    * Phân trang cho danh sách giáo viên.
    * Tìm kiếm giáo viên dựa trên Full Name, Teacher ID (thông qua dropdown ở Header).
* **Trang Class (Lớp học):**
    * Hiển thị danh sách lớp học với Class ID, Subject ID, Teacher ID.
    * Nút "Add Class" và popup modal để thêm lớp học mới.
    * Phân trang cho danh sách lớp học.
    * Tìm kiếm lớp học dựa trên Class ID, Subject ID, Teacher ID (thông qua dropdown ở Header).
* **Trang Subject (Môn học):**
    * Hiển thị danh sách môn học theo layout 2 cột.
    * Mỗi thẻ hiển thị tên Môn học và Subject ID.
    * Nút "Add Subject" và popup modal để thêm môn học mới.
    * Phân trang cho danh sách môn học.
    * Tìm kiếm môn học dựa trên Subject Name, Subject ID (thông qua dropdown ở Header).

**Các thành phần chung:**

* **Sidebar:** Điều hướng giữa các trang quản lý.
* **Header:** Chứa thanh tìm kiếm chung và dropdown chọn trường tìm kiếm động theo trang.

## Công Nghệ Sử Dụng

* **React:** Thư viện JavaScript để xây dựng giao diện người dùng.
* **Vite:** Công cụ build frontend nhanh chóng.
* **JavaScript (ES6+):** Ngôn ngữ lập trình chính.
* **CSS3:** Để tạo kiểu cho ứng dụng (có thể bao gồm cả file CSS riêng cho từng component).
* **SVG:** Sử dụng cho các icon.

## Hướng Dẫn Cài Đặt và Chạy Dự Án

1.  **Clone repository:**
    ```bash
    git clone <URL_repository_cua_ban>
    cd frontend-csdl
    ```

2.  **Cài đặt dependencies:**
    ```bash
    npm install
    ```

3.  **Chạy server phát triển:**
    ```bash
    npm run dev
    ```
    Ứng dụng sẽ thường chạy trên `http://localhost:5173`.

4.  **Build dự án cho production:**
    ```bash
    npm run build
    ```

## Gợi Ý Phát Triển Backend

Phần backend sẽ chịu trách nhiệm cung cấp các API để frontend có thể đọc và ghi dữ liệu vào cơ sở dữ liệu.

**1. Công Nghệ Gợi Ý:**
* **Framework:** Node.js và Express.js (phổ biến và dễ tích hợp nếu đã quen với JavaScript).
* **Cơ sở dữ liệu:** PostgreSQL hoặc MySQL (phù hợp với dữ liệu có quan hệ như dự án này).
* **ORM (tùy chọn):** Sequelize hoặc Prisma để tương tác với CSDL dễ dàng hơn.

**2. Cơ Sở Dữ Liệu (Database):**
Cần thiết kế các bảng để lưu trữ dữ liệu cho các thực thể chính sau:
* `Students` (studentId, fullName, dob, major, ...)
* `Teachers` (teacherId, fullName, ...)
* `Subjects` (subjectId, subjectName, ...)
* `Classes` (classId, subjectId, teacherId, ...)
* `Scores` (scoreId, studentId, subjectId, scoreValue, ...)

**3. Thiết Kế API (RESTful Endpoints):**
Backend cần cung cấp các API endpoints để frontend thực hiện các thao tác CRUD (Create, Read, Update, Delete). Dưới đây là các ví dụ chính:

* **Lấy danh sách (GET):**
    * `GET /api/students`: Lấy danh sách sinh viên (hỗ trợ query params cho tìm kiếm, phân trang: `?search=...&page=...&limit=...`).
    * Tương tự cho `teachers`, `subjects`, `classes`, `scores`.
* **Tạo mới (POST):**
    * `POST /api/students`: Tạo một sinh viên mới (dữ liệu gửi trong request body).
    * Tương tự cho `teachers`, `subjects`, `classes`, `scores`.
* **Cập nhật (PUT):**
    * `PUT /api/scores/{scoreId}`: Cập nhật thông tin một điểm số (dữ liệu gửi trong request body).
    * Tương tự cho các thực thể khác nếu có chức năng edit.
* **Xóa (DELETE):**
    * `DELETE /api/scores/{scoreId}`: Xóa một điểm số.
    * Tương tự cho các thực thể khác nếu có chức năng delete.

**4. Luồng Công Việc Gợi Ý:**

1.  **Thiết lập dự án backend** (ví dụ: `npm init`, cài đặt Express).
2.  **Thiết kế và tạo các bảng trong CSDL** đã chọn.
3.  **Viết code kết nối** từ ứng dụng Express đến CSDL.
4.  **Xây dựng các API endpoints** cho từng thực thể (ví dụ: bắt đầu với `GET /api/students` và `POST /api/students`).
5.  **Kiểm tra các API** bằng công cụ như Postman hoặc Insomnia.
6.  **Cấu hình CORS (Cross-Origin Resource Sharing)** trên server backend để cho phép frontend (chạy ở domain khác) có thể gọi API.
7.  **Chạy server backend**.
8.  **Trong code frontend (React):** Thay thế việc sử dụng dữ liệu mẫu (mock data) bằng cách dùng `Workspace` hoặc `axios` để gọi đến các API của backend.

## Hướng Dẫn Sử Dụng

1.  Mở ứng dụng trên trình duyệt.
2.  Sử dụng Sidebar để điều hướng giữa các trang: Score, Student, Teacher, Class, Subject.
3.  Trên mỗi trang:
    * Sử dụng nút "Add [Tên Mục]" (ví dụ: "Add Score", "Add Student") để mở popup và thêm dữ liệu mới.
    * (Đối với trang Score) Sử dụng nút "Edit Score" trên mỗi thẻ để chỉnh sửa hoặc xóa điểm.
    * Sử dụng thanh tìm kiếm và dropdown trong Header để tìm kiếm dữ liệu.
    * Sử dụng các nút phân trang để xem qua các mục.
    * (Đối với trang Score) Sử dụng các bộ lọc và sắp xếp điểm.

## Đóng Góp

Nếu bạn muốn đóng góp cho dự án, vui lòng làm theo các bước sau:
1.  Fork repository.
2.  Tạo một nhánh mới (`git checkout -b feature/TenTinhNangMoi`).
3.  Commit các thay đổi của bạn (`git commit -m 'Add: TenTinhNangMoi'`).
4.  Push lên nhánh của bạn (`git push origin feature/TenTinhNangMoi`).
5.  Tạo một Pull Request mới.