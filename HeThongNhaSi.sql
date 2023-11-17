create database PHONGKHAMNHASI

go

use PHONGKHAMNHASI

go

create table LOAIDICHVU
(
  MaDV char(10),
  TenDV nvarchar(40),
  MoTa nvarchar(100),
  DongGia bigint,
  constraint PK_MaDV primary key(MaDV)
)

go

create table CHITIETDV
(
  MaDV char(10),
  MaKH char(20),
  STT int,
  SoDT char(15),
  SoLuong float,
  constraint PK_MaDV_STT_SoDT primary key(MaDV,MaKH,STT,SoDT)
)

go

create table NHASI
(
  MaNS char(20),
  TenDangNhap char(50),
  HoTen nvarchar(50),
  Phai CHAR(1) CHECK(Phai IN ('M', 'F')),
  GioiThieu nvarchar(300),
  MatKhau char(50),
  constraint PK_MaNS primary key(MaNS)
)

go

create table KHACHHANG
(
  MaKH char(20),
  SoDT char(15),
  HoTen nvarchar(50),
  Phai CHAR(1) CHECK(Phai IN ('M', 'F')),
  NgaySinh datetime,
  DiaChi nvarchar(100),
  MatKhau char(50),
  Email varchar(40),
  constraint PK_SoDT_MaKH primary key(MaKH,SoDT)
)



go

create table LICHHEN
(
  MaSoHen char(20),
  NgayGioKham datetime,
  LyDoKham nvarchar(100),
  MaNS char(20),
  MaKH char(20),
  SoDT char(15),
  constraint PK_MaSoHen primary key(MaSoHen)
)

create table LOAITHUOC
(
  MaThuoc char(30),
  TenThuoc nvarchar(100),
  DonViTinh nvarchar(100),
  ChiDinh nvarchar(200),
  SoLuong int,
  NgayHetHan date,
  GiaThuoc bigint,
  constraint PK_MaThuoc primary key(MaThuoc)
)

create table HOSOBENH
(
  MaKH char(20),
  SoDT char(15),
  STT int,
  NgayKham datetime,
  DanDo nvarchar(300),
  MaNS char(20),
  TinhTrangXuatHoaDon CHAR(10) CHECK (TinhTrangXuatHoaDon IN ('DaXuat', 'ChuaXuat')),
  constraint PK_SoDT_STT primary key(MaKH,SoDT,STT)
)

create table LICHNHASI
(
  MaNS char(20),
  STT int,
  GioBatDau datetime,
  GioKetThuc datetime,
  TinhTrangCuocHen CHAR(20) CHECK (TinhTrangCuocHen IN ('DaHen', 'ChuaHen')),
  constraint PK_MaNS_STT primary key(MaNS,STT)
)

create table NHANVIEN
(
  MaNV char(20),
  HoTen nvarchar(100),
  Phai CHAR(1) CHECK(Phai IN ('M', 'F')),
  TenDangNhap char(50),
  MatKhau char(50),
  constraint PK_NHANVIEN primary key(MaNV)
)

create table QUANTRIVIEN
(
  MaQTV char(20),
  HoTen nvarchar(100),
  Phai CHAR(1) CHECK(Phai IN ('M', 'F')),
  TenDangNhap char(50),
  MatKhau char(50),
  constraint PK_MaQTV primary key(MaQTV)
)


create table CHITIETTHUOC
(
  MaThuoc char(30),
  MaKH char(20),
  SoDT char(15),
  STT int,
  SoLuong int,
  ThoiDiemDung nvarchar(50),
  constraint PK_MaThuoc_STT_SoDT primary key(MaThuoc,MaKH,SoDT,STT)
)

create table HOADON
(
  MaHoaDon char(20),
  MaKH char(20),
  SoDT char(15),
  STT int,
  NgayXuat datetime,
  TongChiPhi bigint,
  TinhTrangThanhToan char(30) check (TinhTrangThanhToan in ('DaThanhToan','ChuaThanhToan')),
  MaNV char(20),
  MaDV char(10),
  constraint PK_MaKH_STT_SoDT primary key(MaHoaDon,MaKH,STT,SoDT)
)

UPDATE KHACHHANG
SET HoTen = N'Lý Công Hoàng Anh'
WHERE MaKH = 'KH02' AND SoDT = '0344805188';

ALTER TABLE HOADON
ADD CONSTRAINT FK_HOADON_HOSOBENH foreign key(MaKH,SoDT,STT) references HOSOBENH(MaKH,SoDT,STT)

ALTER TABLE HOADON
ADD CONSTRAINT FK_HOADON_NHANVIEN foreign key(MaNV) references NHANVIEN(MaNV)

ALTER TABLE HOADON
ADD CONSTRAINT FK_HOADON_LOAIDICHVU FOREIGN KEY(MaDV) REFERENCES LOAIDICHVU(MaDV);

