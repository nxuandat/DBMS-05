CREATE PROCEDURE UpdateBill
AS
BEGIN
    BEGIN TRANSACTION;
    DECLARE @quantity INT;
    SET @quantity = (SELECT Quantity FROM LOAITHUOC WHERE MaThuoc = T01);
    WAITFOR DELAY '00:00:05';
    UPDATE HOADON SET Total = @quantity * 1000 WHERE MaHoaDon = 1;
    COMMIT TRANSACTION;
END;


CREATE PROCEDURE UpdateDrugQuantity
AS
BEGIN
    BEGIN TRANSACTION;
    UPDATE LOAITHUOC SET SoLuong = LoaiThuoc - 1 WHERE MaThuoc = T01;
    COMMIT TRANSACTION;
END;

CREATE PROCEDURE ThemTaiKhoan
  @MaKH char(20),
  @SoDT char(15),
  @HoTen nvarchar(50),
  @Phai char(1),
  @NgaySinh datetime,
  @DiaChi nvarchar(100),
  @MatKhau char(50),
  @Email varchar(40)
AS
BEGIN
  -- Sử dụng mức cô lập READ COMMITTED
  SET TRANSACTION ISOLATION LEVEL READ COMMITTED
  BEGIN TRANSACTION
    -- Kiểm tra xem khách hàng đã tồn tại hay chưa
    IF NOT EXISTS (SELECT * FROM KHACHHANG WHERE MaKH = @MaKH AND SoDT = @SoDT)
    BEGIN
      -- Thêm khách hàng mới vào bảng KHACHHANG
      INSERT INTO KHACHHANG (MaKH, SoDT, HoTen, Phai, NgaySinh, DiaChi, MatKhau, Email)
      VALUES (@MaKH, @SoDT, @HoTen, @Phai, @NgaySinh, @DiaChi, @MatKhau, @Email)
     
      -- Giả sử quá trình này mất 10 giây
      WAITFOR DELAY '00:00:10'
     
    END
    ELSE
    BEGIN
      -- Nếu khách hàng đã tồn tại, báo lỗi
      RAISERROR ('Khách hàng đã tồn tại', 16, 1)
    END
  COMMIT TRANSACTION
END
SQL
AI-generated code. Review and use carefully. More info on FAQ.

-- Stored procedure thêm lịch cuộc hẹn
CREATE PROCEDURE ThemLichHen
  @MaSoHen char(20),
  @NgayGioKham datetime,
  @LyDoKham nvarchar(100),
  @MaNS char(20),
  @MaKH char(20),
  @SoDT char(15)
AS
BEGIN
  -- Sử dụng mức cô lập READ UNCOMMITTED
  SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
  BEGIN TRANSACTION
    -- Kiểm tra xem lịch hẹn đã tồn tại hay chưa
    IF NOT EXISTS (SELECT * FROM LICHHEN WHERE MaSoHen = @MaSoHen)
    BEGIN
      -- Kiểm tra xem khách hàng đã có tài khoản hay chưa
      IF EXISTS (SELECT * FROM KHACHHANG WHERE MaKH = @MaKH AND SoDT = @SoDT)
      BEGIN
        -- Thêm lịch hẹn mới vào bảng LICHHEN
        INSERT INTO LICHHEN (MaSoHen, NgayGioKham, LyDoKham, MaNS, MaKH, SoDT)
        VALUES (@MaSoHen, @NgayGioKham, @LyDoKham, @MaNS, @MaKH, @SoDT)
        -- Cập nhật thông tin đăng nhập cho khách hàng
        UPDATE KHACHHANG SET MatKhau = '123456', Email = @MaKH + '@gmail.com' WHERE MaKH = @MaKH AND SoDT = @SoDT
      END
      ELSE
      BEGIN
        -- Nếu khách hàng chưa có tài khoản, báo lỗi
        RAISERROR ('Khách hàng chưa có tài khoản', 16, 1)
      END
    END
    ELSE
    BEGIN
      -- Nếu lịch hẹn đã tồn tại, báo lỗi
      RAISERROR ('Lịch hẹn đã tồn tại', 16, 1)
    END
  COMMIT TRANSACTION
END

create procedure sp_XemThongTinDV
  @MaDV char(10),
  @MaKH char(20)
