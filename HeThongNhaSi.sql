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
  MaDV char(10),
  MaThuoc char(30),
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

ALTER TABLE HOSOBENH
ADD CONSTRAINT FK_HOSOBENH_LOAITHUOC foreign key(MaThuoc) references LOAITHUOC(MaThuoc)

ALTER TABLE HOSOBENH
ADD CONSTRAINT FK_HOSOBENH_LOAIDICHVU foreign key(MaDV) references LOAIDICHVU(MaDV)



ALTER TABLE LICHHEN
ADD CONSTRAINT FK_LICHHEN_LOAIDICHVU foreign key(MaNS) references NHASI(MaNS)

ALTER TABLE LICHHEN
ADD CONSTRAINT FK_LICHHEN_KHACHHANG foreign key(MaKH, SoDT) references KHACHHANG(MaKH, SoDT)


ALTER TABLE CHITIETDV
ADD CONSTRAINT FK_CHITIETDV_LOAIDICHVU foreign key(MaDV) references LOAIDICHVU(MaDV)

ALTER TABLE CHITIETDV
ADD CONSTRAINT FK_CHITIETDV_HOSOBENH foreign key(MaKH,SoDT,STT) references HOSOBENH(MaKH,SoDT,STT)

go


insert into LOAIDICHVU
values
  ('DV01', N'Tẩy trắng răng', N'Sử dụng công nghệ laser để làm trắng răng', 2000000),
  ('DV02', N'Niềng răng', N'Sử dụng mắc cài hoặc dây chun để chỉnh hình răng', 10000000),
  ('DV03', N'Nhổ răng', N'Rút răng bị sâu hoặc gây đau', 500000),
  ('DV04', N'Trồng răng', N'Cấy ghép răng giả vào xương hàm', 15000000),
  ('DV05', N'Làm đều răng', N'Sử dụng composite để tạo hình răng đều đẹp', 3000000);


insert into LOAITHUOC
values
  ('T01', N'Paracetamol', N'Viên', N'Hạ sốt, giảm đau', 100, '2023-12-31', 5000),
  ('T02', N'Ibuprofen', N'Viên', N'Giảm đau, chống viêm', 50, '2024-01-31', 10000),
  ('T03', N'Chlorhexidine', N'Nước súc miệng', N'Sát khuẩn, ngừa viêm nha chu', 20, '2024-02-28', 30000),
  ('T04', N'Lidocaine', N'Thuốc tiêm', N'Gây tê, làm dịu cơn đau', 10, '2024-03-31', 50000),
  ('T05', N'Fluoride', N'Kem đánh răng', N'Bảo vệ men răng, ngừa sâu răng', 30, '2024-04-30', 20000);


insert into HOSOBENH
values
  ('KH01', '+12672133096', 1, '2023-11-14 10:00:00', N'Răng sâu, đau nhức', 'NS01', 'DV03', 'T01', 'ChuaXuat'),
  ('KH02', '0344805188', 2, '2023-11-14 10:30:00', N'Răng ố vàng, muốn tẩy trắng', 'NS02', 'DV01', NULL, 'ChuaXuat');

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
    (MaKH, SoDT, STT, NgayKham, DanDo, MaNS, MaDV,MaThuoc,TinhTrangXuatHoaDon)
  SELECT
    I.MaKH,
    I.SoDT,
    I.STT,
    I.NgayKham,
    I.DanDo,
    I.MaNS,
    I.MaDV,
    I.MaThuoc,
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


SELECT MaSoHen
FROM LICHHEN


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
GRANT SELECT,UPDATE, INSERT
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
GRANT EXECUTE ON InsertAppointment TO KH02
GRANT EXECUTE ON GetMedicalRecordByID TO KH02


-------------------------------------------------------
--------------------STORE PROCEDURE--------------------
-------------------------------------------------------

--1.  Procedure đăng nhập cho nha sĩ
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


--2.  Procedure xem thông tin cá nhân cho nhân viên
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