ALTER TABLE CHITIETTHUOC
ADD CONSTRAINT FK_CHITIETTHUOC_HOSOBENH foreign key(MaKH,SoDT,STT) references HOSOBENH(MaKH,SoDT,STT)

ALTER TABLE CHITIETTHUOC
ADD CONSTRAINT FK_CHITIETTHUOC_LOAITHUOC foreign key(MaThuoc) references LOAITHUOC(MaThuoc)


ALTER TABLE LICHNHASI
ADD CONSTRAINT FK_LICHNHASI_NHASI foreign key(MaNS) references NHASI(MaNS)


ALTER TABLE HOSOBENH
ADD CONSTRAINT FK_HOSOBENH_KHACHHANG foreign key(MaKH,SoDT) references KHACHHANG(MaKH,SoDT)


ALTER TABLE HOSOBENH
ADD CONSTRAINT FK_HOSOBENH_NHASI foreign key(MaNS) references NHASI(MaNS)


ALTER TABLE LICHHEN
ADD CONSTRAINT FK_LICHHEN_LOAIDICHVU foreign key(MaNS) references NHASI(MaNS)

ALTER TABLE LICHHEN
ADD CONSTRAINT FK_LICHHEN_KHACHHANG foreign key(MaKH, SoDT) references KHACHHANG(MaKH, SoDT)


ALTER TABLE CHITIETDV
ADD CONSTRAINT FK_CHITIETDV_LOAIDICHVU foreign key(MaDV) references LOAIDICHVU(MaDV)

ALTER TABLE CHITIETDV
ADD CONSTRAINT FK_CHITIETDV_HOSOBENH foreign key(MaKH,SoDT,STT) references HOSOBENH(MaKH,SoDT,STT)

go

--/////////////////////////////////////////////////////////////////////////////////////////////////////////

-- Trigger cho bảng "Khách hàng"
CREATE TRIGGER CheckKhachHang
ON KHACHHANG
INSTEAD OF INSERT
AS
BEGIN
  -- Declare variables to store the values of MaKH and SoDT from the inserted table
  DECLARE @MaKH char(20), @SoDT char(15)
  -- Set the isolation level to serializable to prevent phantom reads
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
  -- Begin a transaction
  BEGIN TRANSACTION
  -- Get the values of MaKH and SoDT from the inserted table
  SELECT @MaKH = MaKH, @SoDT = SoDT
  FROM inserted
  -- Check if the customer ID is unique
  IF EXISTS (SELECT *
  FROM KHACHHANG WITH (XLOCK,ROWLOCK)
  WHERE MaKH = @MaKH)
    BEGIN
    -- Rollback the transaction and raise an error
    ROLLBACK TRANSACTION
    RAISERROR ('Mã khách hàng đã tồn tại.', 16, 1)
    RETURN
  END
  -- Check if the phone number is unique
  IF EXISTS (SELECT *
  FROM KHACHHANG WITH (XLOCK,ROWLOCK)
  WHERE SoDT = @SoDT)
    BEGIN
    -- Rollback the transaction and raise an error
    ROLLBACK TRANSACTION
    RAISERROR ('Số điện thoại đã tồn tại.', 16, 1)
    RETURN
  END
  -- Check if there are no NULL values
  IF EXISTS (SELECT *
  FROM inserted
  WHERE HoTen IS NULL OR NgaySinh IS NULL OR DiaChi IS NULL OR SoDT IS NULL OR MatKhau IS NULL OR Email IS NULL)
    BEGIN
    -- Rollback the transaction and raise an error
    ROLLBACK TRANSACTION
    RAISERROR ('Không được để trống các giá trị.', 16, 1)
    RETURN
  END
  -- Insert the data from the inserted table into KHACHHANG table
  INSERT INTO KHACHHANG
    (MaKH, SoDT, HoTen, Phai, NgaySinh, DiaChi, MatKhau, Email)
  SELECT MaKH, SoDT, HoTen, Phai, NgaySinh, DiaChi, MatKhau, Email
  FROM inserted
  -- Commit the transaction
  COMMIT TRANSACTION
END