as
begin
  -- Đặt mức cô lập là read committed
  set transaction isolation level read committed
  -- Bắt đầu giao dịch
  begin transaction
    -- Truy vấn thông tin dịch vụ từ bảng LOAIDICHVU
    select TenDV, MoTa, DongGia
    from LOAIDICHVU
    where MaDV = @MaDV
    -- Truy vấn thông tin chi tiết dịch vụ từ bảng CHITIETDV
    select STT, SoDT, SoLuong
    from CHITIETDV
    where MaDV = @MaDV and MaKH = @MaKH
  -- Kết thúc giao dịch
  commit transaction
end

create procedure sp_ThayDoiThongTinDV
  @MaDV char(10),
  @TenDV nvarchar(40),
  @MoTa nvarchar(100),
  @DongGia bigint
as
begin
  -- Đặt mức cô lập là read committed
  set transaction isolation level read committed
  -- Bắt đầu giao dịch
  begin transaction
    -- Cập nhật thông tin dịch vụ vào bảng LOAIDICHVU
    update LOAIDICHVU
    set TenDV = @TenDV, MoTa = @MoTa, DongGia = @DongGia
    where MaDV = @MaDV
  -- Kết thúc giao dịch
  commit transaction
end

create procedure sp_CapNhatMatKhau
  @MaNS char(20),
  @MatKhauMoi char(50)
as
begin
  -- Đặt mức cô lập là read committed
  set transaction isolation level read committed
  -- Bắt đầu giao dịch
  begin transaction
    -- Cập nhật mật khẩu mới cho nha sĩ CCC vào bảng NHASI
    update NHASI
    set MatKhau = @MatKhauMoi
    where MaNS = @MaNS
    -- Gửi mật khẩu mới cho nha sĩ CCC qua email
    exec sp_GuiEmail @MaNS, @MatKhauMoi
  -- Kết thúc giao dịch
  commit transaction
end

CREATE PROCEDURE DangKyTaiKhoan
  @MaKH char(20), 
  @SoDT char(15), 
  @HoTen nvarchar(50), 
  @Phai char(1), 
  @NgaySinh datetime, 
  @DiaChi nvarchar(100), 
  @MatKhau char(50), 
  @Email varchar(40)
AS
BEGIN
  -- Bắt đầu giao dịch
  BEGIN TRANSACTION
    -- Kiểm tra xem email đã tồn tại chưa
    IF NOT EXISTS (SELECT * FROM KHACHHANG WHERE Email = @Email)
    BEGIN
      -- Nếu chưa tồn tại, thêm mới khách hàng RR vào bảng KHACHHANG
      INSERT INTO KHACHHANG (MaKH, SoDT, HoTen, Phai, NgaySinh, DiaChi, MatKhau, Email)
      VALUES (@MaKH, @SoDT, @HoTen, @Phai, @NgaySinh, @DiaChi, @MatKhau, @Email)
      -- Gửi email xác nhận cho khách hàng RR
      EXEC GửiEmailXacNhan @Email
      -- Kết thúc giao dịch thành công
      COMMIT TRANSACTION
    END
    ELSE
    BEGIN
      -- Nếu email đã tồn tại, hủy giao dịch và thông báo lỗi
      ROLLBACK TRANSACTION
      RAISERROR ('Email đã được sử dụng', 16, 1)
    END
END

-- Procedure đăng nhập cho nhân viên
CREATE PROCEDURE DangNhap_NhanVien
  @TenDangNhap char(50),
  @MatKhau char(50),
  @KetQua int OUTPUT
AS
BEGIN
  -- Khởi tạo biến transaction
  DECLARE @TranName varchar(20)
  SELECT @TranName = 'DangNhap_NhanVien'

  -- Bắt đầu transaction
  BEGIN TRANSACTION @TranName
    -- Kiểm tra tên đăng nhập và mật khẩu có hợp lệ không
    IF EXISTS (SELECT * FROM NHANVIEN WHERE TenDangNhap = @TenDangNhap AND MatKhau = @MatKhau)
    BEGIN
      -- Nếu hợp lệ, trả về kết quả là 1
      SET @KetQua = 1
      -- Kết thúc transaction
      COMMIT TRANSACTION @TranName
    END
    ELSE
    BEGIN
      -- Nếu không hợp lệ, trả về kết quả là 0
      SET @KetQua = 0
      -- Hủy transaction
      ROLLBACK TRANSACTION @TranName
    END
