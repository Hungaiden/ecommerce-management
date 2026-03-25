# Ecormerce Frontend (Client + Admin)

Tai lieu nay mo ta day du tat ca chuc nang cua ung dung frontend gom 2 khu vuc:

- Client: nguoi dung mua hang
- Admin: quan tri van hanh he thong

README duoc viet theo huong tai lieu san pham + ky thuat, co the dung cho:

- Bao cao mon hoc/do an
- Onboarding thanh vien moi
- Lam checklist test nhanh cho QA

## 1) Tong quan he thong

- Frontend: ecormerce-FEClient
- Backend: ecormerce-be
- Kien truc route:
  - app/(main): khu vuc client
  - app/admin: khu vuc admin
- Tang goi API tach rieng theo domain trong thu muc service
- Quan ly state toan cuc:
  - context/AuthContext.tsx
  - context/cart-context.tsx

## 2) Doi tuong su dung va quyen han

### 2.1 Khach chua dang nhap

- Xem trang chu, shop, chi tiet san pham, blog, about, contact
- Dang ky tai khoan
- Dang nhap he thong

### 2.2 Khach da dang nhap

- Tat ca quyen cua khach chua dang nhap
- Quan ly gio hang
- Dat hang va thanh toan
- Xem lich su don hang
- Quan ly thong tin ca nhan
- Gui danh gia san pham

### 2.3 Staff/Admin

- Dang nhap khu vuc admin
- Truy cap dashboard tong quan
- Quan ly tai khoan, danh muc, san pham, khuyen mai, don hang
- Quan ly review va newsletter

## 3) Mo ta day du chuc nang Client

### 3.1 Trang chu (/)

- Hien thi khu vuc hero va dieu huong nhanh den mua sam
- Hien thi san pham noi bat
- Hien thi uu dai/chuong trinh giam gia dang hoat dong
- Tich hop cac khoi noi dung marketing (newsletter, call to action)

### 3.2 Danh sach san pham (/shop)

- Liet ke san pham theo danh muc
- Tim kiem san pham theo tu khoa
- Loc danh sach theo dieu kien giao dien ho tro
- Dieu huong sang trang chi tiet tung san pham

### 3.3 Chi tiet san pham (/shop/[id])

- Hien thi hinh anh, ten, gia, mo ta, thong tin bo sung
- Chon bien the (size/mau) neu san pham co thuoc tinh
- Chon so luong truoc khi them vao gio
- Xem danh sach review
- Gui review tu tai khoan nguoi dung

### 3.4 Gio hang (/cart)

- Xem danh sach item da them
- Tang giam so luong moi item
- Chon bo chon item de tinh tong linh hoat
- Xoa tung item
- Lam sach toan bo gio
- Tinh tong tien theo item duoc chon

### 3.5 Thanh toan (/checkout)

- Thu thap thong tin nguoi nhan va dia chi giao hang
- Kiem tra thong tin dat hang truoc khi tao don
- Chon phuong thuc thanh toan
- Xac nhan dat hang

### 3.6 Xu ly thanh toan (/payment)

- Tao lien ket thanh toan VNPay tu du lieu don hang
- Dieu huong nguoi dung sang cong thanh toan
- Nhan ket qua tra ve va cap nhat trang thai

### 3.7 Lich su dat hang (/bookings)

- Liet ke cac don da tao
- Theo doi trang thai don hang
- Xem chi tiet thong tin don

### 3.8 Ho so ca nhan (/profile)

- Hien thi thong tin tai khoan
- Chinh sua/quan ly thong tin ho so theo giao dien ho tro

### 3.9 Xac thuc nguoi dung

- Dang nhap (/login)
  - Dang nhap bang thong tin tai khoan
  - Luu phien dang nhap
- Dang ky (/register)
  - Tao tai khoan moi
  - Kiem tra du lieu dau vao

### 3.10 Noi dung bo tro

- /about: gioi thieu he thong
- /blog: noi dung truyen thong
- /contact: lien he/cham soc khach hang

## 4) Mo ta day du chuc nang Admin

### 4.1 Dang nhap admin (/admin/login)

- Luong dang nhap rieng cho staff/admin
- Kiem soat truy cap khu vuc quan tri theo role

### 4.2 Dashboard (/admin)

- Tong hop KPI quan trong:
  - Doanh thu
  - So luong don
  - So luong san pham
  - So luong tai khoan
- Hien thi bieu do (bar/pie) de theo doi xu huong
- Cung cap goc nhin nhanh tinh hinh van hanh

### 4.3 Quan ly tai khoan (/admin/accounts)

- Liet ke danh sach tai khoan
- Tao tai khoan moi (neu nghiep vu cho phep)
- Cap nhat thong tin tai khoan
- Gan/doi role: admin, staff, customer
- Quan ly trang thai tai khoan: active, inactive, suspended

### 4.4 Quan ly danh muc (/admin/categories)

- Tao danh muc san pham
- Cap nhat thong tin danh muc
- Bat/tat trang thai hien thi danh muc
- Ho tro to chuc cay danh muc theo nghiep vu backend

### 4.5 Quan ly san pham (/admin/products)

- Tao san pham moi
- Chinh sua thong tin san pham
- Xoa san pham
- Quan ly gia, ton kho, anh, danh muc
- Quan ly trang thai/noi bat theo bo loc quan tri

### 4.6 Quan ly khuyen mai (/admin/discounts)

- Tao chuong trinh giam gia
- Cau hinh loai giam:
  - Theo phan tram
  - Theo so tien
- Cau hinh thoi gian hieu luc
- Cau hinh gioi han su dung
- Gan pham vi ap dung (tuy theo quy tac backend)

### 4.7 Quan ly don hang (/admin/orders)

- Liet ke toan bo don hang
- Theo doi trang thai xu ly don
- Cap nhat tien trinh van hanh don
- Ho tro quy trinh hoan tat/huy theo nghiep vu

### 4.8 Theo doi gio hang (/admin/carts)

- Quan sat gio hang nguoi dung
- Ho tro phan tich xu huong bo gio va hanh vi mua sam

### 4.9 Quan ly review (/admin/reviews)

- Xem danh sach review
- Kiem duyet/noi dung theo chinh sach
- Ho tro giu chat luong noi dung hien thi tren san pham

### 4.10 Quan ly newsletter (/admin/newsletter)

- Quan ly danh sach subscriber
- Ho tro khai thac du lieu email phuc vu marketing

## 5) Chuc nang dung chung va tien ich he thong

### 5.1 Xac thuc, token va phan quyen

- Tach luong login user va admin
- Luu token truy cap va duy tri phien
- Interceptor tu dong gan token vao request
- Xu ly han phien theo logic auth service

### 5.2 Quan ly gio hang bang context

- Dong bo state gio hang toan app
- Them, xoa, cap nhat so luong nhanh
- Tinh tong tien theo lua chon item

### 5.3 Chatbot goi y san pham

- Widget chatbot tich hop tren giao dien
- Goi service AI de goi y san pham
- Ho tro prompt nhanh cho tinh huong pho bien

### 5.4 Newsletter

- Form dang ky email cho nguoi dung
- Goi API luu subscriber
- Admin theo doi danh sach dang ky

### 5.5 UI/UX va kha nang hien thi

- He thong component hoa theo shadcn/ui
- Responsive cho mobile, tablet, desktop
- Loading skeleton va trang loading
- Toast thong bao trang thai thao tac

## 6) Bang route tong hop

### 6.1 Route khu vuc client

- /
- /shop
- /shop/[id]
- /cart
- /checkout
- /payment
- /bookings
- /profile
- /login
- /register
- /about
- /blog
- /contact

### 6.2 Route khu vuc admin

- /admin
- /admin/login
- /admin/accounts
- /admin/products
- /admin/categories
- /admin/discounts
- /admin/orders
- /admin/carts
- /admin/reviews
- /admin/newsletter

## 7) Tang service API phia frontend

### 7.1 Service chung

- service/http.ts
  - Cau hinh axios instance
  - Quan ly request/response interceptor
- service/auth.ts
  - Login user/admin
  - Logout
  - Xu ly token va phien
- service/register.ts
  - Dang ky tai khoan

### 7.2 Service nghiep vu client

- service/products/index.ts
- service/products/reviews.ts
- service/cart/cart.ts
- service/orders.ts
- service/payment.ts
- service/newsletter.ts
- service/getGroq.ts

Nhom nay bao phu cac nghiep vu:

- San pham
- Review
- Gio hang
- Dat hang
- Thanh toan
- Newsletter
- Tu van AI

### 7.3 Service nghiep vu admin

- service/admin/dashboard.ts
- service/admin/accounts.ts
- service/admin/products.ts
- service/admin/categories.ts
- service/admin/discounts.ts
- service/admin/orders.ts
- service/admin/reviews.ts
- service/admin/newsletter.ts
- service/admin/upload.ts

Nhom nay bao phu cac nghiep vu:

- Quan tri dashboard
- Quan tri tai khoan
- Quan tri danh muc/san pham
- Quan tri khuyen mai
- Quan tri don hang
- Quan tri review/newsletter
- Upload tai nguyen

## 8) Luong nghiep vu trong tam

### 8.1 Luong mua hang end-to-end

1. Nguoi dung vao trang chu/shop
2. Tim va loc san pham
3. Xem chi tiet san pham
4. Them vao gio, dieu chinh so luong
5. Chuyen sang checkout
6. Nhap thong tin giao nhan
7. Chon thanh toan (VNPay)
8. Nhan ket qua giao dich
9. Theo doi don tai trang bookings

### 8.2 Luong van hanh admin

1. Admin/staff dang nhap
2. Theo doi dashboard KPI
3. Quan tri danh muc va san pham
4. Cai dat chuong trinh khuyen mai
5. Theo doi va cap nhat don hang
6. Quan tri tai khoan, review, newsletter

## 9) Cong nghe va cau hinh

- Framework: Next.js App Router + TypeScript
- Styling: Tailwind CSS + shadcn/ui + Radix UI
- Form validation: React Hook Form + Zod
- Chart: Recharts
- Animation: Framer Motion
- Notification: Sonner
- Cong dev mac dinh: 3001

## 10) Huong dan chay du an

Yeu cau:

- Node.js
- pnpm hoac npm

Lenh cai dat:

- pnpm install
  hoac
- npm install

Lenh chay dev:

- pnpm dev
  hoac
- npm run dev

URL mac dinh:

- http://localhost:3001

## 11) Bien moi truong khuyen nghi

Tao tep .env.local trong thu muc frontend:

- NEXT_PUBLIC_API_BASE_URL=<backend-api-url>

Ghi chu:

- Neu khong co bien moi truong, he thong co the dung fallback duoc dinh nghia trong service.

## 12) Kich ban kiem thu nhanh (goi y)

### 12.1 Client

- Dang ky tai khoan moi
- Dang nhap va xem profile
- Them san pham vao gio
- Cap nhat so luong va thanh toan
- Kiem tra trang thai don trong bookings

### 12.2 Admin

- Dang nhap admin
- Tao danh muc moi
- Tao/chinh sua san pham
- Tao ma giam gia
- Cap nhat trang thai don hang
- Kiem duyet review

## 13) Dinh huong mo rong

- Wishlist va so sanh san pham
- Dashboard realtime bang socket
- Bao cao nang cao theo khoang thoi gian
- Phan quyen chi tiet theo hanh dong
- Toi uu SEO cho blog va trang san pham

---

Neu can tai lieu tach rieng theo doi tuong, co the chia thanh:

- README-client.md
- README-admin.md
- README-api-integration.md