--3. Đăng ký tài khoản
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

--Thêm lịch hẹn của người dùng
CREATE PROCEDURE InsertAppointment
  @MaSoHen varchar(20),
  @NgayGioKham datetime,
  @LyDoKham nvarchar(100),
  @MaNS varchar(20),
  @MaKH varchar(20),
  @SoDT varchar(15)
AS
BEGIN
  -- Khai báo biến
  DECLARE @retry INT;
  SET @retry = 5;

  -- Bắt đầu vòng lặp
  WHILE @retry > 0
    BEGIN
    BEGIN TRY
            -- Bắt đầu giao tác
            BEGIN TRANSACTION;

            -- Chờ 5 giây trước khi thực hiện giao tác để giảm thiểu thời gian giữ khóa
            WAITFOR DELAY '00:00:05';

            -- Thực hiện truy vấn INSERT với mức cô lập SERIALIZABLE để tránh dirty read, lost update, phantom read và unrepeatable read
            SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

            INSERT INTO LICHHEN
      (MaSoHen, NgayGioKham, LyDoKham, MaNS, MaKH, SoDT)
    VALUES
      (@MaSoHen, @NgayGioKham, @LyDoKham, @MaNS, @MaKH, @SoDT);

            -- Kết thúc giao tác
            COMMIT TRANSACTION;

            -- Đặt lại số lần thử lại
            SET @retry = 0;
        END TRY
        BEGIN CATCH
            -- Nếu có lỗi, hủy giao tác
            ROLLBACK TRANSACTION;

            -- Giảm số lần thử lại
            SET @retry = @retry - 1;

            -- Nếu hết số lần thử lại, đưa ra lỗi
            IF @retry = 0
                THROW;
        END CATCH
  END
END;

CREATE PROCEDURE GetMedicalRecordByID
  @MaKH CHAR(20),
  @retry INT = 5
AS
BEGIN
  -- Khai báo biến
  DECLARE @retry_count INT = 0;
  DECLARE @wait_time INT = 500;
  -- thời gian chờ (ms)

  -- Sử dụng vòng lặp while để thử lại nếu xảy ra deadlock
  WHILE @retry_count < @retry
    BEGIN
    BEGIN TRY
            -- Bắt đầu giao dịch
            BEGIN TRANSACTION;

            -- Đặt mức cô lập giao dịch
            SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

            -- Lấy thông tin từ bảng HOSOBENH
            SELECT *
    FROM HOSOBENH WITH (ROWLOCK, HOLDLOCK)
    WHERE MaKH = @MaKH;

            -- Kết thúc giao dịch
            COMMIT TRANSACTION;

            -- Thoát khỏi vòng lặp
            BREAK;
        END TRY
        BEGIN CATCH
            -- Kiểm tra xem lỗi có phải là deadlock hay không
            IF ERROR_NUMBER() = 1205 AND @retry_count < @retry
            BEGIN
      -- Tăng biến đếm thử lại
      SET @retry_count = @retry_count + 1;

      -- Chờ một khoảng thời gian trước khi thử lại
      WAITFOR DELAY @wait_time;

      -- Tiếp tục vòng lặp
      CONTINUE;
    END
            ELSE
            BEGIN
      -- Nếu không phải deadlock hoặc đã vượt quá số lần thử lại, rollback giao dịch
      ROLLBACK TRANSACTION;

      -- Đưa ra thông báo lỗi
      THROW;
    END
        END CATCH
  END
END





--Phân quyền code mẫu
USE MASTER;
GO
CREATE LOGIN AW_UserThuong
	WITH PASSWORD = 'AW_UserThuong',
	CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF,
	DEFAULT_DATABASE = PHONGKHAMNHASI
GO


--4. Procedure khách hàng đăng kí lịch hẹn
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

--4. Procedure khách hàng hủy lịch hẹn (được phép hủy trước 2h so với thời gian hẹn)
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