END
GO

-- Procedure đăng nhập cho nha sĩ
CREATE PROCEDURE DangNhap_NhaSi
  @TenDangNhap char(50),
  @MatKhau char(50),
  @KetQua int OUTPUT
AS
BEGIN
  -- Khởi tạo biến transaction
  DECLARE @TranName varchar(20)
  SELECT @TranName = 'DangNhap_NhaSi'

  -- Bắt đầu transaction
  BEGIN TRANSACTION @TranName
    -- Kiểm tra tên đăng nhập và mật khẩu có hợp lệ không
    IF EXISTS (SELECT * FROM NHASI WHERE TenDangNhap = @TenDangNhap AND MatKhau = @MatKhau)
    BEGIN
      -- Nếu hợp lệ, trả về kết quả là 1
      SET @KetQua = 1
      -- Kết thúc transaction
      COMMIT TRANSACTION @TranName
    END
    ELSE
    BEGIN
      -- Nếu không hợp lệ, trả về kết quả là 0
      SET @KetQua = 0
      -- Hủy transaction
      ROLLBACK TRANSACTION @TranName
    END
END
GO

-- Procedure đăng nhập cho quản trị viên
CREATE PROCEDURE DangNhap_QuanTriVien
  @TenDangNhap char(50),
  @MatKhau char(50),
  @KetQua int OUTPUT
AS
BEGIN
  -- Khởi tạo biến transaction
  DECLARE @TranName varchar(20)
  SELECT @TranName = 'DangNhap_QuanTriVien'

  -- Bắt đầu transaction
  BEGIN TRANSACTION @TranName
    -- Kiểm tra tên đăng nhập và mật khẩu có hợp lệ không
    IF EXISTS (SELECT * FROM QUANTRIVIEN WHERE TenDangNhap = @TenDangNhap AND MatKhau = @MatKhau)
    BEGIN
      -- Nếu hợp lệ, trả về kết quả là 1
      SET @KetQua = 1
      -- Kết thúc transaction
      COMMIT TRANSACTION @TranName
    END
    ELSE
    BEGIN
      -- Nếu không hợp lệ, trả về kết quả là 0
      SET @KetQua = 0
      -- Hủy transaction
      ROLLBACK TRANSACTION @TranName
    END
END
GO

-- Procedure xem thông tin cá nhân cho nhân viên
CREATE PROCEDURE XemThongTin_NhanVien
  @MaNV char(20),
  @HoTen nvarchar(100) OUTPUT,
  @Phai char(1) OUTPUT,
  @TenDangNhap char(50) OUTPUT,
  @MatKhau char(50) OUTPUT
AS
BEGIN
  -- Khởi tạo biến transaction
  DECLARE @TranName varchar(20)
  SELECT @TranName = 'XemThongTin_NhanVien'

  -- Bắt đầu transaction
  BEGIN TRANSACTION @TranName
    -- Lấy thông tin nhân viên theo mã nhân viên
    SELECT @HoTen = HoTen, @Phai = Phai, @TenDangNhap = TenDangNhap, @MatKhau = MatKhau
    FROM NHANVIEN
    WHERE MaNV = @MaNV

    -- Kiểm tra xem có lấy được thông tin không
    IF @@ROWCOUNT = 1
    BEGIN
      -- Nếu có, kết thúc transaction
      COMMIT TRANSACTION @TranName
    END
    ELSE
    BEGIN
      -- Nếu không, hủy transaction
      ROLLBACK TRANSACTION @TranName
    END
END
GO



-- Procedure xem thông tin cá nhân cho quản trị viên
CREATE PROCEDURE XemThongTin_QuanTriVien
  @MaQTV char(20),
  @HoTen nvarchar(100) OUTPUT,
  @Phai char(1) OUTPUT,
  @TenDangNhap char(50) OUTPUT,
  @MatKhau char(50) OUTPUT
