# Hướng dẫn nhanh

## Chỉnh danh sách câu chúc Tết

- **File cần sửa:** `src/data/greetings.ts`
- Mở file đó và chỉnh mảng `greetings`: thêm/xóa/sửa các chuỗi. Mỗi lần reload trang **/2026** sẽ hiển thị **1 câu ngẫu nhiên** từ list.

Nếu muốn đặt list ở file khác (ví dụ config), chỉ cần export mảng `greetings` từ file đó và import trong `src/pages/2026.astro` thay cho `@/data/greetings`.