-- Trigger cho bảng "Nha sĩ"
CREATE TRIGGER CheckNhaSi
ON NHASI
INSTEAD OF INSERT
AS
BEGIN
  -- Bắt đầu giao tác
  BEGIN TRANSACTION;
  -- Đặt mức cô lập SERIALIZABLE
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

  -- Kiểm tra xem MaNS đã tồn tại trong NHASI chưa
  IF EXISTS (
        SELECT 1
  FROM NHASI N WITH (XLOCK,ROWLOCK)
    JOIN INSERTED I ON N.MaNS = I.MaNS
    )
    BEGIN
    RAISERROR ('Mã nha sĩ đã tồn tại.', 16, 1);
    ROLLBACK TRANSACTION;
    RETURN;
  END;

  -- Kiểm tra xem tên đăng nhập có trùng lặp không
  IF EXISTS (
        SELECT 1
  FROM NHASI N WITH (XLOCK,ROWLOCK)
    JOIN INSERTED I ON N.TenDangNhap = I.TenDangNhap
    )
    BEGIN
    RAISERROR ('Tên đăng nhập đã tồn tại.', 16, 1);
    ROLLBACK TRANSACTION;
    RETURN;
  END;

  -- Chèn dữ liệu từ bảng INSERTED vào bảng NHASI nếu họ tên không NULL
  INSERT INTO NHASI
    (MaNS, TenDangNhap, HoTen, Phai, GioiThieu, MatKhau)
  SELECT
    I.MaNS,
    I.TenDangNhap,
    I.HoTen,
    I.Phai,
    I.GioiThieu,
    I.MatKhau
  FROM INSERTED I
  WHERE 
        I.HoTen IS NOT NULL;

  -- Kết thúc giao tác
  COMMIT TRANSACTION;
END;




-- Trigger cho bảng "Thuốc"
CREATE TRIGGER CheckThuoc
ON LOAITHUOC
INSTEAD OF INSERT
AS
BEGIN
  -- Bắt đầu giao tác
  BEGIN TRANSACTION;
  -- Đặt mức cô lập SERIALIZABLE
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

  -- Kiểm tra xem MaThuoc đã tồn tại trong LOAITHUOC chưa
  IF EXISTS (
        SELECT 1
  FROM LOAITHUOC T WITH (XLOCK,ROWLOCK)
    JOIN INSERTED I ON T.MaThuoc = I.MaThuoc
    )
    BEGIN
    RAISERROR ('Mã thuốc đã tồn tại.', 16, 1);
    ROLLBACK TRANSACTION;
    RETURN;
  END;

  DECLARE @Now date;
  SET @Now = GETDATE();

  -- Chèn dữ liệu từ bảng INSERTED vào bảng LOAITHUOC nếu MaThuoc không tồn tại trong LOAITHUOC, SoLuong lớn hơn hoặc bằng 0 và NgayHetHan sau ngày hiện tại
  INSERT INTO LOAITHUOC
    (MaThuoc, TenThuoc, DonViTinh, ChiDinh, SoLuong, NgayHetHan, GiaThuoc)
  SELECT
    I.MaThuoc,
    I.TenThuoc,
    I.DonViTinh,
    I.ChiDinh,
    I.SoLuong,
    I.NgayHetHan,
    I.GiaThuoc
  FROM INSERTED I
  WHERE 
        I.SoLuong >= 0
    AND I.NgayHetHan > @Now;

  -- Kết thúc giao tác
  COMMIT TRANSACTION;
END;


-- Trigger cho bảng "Đặt lịch hẹn" (LICHHEN)
CREATE TRIGGER CheckLichHen
ON LICHHEN
INSTEAD OF INSERT
AS
BEGIN
  -- Bắt đầu giao tác thứ nhất
  BEGIN TRANSACTION;
  -- Đặt mức cô lập SERIALIZABLE
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

  DECLARE @Now datetime;
  SET @Now = GETDATE();

  -- Kiểm tra xem MaSoHen đã tồn tại trong LICHHEN chưa
  IF EXISTS (
        SELECT 1
  FROM LICHHEN L WITH (XLOCK, ROWLOCK)
    JOIN INSERTED I ON L.MaSoHen = I.MaSoHen
    )
    BEGIN
    RAISERROR ('Mã số hẹn đã tồn tại trong lịch hẹn.', 16, 1);
    ROLLBACK TRANSACTION;
    RETURN;
  END;

  -- Kiểm tra xem MaKH đã tồn tại trong KHACHHANG chưa
  IF NOT EXISTS (
        SELECT 1
  FROM KHACHHANG K WITH (XLOCK, ROWLOCK)
    JOIN INSERTED I ON K.MaKH = I.MaKH
    )
    BEGIN
    RAISERROR ('Mã khách hàng không tồn tại trong KHACHHANG.', 16, 1);
    ROLLBACK TRANSACTION;
    RETURN;
  END;

  -- Chèn dữ liệu từ bảng INSERTED vào bảng LICHHEN nếu MaKH tồn tại trong KHACHHANG và NgayGioKham sau thời điểm hiện tại
  INSERT INTO LICHHEN
    (MaSoHen, NgayGioKham, LyDoKham, MaNS, MaKH, SoDT)
  SELECT
    I.MaSoHen,
    I.NgayGioKham,
    I.LyDoKham,
    I.MaNS,
    I.MaKH,
    I.SoDT
  FROM INSERTED I WITH (XLOCK, ROWLOCK)
  WHERE EXISTS (
        SELECT 1
    FROM KHACHHANG K WITH (XLOCK, ROWLOCK)
    WHERE K.MaKH = I.MaKH AND K.SoDT = I.SoDT
    ) AND I.NgayGioKham > @Now;

  -- Kết thúc giao tác thứ nhất
  COMMIT TRANSACTION;

  -- Bắt đầu giao tác thứ hai
  BEGIN TRANSACTION;
  -- Đặt mức cô lập SERIALIZABLE
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

  -- Kiểm tra xem MaNS đã tồn tại trong NHASI chưa
  IF NOT EXISTS (
        SELECT 1
  FROM NHASI N WITH (XLOCK, ROWLOCK)
    JOIN INSERTED I ON N.MaNS = I.MaNS
    )
    BEGIN
    RAISERROR ('Mã nha sĩ không tồn tại trong NHASI.', 16, 1);
    ROLLBACK TRANSACTION;
    RETURN;
  END;

  -- Kết thúc giao tác thứ hai
  COMMIT TRANSACTION;