--5. Procedure khách hàng/ nha sĩ xem hồ sơ bệnh án
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

--6	NS	Quan ly ho so benh nhan: them, xoa ho so benh
--them ho so benh
CREATE PROCEDURE ThemHoSoBenh
    @MaKH CHAR(20),
    @SoDT CHAR(15),
    @STT INT,
    @NgayKham DATETIME,
    @DanDo NVARCHAR(300),
    @MaNS CHAR(20),
    @MaDV CHAR(10),
    @MaThuoc CHAR(30),
    @TinhTrangXuatHoaDon CHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION WITH ISOLATION LEVEL READ COMMITTED; -- Set the isolation level

        -- Check if the record already exists
        IF NOT EXISTS (SELECT 1 FROM HOSOBENH WHERE MaKH = @MaKH AND SoDT = @SoDT AND STT = @STT)
        BEGIN
        -- Insert the new record
        INSERT INTO HOSOBENH (MaKH, SoDT, STT, NgayKham, DanDo, MaNS, MaDV, MaThuoc, TinhTrangXuatHoaDon)
        VALUES (@MaKH, @SoDT, @STT, @NgayKham, @DanDo, @MaNS, @MaDV, @MaThuoc, @TinhTrangXuatHoaDon);

        -- Commit the transaction if all steps succeed
        COMMIT;
        PRINT 'Transaction committed successfully.';
        END
        ELSE
        BEGIN
        -- Rollback the transaction if the record already exists
        ROLLBACK;
        PRINT 'Transaction rolled back. Record already exists.';
        END
    END TRY
    BEGIN CATCH
        -- Rollback the transaction in case of any error
        ROLLBACK;
        PRINT 'Transaction rolled back due to an error.';
        THROW;
    END CATCH
END;

--xoa ho so benh
CREATE PROCEDURE XoaHoSoBenh
    @MaKH CHAR(20),
    @SoDT CHAR(15),
    @STT INT
AS
BEGIN
    -- Set NOCOUNT to ON to suppress "xx rows affected" messages
    SET NOCOUNT ON;

    BEGIN TRY
        -- Start a new transaction with READ COMMITTED isolation level
        BEGIN TRANSACTION WITH ISOLATION LEVEL READ COMMITTED;

        -- Check if the record exists
        IF EXISTS (SELECT 1 FROM HOSOBENH WHERE MaKH = @MaKH AND SoDT = @SoDT AND STT = @STT)
        BEGIN
        -- Delete the record from the HOSOBENH table
        DELETE FROM HOSOBENH WHERE MaKH = @MaKH AND SoDT = @SoDT AND STT = @STT;

        -- Commit the transaction if the deletion is successful
        COMMIT;
        PRINT 'Transaction committed successfully. Record deleted.';
        END
        ELSE
        BEGIN
        -- Rollback the transaction if the record does not exist
        ROLLBACK;
        PRINT 'Transaction rolled back. Record does not exist.';
        END
    END TRY
    BEGIN CATCH
        -- Rollback the transaction in case of any error
        ROLLBACK;
        PRINT 'Transaction rolled back due to an error.';
        THROW;
    END CATCH
END;

--7	NS	Quản lý cuộc hẹn	Xem lịch hẹn của mình, thêm lịch cá nhân (lịch bận)
--xem lich nha si
CREATE PROCEDURE XemLichNhaSi
    @MaNS char(20)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION; -- Start the transaction

        -- Your SELECT statement to retrieve data from LICHNHASI table
        SELECT MaNS, STT, GioBatDau, GioKetThuc, TinhTrangCuocHen
        FROM LICHNHASI;
        WHERE MaNS = @MaNS;

        COMMIT; -- Commit the transaction if successful
    END TRY
    BEGIN CATCH
        ROLLBACK; -- Rollback the transaction if there is an error

        -- Print a custom error message
        PRINT 'Cannot view the schedule. An error occurred: ' + ERROR_MESSAGE();

    END CATCH
