# Tien Dat Wedding Platform

Website giới thiệu và tư vấn cho dịch vụ thiệp cưới, danh thiếp và in ấn của Tiến Đạt. Dự án dùng React + Vite ở frontend, Azure Static Web Apps để deploy, Azure Functions làm API, Azure Table Storage để lưu dữ liệu cloud.

Hiện tại hệ thống đã có:

- Trang chủ rút gọn với `Hero`, `Quy trình đặt hàng`, `Chat tư vấn`
- Trang riêng để xem `mẫu thiệp / sản phẩm mẫu`
- Trang `Wedding Card Designer`
- Đăng nhập Google
- Lưu mẫu thiệp lên cloud
- Chat cloud giữa `user` và `admin`
- Dashboard admin để xem và trả lời tin nhắn user

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Authentication: Google Identity Services
- Hosting: Azure Static Web Apps
- API: Azure Functions
- Cloud storage: Azure Table Storage
- CI/CD: GitHub Actions

## Main Features

### 1. Sample Product Page

- Có một trang riêng để xem các mẫu thiệp / sản phẩm nổi bật
- Có thể mở từ `Hero` và `Header`
- Dùng để khách hàng tham khảo trước khi chat hoặc đặt thiết kế

### 2. Wedding Card Designer

- Cho phép tạo / chỉnh sửa mẫu thiệp
- Có local draft
- Có cloud save khi người dùng đăng nhập Google hợp lệ

### 3. Cloud Consultation Chat

- User đăng nhập Google rồi nhắn tin trong phần `Liên hệ tư vấn`
- Tin nhắn được lưu lên Azure Table Storage
- Admin đăng nhập sẽ thấy danh sách hội thoại và trả lời từ dashboard
- Giao diện chat hiện tại được làm theo phong cách gần giống Messenger
- Dữ liệu chat đang refresh theo polling mỗi 5 giây

### 4. Admin Inbox

- Admin có thể xem toàn bộ hội thoại từ user
- Có thể gửi phản hồi
- Có thể đóng / mở lại hội thoại
- Admin mặc định hiện tại là:

`kim1801x5@gmail.com`

Ngoài fallback cứng trong code, bạn vẫn nên set biến môi trường admin để dễ đổi sau này.

## Project Structure

```text
src/
  app/
    components/
      AdminChatPage.tsx
      Contact.tsx
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
    chatRepository.js
    googleAuth.js
```

## Application Flow

### User Flow

1. User vào trang chủ
2. Có thể mở trang `Xem mẫu thiết kế`
3. Có thể vào `Thiết kế`
4. Có thể đăng nhập Google
5. Ở phần chat tư vấn:
   - nhập số điện thoại
   - gửi tin nhắn đầu tiên
   - hệ thống tạo conversation cloud
6. Những tin nhắn tiếp theo được lưu tiếp vào cloud

### Admin Flow

1. Admin đăng nhập bằng Google account được cấp quyền
2. Header sẽ hiện nút `Chat admin`
3. Mở dashboard admin
4. Xem danh sách hội thoại ở cột trái
5. Chọn hội thoại để đọc và trả lời user

## Cloud Data Design

Hiện tại có 3 nhóm dữ liệu chính:

### A. Wedding card designs

Được lưu trong Azure Table Storage qua API:

- `GET /api/cards`
- `POST /api/cards`
- `GET /api/cards/{id}`
- `PUT /api/cards/{id}`
- `DELETE /api/cards/{id}`

Thiết kế dùng:

- `PartitionKey = userId`
- `RowKey = designId`

### B. Chat conversations

API:

- `GET /api/chat/conversations`
- `POST /api/chat/conversations`
- `GET /api/chat/conversations/{id}`
- `PUT /api/chat/conversations/{id}`

Conversation lưu các thông tin như:

- `userId`
- `userEmail`
- `userName`
- `contactPhone`
- `status`
- `lastMessage`
- `unreadForAdmin`
- `unreadForUser`
- `createdAt`
- `updatedAt`

### C. Chat messages

API:

- `GET /api/chat/conversations/{id}/messages`
- `POST /api/chat/conversations/{id}/messages`

Message lưu các thông tin như:

- `conversationId`
- `senderId`
- `senderName`
- `senderRole`
- `content`
- `createdAt`

## Authentication

App đang dùng Google Identity Services.

### Frontend

- Người dùng đăng nhập bằng Google trên `LoginPage`
- Token được giữ ở local storage
- Frontend gửi token lên API qua:

`Authorization: Bearer <google-id-token>`

và thêm cả:

`X-Google-Id-Token`

### Backend

- Azure Functions verify Google ID token
- Từ token, backend lấy:
  - `userId`
  - `userEmail`
  - `userName`

### Admin Permission

Frontend và backend đều kiểm tra email admin.

Hiện tại logic admin:

- Nếu có env `VITE_ADMIN_EMAILS` / `ADMIN_EMAILS` thì dùng env
- Nếu không có env thì fallback sang:

`kim1801x5@gmail.com`

## Run Frontend Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env`

Tạo file `.env` từ `.env.example`

Ví dụ:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_ADMIN_EMAILS=kim1801x5@gmail.com
```

### 3. Run app

```bash
npm run dev
```

### 4. Build check

```bash
npm run build
```

## Run Azure Functions Locally

Nếu bạn muốn test API local sau này:

1. Copy file:

`api/local.settings.sample.json` -> `api/local.settings.json`

2. Điền giá trị thật cho các biến bên trong

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

3. Chạy Azure Functions local bằng môi trường Functions của bạn

README này không ép lệnh local functions cụ thể vì còn tùy máy đã cài Azure Functions Core Tools hay chưa.

## Required Environment Variables

### Frontend

- `VITE_GOOGLE_CLIENT_ID`
- `VITE_ADMIN_EMAILS`

### API / Azure Functions

- `GOOGLE_CLIENT_ID`
- `AZURE_STORAGE_CONNECTION_STRING`
- `AZURE_TABLE_NAME`
- `AZURE_CHAT_CONVERSATIONS_TABLE_NAME`
- `AZURE_CHAT_MESSAGES_TABLE_NAME`
- `ADMIN_EMAILS`

## Azure Manual Setup

Đây là phần manual quan trọng sau khi code xong.

### 1. Tạo Storage Account

Trên Azure:

- tạo `Storage Account`
- lấy `Connection String`

### 2. Cấu hình Azure Static Web Apps

Trong phần `Environment variables` của Azure Static Web App, thêm:

- `VITE_GOOGLE_CLIENT_ID`
- `VITE_ADMIN_EMAILS`
- `GOOGLE_CLIENT_ID`
- `AZURE_STORAGE_CONNECTION_STRING`
- `AZURE_TABLE_NAME`
- `AZURE_CHAT_CONVERSATIONS_TABLE_NAME`
- `AZURE_CHAT_MESSAGES_TABLE_NAME`
- `ADMIN_EMAILS`

Giá trị khuyến nghị:

- `VITE_ADMIN_EMAILS=kim1801x5@gmail.com`
- `ADMIN_EMAILS=kim1801x5@gmail.com`
- `AZURE_TABLE_NAME=WeddingCardDesigns`
- `AZURE_CHAT_CONVERSATIONS_TABLE_NAME=ConsultationConversations`
- `AZURE_CHAT_MESSAGES_TABLE_NAME=ConsultationMessages`

### 3. Redeploy

Sau khi thêm env:

- save cấu hình
- redeploy app

## GitHub Actions / Deployment

Workflow hiện tại:

[.github/workflows/azure-static-web-apps-orange-hill-077720b00.yml](/abs/path/d:/Y3S2/Cloud/BTL/.github/workflows/azure-static-web-apps-orange-hill-077720b00.yml:1)

Hiện workflow đang truyền:

- `VITE_GOOGLE_CLIENT_ID`
- `VITE_ADMIN_EMAILS`

qua GitHub Secrets vào bước build frontend.

### GitHub Secrets nên có

- `AZURE_STATIC_WEB_APPS_API_TOKEN_ORANGE_HILL_077720B00`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_ADMIN_EMAILS`

Lưu ý:

- Các biến backend như `GOOGLE_CLIENT_ID`, `AZURE_STORAGE_CONNECTION_STRING`, `ADMIN_EMAILS` thường nên cấu hình trực tiếp trong Azure Static Web Apps thay vì nhét hết vào workflow.

## Files Important For Chat

### Frontend

- [src/app/components/Contact.tsx](/abs/path/d:/Y3S2/Cloud/BTL/src/app/components/Contact.tsx:1)
- [src/app/components/AdminChatPage.tsx](/abs/path/d:/Y3S2/Cloud/BTL/src/app/components/AdminChatPage.tsx:1)
- [src/app/services/chatApi.ts](/abs/path/d:/Y3S2/Cloud/BTL/src/app/services/chatApi.ts:1)
- [src/app/contexts/AuthContext.tsx](/abs/path/d:/Y3S2/Cloud/BTL/src/app/contexts/AuthContext.tsx:1)

### Backend

- [api/chat-conversations/index.js](/abs/path/d:/Y3S2/Cloud/BTL/api/chat-conversations/index.js:1)
- [api/chat-conversation-item/index.js](/abs/path/d:/Y3S2/Cloud/BTL/api/chat-conversation-item/index.js:1)
- [api/chat-messages/index.js](/abs/path/d:/Y3S2/Cloud/BTL/api/chat-messages/index.js:1)
- [api/shared/chatRepository.js](/abs/path/d:/Y3S2/Cloud/BTL/api/shared/chatRepository.js:1)
- [api/shared/googleAuth.js](/abs/path/d:/Y3S2/Cloud/BTL/api/shared/googleAuth.js:1)

## Current Limitations

- Chat đang dùng polling mỗi 5 giây, chưa phải realtime socket
- Chưa có upload ảnh / file trong chat
- Chưa có push notification
- Chưa có phân trang hội thoại
- Chưa có read receipt chi tiết như Messenger thật

## Suggested Next Improvements

- Đổi polling sang SignalR / WebSocket để realtime hơn
- Thêm tìm kiếm hội thoại cho admin
- Thêm gửi ảnh mẫu trong chat
- Thêm trạng thái `seen`
- Thêm route thật bằng React Router nếu muốn app có URL riêng cho từng page

## Quick Manual Checklist

Sau khi clone code hoặc trước khi demo, check nhanh:

1. Có `.env` chưa
2. `VITE_GOOGLE_CLIENT_ID` đã đúng chưa
3. `VITE_ADMIN_EMAILS` đã có `kim1801x5@gmail.com` chưa
4. Azure có `AZURE_STORAGE_CONNECTION_STRING` chưa
5. Azure có `GOOGLE_CLIENT_ID` chưa
6. Azure có `ADMIN_EMAILS` chưa
7. Đã redeploy sau khi sửa env chưa
8. Đăng nhập đúng Gmail admin chưa

## Notes

- Nếu user dùng guest mode thì không có cloud token, nên không dùng được chat cloud đầy đủ
- Nếu admin không đăng nhập đúng Gmail được cấp quyền thì sẽ không thấy inbox admin
- Fallback admin hiện đang là `kim1801x5@gmail.com`, nhưng vẫn nên set env rõ ràng để tránh nhầm khi deploy nhiều môi trường