END;



-- Trigger cho bảng "Quản lý hồ sơ bệnh nhân" (HOSOBENH)
CREATE TRIGGER CheckHosoBenh
ON HOSOBENH
INSTEAD OF INSERT
AS
BEGIN
  -- Bắt đầu giao tác
  BEGIN TRANSACTION;
  -- Đặt mức cô lập SERIALIZABLE
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

  DECLARE @Now datetime;
  SET @Now = GETDATE();

  -- Kiểm tra xem MaNS đã tồn tại trong NHASI chưa
  IF NOT EXISTS (
        SELECT 1
  FROM NHASI N WITH (XLOCK,ROWLOCK)
    JOIN INSERTED I ON N.MaNS = I.MaNS
    )
    BEGIN
    RAISERROR ('Mã nha sĩ không tồn tại trong NHASI.', 16, 1);
    ROLLBACK TRANSACTION;
    RETURN;
  END;

  -- Kiểm tra xem MaKH và SoDT đã tồn tại trong KHACHHANG chưa
  IF NOT EXISTS (
        SELECT 1
  FROM KHACHHANG K WITH (XLOCK,ROWLOCK)
    JOIN INSERTED I ON K.MaKH = I.MaKH AND K.SoDT = I.SoDT
    )
    BEGIN
    RAISERROR ('Mã KH và Số ĐT không tồn tại trong KHACHHANG.', 16, 1);
    ROLLBACK TRANSACTION;
    RETURN;
  END;

  -- Chèn dữ liệu từ bảng INSERTED vào bảng HOSOBENH nếu MaNS tồn tại trong NHASI và NgayKham sau hoặc bằng NgayDK
  INSERT INTO HOSOBENH
    (MaKH, SoDT, STT, NgayKham, DanDo, MaNS, TinhTrangXuatHoaDon)
  SELECT
    I.MaKH,
    I.SoDT,
    I.STT,
    I.NgayKham,
    I.DanDo,
    I.MaNS,
    I.TinhTrangXuatHoaDon
  FROM INSERTED I WITH (XLOCK,ROWLOCK)
  WHERE EXISTS (
        SELECT 1
    FROM NHASI N
    WHERE N.MaNS = I.MaNS
    ) AND EXISTS (
        SELECT 1
    FROM KHACHHANG K
    WHERE K.MaKH = I.MaKH AND K.SoDT = I.SoDT
    ) AND I.NgayKham >= @Now;

  -- Kết thúc giao dịch
  COMMIT TRANSACTION;
END;



--Trigger cho Chi tiết dịch vụ
CREATE TRIGGER Check_Chitietdichvu 
ON CHITIETDV
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
  -- Declare variables to store the values of MaDV from the inserted and deleted tables
  DECLARE @MaDV_Inserted char(10), @MaDV_Deleted char(10)
  -- Set the isolation level to serializable to prevent phantom reads
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
  -- Begin a transaction
  BEGIN TRANSACTION
  -- Check if the trigger is fired by an INSERT or UPDATE statement
  IF EXISTS (SELECT *
  FROM inserted)
    BEGIN
    -- Get the value of MaDV from the inserted table
    SELECT @MaDV_Inserted = MaDV
    FROM inserted
    -- Check if there is a corresponding service in LOAIDICHVU table
    IF NOT EXISTS (SELECT *
    FROM LOAIDICHVU WITH (XLOCK,ROWLOCK)
    WHERE MaDV = @MaDV_Inserted)
      BEGIN
      -- Rollback the transaction and raise an error
      ROLLBACK TRANSACTION
      RAISERROR ('Không có dịch vụ tương ứng trong LOAIDICHVU', 16, 1)
      RETURN
    END
  END
  -- Check if the trigger is fired by a DELETE or UPDATE statement
  IF EXISTS (SELECT *
  FROM deleted)
    BEGIN
    -- Get the value of MaDV from the deleted table
    SELECT @MaDV_Deleted = MaDV
    FROM deleted
    -- Check if there is any other service in CHITIETDV that references the same service in LOAIDICHVU
    IF NOT EXISTS (SELECT *
    FROM CHITIETDV WITH (XLOCK,ROWLOCK)
    WHERE MaDV = @MaDV_Deleted)
      BEGIN
      -- Delete the corresponding service in LOAIDICHVU
      DELETE FROM LOAIDICHVU WHERE MaDV = @MaDV_Deleted
    END
  END
  -- Commit the transaction
  COMMIT TRANSACTION