AS
BEGIN
  -- Khởi tạo biến transaction
  DECLARE @TranName varchar(20)
  SELECT @TranName = 'XemThongTin_QuanTriVien'

  -- Bắt đầu transaction
  BEGIN TRANSACTION @TranName
    -- Lấy thông tin quản trị viên theo mã quản trị viên
    SELECT @HoTen = HoTen, @Phai = Phai, @TenDangNhap = TenDangNhap, @MatKhau = MatKhau
    FROM QUANTRIVIEN
    WHERE MaQTV = @MaQTV

    -- Kiểm tra xem có lấy được thông tin không
    IF @@ROWCOUNT = 1
    BEGIN
      -- Nếu có, kết thúc transaction
      COMMIT TRANSACTION @TranName
    END
    ELSE
    BEGIN
      -- Nếu không, hủy transaction
      ROLLBACK TRANSACTION @TranName
    END
END
GO

-- Procedure cập nhật thông tin cá nhân cho quản trị viên
CREATE PROCEDURE CapNhatThongTin_QuanTriVien
  @MaQTV char(20),
  @HoTen nvarchar(100),
  @Phai char(1),
  @TenDangNhap char(50),
  @MatKhau char(50),
  @KetQua int OUTPUT
AS
BEGIN
  -- Khởi tạo biến transaction
  DECLARE @TranName varchar(20)
  SELECT @TranName = 'CapNhatThongTin_QuanTriVien'

  -- Bắt đầu transaction
  BEGIN TRANSACTION @TranName
    -- Cập nhật thông tin quản trị viên theo mã quản trị viên
    UPDATE QUANTRIVIEN
    SET HoTen = @HoTen, Phai = @Phai, TenDangNhap = @TenDangNhap, MatKhau = @MatKhau
    WHERE MaQTV = @MaQTV

    -- Kiểm tra xem có cập nhật được thông tin không
    IF @@ROWCOUNT = 1
    BEGIN
      -- Nếu có, trả về kết quả là 1
      SET @KetQua = 1
      -- Kết thúc transaction
      COMMIT TRANSACTION @TranName
    END
    ELSE
    BEGIN
      -- Nếu không, trả về kết quả là 0
      SET @KetQua = 0
      -- Hủy transaction
      ROLLBACK TRANSACTION @TranName
    END
END
GO

-- Procedure hủy lịch hẹn khách hàng
CREATE PROCEDURE HuyLichHen_Khachhang
  @MaSoHen char(20),
  @KetQua int OUTPUT
AS
BEGIN
  -- Khởi tạo biến transaction
  DECLARE @TranName varchar(20)
  SELECT @TranName = 'HuyLichHen'

  -- Bắt đầu transaction
  BEGIN TRANSACTION @TranName
    -- Lấy mã nha sĩ, ngày giờ khám và số thứ tự từ bảng LICHHEN theo mã số hẹn
    DECLARE @MaNS char(20), @NgayGioKham datetime, @STT int
    SELECT @MaNS = MaNS, @NgayGioKham = NgayGioKham
    FROM LICHHEN
    WHERE MaSoHen = @MaSoHen

    -- Kiểm tra xem có lấy được thông tin không
    IF @@ROWCOUNT = 1
    BEGIN
      -- Nếu có, tìm số thứ tự tương ứng trong bảng LICHNHASI theo mã nha sĩ và ngày giờ khám
      SELECT @STT = STT
      FROM LICHNHASI
      WHERE MaNS = @MaNS AND GioBatDau <= @NgayGioKham AND GioKetThuc >= @NgayGioKham

      -- Kiểm tra xem có tìm được số thứ tự không
      IF @@ROWCOUNT = 1
      BEGIN
        -- Nếu có, cập nhật tình trạng cuộc hẹn trong bảng LICHNHASI thành 'ChuaHen'
        UPDATE LICHNHASI
        SET TinhTrangCuocHen = 'ChuaHen'
        WHERE MaNS = @MaNS AND STT = @STT

        -- Kiểm tra xem có cập nhật được tình trạng không
        IF @@ROWCOUNT = 1
        BEGIN
          -- Nếu có, xóa bản ghi trong bảng LICHHEN theo mã số hẹn
          DELETE FROM LICHHEN
          WHERE MaSoHen = @MaSoHen

          -- Kiểm tra xem có xóa được bản ghi không
          IF @@ROWCOUNT = 1
          BEGIN
            -- Nếu có, trả về kết quả là 1
            SET @KetQua = 1
            -- Kết thúc transaction
            COMMIT TRANSACTION @TranName
          END
          ELSE
          BEGIN
            -- Nếu không, trả về kết quả là 0
            SET @KetQua = 0
            -- Hủy transaction
            ROLLBACK TRANSACTION @TranName
          END
        END
        ELSE
        BEGIN
          -- Nếu không, trả về kết quả là 0
          SET @KetQua = 0
          -- Hủy transaction
          ROLLBACK TRANSACTION @TranName
        END
      END
      ELSE
      BEGIN
        -- Nếu không, trả về kết quả là 0
        SET @KetQua = 0
        -- Hủy transaction
        ROLLBACK TRANSACTION @TranName
      END
    END
    ELSE
    BEGIN
      -- Nếu không, trả về kết quả là 0
      SET @KetQua = 0
      -- Hủy transaction
      ROLLBACK TRANSACTION @TranName
    END
