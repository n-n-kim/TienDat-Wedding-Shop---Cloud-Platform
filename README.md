# Tien Dat Wedding Platform

## 1. Tổng quan dự án

`Tien Dat Wedding Platform` là một web app hỗ trợ:

- giới thiệu dịch vụ thiệp cưới và in ấn
- xem các mẫu thiệp có sẵn
- tự thiết kế thiệp cưới trực tiếp trên web
- lưu bản nháp thiết kế lên cloud
- nhắn tin tư vấn giữa user và admin
- để admin đăng nhập và trả lời hội thoại của khách hàng

Dự án được xây dựng theo hướng `frontend tách khỏi backend`, trong đó:

- frontend chạy bằng `React + TypeScript + Vite`
- backend API chạy bằng `Azure Functions`
- dữ liệu cloud được lưu trong `Azure Table Storage`
- xác thực dùng `Google Identity Services`
- triển khai dùng `Azure Static Web Apps`

---

## 2. Bài toán mà dự án giải quyết

Website này không chỉ là trang giới thiệu dịch vụ, mà còn đóng vai trò như một nền tảng mini cho quy trình đặt thiệp:

1. khách hàng xem các mẫu thiệp sẵn có
2. khách hàng tự tùy chỉnh một mẫu thiệp cưới
3. khách hàng lưu bản nháp thiết kế của mình
4. khách hàng bấm `Tư vấn đặt ngay` để chuyển sang phần chat
5. admin đăng nhập Gmail được cấp quyền để xem và phản hồi tin nhắn

Nhờ đó, dự án thể hiện được cả 3 nhóm chức năng:

- `UI/UX frontend`
- `cloud backend`
- `authentication + lưu trữ dữ liệu`

---

## 3. Chức năng hiện tại

### 3.1. Trang chủ

Trang chủ hiện được tinh gọn, chỉ giữ các phần chính:

- `Hero`
- `Quy trình đặt hàng`
- `Liên hệ tư vấn` dạng chat

Mục tiêu của bố cục này là đưa người dùng đi thẳng vào hành động chính:

- xem mẫu
- bắt đầu thiết kế
- hoặc chat tư vấn

### 3.2. Trang xem mẫu sản phẩm

Người dùng có thể mở một trang riêng để xem:

- mẫu thiệp cưới
- mẫu thiệp mời
- mẫu danh thiếp

Trang này hoạt động như một gallery tham khảo trước khi khách hàng chuyển sang thiết kế hoặc nhắn tin.

### 3.3. Trình thiết kế thiệp cưới

Trang thiết kế cho phép người dùng:

- nhập tên cô dâu, chú rể
- nhập cha mẹ hai bên
- nhập ngày, giờ, địa điểm
- chọn `ngôn ngữ nội dung`: tiếng Việt, tiếng Anh, song ngữ
- chọn loại sự kiện: lễ thành hôn, lễ đính hôn, tiệc cưới, save the date
- chọn `bảng màu`
- chọn `phong cách`
- chọn `kiểu nền`
- chọn `items / embellishments`
- lưu bản thiết kế lên cloud

Phiên bản hiện tại đã được tối giản để giống thiệp thật hơn:

- chỉ dùng tỷ lệ `5x7`
- toàn bộ nội dung nằm gọn trong khung thiệp
- không còn phần quote dài
- không để nội dung tràn ra ngoài
- giao diện trang thiết kế hiển thị bằng tiếng Việt

### 3.4. Lưu bản nháp lên cloud

Nếu người dùng đăng nhập bằng Google, họ có thể:

- lưu thiết kế mới
- cập nhật thiết kế cũ
- tải lại thiết kế đã lưu
- xóa thiết kế khỏi cloud

Dữ liệu lưu bao gồm toàn bộ thuộc tính quan trọng của tấm thiệp, không chỉ là text cơ bản.

### 3.5. Chat tư vấn giữa user và admin