END

--Trigger cho Loại dịch vụ
CREATE TRIGGER CheckLoaiDichVu
ON LOAIDICHVU
INSTEAD OF INSERT
AS
BEGIN
  -- Bắt đầu giao tác
  BEGIN TRANSACTION;
  -- Đặt mức cô lập SERIALIZABLE
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

  -- Kiểm tra xem MaDV có trùng lặp không
  IF EXISTS (
        SELECT 1
  FROM LOAIDICHVU L WITH (XLOCK,ROWLOCK)
    JOIN INSERTED I ON L.MaDV = I.MaDV
    )
    BEGIN
    RAISERROR ('Mã dịch vụ đã tồn tại.', 16, 1);
    ROLLBACK TRANSACTION;
    RETURN;
  END;

  -- Chèn dữ liệu từ bảng INSERTED vào bảng LOAIDICHVU nếu TenDV không NULL
  INSERT INTO LOAIDICHVU
    (MaDV, TenDV, MoTa, DongGia)
  SELECT
    I.MaDV,
    I.TenDV,
    I.MoTa,
    I.DongGia
  FROM INSERTED I
  WHERE 
        I.TenDV IS NOT NULL;

  -- Kết thúc giao tác
  COMMIT TRANSACTION;
END;

--Trigger cho nhân viên
CREATE TRIGGER CheckNhanVien
ON NHANVIEN
INSTEAD OF INSERT
AS
BEGIN
  DECLARE @MaNV char(20), @TenDangNhap char(50);
  SELECT @MaNV = MaNV, @TenDangNhap = TenDangNhap
  FROM inserted;

  -- Start transaction
  BEGIN TRANSACTION;

  -- Set transaction isolation level
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

  -- Check for duplicate MaNV
  IF EXISTS (SELECT 1
  FROM NHANVIEN WITH (XLOCK, ROWLOCK)
  WHERE MaNV = @MaNV)
  BEGIN
    ROLLBACK TRANSACTION;
    RAISERROR ('Mã NV đã tồn tại', 16, 1);
    RETURN;
  END;

  -- Check for duplicate TenDangNhap
  IF EXISTS (SELECT 1
  FROM NHANVIEN WITH (XLOCK, ROWLOCK)
  WHERE TenDangNhap = @TenDangNhap)
  BEGIN
    ROLLBACK TRANSACTION;
    RAISERROR ('Tên đăng nhập đã tồn tại', 16, 1);
    RETURN;
  END;

  -- If no duplicates, insert the row
  INSERT INTO NHANVIEN
  SELECT *
  FROM inserted;

  -- Commit transaction
  COMMIT TRANSACTION;
END;

--Trigger cho quản trị viên
CREATE TRIGGER CheckQuantrivien
ON QUANTRIVIEN
INSTEAD OF INSERT
AS
BEGIN
  DECLARE @MaQTV char(20), @TenDangNhap char(50);
  SELECT @MaQTV = MaQTV, @TenDangNhap = TenDangNhap
  FROM inserted;

  -- Start transaction
  BEGIN TRANSACTION;

  -- Set transaction isolation level
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

  -- Check for duplicate MaQTV
  IF EXISTS (SELECT 1
  FROM QUANTRIVIEN WITH (XLOCK, ROWLOCK)
  WHERE MaQTV = @MaQTV)
  BEGIN
    ROLLBACK TRANSACTION;
    RAISERROR ('Mã QTV đã tồn tại', 16, 1);
    RETURN;
  END;

  -- Check for duplicate TenDangNhap
  IF EXISTS (SELECT 1
  FROM QUANTRIVIEN WITH (XLOCK, ROWLOCK)
  WHERE TenDangNhap = @TenDangNhap)
  BEGIN
    ROLLBACK TRANSACTION;
    RAISERROR ('Tên đăng nhập đã tồn tại', 16, 1);
    RETURN;
  END;

  -- If no duplicates, insert the row
  INSERT INTO QUANTRIVIEN
  SELECT *
  FROM inserted;

  -- Commit transaction
  COMMIT TRANSACTION;