END;

--them lich nha si
CREATE PROCEDURE ThemLichHenNhaSi
    @MaNS char(20),
    @GioBatDau datetime,
    @GioKetThuc datetime,
    @TinhTrangCuocHen char(20)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Set the isolation level
        SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
        
        BEGIN TRANSACTION;

        -- Insert the new schedule
        INSERT INTO LICHNHASI (MaNS, GioBatDau, GioKetThuc, TinhTrangCuocHen)
        VALUES (@MaNS, @GioBatDau, @GioKetThuc, @TinhTrangCuocHen);

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;

        -- Print the error message
        PRINT 'Cannot insert the schedule. An error occurred: ' + ERROR_MESSAGE();
    END CATCH;
END;

--xoa lich nha si
CREATE PROCEDURE XoaLichHenNhaSi
    @MaNS char(20),
    @STT int
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Delete the schedule
        DELETE FROM LICHNHASI
        WHERE MaNS = @MaNS AND STT = @STT;

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;

        -- Print the error message
        PRINT 'Cannot delete the schedule. An error occurred: ' + ERROR_MESSAGE();
    END CATCH;
END;

--8	NS	Quản lý lịch sử khám	Xem, sửa lịch sử khám của bệnh nhân (hồ sơ bệnh)
CREATE PROCEDURE ViewHoSoBenh
  @MaKH CHAR(20)
AS
BEGIN
  -- Set NOCOUNT to ON to suppress "xx rows affected" messages
  SET NOCOUNT ON;

  BEGIN TRY
    -- Start a new transaction with READ COMMITTED isolation level
    BEGIN TRANSACTION WITH ISOLATION LEVEL READ COMMITTED;

    -- Select all Ho So Benh records for the specified MaKH
    SELECT MaKH, SoDT, STT, NgayKham, DanDo, MaNS, MaDV, MaThuoc, TinhTrangXuatHoaDon
    FROM HOSOBENH
    WHERE MaKH = @MaKH;

    -- Commit the transaction if the SELECT statement succeeds
    COMMIT;
    PRINT 'Transaction committed successfully.';
  END TRY
  BEGIN CATCH
    -- Rollback the transaction in case of any error
    ROLLBACK;
    PRINT 'Transaction rolled back due to an error.';
    THROW;
  END CATCH
END;

--CapNhatHoSoBenh
CREATE PROCEDURE CapNhatHoSoBenh
    @MaKH CHAR(20),
    @SoDT CHAR(15),
    @STT INT,
    @NgayKham DATETIME,
    @DanDo NVARCHAR(300),
    @MaNS CHAR(20),
    @MaDV CHAR(10),
    @MaThuoc CHAR(30),
    @TinhTrangXuatHoaDon CHAR(10)
AS
BEGIN
    -- Set NOCOUNT to ON to suppress "xx rows affected" messages
    SET NOCOUNT ON;

    BEGIN TRY
        -- Start a new transaction with READ COMMITTED isolation level
        BEGIN TRANSACTION WITH ISOLATION LEVEL READ COMMITTED;

        -- Check if the record exists
        IF EXISTS (SELECT 1 FROM HOSOBENH WHERE MaKH = @MaKH AND SoDT = @SoDT AND STT = @STT)
        BEGIN
        -- Update the record in the HOSOBENH table
        UPDATE HOSOBENH
        SET
            NgayKham = @NgayKham,
            DanDo = @DanDo,
            MaNS = @MaNS,
            MaDV = @MaDV,
            MaThuoc = @MaThuoc,
            TinhTrangXuatHoaDon = @TinhTrangXuatHoaDon
        WHERE MaKH = @MaKH AND SoDT = @SoDT AND STT = @STT;

        -- Commit the transaction if the update is successful
        COMMIT;
        PRINT 'Transaction committed successfully. Record updated.';
        END
        ELSE
        BEGIN
        -- Rollback the transaction if the record does not exist
        ROLLBACK;
        PRINT 'Transaction rolled back. Record does not exist.';
        END
    END TRY
    BEGIN CATCH
        -- Rollback the transaction in case of any error
        ROLLBACK;
        PRINT 'Transaction rolled back due to an error.';
        THROW;
    END CATCH
