# Todo List - Quản lý công việc với Astro

Một ứng dụng Todo List đơn giản và đẹp mắt, được xây dựng bằng Astro.

## Tính năng

- ✅ Thêm, xóa và đánh dấu hoàn thành công việc
- 💾 Lưu trữ dữ liệu trong localStorage
- 📊 Thống kê: Tổng cộng, Hoàn thành, Còn lại
- 🌙 Dark mode support
- 📱 Responsive design
- ⚡ Static site - dễ dàng host

## Cài đặt

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

Site sẽ chạy tại `http://localhost:4321`

## Build

```bash
pnpm build
```

Output sẽ ở trong thư mục `dist/` - sẵn sàng để deploy lên bất kỳ static hosting nào (Vercel, Netlify, GitHub Pages, etc.)

## Deploy

### Vercel
```bash
vercel deploy
```

### Netlify
```bash
netlify deploy --prod
```

### GitHub Pages

Project đã được cấu hình với GitHub Actions để tự động deploy lên GitHub Pages.

**Cách deploy:**

1. Push code lên GitHub repository
2. Vào Settings > Pages trong repository
3. Chọn Source: "GitHub Actions"
4. Mỗi khi push lên branch `main`, GitHub Actions sẽ tự động build và deploy

Hoặc nếu bạn muốn deploy thủ công:

```bash
pnpm build
# Sau đó push thư mục dist/ lên branch gh-pages
```

## Cấu trúc

```
├── src/
│   ├── components/
│   │   └── TodoList.astro      # Component Todo List
│   ├── layouts/
│   │   └── Layout.astro         # Layout chính
│   └── pages/
│       └── index.astro          # Trang chủ
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions workflow
├── astro.config.mjs
└── package.json
```

## License

MIT