END;

--trigger cho Hóa đơn
CREATE TRIGGER CheckHoaDon
ON HOADON
INSTEAD OF INSERT
AS
BEGIN
  DECLARE @MaHoaDon char(20);
  SELECT @MaHoaDon = MaHoaDon
  FROM inserted;

  -- Start transaction
  BEGIN TRANSACTION;

  -- Set transaction isolation level
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

  -- Check for duplicate MaHoaDon
  IF EXISTS (SELECT 1
  FROM HOADON WITH (XLOCK, ROWLOCK)
  WHERE MaHoaDon = @MaHoaDon)
  BEGIN
    ROLLBACK TRANSACTION;
    RAISERROR ('Mã hóa đơn đã tồn tại', 16, 1);
    RETURN;
  END;

  -- If no duplicates, insert the row
  INSERT INTO HOADON
  SELECT *
  FROM inserted;

  -- Commit transaction
  COMMIT TRANSACTION;
END;










--STORE PROCEDURE
--Đăng ký tài khoản
CREATE PROCEDURE DangKyTaiKhoan
  @MaKH char(20),
  @SoDT char(15),
  @HoTen nvarchar(50),
  @Phai CHAR(1),
  @NgaySinh datetime,
  @DiaChi nvarchar(100),
  @MatKhau char(50),
  @Email varchar(50)
AS
BEGIN
  -- Khởi tạo biến retry
  DECLARE @retry INT;
  SET @retry = 5;

  WHILE @retry > 0
    BEGIN
    SET @retry = @retry - 1;

    BEGIN TRY
            -- Khởi tạo giao tác
            BEGIN TRANSACTION;

            -- Đặt mức cô lập SERIALIZABLE
            SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

            -- Kiểm tra xem số điện thoại đã tồn tại chưa
            IF EXISTS (SELECT 1
    FROM KHACHHANG WITH (UPDLOCK, HOLDLOCK)
    WHERE SoDT = @SoDT)
            BEGIN
      RAISERROR ('Số điện thoại đã tồn tại.', 16, 1);
      ROLLBACK TRANSACTION;
      RETURN;
    END

            -- Thêm người dùng mới vào cơ sở dữ liệu
            INSERT INTO KHACHHANG
      (MaKH, SoDT, HoTen, Phai, NgaySinh, DiaChi, MatKhau,Email)
    VALUES
      (@MaKH, @SoDT, @HoTen, @Phai, @NgaySinh, @DiaChi, @MatKhau, @Email);

            -- Nếu không có lỗi, commit giao tác
            COMMIT TRANSACTION;

            -- Reset biến retry
            SET @retry = 0;
        END TRY
        BEGIN CATCH
            -- Nếu có lỗi, rollback giao tác
            ROLLBACK TRANSACTION;

            -- Nếu lỗi là do deadlock, thử lại giao tác
            IF ERROR_NUMBER() = 1205 AND @retry > 0
            BEGIN
      WAITFOR DELAY '00:00:05';
      CONTINUE;
    END
            ELSE
            BEGIN
                THROW;
            END
    END CATCH
  END
END;


--Lấy tất cả thông tin tài khoản người khám
CREATE PROCEDURE GetAllUsers
AS
BEGIN
  DECLARE @retry INT;
  SET @retry = 5;

  WHILE @retry > 0
    BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
            DECLARE @users TABLE (
      MaKH NVARCHAR(50),
      SoDT NVARCHAR(50),
      HoTen NVARCHAR(50),
      Phai NVARCHAR(50),
      NgaySinh DATETIME,
      DiaChi NVARCHAR(50),
      MatKhau NVARCHAR(50),
      Email NVARCHAR(50)
            );

            INSERT INTO @users
    SELECT *
    FROM KHACHHANG WITH (TABLOCKX)
    ORDER BY MaKH;

			WAITFOR DELAY '00:00:01';

            COMMIT TRANSACTION; 

            SELECT *
    FROM @users;

            SET @retry = 0;
        END TRY
        BEGIN CATCH
            SET @retry = @retry - 1;
            ROLLBACK TRANSACTION;
        END CATCH
  END
END;


--cập nhật thông tin người khám
CREATE PROCEDURE UpdateUserInfo
  @MaKH char(20),
  @HoTen nvarchar(50),
  @Phai char(1),
  @NgaySinh datetime,
  @DiaChi nvarchar(100)
