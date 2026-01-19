# Hướng dẫn Deploy lên GitHub Pages

## Bước 1: Chuẩn bị Repository

1. Tạo repository mới trên GitHub (hoặc sử dụng repository hiện có)
2. Clone repository về máy (nếu chưa có)

## Bước 2: Push code lên GitHub

```bash
# Khởi tạo git (nếu chưa có)
git init

# Thêm remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Thêm tất cả files
git add .

# Commit
git commit -m "Initial commit: Todo List app"

# Push lên GitHub
git push -u origin main
```

## Bước 3: Cấu hình GitHub Pages

1. Vào repository trên GitHub
2. Vào **Settings** > **Pages**
3. Trong phần **Source**, chọn **GitHub Actions**
4. Lưu lại

## Bước 4: Deploy tự động

Sau khi cấu hình xong, mỗi khi bạn push code lên branch `main`, GitHub Actions sẽ tự động:
- Build project
- Deploy lên GitHub Pages

Bạn có thể xem tiến trình deploy trong tab **Actions** của repository.

## Kiểm tra kết quả

Sau khi deploy thành công, site sẽ có tại:
`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Lưu ý

- Đảm bảo repository là public (hoặc bạn có GitHub Pro/Team nếu muốn private)
- Workflow file đã được tạo tại `.github/workflows/deploy.yml`
- Build output sẽ ở trong thư mục `dist/`