Phần `Liên hệ tư vấn` đã được chuyển từ form tĩnh thành giao diện chat kiểu Messenger.

Người dùng có thể:

- đăng nhập bằng Google
- nhập số điện thoại
- gửi tin nhắn đầu tiên
- tiếp tục nhắn trong cùng hội thoại
- xem lại lịch sử chat

Tin nhắn được lưu trên cloud và sẽ xuất hiện trong inbox của admin.

### 3.6. Admin chat inbox

Admin đăng nhập bằng Gmail được cấp quyền sẽ nhìn thấy:

- danh sách tất cả hội thoại
- nội dung từng cuộc chat
- số tin nhắn chưa đọc
- trạng thái mở / đóng hội thoại
- ô nhập phản hồi để trả lời user

Email admin mặc định hiện tại là:

`kim1801x5@gmail.com`

Nếu không truyền biến môi trường admin, hệ thống sẽ fallback về email này.

### 3.7. Nút `Tư vấn đặt ngay`

Trong trang thiết kế, khi người dùng bấm `Tư vấn đặt ngay`:

- app quay về `home`
- tự cuộn đến section chat `#contact`

Điều này giúp nối liền luồng:

`xem mẫu -> thiết kế -> chat tư vấn`

---

## 4. Công nghệ sử dụng và dùng để làm gì

Đây là phần quan trọng nhất để trình bày trong báo cáo hoặc README bàn giao.

### 4.1. Tổng hợp nhanh theo nhóm

| Công nghệ | Vai trò chính |
| --- | --- |
| `React` | Xây dựng giao diện theo component |
| `TypeScript` | Kiểm soát kiểu dữ liệu cho frontend |
| `Vite` | Dev server và build frontend |
| `Tailwind CSS` | Styling giao diện nhanh bằng utility class |
| `Lucide React` | Bộ icon cho UI |
| `Context API` | Quản lý trạng thái ngôn ngữ và đăng nhập |
| `Google Identity Services` | Đăng nhập Google ở frontend |
| `Fetch API` | Gọi API giữa frontend và Azure Functions |
| `Azure Static Web Apps` | Hosting frontend + tích hợp API |
| `Azure Functions` | Xử lý backend dạng serverless |
| `@azure/data-tables` | Giao tiếp với Azure Table Storage |
| `Azure Table Storage` | Lưu bản thiết kế, hội thoại và tin nhắn |
| `google-auth-library` | Xác minh Google ID Token ở backend |
| `GitHub Actions` | CI/CD build và deploy |

### 4.2. React dùng cho phần nào

`React` là nền tảng chính của frontend. Mỗi phần giao diện được tách thành component riêng:

- `Header.tsx`: thanh điều hướng
- `Hero.tsx`: phần giới thiệu đầu trang
- `Process.tsx`: quy trình đặt hàng
- `SamplesPage.tsx`: trang xem mẫu thiệp
- `WeddingCardDesigner.tsx`: trình thiết kế thiệp
- `Contact.tsx`: chat phía user
- `AdminChatPage.tsx`: inbox phía admin
- `LoginPage.tsx`: trang đăng nhập

Lợi ích của React trong dự án này:

- dễ chia nhỏ giao diện
- dễ tái sử dụng UI
- dễ điều khiển màn hình theo state
- phù hợp với flow một trang, nhiều view

### 4.3. TypeScript dùng cho phần nào

`TypeScript` được dùng để định nghĩa kiểu dữ liệu cho:

- thông tin user
- dữ liệu thiết kế thiệp
- hội thoại chat
- tin nhắn chat
- props của component

Ví dụ:

- `src/app/types/weddingCard.ts`
- `src/app/types/chat.ts`

Lợi ích:

- giảm lỗi khi truyền sai dữ liệu
- giúp code dễ bảo trì
- dễ mở rộng chức năng sau này

### 4.4. Vite dùng cho phần nào

`Vite` được dùng làm:

- dev server khi chạy local
- bundler khi build production