END;

-- 9. Stored procedure thêm lịch cuộc hẹn
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

--9. Xem những lịch hẹn tiếp theo
CREATE PROCEDURE ViewUpcomingAppointments
    @NgayHienTai DATETIME
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
    BEGIN TRANSACTION;

    -- Lấy tất cả lịch hẹn sắp tới của khách hàng
    SELECT * FROM LICHHEN
    WHERE NgayGioKham > @NgayHienTai

    COMMIT TRANSACTION;
END;

--9. Xóa lịch hẹn
CREATE PROCEDURE CancelAppointment
    @MaSoHen VARCHAR(20)
AS
BEGIN
    SET XACT_ABORT ON;
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;

    -- Kiểm tra xem lịch hẹn có tồn tại không
    IF NOT EXISTS (SELECT 1 FROM LICHHEN WHERE MaSoHen = @MaSoHen)
    BEGIN
        RAISERROR('Lịch hẹn không tồn tại.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- Hủy lịch hẹn
    DELETE FROM LICHHEN WHERE MaSoHen = @MaSoHen;

    COMMIT TRANSACTION;
END;

--10. cập nhật hóa đơn
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

-- 11. Procedure xem danh sách người dùng
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


-- 11. Procedure cập nhật thông tin cá nhân cho quản trị viên
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

--11. QTV sửa thông tin nhân viên
CREATE PROCEDURE SuaThongTinNhanVien
  @MaNV char(20),
  @HoTen nvarchar(50),
  @Phai char(1),
  @TenDangNhap char(50),
  @MatKhau char(50)
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

      -- Kiểm tra xem mã nhân viên có tồn tại không
      IF NOT EXISTS (SELECT 1
    FROM NHANVIEN WITH (UPDLOCK, HOLDLOCK)
    WHERE MaNV = @MaNV)
      BEGIN
      RAISERROR ('Mã nhân viên không tồn tại.', 16, 1);
      ROLLBACK TRANSACTION;
      RETURN;
    END

      -- Cập nhật thông tin nhân viên
      UPDATE NHANVIEN
    SET HoTen = ISNULL(@HoTen, HoTen),
        Phai = ISNULL(@Phai, Phai),
        TenDangNhap = ISNULL(@TenDangNhap, TenDangNhap),
        MatKhau = ISNULL(@MatKhau, MatKhau)
    WHERE MaNV = @MaNV;

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

--11. Xem các loại dịch vụ
CREATE PROCEDURE XemDichVu
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM LOAIDICHVU;
END;

--Xem 1 loại dịch vụ
CREATE PROCEDURE XemChiTietDichVu
    @MaDV char(10)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Truy vấn thông tin của dịch vụ bằng MaDV
        SELECT * FROM LOAIDICHVU WHERE MaDV = @MaDV;

        -- Nếu không có lỗi, commit transaction
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Nếu có lỗi, rollback transaction
        ROLLBACK TRANSACTION;
        PRINT 'Đã xảy ra lỗi khi truy vấn thông tin dịch vụ.';
    END CATCH
END;

--11. Thêm loại dịch vụ
CREATE PROCEDURE ThemDichVu
    @MaDV char(10),
    @TenDV nvarchar(40),
    @MoTa nvarchar(100),
    @DongGia bigint
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        INSERT INTO LOAIDICHVU (MaDV, TenDV, MoTa, DongGia)
        VALUES (@MaDV, @TenDV, @MoTa, @DongGia);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        RAISERROR ('Lỗi khi thêm dịch vụ mới.', 16, 1);
    END CATCH
END;

--Xóa loại dịch vụ
CREATE PROCEDURE XoaDichVu
    @MaDV char(10)
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        DELETE FROM LOAIDICHVU WHERE MaDV = @MaDV;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        RAISERROR ('Lỗi khi xóa dịch vụ.', 16, 1);
    END CATCH
END;

--11. Sửa loại dịch vụ
CREATE PROCEDURE SuaDichVu
    @MaDV char(10),
    @TenDV nvarchar(40),
    @MoTa nvarchar(100),
    @DongGia bigint
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        UPDATE LOAIDICHVU
        SET TenDV = @TenDV, MoTa = @MoTa, DongGia = @DongGia
        WHERE MaDV = @MaDV;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        RAISERROR ('Lỗi khi cập nhật dịch vụ.', 16, 1);
    END CATCH
END;

-- 13	QT	Quản lý thuốc	Thêm, sửa, xóa, xem, xem thuốc hết hạn, xóa thuốc hết hạn

--Them thuoc
CREATE PROCEDURE ThemThuoc
    @MaThuoc char(30),
    @TenThuoc nvarchar(100),
    @DonViTinh nvarchar(100),
    @ChiDinh nvarchar(200),
    @SoLuong int,
    @NgayHetHan date,
    @GiaThuoc bigint
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Insert the new record
        INSERT INTO LOAITHUOC (MaThuoc, TenThuoc, DonViTinh, ChiDinh, SoLuong, NgayHetHan, GiaThuoc)
        VALUES (@MaThuoc, @TenThuoc, @DonViTinh, @ChiDinh, @SoLuong, @NgayHetHan, @GiaThuoc);

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;

        -- Print the error message
        PRINT 'Cannot insert the record. An error occurred: ' + ERROR_MESSAGE();
    END CATCH;
END;

--Xoa thuoc
CREATE PROCEDURE XoaThuoc
    @MaThuoc char(30)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Delete the record
        DELETE FROM LOAITHUOC
        WHERE MaThuoc = @MaThuoc;

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;

        -- Print the error message
        PRINT 'Cannot delete the record. An error occurred: ' + ERROR_MESSAGE();
    END CATCH;
END;

--sua thuoc
CREATE PROCEDURE SuaThongTinThuoc
    @MaThuoc char(30),
    @TenThuoc nvarchar(100),
    @DonViTinh nvarchar(100),
    @ChiDinh nvarchar(200),
    @SoLuong int,
    @NgayHetHan date,
    @GiaThuoc bigint
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Update the record
        UPDATE LOAITHUOC
        SET TenThuoc = @TenThuoc,
            DonViTinh = @DonViTinh,
            ChiDinh = @ChiDinh,
            SoLuong = @SoLuong,
            NgayHetHan = @NgayHetHan,
            GiaThuoc = @GiaThuoc
        WHERE MaThuoc = @MaThuoc;

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;

        -- Print the error message
        PRINT 'Cannot update the record. An error occurred: ' + ERROR_MESSAGE();
    END CATCH;
END;

--xem thuoc
CREATE PROCEDURE XemThuoc
    @MaThuoc char(30)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- View the medicine information
        SELECT MaThuoc, TenThuoc, DonViTinh, ChiDinh, SoLuong, NgayHetHan, GiaThuoc
        FROM LOAITHUOC
        WHERE MaThuoc = @MaThuoc;

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;

        -- Print the error message
        PRINT 'Cannot view the medicine information. An error occurred: ' + ERROR_MESSAGE();
    END CATCH;
END;

--xem thuoc het han
CREATE PROCEDURE XemThuocHetHan
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- View the expired medicines
        SELECT MaThuoc, TenThuoc, DonViTinh, ChiDinh, SoLuong, NgayHetHan, GiaThuoc
        FROM LOAITHUOC
        WHERE NgayHetHan < GETDATE(); -- Select medicines whose expiration date is before the current date

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;

        -- Print the error message
        PRINT 'Cannot view expired medicines. An error occurred: ' + ERROR_MESSAGE();
    END CATCH;
END;

--xoa thuoc het han
CREATE PROCEDURE XoaThuocHetHan
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Delete expired medicines
        DELETE FROM LOAITHUOC
        WHERE NgayHetHan < GETDATE(); -- Delete medicines whose expiration date is before the current date

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;

        -- Print the error message
        PRINT 'Cannot delete expired medicines. An error occurred: ' + ERROR_MESSAGE();
    END CATCH;
END;

--Xem báo cáo doanh thu
USE PHONGKHAMNHASI;
GO

CREATE PROCEDURE XemBaoCaoDoanhThu
    @NgayBatDau DATETIME,
    @NgayKetThuc DATETIME
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
        
        -- Tính toán doanh thu từ dịch vụ
        DECLARE @DoanhThuDichVu BIGINT;
        SELECT @DoanhThuDichVu = SUM(LDV.DongGia * CTDV.SoLuong)
        FROM LOAIDICHVU LDV
        JOIN CHITIETDV CTDV ON LDV.MaDV = CTDV.MaDV
        WHERE EXISTS (
            SELECT 1
            FROM HOADON HD
            WHERE HD.MaDV = CTDV.MaDV
              AND HD.NgayXuat BETWEEN @NgayBatDau AND @NgayKetThuc
        );

        -- Tính toán doanh thu từ thuốc
        DECLARE @DoanhThuThuoc BIGINT;
        SELECT @DoanhThuThuoc = SUM(LT.GiaThuoc * CTT.SoLuong)
        FROM LOAITHUOC LT
        JOIN CHITIETTHUOC CTT ON LT.MaThuoc = CTT.MaThuoc
        WHERE EXISTS (
            SELECT 1
            FROM HOADON HD
            WHERE HD.MaThuoc = CTT.MaThuoc
              AND HD.NgayXuat BETWEEN @NgayBatDau AND @NgayKetThuc
        );

        -- Tổng hợp doanh thu
        DECLARE @TongDoanhThu BIGINT;
        SET @TongDoanhThu = ISNULL(@DoanhThuDichVu, 0) + ISNULL(@DoanhThuThuoc, 0);

        -- Trả về kết quả
        SELECT 
            @TongDoanhThu AS 'TongDoanhThu',
            @DoanhThuDichVu AS 'DoanhThuDichVu',
            @DoanhThuThuoc AS 'DoanhThuThuoc';

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Nếu có lỗi, rollback giao tác
        ROLLBACK TRANSACTION;
        -- Ném lỗi ra ngoài
        THROW;
    END CATCH
END;
GO

--Xem top nha sĩ dựa và số lượng bệnh án và doanh thu của họ
CREATE PROCEDURE XemTopNhaSi
    @NgayBatDau DATETIME,
    @NgayKetThuc DATETIME
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
        
        -- Truy vấn để lấy thông tin top nha sĩ
        SELECT 
            N.MaNS,
            N.HoTen,
            COUNT(DISTINCT H.MaKH) AS 'SoLuongBenhAn',
            SUM(CASE 
                WHEN HD.MaDV IS NOT NULL THEN LDV.DongGia 
                ELSE 0 
            END) AS 'DoanhThuDichVu'
        FROM NHASI N
        LEFT JOIN HOSOBENH H ON N.MaNS = H.MaNS
        LEFT JOIN HOADON HD ON H.MaKH = HD.MaKH AND H.SoDT = HD.SoDT AND H.STT = HD.STT
        LEFT JOIN LOAIDICHVU LDV ON HD.MaDV = LDV.MaDV
        WHERE H.NgayKham BETWEEN @NgayBatDau AND @NgayKetThuc
        GROUP BY N.MaNS, N.HoTen
        ORDER BY COUNT(DISTINCT H.MaKH) DESC, SUM(CASE 
                WHEN HD.MaDV IS NOT NULL THEN LDV.DongGia 
                ELSE 0 
            END) DESC;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO
