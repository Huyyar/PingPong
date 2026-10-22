# PING PONG — GAME OVERVIEW

## 1. Tổng quan trò chơi

PING PONG là game phá gạch (Brick Breaker) dành cho một người chơi. Người chơi điều khiển một thanh đỡ ở phía dưới sân để giữ bóng không rơi khỏi màn hình. Bóng nảy lên và va chạm với các viên gạch, quái vật hoặc Boss tùy theo từng màn chơi.

Game gồm 7 level. Mỗi level có bố cục, mục tiêu và cơ chế riêng, độ phức tạp tăng dần từ phá gạch cơ bản đến chiến đấu với Boss.

## 2. Điều khiển

- **Phím mũi tên trái:** Di chuyển thanh đỡ sang trái.
- **Phím mũi tên phải:** Di chuyển thanh đỡ sang phải.
- **Chuột:** Di chuyển thanh đỡ theo vị trí con trỏ trong sân chơi.
- **Space:** Phóng bóng.
- **Click chuột trái:** Phóng bóng.
- **Phím R:** Chơi lại level.

Khi bắt đầu màn chơi hoặc sau khi mất bóng nhưng chưa thua, bóng nằm ở giữa phía trên thanh đỡ và chờ người chơi phóng.

## 3. Luật chơi chung

### 3.1. Bóng và thanh đỡ

- Bóng di chuyển trong sân và nảy khi chạm tường trái, tường phải hoặc tường trên.
- Khi bóng chạm thanh đỡ, bóng nảy ngược trở lại sân.
- Nếu bóng rơi qua mép dưới sân, người chơi mất một mạng hoặc bị trừ HP tùy theo level.
- Một số level có thể xuất hiện nhiều bóng cùng lúc.
- Khi còn mạng hoặc HP, người chơi được tạo bóng mới để tiếp tục chơi.

### 3.2. Phá gạch và tính điểm

- Gạch thường bị phá khi bóng va chạm.
- Mỗi viên gạch thường bị phá cộng 10 điểm.
- Gạch đặc biệt có thể có cơ chế riêng.
- Gạch không thể phá không bị xóa và không cộng điểm.
- Người chơi thắng khi hoàn thành mục tiêu bắt buộc của level.

### 3.3. Mạng và HP

**Level 1–5:**

- Người chơi bắt đầu với 3 mạng.
- Mỗi lần toàn bộ bóng đang hoạt động rơi khỏi sân, người chơi mất 1 mạng.
- Nếu còn mạng, người chơi tiếp tục với bóng mới.
- Hết mạng đồng nghĩa với thua cuộc.

**Level 6–7:**

- Người chơi có 100 HP ban đầu.
- Bóng rơi hoặc đạn của kẻ địch trúng người chơi sẽ làm giảm HP.
- Khi HP về 0, người chơi thua cuộc.

## 4. Các loại vật phẩm (Item)

Item là những vật phẩm có thể rơi xuống sân. Người chơi thu thập item bằng cách để item chạm vào thanh đỡ.

| Item | Tác dụng |
|---|---|
| +1 | Tạo thêm 1 bóng |
| +3 | Tạo thêm 3 bóng |
| Xanh lá | Tăng chiều dài thanh đỡ |
| Trắng | Làm chậm bóng |
| Vàng | Làm chậm thanh đỡ |
| Tím | Đảo ngược điều khiển trái/phải |
| Xanh biển đậm | Đóng băng thanh đỡ trong một khoảng thời gian |

Các hiệu ứng có thời hạn sẽ kết thúc sau khoảng thời gian quy định. Item rơi khỏi sân mà không được thu thập sẽ biến mất.

Ở Level 1–5, item có thể xuất hiện khi gạch bị phá. Ở Level 6–7, item xuất hiện ngẫu nhiên từ phía trên sân theo thời gian.

## 5. Chi tiết từng level

### Level 1 — Brick Breaker cơ bản

**Mục tiêu:** Phá hết gạch thường.

- Khoảng 20 viên gạch thường.
- Gạch đứng yên và bị phá sau một lần bóng va chạm.
- Có 3 mạng.
- Chỉ xuất hiện item +1 và +3.
- Không có giới hạn thời gian.
- Thắng khi phá hết gạch.
- Thua khi hết mạng.

Đây là màn chơi cơ bản, tập trung vào khả năng điều khiển thanh đỡ và giữ bóng trong sân.

### Level 2 — Gạch không thể phá

**Mục tiêu:** Phá hết gạch thường trong khi tận dụng các bề mặt nảy.

- Khoảng 20 viên gạch thường.
- Có thêm khoảng 5–8 viên gạch xám không thể phá.
- Gạch xám được bố trí tại các vị trí cố định.
- Bóng nảy khi chạm gạch xám nhưng không phá được chúng.
- Có 3 mạng.
- Thắng khi phá hết gạch thường, không cần phá gạch xám.
- Thua khi hết mạng.

### Level 3 — Item buff/debuff

**Mục tiêu:** Phá hết gạch và sử dụng các hiệu ứng vật phẩm.

- Khoảng 20 viên gạch.
- Một số viên gạch có thể làm rơi item.
- Có 3 mạng.
- Xuất hiện các item tăng chiều dài thanh đỡ, làm chậm bóng, làm chậm thanh đỡ, đảo điều khiển và đóng băng thanh đỡ.
- Các hiệu ứng có thời hạn.
- Thắng khi phá hết gạch.
- Thua khi hết mạng.

### Level 4 — TNT và giới hạn thời gian

**Mục tiêu:** Phá hết gạch trước khi hết giờ.

- Khoảng 40 viên gạch.
- Có các viên gạch TNT.
- Khi bóng chạm TNT, TNT phát nổ và phá các viên gạch trong vùng ảnh hưởng.
- Nếu vụ nổ tác động đến TNT khác, TNT đó tiếp tục phát nổ, tạo thành chuỗi nổ.
- Có đồng hồ đếm ngược, thời gian dự kiến từ 90–120 giây.
- Có 3 mạng.
- Thắng khi phá hết gạch trước khi hết giờ.
- Thua khi hết giờ hoặc hết mạng.

### Level 5 — Gạch di chuyển

**Mục tiêu:** Phá hết gạch trong khi điều chỉnh hướng bóng theo chuyển động của gạch.

- Khoảng 20 viên gạch.
- Một số viên gạch di chuyển ngang qua lại.
- Gạch đổi hướng khi chạm giới hạn vùng di chuyển.
- Gạch di chuyển không gây sát thương cho người chơi.
- Có 3 mạng.
- Thắng khi phá hết gạch mục tiêu.
- Thua khi hết mạng.

### Level 6 — Enemy Combat

**Mục tiêu:** Tiêu diệt toàn bộ quái vật và sống sót.

- Có khoảng 6–8 quái vật.
- Mỗi quái có HP riêng và thanh máu.
- Quái vật bắn đạn đỏ về phía người chơi.
- Người chơi sử dụng bóng để gây sát thương cho quái và điều khiển thanh đỡ để tránh mất HP.
- Có các viên gạch xám không thể phá.
- Người chơi bắt đầu với 100 HP.
- Item xuất hiện ngẫu nhiên từ phía trên sân.

**Cơ chế tăng sát thương:**

- Bóng chạm tường hoặc gạch xám sẽ tăng sát thương cộng thêm 1.
- Sát thương cộng thêm tối đa là +5.
- Khi bóng chạm thanh đỡ, sát thương cộng thêm trở về 0.
- Sau khi bóng gây sát thương cho quái, sát thương cộng thêm trở về 0.
- Có thể sử dụng màu bóng hoặc chỉ báo trực quan để thể hiện sát thương hiện tại.

**Điều kiện kết thúc:**

- Thắng khi tất cả quái vật mục tiêu bị tiêu diệt.
- Thua khi HP người chơi về 0.

### Level 7 — Boss Battle

**Mục tiêu:** Đánh bại Boss trong khi tránh đạn và duy trì HP.

- Có một Boss với lượng HP lớn.
- Boss có thanh máu riêng.
- Boss di chuyển ngang qua lại.
- Boss bắn đạn đỏ về phía người chơi.
- Có các viên gạch xám không thể phá.
- Bóng tăng sát thương theo số lần nảy tường hoặc gạch xám.
- Item xuất hiện ngẫu nhiên từ phía trên sân.
- Người chơi bắt đầu với 100 HP.

**Giai đoạn 1:**

- Boss di chuyển ngang.
- Boss bắn đạn theo chu kỳ.

**Giai đoạn 2:**

- Kích hoạt khi HP Boss xuống dưới 50%.
- Boss gọi thêm quái nhỏ.
- Tốc độ bắn của Boss tăng lên.
- Quái nhỏ không bắt buộc phải tiêu diệt để thắng.

**Điều kiện kết thúc:**

- Thắng khi HP Boss về 0.
- Thua khi HP người chơi về 0.

## 6. Tạm dừng và kết thúc trò chơi

### Tạm dừng

Khi người chơi tạm dừng, mọi hoạt động gameplay phải dừng lại, bao gồm chuyển động của bóng, thanh đỡ, gạch di chuyển, item, đạn, quái, Boss và đồng hồ.

Khi tiếp tục, trò chơi khôi phục trạng thái trước đó.

### Thắng và thua

Khi thắng hoặc thua, trò chơi hiển thị kết quả và điểm số.

Người chơi có thể:

- Chơi lại level hiện tại.
- Chọn level khác.
- Quay về trang chủ.

Chơi lại sẽ đưa level về trạng thái ban đầu.

## 7. Mục tiêu hoàn thành

Game được xem là hoàn thiện khi người chơi có thể chơi đủ 7 level, mỗi level có bố cục và cơ chế đúng mô tả, điều khiển ổn định, điểm số và mạng/HP chính xác, các cơ chế đặc biệt hoạt động đúng, đồng thời có thể tạm dừng, tiếp tục, chơi lại và chuyển màn mà không cần tải lại trang.