END
GO

-- Procedure xem danh sách người dùng
CREATE PROCEDURE XemDanhSachNguoiDung
  @LoaiNguoiDung char(10),
  @DanhSach table OUTPUT
AS
BEGIN
  -- Khởi tạo biến transaction
  DECLARE @TranName varchar(20)
  SELECT @TranName = 'XemDanhSachNguoiDung'

  -- Bắt đầu transaction
  BEGIN TRANSACTION @TranName
    -- Kiểm tra loại người dùng là khách hàng hay nhân viên
    IF @LoaiNguoiDung = 'KhachHang'
    BEGIN
      -- Nếu là khách hàng, lấy danh sách khách hàng từ bảng KHACHHANG
      SELECT * INTO @DanhSach
      FROM KHACHHANG
      -- Kết thúc transaction
      COMMIT TRANSACTION @TranName
    END
    ELSE IF @LoaiNguoiDung = 'NhanVien'
    BEGIN
      -- Nếu là nhân viên, lấy danh sách nhân viên từ bảng NHANVIEN
      SELECT * INTO @DanhSach
      FROM NHANVIEN
      -- Kết thúc transaction
      COMMIT TRANSACTION @TranName
    END
    ELSE
    BEGIN
      -- Nếu không phải hai loại trên, trả về danh sách rỗng
      SELECT * INTO @DanhSach
      FROM KHACHHANG
      WHERE 1 = 0
      -- Hủy transaction
      ROLLBACK TRANSACTION @TranName
    END
END
GO

-- Procedure sửa thông tin người dùng
CREATE PROCEDURE SuaThongTinNguoiDung
  @LoaiNguoiDung char(10),
  @Ma char(20),
  @SoDT char(15),
  @HoTen nvarchar(50),
  @Phai char(1),
  @NgaySinh datetime,
  @DiaChi nvarchar(100),
  @MatKhau char(50),
  @Email varchar(40),
  @TenDangNhap char(50),
  @KetQua int OUTPUT
AS
BEGIN
  -- Khởi tạo biến transaction
  DECLARE @TranName varchar(20)
  SELECT @TranName = 'SuaThongTinNguoiDung'

  -- Bắt đầu transaction
  BEGIN TRANSACTION @TranName
    -- Kiểm tra loại người dùng là khách hàng hay nhân viên
    IF @LoaiNguoiDung = 'KhachHang'
    BEGIN
      -- Nếu là khách hàng, cập nhật thông tin khách hàng theo mã khách hàng và số điện thoại
      UPDATE KHACHHANG
      SET HoTen = @HoTen, Phai = @Phai, NgaySinh = @NgaySinh, DiaChi = @DiaChi, MatKhau = @MatKhau, Email = @Email
      WHERE MaKH = @Ma AND SoDT = @SoDT

      -- Kiểm tra xem có cập nhật được thông tin không
      IF @@ROWCOUNT = 1
      BEGIN
        -- Nếu có, trả về kết quả là 1
        SET @KetQua = 1
        -- Kết thúc transaction
        COMMIT TRANSACTION @TranName
      END
      ELSE
      BEGIN
        -- Nếu không, trả về kết quả là 0
        SET @KetQua = 0
        -- Hủy transaction
        ROLLBACK TRANSACTION @TranName
      END
    END
    ELSE IF @LoaiNguoiDung = 'NhanVien'
    BEGIN
      -- Nếu là nhân viên, cập nhật thông tin nhân viên theo mã nhân viên
      UPDATE NHANVIEN
      SET HoTen = @HoTen, Phai = @Phai, TenDangNhap = @TenDangNhap, MatKhau = @MatKhau
      WHERE MaNV = @Ma

      -- Kiểm tra xem có cập nhật được thông tin không
      IF @@ROWCOUNT = 1
      BEGIN
        -- Nếu có, trả về kết quả là 1
        SET @KetQua = 1
        -- Kết thúc transaction
        COMMIT TRANSACTION @TranName
      END
      ELSE
      BEGIN
        -- Nếu không, trả về kết quả là 0
        SET @KetQua = 0
        -- Hủy transaction
        ROLLBACK TRANSACTION @TranName
      END
    END
    ELSE
    BEGIN
      -- Nếu không phải hai loại trên, trả về kết quả là 0
      SET @KetQua = 0
      -- Hủy transaction
      ROLLBACK TRANSACTION @TranName
    END