AS
BEGIN
  -- Khởi tạo giao tác
  BEGIN TRANSACTION;
  BEGIN TRY
        -- Đặt mức cô lập
        SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
        
        -- Cập nhật thông tin người dùng
        UPDATE KHACHHANG WITH (UPDLOCK,HOLDLOCK)
        SET HoTen = ISNULL(@HoTen, HoTen),
            Phai = ISNULL(@Phai, Phai),
            NgaySinh = ISNULL(@NgaySinh, NgaySinh),
            DiaChi = ISNULL(@DiaChi, DiaChi)
        WHERE MaKH = @MaKH;
        
        -- Nếu không có lỗi, commit giao tác
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Nếu có lỗi, rollback giao tác
        ROLLBACK TRANSACTION;
        -- Nếu có deadlock, thử lại giao tác
        IF ERROR_NUMBER() = 1205
        BEGIN
    WAITFOR DELAY '00:00:05';
    EXEC UpdateUserInfo @MaKH, @HoTen, @Phai, @NgaySinh, @DiaChi;
  END
    END CATCH
END;




--Phân quyền code mẫu
USE MASTER;
GO
CREATE LOGIN AW_UserThuong
	WITH PASSWORD = 'AW_UserThuong',
	CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF,
	DEFAULT_DATABASE = PHONGKHAMNHASI
GO

USE PHONGKHAMNHASI
GO
CREATE USER AW_UserThuong
	for login AW_UserThuong
GO

USE PHONGKHAMNHASI
GO
GRANT SELECT, INSERT, DELETE, UPDATE 
ON BANGGIDO TO AW_UserThuong


--Phân quyền nha sĩ(chưa xong)
USE MASTER;
GO
CREATE LOGIN NS01
	WITH PASSWORD = '123456',
	CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF,
	DEFAULT_DATABASE = PHONGKHAMNHASI
GO

USE PHONGKHAMNHASI
GO
CREATE USER NS01
	for login NS01
GO

-- Phân quyền cho nha sĩ thêm hồ sơ bệnh nhân
GRANT SELECT,INSERT,DELETE,UPDATE ON HOSOBENH TO NS01

-- Phân quyền cho nha sĩ ghi nhận thông tin khám bệnh
GRANT INSERT ON ThongTinKhamBenh TO NhaSi

-- Phân quyền cho nha sĩ xem lịch hẹn của mình
GRANT SELECT ON LichHen TO NhaSi


-- Phân quyền cho nha sĩ thêm lịch hẹn của mình
GRANT INSERT ON LichHen TO NhaSi

-- Phân quyền cho nha sĩ cập nhật lịch cá nhân của mình
GRANT SELECT,INSERT,DELETE,UPDATE ON LichNHASI TO NS01


--Phân quyền người dùng
USE MASTER;
GO
CREATE LOGIN KH02
WITH PASSWORD = 'password113',
CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF,
DEFAULT_DATABASE = PHONGKHAMNHASI
GO

USE PHONGKHAMNHASI
GO
CREATE USER KH02
for login KH02
GO

USE PHONGKHAMNHASI
GO
GRANT SELECT, UPDATE 
ON KHACHHANG TO KH02

USE PHONGKHAMNHASI
GO
GRANT SELECT,UPDATE
ON LICHHEN TO KH02
GO

USE PHONGKHAMNHASI
GO
GRANT SELECT
ON HOSOBENH TO KH02
GO

USE PHONGKHAMNHASI
GO
GRANT SELECT
ON NHASI TO KH02
GO

GRANT EXECUTE ON UpdateUserInfo TO KH02




--Procedure khách hàng đăng kí thông tin
CREATE PROCEDURE DangKiThongTin
  @MaKH char(20),
  @SoDT char(15),
  @HoTen nvarchar(50),
  @Phai CHAR(1),
  @NgaySinh datetime,
  @DiaChi nvarchar(100),
  @MatKhau char(50),
  @Email varchar(50)
AS
BEGIN
  DECLARE @retry INT;
  SET @retry = 5;

  WHILE @retry > 0
    BEGIN
    SET @retry = @retry - 1;

    BEGIN TRY
            BEGIN TRANSACTION;

            SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

            -- Kiểm tra xem số điện thoại đã tồn tại chưa
            IF EXISTS (SELECT 1
    FROM KHACHHANG WITH (UPDLOCK, HOLDLOCK)
    WHERE SoDT = @SoDT)
            BEGIN
      RAISERROR ('Số điện thoại đã tồn tại.', 16, 1);
      ROLLBACK TRANSACTION;
      RETURN;
    END

            -- Thêm người dùng mới vào cơ sở dữ liệu
            INSERT INTO KHACHHANG
      (MaKH, SoDT, HoTen, Phai, NgaySinh, DiaChi, MatKhau,Email)
    VALUES
      (@MaKH, @SoDT, @HoTen, @Phai, @NgaySinh, @DiaChi, @MatKhau, @Email);

            COMMIT TRANSACTION;

            SET @retry = 0;
        END TRY
        BEGIN CATCH
            ROLLBACK TRANSACTION;

            IF ERROR_NUMBER() = 1205 AND @retry > 0
            BEGIN
      WAITFOR DELAY '00:00:05';
      CONTINUE;
    END
            ELSE
            BEGIN
                THROW;
            END
    END CATCH
  END