Lợi ích:

- khởi động nhanh
- build gọn
- phù hợp với React + TypeScript

Các lệnh chính:

```bash
npm run dev
npm run build
```

### 4.5. Tailwind CSS dùng cho phần nào

`Tailwind CSS` được dùng để tạo giao diện nhanh bằng class utility trực tiếp trong JSX.

Tailwind đang xử lý:

- layout
- spacing
- typography
- màu sắc
- border
- shadow
- responsive

Ví dụ các component sử dụng Tailwind rất nhiều:

- `Contact.tsx`
- `AdminChatPage.tsx`
- `WeddingCardDesigner.tsx`
- `SamplesPage.tsx`

Lợi ích:

- chỉnh giao diện rất nhanh
- không phải viết quá nhiều CSS riêng
- giữ style đồng nhất giữa các trang

### 4.6. Lucide React dùng cho phần nào

`lucide-react` là thư viện icon đang được dùng xuyên suốt dự án:

- icon menu
- icon chat
- icon điện thoại
- icon quay lại
- icon gửi tin nhắn
- icon save / delete / sparkles

Lợi ích:

- icon nhẹ
- dùng trực tiếp như component React
- đồng bộ phong cách giao diện

### 4.7. Context API dùng cho phần nào

Dự án hiện dùng `React Context API` cho 2 phần rất quan trọng:

#### `LanguageContext`

File:

- `src/app/contexts/LanguageContext.tsx`

Chức năng:

- lưu ngôn ngữ hiện tại `vi` hoặc `en`
- cung cấp hàm `t()` để lấy text theo key
- cho phép UI đổi ngôn ngữ ở nhiều component

#### `AuthContext`

File:

- `src/app/contexts/AuthContext.tsx`

Chức năng:

- lưu user đang đăng nhập
- xác định đã đăng nhập hay chưa
- xác định có cloud token hay không
- xác định user có phải admin hay không

Lợi ích của Context API ở đây:

- tránh truyền props nhiều tầng
- dễ dùng ở toàn app
- đủ gọn cho quy mô dự án này

### 4.8. Google Identity Services dùng cho phần nào

`Google Identity Services` được dùng ở frontend để:

- hiển thị nút đăng nhập Google
- nhận Google ID token sau khi user đăng nhập

File chính:

- `src/app/components/LoginPage.tsx`

Khi đăng nhập thành công, frontend lấy được:

- `sub`
- `name`
- `email`
- `picture`
- `credential` là Google ID token

Token này sẽ được lưu vào session local để frontend gọi API cloud.

### 4.9. Session lưu local dùng cho phần nào

Phần session frontend đang được xử lý qua:

- `src/app/services/googleSession.ts`

Chức năng:

- lưu user vào local/session storage
- đọc user đã lưu
- xóa user khi logout hoặc token lỗi
- phát event đồng bộ trạng thái đăng nhập

Lợi ích:

- giữ trạng thái đăng nhập giữa các lần reload
- làm base cho `AuthContext`

### 4.10. Fetch API dùng cho phần nào

Frontend gọi backend bằng `fetch`.

Các service chính:

- `src/app/services/cardsApi.ts`
- `src/app/services/chatApi.ts`

Phần này chịu trách nhiệm:

- gọi API tạo / đọc / sửa / xóa bản thiết kế
- gọi API tạo hội thoại
- gọi API lấy tin nhắn
- gọi API gửi tin nhắn
- gọi API đóng / mở hội thoại

Ngoài ra nó còn:

- tự gắn `Authorization: Bearer <token>`
- tự gắn `X-Google-Id-Token`
- xử lý lỗi `401`
- tự logout local nếu token không hợp lệ

### 4.11. Azure Static Web Apps dùng cho phần nào

`Azure Static Web Apps` là nền tảng deploy chính của dự án.

Nó được dùng để:

- host frontend React build ra từ Vite
- kết nối frontend với thư mục `api/`
- triển khai cả web app lẫn Azure Functions trong cùng hệ thống

Lợi ích:

- phù hợp với đồ án có frontend + serverless API
- deploy đơn giản từ GitHub
- dễ cấu hình biến môi trường

### 4.12. Azure Functions dùng cho phần nào

`Azure Functions` đóng vai trò backend serverless.

Backend hiện cung cấp 2 nhóm API chính:

#### API cho bản thiết kế thiệp

- `GET /api/cards`
- `POST /api/cards`
- `GET /api/cards/{id}`
- `PUT /api/cards/{id}`
- `DELETE /api/cards/{id}`

#### API cho chat tư vấn

- `GET /api/chat/conversations`
- `POST /api/chat/conversations`
- `GET /api/chat/conversations/{id}`
- `PUT /api/chat/conversations/{id}`
- `GET /api/chat/conversations/{id}/messages`
- `POST /api/chat/conversations/{id}/messages`

Các thư mục chính:

- `api/cards`
- `api/cards-item`
- `api/chat-conversations`
- `api/chat-conversation-item`
- `api/chat-messages`

Lợi ích của Azure Functions:

- không cần dựng server Express riêng
- phù hợp chức năng CRUD và auth token
- tiết kiệm công triển khai

### 4.13. @azure/data-tables dùng cho phần nào

Trong backend, thư viện `@azure/data-tables` được dùng để làm việc với `Azure Table Storage`.

File chính:

- `api/shared/cardsRepository.js`
- `api/shared/chatRepository.js`

Nó đang xử lý:

- tạo table nếu chưa tồn tại
- ghi entity mới
- đọc entity theo key
- liệt kê entity theo filter
- cập nhật entity
- xóa entity

Đây là lớp repository trung gian giữa Function và storage.

### 4.14. Azure Table Storage dùng cho phần nào

`Azure Table Storage` là nơi lưu dữ liệu cloud chính của dự án.

Hiện đang có 3 nhóm dữ liệu:

#### Bảng 1: thiết kế thiệp

Mặc định:

- `WeddingCardDesigns`

Lưu:

- chủ sở hữu thiết kế
- tiêu đề bản nháp
- trạng thái
- `cardData`
- thời gian tạo / cập nhật

#### Bảng 2: hội thoại chat

Mặc định:

- `ConsultationConversations`

Lưu:

- thông tin user
- số điện thoại liên hệ
- trạng thái open/closed
- tin nhắn cuối
- số chưa đọc cho admin và user

#### Bảng 3: tin nhắn chat

Mặc định:

- `ConsultationMessages`

Lưu:

- conversationId
- senderId
- senderName
- senderRole
- content
- createdAt

Lý do chọn Table Storage:

- đơn giản
- chi phí thấp
- phù hợp cho dữ liệu key-value / entity không quá phức tạp
- đủ tốt cho đồ án cloud quy mô vừa

### 4.15. google-auth-library dùng cho phần nào

Ở backend, `google-auth-library` được dùng để:

- verify Google ID token
- kiểm tra token có đúng `GOOGLE_CLIENT_ID` hay không
- lấy thông tin user từ payload

File chính:

- `api/shared/googleAuth.js`

Sau khi xác minh token thành công, backend lấy được:

- `id`
- `email`
- `name`
- `avatar`

Phần này cũng xác định quyền admin theo email.

### 4.16. GitHub Actions dùng cho phần nào

`GitHub Actions` được dùng để tự động build và deploy dự án lên Azure.

Workflow hiện tại:

- `.github/workflows/azure-static-web-apps-orange-hill-077720b00.yml`

Vai trò:

- build frontend
- publish app lên Azure Static Web Apps
- dùng secret build như `VITE_GOOGLE_CLIENT_ID`, `VITE_ADMIN_EMAILS`

### 4.17. Những dependency khác trong package.json

`package.json` hiện có khá nhiều dependency từ template hoặc cho khả năng mở rộng sau này như:

- `MUI`
- `Radix UI`
- `react-router`
- `recharts`
- `motion`
- `react-hook-form`

Tuy nhiên, ở trạng thái hiện tại của project, các chức năng chính đang chạy thực tế chủ yếu dựa vào:

- `React`
- `TypeScript`
- `Vite`
- `Tailwind CSS`
- `Lucide React`
- `Google Identity Services`
- `Azure Functions`
- `Azure Table Storage`

Nói cách khác, README và báo cáo nên tập trung vào những công nghệ đang thực sự tham gia vào flow người dùng hiện tại.

---

## 5. Kiến trúc hệ thống

### 5.1. Kiến trúc tổng quát

```text
Người dùng / Admin
        |
        v
Frontend React (Vite)
        |
        v
Azure Static Web Apps
        |
        v
Azure Functions API
        |
        v
Azure Table Storage
```

### 5.2. Kiến trúc frontend

Frontend dùng mô hình component + context:

```text
App.tsx
  |- AuthProvider
  |- LanguageProvider
  |- Header
  |- Hero
  |- Process
  |- Contact
  |- SamplesPage
  |- WeddingCardDesigner
  |- AdminChatPage
  |- LoginPage
```

Điểm đáng chú ý:

- app hiện chưa dùng router URL đầy đủ
- thay vào đó dùng `currentView` trong `App.tsx` để đổi màn hình
- cách này phù hợp với đồ án nhỏ và dễ kiểm soát flow

### 5.3. Kiến trúc backend

Backend được chia thành:

- `function endpoint`
- `repository`
- `validation`
- `auth helper`

Ví dụ:

- endpoint nhận request và trả response
- repository xử lý Azure Table Storage
- validation kiểm tra dữ liệu đầu vào
- auth helper kiểm tra token và quyền admin

---

## 6. Luồng hoạt động chi tiết

### 6.1. Luồng của user

1. vào trang chủ
2. xem mẫu thiệp nếu muốn
3. mở trang thiết kế
4. nhập thông tin thiệp
5. nếu muốn lưu cloud thì đăng nhập Google
6. bấm lưu thiết kế
7. bấm `Tư vấn đặt ngay`
8. chuyển sang chat
9. gửi số điện thoại và tin nhắn cho admin

### 6.2. Luồng của admin

1. đăng nhập bằng Gmail admin
2. mở `Chat admin` từ header
3. xem danh sách hội thoại
4. chọn một user
5. đọc lịch sử chat
6. phản hồi tin nhắn
7. đóng / mở lại hội thoại nếu cần

### 6.3. Luồng xác thực

1. user đăng nhập Google ở frontend
2. frontend nhận Google ID token
3. token được lưu local
4. frontend gọi API kèm token trong header
5. Azure Functions verify token bằng `google-auth-library`
6. backend xác định user thường hay admin

---

## 7. Các chức năng gắn với công nghệ nào

### 7.1. Xem mẫu thiệp

Sử dụng:

- `React`
- `Tailwind CSS`
- `Lucide React`

Không cần backend vì dữ liệu mẫu hiện được render tĩnh từ frontend.

### 7.2. Thiết kế thiệp cưới

Sử dụng:

- `React state`
- `TypeScript`
- `Tailwind CSS`

Nếu chỉ chỉnh sửa giao diện thì chưa cần cloud.

Nếu bấm lưu:

- frontend gọi `cardsApi.ts`
- Azure Functions xử lý request
- Azure Table Storage lưu dữ liệu

### 7.3. Đăng nhập Google

Sử dụng:

- `Google Identity Services` ở frontend
- `google-auth-library` ở backend
- `AuthContext` để quản lý trạng thái user

### 7.4. Lưu bản nháp lên cloud

Sử dụng:

- `fetch`
- `Azure Functions`
- `@azure/data-tables`
- `Azure Table Storage`

### 7.5. Chat user-admin

Sử dụng:

- `React`
- `fetch`
- `Azure Functions`
- `Azure Table Storage`

Hiện tại chat đang update theo cơ chế:

- polling mỗi 5 giây

Chưa dùng:

- WebSocket
- SignalR

### 7.6. Phân quyền admin

Sử dụng:

- `AuthContext` ở frontend
- `googleAuth.js` ở backend
- biến môi trường `VITE_ADMIN_EMAILS` và `ADMIN_EMAILS`

Fallback hiện tại:

- `kim1801x5@gmail.com`

### 7.7. Deploy và CI/CD

Sử dụng:

- `GitHub Actions`
- `Azure Static Web Apps`

---

## 8. Cấu trúc thư mục chính

```text
src/
  app/
    App.tsx
    components/
      AdminChatPage.tsx
      Contact.tsx
      Footer.tsx
      Header.tsx
      Hero.tsx
      LoginPage.tsx
      Process.tsx
      SamplesPage.tsx
      WeddingCardDesigner.tsx
    contexts/
      AuthContext.tsx
      LanguageContext.tsx
    services/
      cardsApi.ts
      chatApi.ts
      googleSession.ts
    types/
      chat.ts
      weddingCard.ts

api/
  cards/
  cards-item/
  chat-conversations/
  chat-conversation-item/
  chat-messages/
  shared/
    cardsRepository.js
    cardsValidation.js
    chatRepository.js
    chatValidation.js
    googleAuth.js
    http.js

.github/
  workflows/
    azure-static-web-apps-orange-hill-077720b00.yml
```

---

## 9. Các file quan trọng

### Frontend

- `src/app/App.tsx`
  Điều phối view hiện tại của app.

- `src/app/contexts/AuthContext.tsx`
  Quản lý đăng nhập, quyền admin và cloud token.

- `src/app/contexts/LanguageContext.tsx`
  Quản lý ngôn ngữ hiển thị.

- `src/app/components/WeddingCardDesigner.tsx`
  Màn hình thiết kế thiệp cưới.

- `src/app/components/Contact.tsx`
  Chat phía user.

- `src/app/components/AdminChatPage.tsx`
  Inbox chat phía admin.

- `src/app/services/cardsApi.ts`
  Service gọi API lưu bản thiết kế.

- `src/app/services/chatApi.ts`
  Service gọi API chat.

### Backend

- `api/shared/googleAuth.js`
  Verify Google token và xác định admin.

- `api/shared/cardsRepository.js`
  CRUD thiết kế thiệp trong Azure Table Storage.

- `api/shared/chatRepository.js`
  CRUD hội thoại và tin nhắn chat.

- `api/cards/index.js`
  API list và create thiết kế.

- `api/cards-item/index.js`
  API get, update, delete một thiết kế.

- `api/chat-conversations/index.js`
  API list conversation và tạo conversation mới.

- `api/chat-conversation-item/index.js`
  API cập nhật trạng thái hội thoại.

- `api/chat-messages/index.js`
  API lấy tin nhắn và gửi tin nhắn mới.

---

## 10. API hiện có

### 10.1. API thiết kế thiệp

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| `GET` | `/api/cards` | Lấy danh sách thiết kế của user |
| `POST` | `/api/cards` | Tạo thiết kế mới |
| `GET` | `/api/cards/{id}` | Lấy chi tiết một thiết kế |
| `PUT` | `/api/cards/{id}` | Cập nhật thiết kế |
| `DELETE` | `/api/cards/{id}` | Xóa thiết kế |

### 10.2. API chat

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| `GET` | `/api/chat/conversations` | Lấy danh sách hội thoại |
| `POST` | `/api/chat/conversations` | Tạo hội thoại mới |
| `GET` | `/api/chat/conversations/{id}` | Lấy thông tin hội thoại |
| `PUT` | `/api/chat/conversations/{id}` | Đổi trạng thái open/closed |
| `GET` | `/api/chat/conversations/{id}/messages` | Lấy danh sách tin nhắn |
| `POST` | `/api/chat/conversations/{id}/messages` | Gửi tin nhắn mới |

---

## 11. Mô hình dữ liệu cloud

### 11.1. Bản thiết kế thiệp

Partition/Row key:

- `PartitionKey = userId`
- `RowKey = designId`

Các field chính:

- `userEmail`
- `userName`
- `title`
- `status`
- `cardData`
- `previewImageUrl`
- `createdAt`
- `updatedAt`

### 11.2. Hội thoại chat

Partition/Row key:

- `PartitionKey = conversation`
- `RowKey = conversationId`

Các field chính:

- `userId`
- `userEmail`
- `userName`
- `userAvatar`
- `contactPhone`
- `status`
- `lastMessage`
- `lastSenderRole`
- `unreadForAdmin`
- `unreadForUser`
- `createdAt`
- `updatedAt`

### 11.3. Tin nhắn chat

Partition/Row key:

- `PartitionKey = conversationId`
- `RowKey = messageId`

Các field chính:

- `senderId`
- `senderName`
- `senderRole`
- `content`
- `createdAt`

---

## 12. Cách chạy local

### 12.1. Cài dependency frontend

```bash
npm install
```

### 12.2. Tạo file `.env`

Tạo `.env` từ `.env.example`

Ví dụ:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_ADMIN_EMAILS=kim1801x5@gmail.com
```

### 12.3. Chạy frontend

```bash
npm run dev
```

### 12.4. Build kiểm tra

```bash
npm run build
```

---

## 13. Cách cấu hình backend local

Nếu muốn test Azure Functions local:

1. copy file:

`api/local.settings.sample.json`

thành:

`api/local.settings.json`

2. điền giá trị thật

Ví dụ:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "GOOGLE_CLIENT_ID": "your-google-client-id.apps.googleusercontent.com",
    "AZURE_STORAGE_CONNECTION_STRING": "your-real-storage-connection-string",
    "AZURE_TABLE_NAME": "WeddingCardDesigns",
    "AZURE_CHAT_CONVERSATIONS_TABLE_NAME": "ConsultationConversations",
    "AZURE_CHAT_MESSAGES_TABLE_NAME": "ConsultationMessages",
    "ADMIN_EMAILS": "kim1801x5@gmail.com"
  }
}
```

---

## 14. Biến môi trường cần có

### 14.1. Frontend

- `VITE_GOOGLE_CLIENT_ID`
- `VITE_ADMIN_EMAILS`

### 14.2. Backend / Azure Functions

- `GOOGLE_CLIENT_ID`
- `AZURE_STORAGE_CONNECTION_STRING`
- `AZURE_TABLE_NAME`
- `AZURE_CHAT_CONVERSATIONS_TABLE_NAME`
- `AZURE_CHAT_MESSAGES_TABLE_NAME`
- `ADMIN_EMAILS`

---

## 15. Phần manual cần làm sau code

Đây là phần cấu hình cloud mà bạn vẫn cần làm tay.

### 15.1. Tạo Google Client ID

Bạn cần tạo OAuth client ở Google Cloud Console để lấy:

- `VITE_GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_ID`

### 15.2. Tạo Storage Account trên Azure

Bạn cần:

- tạo `Storage Account`
- lấy `Connection String`
- gán vào `AZURE_STORAGE_CONNECTION_STRING`

### 15.3. Cấu hình Azure Static Web Apps

Trong Azure, thêm các biến:

- `VITE_GOOGLE_CLIENT_ID`
- `VITE_ADMIN_EMAILS`
- `GOOGLE_CLIENT_ID`
- `AZURE_STORAGE_CONNECTION_STRING`
- `AZURE_TABLE_NAME`
- `AZURE_CHAT_CONVERSATIONS_TABLE_NAME`
- `AZURE_CHAT_MESSAGES_TABLE_NAME`
- `ADMIN_EMAILS`

Giá trị khuyến nghị:

```env
VITE_ADMIN_EMAILS=kim1801x5@gmail.com
ADMIN_EMAILS=kim1801x5@gmail.com
AZURE_TABLE_NAME=WeddingCardDesigns
AZURE_CHAT_CONVERSATIONS_TABLE_NAME=ConsultationConversations
AZURE_CHAT_MESSAGES_TABLE_NAME=ConsultationMessages
```

### 15.4. Redeploy

Sau khi đổi biến môi trường, cần redeploy lại app để frontend và backend nhận cấu hình mới.

---

## 16. GitHub Actions và deploy

Workflow hiện tại:

- `.github/workflows/azure-static-web-apps-orange-hill-077720b00.yml`

Nó được dùng để:

- build project
- deploy lên Azure Static Web Apps

### Secret nên có trong GitHub

- `AZURE_STATIC_WEB_APPS_API_TOKEN_ORANGE_HILL_077720B00`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_ADMIN_EMAILS`

### Biến backend nên cấu hình ở Azure

Nên đặt ở Azure thay vì đưa vào frontend build:

- `GOOGLE_CLIENT_ID`
- `AZURE_STORAGE_CONNECTION_STRING`
- `ADMIN_EMAILS`
- các table name

---

## 17. Hạn chế hiện tại

- chat đang dùng polling mỗi 5 giây, chưa realtime socket thật
- chưa có upload ảnh trong chat
- chưa có push notification
- chưa có pagination cho inbox admin
- chưa có read receipt chi tiết kiểu seen
- app chưa dùng router URL đầy đủ
- dữ liệu mẫu thiệp hiện vẫn là dữ liệu tĩnh ở frontend

---

## 18. Hướng mở rộng tiếp theo

- thay polling bằng `SignalR` hoặc `WebSocket`
- thêm `React Router` để có URL riêng cho từng trang
- cho phép gửi ảnh mẫu trong chat
- thêm export thiết kế ra ảnh hoặc PDF
- thêm mặt trước / mặt sau của thiệp
- thêm bộ preset thiệp thực tế nhiều hơn
- thêm tìm kiếm, lọc và phân loại hội thoại trong admin inbox

---

## 19. Checklist demo nhanh

Trước khi demo hoặc nộp bài, nên kiểm tra:

1. `.env` đã có `VITE_GOOGLE_CLIENT_ID`
2. `VITE_ADMIN_EMAILS` chứa `kim1801x5@gmail.com`
3. Azure đã có `GOOGLE_CLIENT_ID`
4. Azure đã có `AZURE_STORAGE_CONNECTION_STRING`
5. Azure đã có `ADMIN_EMAILS`
6. app đã redeploy sau khi đổi config
7. admin đăng nhập đúng Gmail
8. user đăng nhập Google trước khi test lưu cloud hoặc chat cloud

---

## 20. Kết luận

Dự án này là một ví dụ khá đầy đủ của mô hình:

- `Frontend SPA bằng React`
- `Xác thực bằng Google`
- `Backend serverless bằng Azure Functions`
- `Lưu dữ liệu cloud bằng Azure Table Storage`
- `Triển khai tự động bằng Azure Static Web Apps + GitHub Actions`

Điểm mạnh của project là không chỉ có giao diện, mà đã có:

- luồng người dùng rõ ràng
- xác thực
- lưu dữ liệu cloud
- phân quyền admin
- chat user-admin

Nếu dùng cho báo cáo, bạn có thể mô tả ngắn gọn rằng:

`Đây là một nền tảng thiết kế và tư vấn thiệp cưới trên cloud, trong đó React phụ trách trải nghiệm người dùng, Azure Functions phụ trách xử lý nghiệp vụ phía server, Google Identity Services phụ trách xác thực, và Azure Table Storage phụ trách lưu trữ dữ liệu thiết kế cũng như hội thoại tư vấn.`