END
GO

-- Procedure xóa thông tin người dùng
CREATE PROCEDURE XoaThongTinNguoiDung
  @LoaiNguoiDung char(10),
  @Ma char(20),
  @SoDT char(15),
  @KetQua int OUTPUT
AS
BEGIN
  -- Khởi tạo biến transaction
  DECLARE @TranName varchar(20)
  SELECT @TranName = 'XoaThongTinNguoiDung'

  -- Bắt đầu transaction
  BEGIN TRANSACTION @TranName
    -- Kiểm tra loại người dùng là khách hàng hay nhân viên
    IF @LoaiNguoiDung = 'KhachHang'
    BEGIN
      -- Nếu là khách hàng, xóa thông tin khách hàng theo mã khách hàng và số điện thoại
      DELETE FROM KHACHHANG
      WHERE MaKH = @Ma AND SoDT = @SoDT

      -- Kiểm tra xem có xóa được thông tin không
      IF @@ROWCOUNT = 1
      BEGIN
        -- Nếu có, trả về kết quả là 1
        SET @KetQua = 1
        -- Kết thúc transaction
        COMMIT TRANSACTION @TranName
      END
      ELSE
      BEGIN
        -- Nếu không, trả về kết quả là 0
        SET @KetQua = 0
        -- Hủy transaction
        ROLLBACK TRANSACTION @TranName
      END
    END
    ELSE IF @LoaiNguoiDung = 'NhanVien'
    BEGIN
      -- Nếu là nhân viên, xóa thông tin nhân viên theo mã nhân viên
      DELETE FROM NHANVIEN
      WHERE MaNV = @Ma

      -- Kiểm tra xem có xóa được thông tin không
      IF @@ROWCOUNT = 1
      BEGIN
        -- Nếu có, trả về kết quả là 1
        SET @KetQua = 1
        -- Kết thúc transaction
        COMMIT TRANSACTION @TranName
      END
      ELSE
      BEGIN
        -- Nếu không, trả về kết quả là 0
        SET @KetQua = 0
        -- Hủy transaction
        ROLLBACK TRANSACTION @TranName
      END
    END
    ELSE
    BEGIN
      -- Nếu không phải hai loại trên, trả về kết quả là 0
      SET @KetQua = 0
      -- Hủy transaction
      ROLLBACK TRANSACTION @TranName
    END
END
GO

-- Procedure thêm nhân sự
CREATE PROCEDURE ThemNhanVien
  @MaNV char(20),
  @HoTen nvarchar(100),
  @Phai char(1),
  @TenDangNhap char(50),
  @MatKhau char(50),
  @KetQua int OUTPUT
AS
BEGIN
  -- Khởi tạo biến transaction
  DECLARE @TranName varchar(20)
  SELECT @TranName = 'ThemNhanSu'

  -- Bắt đầu transaction
  BEGIN TRANSACTION @TranName
    -- Thêm thông tin nhân sự vào bảng NHANVIEN
    INSERT INTO NHANVIEN (MaNV, HoTen, Phai, TenDangNhap, MatKhau)
    VALUES (@MaNV, @HoTen, @Phai, @TenDangNhap, @MatKhau)

    -- Kiểm tra xem có thêm được thông tin không
    IF @@ROWCOUNT = 1
    BEGIN
      -- Nếu có, trả về kết quả là 1
      SET @KetQua = 1
      -- Kết thúc transaction
      COMMIT TRANSACTION @TranName
    END
    ELSE
    BEGIN
      -- Nếu không, trả về kết quả là 0
      SET @KetQua = 0
      -- Hủy transaction
      ROLLBACK TRANSACTION @TranName
    END
END
GO