END;

--Procedure khách hàng đăng kí lịch hẹn
CREATE PROCEDURE DangKiLichHen
  @NgayGioKham datetime,
  @LyDoKham nvarchar(100),
  @MaNS char(20),
  @MaKH char(20),
  @SoDT char(15)
AS
BEGIN
  DECLARE @retry INT;
  SET @retry = 5;

  WHILE @retry > 0
  BEGIN
    SET @retry = @retry - 1;

    BEGIN TRY
      BEGIN TRANSACTION;

      SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

      -- Tạo mã số hẹn
      DECLARE @MaSoHen char(20);
      SET @MaSoHen = NEWID();

      INSERT INTO LICHHEN
      (MaSoHen, NgayGioKham, LyDoKham, MaNS, MaKH, SoDT)
    VALUES
      (@MaSoHen, @NgayGioKham, @LyDoKham, @MaNS, @MaKH, @SoDT);

      COMMIT TRANSACTION;

      SET @retry = 0;
    END TRY
    BEGIN CATCH
      ROLLBACK TRANSACTION;

      IF ERROR_NUMBER() = 1205 AND @retry > 0
      BEGIN
      WAITFOR DELAY '00:00:05';
      CONTINUE;
    END
      ELSE
      BEGIN
        THROW;
      END
    END CATCH
  END
END;

--Procedure khách hàng hủy lịch hẹn (được phép hủy trước 2h so với thời gian hẹn)
CREATE PROCEDURE HuyLichHen
  @MaSoHen char(20)
AS
BEGIN
  DECLARE @retry INT;
  SET @retry = 5;

  WHILE @retry > 0
  BEGIN
    SET @retry = @retry - 1;

    BEGIN TRY
      BEGIN TRANSACTION;

      SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

      IF NOT EXISTS (SELECT 1
    FROM LICHHEN WITH (UPDLOCK, HOLDLOCK)
    WHERE MaSoHen = @MaSoHen)
      BEGIN
      RAISERROR ('Mã số hẹn không tồn tại.', 16, 1);
      ROLLBACK TRANSACTION;
      RETURN;
    END

      -- Kiểm tra xem mã số hẹn có thể hủy không
      IF NOT EXISTS (SELECT 1
    FROM LICHHEN WITH (UPDLOCK, HOLDLOCK)
    WHERE MaSoHen = @MaSoHen AND NgayGioKham > DATEADD(HOUR, 2, GETDATE()))
      BEGIN
      RAISERROR ('Không thể hủy lịch hẹn.', 16, 1);
      ROLLBACK TRANSACTION;
      RETURN;
    END

      DELETE FROM LICHHEN WHERE MaSoHen = @MaSoHen;

      COMMIT TRANSACTION;

      SET @retry = 0;
    END TRY
    BEGIN CATCH
      ROLLBACK TRANSACTION;

      IF ERROR_NUMBER() = 1205 AND @retry > 0
      BEGIN
      WAITFOR DELAY '00:00:05';
      CONTINUE;
    END
      ELSE
      BEGIN
        THROW;
      END
    END CATCH
  END
END;

--Procedure khách hàng/ nha sĩ xem hồ sơ bệnh án
CREATE PROCEDURE XemHoSoBenh
  @MaKH char(20),
  @SoDT char(15)
AS
BEGIN
  DECLARE @retry INT;
  SET @retry = 5;

  WHILE @retry > 0
  BEGIN
    SET @retry = @retry - 1;

    BEGIN TRY
      BEGIN TRANSACTION;

      SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

      IF NOT EXISTS (SELECT 1
    FROM KHACHHANG WITH (UPDLOCK, HOLDLOCK)
    WHERE MaKH = @MaKH AND SoDT = @SoDT)
      BEGIN
      RAISERROR ('Mã khách hàng không tồn tại.', 16, 1);
      ROLLBACK TRANSACTION;
      RETURN;
    END

      -- Lấy thông tin hồ sơ bệnh án
      SELECT *
    FROM HOSOBENH
    WHERE MaKH = @MaKH AND SoDT = @SoDT;

      COMMIT TRANSACTION;

      SET @retry = 0;
    END TRY
    BEGIN CATCH
      ROLLBACK TRANSACTION;

      IF ERROR_NUMBER() = 1205 AND @retry > 0
      BEGIN
      WAITFOR DELAY '00:00:05';
      CONTINUE;
    END
      ELSE
      BEGIN
        THROW;
      END
    END CATCH
  END
END;

