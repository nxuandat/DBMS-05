create database PHONGKHAMNHASI

go

use PHONGKHAMNHASI

go

create table LOAIDICHVU (
  MaDV char(10),
  TenDV nvarchar(40),
  MoTa nvarchar(100),
  DongGia bigint,
  constraint PK_MaDV primary key(MaDV)
)



go

create table CHITIETDV (
  MaDV char(10),
  MaKH char(20),
  STT int,
  SoDT char(15),
  SoLuong float,
  constraint PK_MaDV_STT_SoDT primary key(MaDV,MaKH,STT,SoDT)
)

go

create table NHASI (
  MaNS char(20),
  TenDangNhap char(50),
  HoTen nvarchar(50),
  Phai CHAR(1) CHECK(Phai IN ('M', 'F')),
  GioiThieu nvarchar(300),
  MatKhau char(50),
  constraint PK_MaNS primary key(MaNS)
)

go

create table KHACHHANG (
  MaKH char(20),
  SoDT char(15),
  HoTen nvarchar(50),
  Phai CHAR(1) CHECK(Phai IN ('M', 'F')),
  NgaySinh datetime,
  DiaChi nvarchar(100),
  MatKhau char(50),
  Email varchar(40),
  NgayTao datetime,
  constraint PK_SoDT_MaKH primary key(MaKH,SoDT)
)



go

create table LICHHEN (
  MaSoHen char(20),
  NgayGioKham datetime,
  LyDoKham nvarchar(100),
  MaNS char(20),
  MaKH char(20),
  SoDT char(15),
  constraint PK_MaSoHen primary key(MaSoHen)
)

create table LOAITHUOC(
  MaThuoc char(30),
  TenThuoc nvarchar(100),
  DonViTinh nvarchar(100),
  ChiDinh nvarchar(200),
  SoLuong int,
  NgayHetHan date,
  GiaThuoc bigint,
  constraint PK_MaThuoc primary key(MaThuoc)
)

create table HOSOBENH(
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

create table LICHNHASI(
  MaNS char(20),
  STT int,
  GioBatDau datetime,
  GioKetThuc datetime,
  TinhTrangCuocHen CHAR(20) CHECK (TinhTrangCuocHen IN ('DaHen', 'ChuaHen')),
  MaKH char(20),
  SoDT char(15),
  constraint PK_MaNS_STT primary key(MaNS,STT)
)



create table NHANVIEN(
  MaNV char(20),
  HoTen nvarchar(100),
  Phai CHAR(1) CHECK(Phai IN ('M', 'F')),
  TenDangNhap char(50),
  MatKhau char(50),
  constraint PK_NHANVIEN primary key(MaNV)
)

create table QUANTRIVIEN(
  MaQTV char(20),
  HoTen nvarchar(100),
  Phai CHAR(1) CHECK(Phai IN ('M', 'F')),
  TenDangNhap char(50),
  MatKhau char(50),
  constraint PK_MaQTV primary key(MaQTV)
)

 
create table CHITIETTHUOC(
  MaThuoc char(30),
  MaKH char(20),
  SoDT char(15),
  STT int,
  SoLuong int,
  ThoiDiemDung nvarchar(50),
  constraint PK_MaThuoc_STT_SoDT primary key(MaThuoc,MaKH,SoDT,STT)
)

create table HOADON(
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

create table LUUTRUANH (
  MaNguoiDung char(20),
  SoDT char(15),
  AvatarUrl varchar(200),
  constraint PK_MaNguoiDung primary key(MaNguoiDung)
)

CREATE TABLE THONGBAO (
    title VARCHAR(255),
    message TEXT,
    status VARCHAR(255),
    MaNguoiDung char(20),
	SoDT char(15),
    dateCreated DATETIME
);

CREATE TABLE DOANHTHU (
	TongDoanhThu bigint,
	Thang Date,
)




-------------------------------------------------------

ALTER TABLE HOADON ADD CONSTRAINT FK_HOADON_HOSOBENH 
FOREIGN KEY(MaKH,SoDT,STT) REFERENCES HOSOBENH(MaKH,SoDT,STT) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE HOADON ADD CONSTRAINT FK_HOADON_NHANVIEN 
FOREIGN KEY(MaNV) REFERENCES NHANVIEN(MaNV) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE HOADON ADD CONSTRAINT FK_HOADON_LOAIDICHVU 
FOREIGN KEY(MaDV) REFERENCES LOAIDICHVU(MaDV) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE CHITIETTHUOC ADD CONSTRAINT FK_CHITIETTHUOC_HOSOBENH 
FOREIGN KEY(MaKH,SoDT,STT) REFERENCES HOSOBENH(MaKH,SoDT,STT) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE CHITIETTHUOC ADD CONSTRAINT FK_CHITIETTHUOC_LOAITHUOC 
FOREIGN KEY(MaThuoc) REFERENCES LOAITHUOC(MaThuoc) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE LICHNHASI ADD CONSTRAINT FK_LICHNHASI_NHASI 
FOREIGN KEY(MaNS) REFERENCES NHASI(MaNS) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE LICHNHASI ADD CONSTRAINT FK_LICHNHASI_KHACHHANG
FOREIGN KEY(MaKH,SoDT) REFERENCES KHACHHANG(MaKH,SoDT) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE HOSOBENH ADD CONSTRAINT FK_HOSOBENH_KHACHHANG 
FOREIGN KEY(MaKH,SoDT) REFERENCES KHACHHANG(MaKH,SoDT) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE HOSOBENH ADD CONSTRAINT FK_HOSOBENH_NHASI 
FOREIGN KEY(MaNS) REFERENCES NHASI(MaNS) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE LICHHEN ADD CONSTRAINT FK_LICHHEN_LOAIDICHVU 
FOREIGN KEY(MaNS) REFERENCES NHASI(MaNS) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE LICHHEN ADD CONSTRAINT FK_LICHHEN_KHACHHANG 
FOREIGN KEY(MaKH, SoDT) REFERENCES KHACHHANG(MaKH, SoDT) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE CHITIETDV ADD CONSTRAINT FK_CHITIETDV_LOAIDICHVU 
FOREIGN KEY(MaDV) REFERENCES LOAIDICHVU(MaDV) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE CHITIETDV ADD CONSTRAINT FK_CHITIETDV_HOSOBENH 
FOREIGN KEY(MaKH,SoDT,STT) REFERENCES HOSOBENH(MaKH,SoDT,STT) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE THONGBAO ADD CONSTRAINT FK_THONGBAO_KHACHHANG 
FOREIGN KEY(MaNguoiDUng,SoDT) REFERENCES KHACHHANG(MaKH,SoDT) ON DELETE CASCADE ON UPDATE CASCADE;





INSERT INTO KHACHHANG (MaKH, SoDT, HoTen, Phai, NgaySinh, DiaChi, MatKhau, Email, NgayTao)
VALUES 
('KH01', '+12672133096', 'Nguyen Thi B', 'M', '1990-01-01 00:00:00.000', '123 Đường ABC, Phường XYZ, TP.HCM', 'password123', 'nguyen.vu.hung309@gmail.com', GETDATE()),
('KH02', '0344805188', 'Bui Hoang Duc', 'F', '2000-01-01 00:00:00.000', '342 Đường 78, Phường CCD, Long An', 'password113', 'lamnguyenvu1612@gmail.com', GETDATE()),
('KH03', '0912748492', 'Le Hoang Anh', 'M', '2000-01-01 00:00:00.000', '321 Đường 98, Phường CCD, Cần Thơ', 'password110', 'lamnguyenvu1612@gmail.com', GETDATE());


INSERT INTO NHANVIEN (MaNV, HoTen, Phai, TenDangNhap, MatKhau)
VALUES 
('NV01', 'Nguyễn Văn A', 'M', 'nva', '123456'),
('NV02', 'Trần Thị B', 'F', 'ttb', '789012'),
('NV03', 'Lê Văn C', 'M', 'lvc', '345678'),
('NV04', 'Phạm Thị D', 'F', 'ptd', '901234');

INSERT INTO NHASI (MaNS, TenDangNhap, HoTen, Phai, GioiThieu, MatKhau)
VALUES 
('NS01', 'nguyenvanA', 'Nguyễn Văn A', 'M', 'Nha sĩ chuyên nghiệp với 10 năm kinh nghiệm', '123456'),
('NS02', 'tranvanB', 'Trần Văn B', 'M', 'Nha sĩ tận tâm với khách hàng', 'abcdef'),
('NS03', 'phamthiC', 'Phạm Thị C', 'F', 'Nha sĩ thân thiện và nhiệt tình', 'ghijkl');


INSERT INTO QUANTRIVIEN (MaQTV, HoTen, Phai, TenDangNhap, MatKhau)
VALUES 
('QTV01', 'Đỗ Thị E', 'F', 'admin01', '567890');



insert into LOAIDICHVU values
('DV01', N'Tẩy trắng răng', N'Sử dụng công nghệ laser để làm trắng răng', 2000000),
('DV02', N'Niềng răng', N'Sử dụng mắc cài hoặc dây chun để chỉnh hình răng', 10000000),
('DV03', N'Nhổ răng', N'Rút răng bị sâu hoặc gây đau', 500000),
('DV04', N'Trồng răng', N'Cấy ghép răng giả vào xương hàm', 15000000),
('DV05', N'Làm đều răng', N'Sử dụng composite để tạo hình răng đều đẹp', 3000000);


insert into LOAITHUOC values
('T01', N'Paracetamol', N'Viên', N'Hạ sốt, giảm đau', 100, '2024-12-31', 5000),
('T02', N'Ibuprofen', N'Viên', N'Giảm đau, chống viêm', 50, '2024-01-31', 10000),
('T03', N'Chlorhexidine', N'Nước súc miệng', N'Sát khuẩn, ngừa viêm nha chu', 20, '2024-02-28', 30000),
('T04', N'Lidocaine', N'Thuốc tiêm', N'Gây tê, làm dịu cơn đau', 30, '2024-03-31', 50000),
('T05', N'Fluoride', N'Kem đánh răng', N'Bảo vệ men răng, ngừa sâu răng', 30, '2024-04-30', 20000);

insert into LOAITHUOC values
('T06', N'Fluoride', N'Kem đánh răng', N'Bảo vệ men răng, ngừa sâu răng', 30, '2024-04-30', 60000);


insert into HOSOBENH values
('KH01', '+12672133096', 1, '2023-11-14 10:00:00', N'Răng sâu, đau nhức', 'NS01', 'DV03', 'T01', 'ChuaXuat'),
('KH02', '0344805188', 2, '2023-11-14 10:30:00', N'Răng ố vàng, muốn tẩy trắng', 'NS02', 'DV01', 'T02', 'ChuaXuat');

insert into HOSOBENH values
('KH03', '0912748492', 3, '2023-12-12 10:30:00', N'Răng ố vàng, muốn cạo vôi răng', 'NS02', 'DV03', 'T06', 'ChuaXuat');

insert into HOSOBENH values
('KH305', '0142206188', 305, '2024-02-18 00:00:00', N'Răng ố vàng, muốn cạo vôi răng', 'NS02', 'DV03', 'T01', 'ChuaXuat');





INSERT INTO LICHNHASI (MaNS, STT, GioBatDau, GioKetThuc, TinhTrangCuocHen)
VALUES 
    ('NS01', 1, '2023-11-16 08:00:00', '2023-11-16 09:30:00', 'DaHen'),
    ('NS01', 2, '2023-11-16 10:00:00', '2023-11-16 11:30:00', 'ChuaHen'),
    ('NS02', 1, '2023-11-17 09:00:00', '2023-11-17 10:30:00', 'DaHen'),
    ('NS02', 2, '2023-11-17 11:00:00', '2023-11-17 12:30:00', 'ChuaHen');

INSERT INTO LICHNHASI (MaNS, STT, GioBatDau, GioKetThuc, TinhTrangCuocHen)
VALUES 
    ('NS02', 3, '2023-11-17 19:00:00', '2023-11-17 21:00:00', 'ChuaHen');

INSERT INTO LICHNHASI (MaNS, STT, GioBatDau, GioKetThuc, TinhTrangCuocHen)
VALUES 
    ('NS03', 4, '2024-02-17 17:00:00', '2024-02-17 21:00:00', 'ChuaHen'),
	('NS03', 5, '2024-02-18 17:00:00', '2024-02-17 21:00:00', 'ChuaHen');




INSERT INTO LUUTRUANH (MaNguoiDung, SoDT, AvatarUrl)
VALUES ('KH03', '0139438492', 'avatar1.jpg');

use 

INSERT INTO HOADON(MaHoaDon, MaKH, SoDT, STT, NgayXuat, TongChiPhi, TinhTrangThanhToan, MaNV, MaDV)
VALUES ('HD01', 'KH03', '0912748492', 3, '2023-11-10 00:00:00', 1000000, 'DaThanhToan', 'NV01', 'DV01'),
	   ('HD02', 'KH02', '0344805188', 2, '2023-10-13 00:00:00', 800000, 'DaThanhToan', 'NV01', 'DV01'),
	   ('HD03', 'KH03', '0912748492', 3, '2023-11-14 00:00:00', 500000, 'DaThanhToan', 'NV01', 'DV03'),
	   ('HD04', 'KH01', '+12672133096', 1, '2023-10-5 00:00:00', 700000, 'DaThanhToan', 'NV01', 'DV02'),
	   ('HD05', 'KH01', '+12672133096', 1, '2023-12-7 00:00:00', 2500000, 'DaThanhToan', 'NV01', 'DV03');

INSERT INTO HOADON(MaHoaDon, MaKH, SoDT, STT, NgayXuat, TongChiPhi, TinhTrangThanhToan, MaNV, MaDV)
VALUES ('HD06', 'KH03', '0912748492', 3, '2023-12-10 00:00:00', 1000000, 'DaThanhToan', 'NV01', 'DV01');

-- Insert data into CHITIETTHUOC
INSERT INTO CHITIETTHUOC(MaThuoc, MaKH, SoDT, STT, SoLuong, ThoiDiemDung)
VALUES ('T05', 'KH03', '0912748492', 3, 20, '2024-01-07 10:00:00');

INSERT INTO CHITIETTHUOC(MaThuoc, MaKH, SoDT, STT, SoLuong, ThoiDiemDung)
VALUES ('T01', 'KH03', '0912748492', 3, 5, '2024-01-07 10:00:00'),
	   ('T02', 'KH02', '0344805188', 2, 20, '2024-01-08 10:00:00'),
	   ('T03', 'KH02', '0344805188', 2, 1, '2024-01-12 11:00:00');

INSERT INTO LICHHEN (MaSoHen, NgayGioKham, LyDoKham, MaNS, MaKH, SoDT)
VALUES 
('MSH01', '2023-11-14 18:20:00.000', N'Chảy máu chân răng', 'NS01', 'KH02', '0344805188'),
('MSH02', '2023-11-16 10:30:00.000', N'Kiểm tra sức khỏe', 'NS01', 'KH01', '+12672133096'),
('MSH701', '2024-01-17 19:45:00.000', N'bị đau tủy răng', 'NS02', 'KH03', '0912748492');

INSERT INTO LICHHEN (MaSoHen, NgayGioKham, LyDoKham, MaNS, MaKH, SoDT)
VALUES 
('MSH34', '2024-01-15 10:20:00.000', N'Viêm nha chu', 'NS03', 'KH02', '0344805188');
	  


UPDATE CHITIETTHUOC
SET SoLuong = 5
WHERE MaThuoc = 'T05' AND MaKH = 'KH03' AND SoDT = '0912748492' AND STT = 3;

       
DELETE FROM CHITIETTHUOC
WHERE MaThuoc = 'T05' AND MaKH = 'KH03' AND SoDT = '0912748492' AND STT = 3;



----------------------------------------------------TRIGGER-------------------------------------------------------

CREATE TRIGGER trg_AfterDelete_LOAITHUOC
ON LOAITHUOC
FOR DELETE
AS
BEGIN
    UPDATE HOSOBENH
    SET MaThuoc = NULL
    WHERE MaThuoc IN (SELECT MaThuoc FROM DELETED)
END

go

CREATE TRIGGER trg_AfterDelete_LOAIDICHVU
ON LOAIDICHVU
FOR DELETE
AS
BEGIN
    UPDATE HOSOBENH
    SET MaDV = NULL
    WHERE MaDV IN (SELECT MaDV FROM DELETED)
END

go


CREATE TRIGGER UpdateDoanhThu
ON HOADON
AFTER INSERT, UPDATE
AS
BEGIN
    -- Tính tổng doanh thu từ bảng HOADON dựa vào ngày xuất và chỉ tính khi TinhTrangThanhToan là 'DaThanhToan'
    ;WITH CTE AS (
        SELECT 
            SUM(TongChiPhi) as TongDoanhThu, 
            DATEPART(YEAR, NgayXuat) as Nam, 
            DATEPART(MONTH, NgayXuat) as Thang
        FROM 
            inserted
        WHERE 
            TinhTrangThanhToan = 'DaThanhToan'
        GROUP BY 
            DATEPART(YEAR, NgayXuat), 
            DATEPART(MONTH, NgayXuat)
    )
    -- Cập nhật bảng DOANHTHU
    MERGE INTO DOANHTHU AS D
    USING CTE AS C
    ON D.Thang = DATEFROMPARTS(C.Nam, C.Thang, 1)
    WHEN MATCHED THEN
        UPDATE SET D.TongDoanhThu = D.TongDoanhThu + C.TongDoanhThu
    WHEN NOT MATCHED THEN
        INSERT (TongDoanhThu, Thang)
        VALUES (C.TongDoanhThu, DATEFROMPARTS(C.Nam, C.Thang, 1));
END;

GO

CREATE TRIGGER UpdateDoanhThu_Delete
ON HOADON
AFTER DELETE
AS
BEGIN
    -- Tính tổng doanh thu từ bảng HOADON dựa vào ngày xuất và chỉ tính khi TinhTrangThanhToan là 'DaThanhToan'
    ;WITH CTE AS (
        SELECT 
            SUM(TongChiPhi) as TongDoanhThu, 
            DATEPART(YEAR, NgayXuat) as Nam, 
            DATEPART(MONTH, NgayXuat) as Thang
        FROM 
            deleted
        WHERE 
            TinhTrangThanhToan = 'DaThanhToan'
        GROUP BY 
            DATEPART(YEAR, NgayXuat), 
            DATEPART(MONTH, NgayXuat)
    )
    -- Cập nhật bảng DOANHTHU
    MERGE INTO DOANHTHU AS D
    USING CTE AS C
    ON D.Thang = DATEFROMPARTS(C.Nam, C.Thang, 1)
    WHEN MATCHED THEN
        UPDATE SET D.TongDoanhThu = D.TongDoanhThu - C.TongDoanhThu
    WHEN NOT MATCHED THEN
        INSERT (TongDoanhThu, Thang)
        VALUES (C.TongDoanhThu, DATEFROMPARTS(C.Nam, C.Thang, 1));
END;

GO







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
    SELECT @MaKH = MaKH, @SoDT = SoDT FROM inserted
    -- Check if the customer ID is unique
    IF EXISTS (SELECT * FROM KHACHHANG WITH (XLOCK,ROWLOCK) WHERE MaKH = @MaKH)
    BEGIN
      -- Rollback the transaction and raise an error
      ROLLBACK TRANSACTION
      RAISERROR ('Mã khách hàng đã tồn tại.', 16, 1)
      RETURN
    END
    -- Check if the phone number is unique
    IF EXISTS (SELECT * FROM KHACHHANG WITH (XLOCK,ROWLOCK) WHERE SoDT = @SoDT)
    BEGIN
      -- Rollback the transaction and raise an error
      ROLLBACK TRANSACTION
      RAISERROR ('Số điện thoại đã tồn tại.', 16, 1)
      RETURN
    END
    -- Check if there are no NULL values
    IF EXISTS (SELECT * FROM inserted WHERE HoTen IS NULL OR NgaySinh IS NULL OR DiaChi IS NULL OR SoDT IS NULL OR MatKhau IS NULL OR Email IS NULL)
    BEGIN
      -- Rollback the transaction and raise an error
      ROLLBACK TRANSACTION
      RAISERROR ('Không được để trống các giá trị.', 16, 1)
      RETURN
    END
    -- Insert the data from the inserted table into KHACHHANG table
    INSERT INTO KHACHHANG (MaKH, SoDT, HoTen, Phai, NgaySinh, DiaChi, MatKhau, Email,NgayTao)
    SELECT MaKH, SoDT, HoTen, Phai, NgaySinh, DiaChi, MatKhau, Email ,NgayTao FROM inserted
  -- Commit the transaction
  COMMIT TRANSACTION
END

GO


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
    INSERT INTO NHASI (MaNS, TenDangNhap, HoTen, Phai, GioiThieu, MatKhau)
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

GO




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
    INSERT INTO LOAITHUOC (MaThuoc, TenThuoc, DonViTinh, ChiDinh, SoLuong, NgayHetHan, GiaThuoc)
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

GO

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
    INSERT INTO LICHHEN (MaSoHen, NgayGioKham, LyDoKham, MaNS, MaKH, SoDT)
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

GO

--Trigger cho bảng Lịch Hẹn kiểm tra nếu lịch hẹn nằm trong khoảng giờ rảnh của Nha sĩ thì set DaHen
CREATE TRIGGER LichHen_LichNhaSiChange
ON LICHHEN
AFTER INSERT,Update
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE ln
    SET ln.TinhTrangCuocHen = 'DaHen'
    FROM LICHNHASI ln
    INNER JOIN inserted i ON ln.MaNS = i.MaNS
    WHERE ln.TinhTrangCuocHen = 'ChuaHen'
      AND i.NgayGioKham BETWEEN ln.GioBatDau AND ln.GioKetThuc;
END;

CREATE TRIGGER LichHen_LichNhaSiChange
ON LICHHEN
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE ln
    SET ln.TinhTrangCuocHen = 'DaHen',
        ln.MaKH = i.MaKH,
        ln.SoDT = i.SoDT
    FROM LICHNHASI ln
    INNER JOIN inserted i ON ln.MaNS = i.MaNS
    WHERE ln.TinhTrangCuocHen = 'ChuaHen'
      AND i.NgayGioKham BETWEEN ln.GioBatDau AND ln.GioKetThuc;
END;


GO

INSERT INTO LICHHEN (MaSoHen, NgayGioKham, LyDoKham, MaNS, MaKH, SoDT)
VALUES ('MSH02', '2023-11-16 10:30:00', N'Kiểm tra sức khỏe', 'NS01', 'KH01', '+12672133096');




GO

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
    INSERT INTO HOSOBENH (MaKH, SoDT, STT, NgayKham, DanDo, MaNS, MaDV,MaThuoc,TinhTrangXuatHoaDon)
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

GO



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
    IF EXISTS (SELECT * FROM inserted)
    BEGIN
      -- Get the value of MaDV from the inserted table
      SELECT @MaDV_Inserted = MaDV FROM inserted
      -- Check if there is a corresponding service in LOAIDICHVU table
      IF NOT EXISTS (SELECT * FROM LOAIDICHVU WITH (XLOCK,ROWLOCK) WHERE MaDV = @MaDV_Inserted)
      BEGIN
        -- Rollback the transaction and raise an error
        ROLLBACK TRANSACTION
        RAISERROR ('Không có dịch vụ tương ứng trong LOAIDICHVU', 16, 1)
        RETURN
      END
    END
    -- Check if the trigger is fired by a DELETE or UPDATE statement
    IF EXISTS (SELECT * FROM deleted)
    BEGIN
      -- Get the value of MaDV from the deleted table
      SELECT @MaDV_Deleted = MaDV FROM deleted
      -- Check if there is any other service in CHITIETDV that references the same service in LOAIDICHVU
      IF NOT EXISTS (SELECT * FROM CHITIETDV WITH (XLOCK,ROWLOCK) WHERE MaDV = @MaDV_Deleted)
      BEGIN
        -- Delete the corresponding service in LOAIDICHVU
        DELETE FROM LOAIDICHVU WHERE MaDV = @MaDV_Deleted
      END
    END
  -- Commit the transaction
  COMMIT TRANSACTION
END

GO

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
    INSERT INTO LOAIDICHVU (MaDV, TenDV, MoTa, DongGia)
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

GO

--Trigger cho nhân viên
CREATE TRIGGER CheckNhanVien
ON NHANVIEN
INSTEAD OF INSERT
AS
BEGIN
  DECLARE @MaNV char(20), @TenDangNhap char(50);
  SELECT @MaNV = MaNV, @TenDangNhap = TenDangNhap FROM inserted;

  -- Start transaction
  BEGIN TRANSACTION;

  -- Set transaction isolation level
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

  -- Check for duplicate MaNV
  IF EXISTS (SELECT 1 FROM NHANVIEN WITH (XLOCK, ROWLOCK) WHERE MaNV = @MaNV)
  BEGIN
    ROLLBACK TRANSACTION;
    RAISERROR ('Mã NV đã tồn tại', 16, 1);
    RETURN;
  END;

  -- Check for duplicate TenDangNhap
  IF EXISTS (SELECT 1 FROM NHANVIEN WITH (XLOCK, ROWLOCK) WHERE TenDangNhap = @TenDangNhap)
  BEGIN
    ROLLBACK TRANSACTION;
    RAISERROR ('Tên đăng nhập đã tồn tại', 16, 1);
    RETURN;
  END;

  -- If no duplicates, insert the row
  INSERT INTO NHANVIEN SELECT * FROM inserted;

  -- Commit transaction
  COMMIT TRANSACTION;
END;

GO

--Trigger cho quản trị viên
CREATE TRIGGER CheckQuantrivien
ON QUANTRIVIEN
INSTEAD OF INSERT
AS
BEGIN
  DECLARE @MaQTV char(20), @TenDangNhap char(50);
  SELECT @MaQTV = MaQTV, @TenDangNhap = TenDangNhap FROM inserted;

  -- Start transaction
  BEGIN TRANSACTION;

  -- Set transaction isolation level
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

  -- Check for duplicate MaQTV
  IF EXISTS (SELECT 1 FROM QUANTRIVIEN WITH (XLOCK, ROWLOCK) WHERE MaQTV = @MaQTV)
  BEGIN
    ROLLBACK TRANSACTION;
    RAISERROR ('Mã QTV đã tồn tại', 16, 1);
    RETURN;
  END;

  -- Check for duplicate TenDangNhap
  IF EXISTS (SELECT 1 FROM QUANTRIVIEN WITH (XLOCK, ROWLOCK) WHERE TenDangNhap = @TenDangNhap)
  BEGIN
    ROLLBACK TRANSACTION;
    RAISERROR ('Tên đăng nhập đã tồn tại', 16, 1);
    RETURN;
  END;

  -- If no duplicates, insert the row
  INSERT INTO QUANTRIVIEN SELECT * FROM inserted;

  -- Commit transaction
  COMMIT TRANSACTION;
END;

GO

--trigger cho Hóa đơn
CREATE TRIGGER CheckHoaDon
ON HOADON
INSTEAD OF INSERT
AS
BEGIN
  DECLARE @MaHoaDon char(20);
  SELECT @MaHoaDon = MaHoaDon FROM inserted;

  -- Start transaction
  BEGIN TRANSACTION;

  -- Set transaction isolation level
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

  -- Check for duplicate MaHoaDon
  IF EXISTS (SELECT 1 FROM HOADON WITH (XLOCK, ROWLOCK) WHERE MaHoaDon = @MaHoaDon)
  BEGIN
    ROLLBACK TRANSACTION;
    RAISERROR ('Mã hóa đơn đã tồn tại', 16, 1);
    RETURN;
  END;

  -- If no duplicates, insert the row
  INSERT INTO HOADON SELECT * FROM inserted;

  -- Commit transaction
  COMMIT TRANSACTION;
END;

GO

--trigger cho bảng lưu trữ ảnh
CREATE TRIGGER trg_CheckLuuTruAnh
ON LUUTRUANH
INSTEAD OF INSERT
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM NHASI N
        JOIN INSERTED I ON N.MaNS = I.MaNguoiDung
    )
    BEGIN
        -- If the condition is met, insert the row into LUUTRUANH and exit the trigger
        INSERT INTO LUUTRUANH
        SELECT * FROM INSERTED
        RETURN;
    END

    IF EXISTS (
        SELECT 1
        FROM KHACHHANG K
        JOIN INSERTED I ON K.MaKH = I.MaNguoiDung
    )
    BEGIN
        -- If the condition is met, insert the row into LUUTRUANH and exit the trigger
        INSERT INTO LUUTRUANH
        SELECT * FROM INSERTED
        RETURN;
    END

    IF EXISTS (
        SELECT 1
        FROM NHANVIEN NV
        JOIN INSERTED I ON NV.MaNV = I.MaNguoiDung
    )
    BEGIN
        -- If the condition is met, insert the row into LUUTRUANH and exit the trigger
        INSERT INTO LUUTRUANH
        SELECT * FROM INSERTED
        RETURN;
    END

    IF EXISTS (
        SELECT 1
        FROM QUANTRIVIEN QTV
        JOIN INSERTED I ON QTV.MaQTV = I.MaNguoiDung
    )
    BEGIN
        -- If the condition is met, insert the row into LUUTRUANH and exit the trigger
        INSERT INTO LUUTRUANH
        SELECT * FROM INSERTED
        RETURN;
    END

    -- If none of the conditions are met, raise an error
    RAISERROR ('Mã người dùng không tồn tại trong bất kỳ bảng nào.', 16, 1);
    ROLLBACK TRANSACTION;
END

GO


CREATE TRIGGER trg_KHACHHANG_delete
ON KHACHHANG
FOR DELETE
AS
BEGIN
    UPDATE CHITIETDV SET MaKH = NULL WHERE MaKH IN (SELECT MaKH FROM deleted)
    UPDATE LICHHEN SET MaKH = NULL WHERE MaKH IN (SELECT MaKH FROM deleted)
    UPDATE HOSOBENH SET MaKH = NULL WHERE MaKH IN (SELECT MaKH FROM deleted)
    UPDATE CHITIETTHUOC SET MaKH = NULL WHERE MaKH IN (SELECT MaKH FROM deleted)
    UPDATE HOADON SET MaKH = NULL WHERE MaKH IN (SELECT MaKH FROM deleted)
END
GO

-- Trigger for INSERT
CREATE TRIGGER trg_after_insert ON CHITIETTHUOC
AFTER INSERT
AS
BEGIN
  UPDATE LOAITHUOC
  SET LOAITHUOC.SoLuong = LOAITHUOC.SoLuong - inserted.SoLuong
  FROM LOAITHUOC
  INNER JOIN inserted ON LOAITHUOC.MaThuoc = inserted.MaThuoc;
END;

go

-- Trigger for UPDATE
CREATE TRIGGER trg_after_update ON CHITIETTHUOC
AFTER UPDATE
AS
BEGIN
  UPDATE LOAITHUOC
  SET LOAITHUOC.SoLuong = LOAITHUOC.SoLuong + deleted.SoLuong - inserted.SoLuong
  FROM LOAITHUOC
  INNER JOIN inserted ON LOAITHUOC.MaThuoc = inserted.MaThuoc
  INNER JOIN deleted ON LOAITHUOC.MaThuoc = deleted.MaThuoc;
END;

go

-- Trigger for DELETE
CREATE TRIGGER trg_after_delete ON CHITIETTHUOC
AFTER DELETE
AS
BEGIN
  UPDATE LOAITHUOC
  SET LOAITHUOC.SoLuong = LOAITHUOC.SoLuong + deleted.SoLuong
  FROM LOAITHUOC
  INNER JOIN deleted ON LOAITHUOC.MaThuoc = deleted.MaThuoc;
END;

go






---------------------------------------------------------STORE PROCEDURE---------------------------------------------------------------

CREATE PROCEDURE GetAllLichHen
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRY
        BEGIN TRANSACTION;
        SELECT * FROM LICHHEN;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
    END CATCH
END;
GO

CREATE PROCEDURE GetAllHoaDon
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRY
        BEGIN TRANSACTION;
        SELECT * FROM HOADON;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
    END CATCH
END;
GO



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
            IF EXISTS (SELECT 1 FROM KHACHHANG WITH (UPDLOCK, HOLDLOCK) WHERE SoDT = @SoDT)
            BEGIN
                RAISERROR ('Số điện thoại đã tồn tại.', 16, 1);
                ROLLBACK TRANSACTION;
                RETURN;
            END

            -- Thêm người dùng mới vào cơ sở dữ liệu
            INSERT INTO KHACHHANG (MaKH, SoDT, HoTen, Phai, NgaySinh, DiaChi, MatKhau, Email, NgayTao)
            VALUES (@MaKH, @SoDT, @HoTen, @Phai, @NgaySinh, @DiaChi, @MatKhau, @Email, GETDATE());

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

GO

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
                Email NVARCHAR(50),
				NgayTao DATETIME
            );

            INSERT INTO @users
            SELECT * FROM KHACHHANG WITH (TABLOCKX) ORDER BY MaKH;

			WAITFOR DELAY '00:00:01';

            COMMIT TRANSACTION; 

            SELECT * FROM @users;

            SET @retry = 0;
        END TRY
        BEGIN CATCH
            SET @retry = @retry - 1;
            ROLLBACK TRANSACTION;
        END CATCH
    END
END;

GO



--cập nhật thông tin người khám
CREATE PROCEDURE UpdateUserInfo
    @MaKH char(20),
	@SoDT char (15),
    @HoTen nvarchar(50),
    @Phai char(1),
    @NgaySinh datetime,
    @DiaChi nvarchar(100),
	@Email varchar(40)
AS
BEGIN
    -- Khởi tạo giao tác
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Đặt mức cô lập
        SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
        
        -- Cập nhật thông tin người dùng
        UPDATE KHACHHANG WITH (UPDLOCK,HOLDLOCK)
        SET SoDT = ISNULL(@SoDT, SoDT),
			HoTen = ISNULL(@HoTen, HoTen),
            Phai = ISNULL(@Phai, Phai),
            NgaySinh = ISNULL(@NgaySinh, NgaySinh),
            DiaChi = ISNULL(@DiaChi, DiaChi),
			Email = ISNULL(@Email,Email)
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
            EXEC UpdateUserInfo @MaKH,@SoDT ,@HoTen, @Phai, @NgaySinh, @DiaChi, @Email;
        END
    END CATCH
END;

GO


--Thêm lịch hẹn của người dùng 
CREATE PROCEDURE InsertAppointment
    @MaSoHen varchar(20),
    @NgayGioKham datetime,
    @LyDoKham nvarchar(100),
    @HoTen nvarchar(50),
    @MaKH char(20),
    @SoDT varchar(15)
AS
BEGIN
    -- Khai báo biến
    DECLARE @MaNS varchar(20)
    SELECT @MaNS = MaNS from NHASI where HoTen = @HoTen

    BEGIN TRY
        -- Bắt đầu giao tác
        BEGIN TRANSACTION;

        -- Thực hiện truy vấn INSERT với mức cô lập SERIALIZABLE để tránh dirty read, lost update, phantom read và unrepeatable read
        SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

        INSERT INTO LICHHEN (MaSoHen, NgayGioKham, LyDoKham, MaNS, MaKH, SoDT) 
        VALUES (@MaSoHen, @NgayGioKham, @LyDoKham, @MaNS, @MaKH, @SoDT);

        -- Kết thúc giao tác
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Nếu có lỗi, hủy giao tác
        ROLLBACK TRANSACTION;

        -- Đưa ra lỗi
        THROW;
    END CATCH
END;

GO

CREATE PROCEDURE InsertAppointmentByEmployee
    @MaSoHen varchar(20),
    @NgayGioKham datetime,
    @LyDoKham nvarchar(100),
    @HoTen nvarchar(50),
    @SoDT varchar(15)
AS
BEGIN
    -- Khai báo biến
	DECLARE @MaNS varchar(20)
	SELECT @MaNS = MaNS from NHASI where HoTen = @HoTen
	DECLARE @MaKH varchar(20)
	SELECT @MaKH = MaKH from KHACHHANG where SoDT = @SoDT

    BEGIN TRY
        -- Bắt đầu giao tác
        BEGIN TRANSACTION;

        -- Chờ 5 giây trước khi thực hiện giao tác để giảm thiểu thời gian giữ khóa
        WAITFOR DELAY '00:00:05';

        -- Thực hiện truy vấn INSERT với mức cô lập SERIALIZABLE để tránh dirty read, lost update, phantom read và unrepeatable read
        SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

        INSERT INTO LICHHEN (MaSoHen, NgayGioKham, LyDoKham, MaNS, MaKH, SoDT) 
        VALUES (@MaSoHen, @NgayGioKham, @LyDoKham, @MaNS, @MaKH, @SoDT);

        -- Kết thúc giao tác
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Nếu có lỗi, hủy giao tác
        ROLLBACK TRANSACTION;

        -- Đưa ra lỗi
        THROW;
    END CATCH
END;


GO

--Lấy thông tin hồ sơ bệnh án theo mã người dùng
CREATE PROCEDURE GetMedicalRecordByID
    @MaKH CHAR(20),
    @retry INT = 5
AS
BEGIN
    -- Khai báo biến
    DECLARE @retry_count INT = 0;
    DECLARE @wait_time INT = 500; -- thời gian chờ (ms)

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

GO

--Lấy tất cả thông tin nha sĩ theo người dùng
CREATE PROCEDURE GetAllDentistInfoByUser
AS
BEGIN
  -- Khai báo biến retry để kiểm soát số lần thử lại giao tác
  DECLARE @retry INT;
  SET @retry = 3;

  -- Bắt đầu một vòng lặp while
  WHILE @retry > 0
  BEGIN
    -- Bắt đầu một giao tác
    BEGIN TRANSACTION;

    -- Thiết lập mức cô lập là Read Committed
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

    -- Thử lấy thông tin nha sĩ từ bảng NHASI
    BEGIN TRY
      -- Sử dụng cơ chế khóa là RowLock để khóa từng hàng được truy vấn
      SELECT MaNS, HoTen, Phai, GioiThieu FROM NHASI WITH (ROWLOCK);

      -- Nếu không có lỗi, kết thúc giao tác và thoát khỏi vòng lặp
      COMMIT TRANSACTION;
      BREAK;
    END TRY
    BEGIN CATCH
      -- Nếu có lỗi, hủy bỏ giao tác và giảm biến retry đi 1
      ROLLBACK TRANSACTION;
      SET @retry = @retry - 1;

      -- Nếu lỗi là do deadlock, thì chờ 1 giây rồi thử lại
      IF ERROR_NUMBER() = 1205
      BEGIN
        WAITFOR DELAY '00:00:01';
      END
      -- Nếu lỗi khác, thì báo lỗi và thoát khỏi vòng lặp
      ELSE
      BEGIN
        DECLARE @ErrorMessage NVARCHAR(4000);
		SET @ErrorMessage = ERROR_MESSAGE();
		RAISERROR('Lỗi khi truy vấn thông tin nha sĩ: %s', 16, 1, @ErrorMessage);
        BREAK;
      END
    END CATCH
  END
END

GO

--Lấy Tất Cả Thông Tin lịch của nha sĩ
CREATE PROCEDURE GetAllLICHNHASI
AS
BEGIN
    -- Khởi tạo biến retry
    DECLARE @retry INT;
    SET @retry = 5;

    -- Bắt đầu vòng lặp while
    WHILE @retry > 0
    BEGIN
        SET @retry = @retry - 1;
        BEGIN TRY
            -- Bắt đầu giao tác
            BEGIN TRANSACTION;

            -- Đặt mức cô lập
            SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

            -- Truy vấn dữ liệu
            SELECT * FROM LICHNHASI;

            -- Kết thúc giao tác
            COMMIT TRANSACTION;

            -- Thoát khỏi vòng lặp while
            BREAK;
        END TRY
        BEGIN CATCH
            -- Nếu có lỗi xảy ra, rollback giao tác
            IF @@TRANCOUNT > 0
                ROLLBACK TRANSACTION;

            -- Nếu hết lần thử lại, đưa ra lỗi
            IF @retry = 0
                THROW;

            -- Chờ một khoảng thời gian nhất định trước khi thử lại
            WAITFOR DELAY '00:00:05';
        END CATCH
    END
END;

GO

--Lấy tất cả thông tin nha sĩ theo quản trị viên
CREATE PROCEDURE GetAllDentistInfoByAdmin
AS
BEGIN
  -- Khai báo biến retry để kiểm soát số lần thử lại giao tác
  DECLARE @retry INT;
  SET @retry = 3;

  -- Bắt đầu một vòng lặp while
  WHILE @retry > 0
  BEGIN
    -- Bắt đầu một giao tác
    BEGIN TRANSACTION;

    -- Thiết lập mức cô lập là Read Committed
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

    -- Thử lấy thông tin nha sĩ từ bảng NHASI
    BEGIN TRY
      -- Sử dụng cơ chế khóa là RowLock để khóa từng hàng được truy vấn
      SELECT * FROM NHASI WITH (ROWLOCK);

      -- Nếu không có lỗi, kết thúc giao tác và thoát khỏi vòng lặp
      COMMIT TRANSACTION;
      BREAK;
    END TRY
    BEGIN CATCH
      -- Nếu có lỗi, hủy bỏ giao tác và giảm biến retry đi 1
      ROLLBACK TRANSACTION;
      SET @retry = @retry - 1;

      -- Nếu lỗi là do deadlock, thì chờ 1 giây rồi thử lại
      IF ERROR_NUMBER() = 1205
      BEGIN
        WAITFOR DELAY '00:00:01';
      END
      -- Nếu lỗi khác, thì báo lỗi và thoát khỏi vòng lặp
      ELSE
      BEGIN
        DECLARE @ErrorMessage NVARCHAR(4000);
		SET @ErrorMessage = ERROR_MESSAGE();
		RAISERROR('Lỗi khi truy vấn thông tin nha sĩ: %s', 16, 1, @ErrorMessage);
        BREAK;
      END
    END CATCH
  END
END

GO

--Lấy tất cả thông tin nhân viên theo quản trị viên
CREATE PROCEDURE GetAllEmployee
AS
BEGIN
  -- Khai báo biến retry để kiểm soát số lần thử lại giao tác
  DECLARE @retry INT;
  SET @retry = 3;

  -- Bắt đầu một vòng lặp while
  WHILE @retry > 0
  BEGIN
    -- Bắt đầu một giao tác
    BEGIN TRANSACTION;

    -- Thiết lập mức cô lập là Read Committed
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

    -- Thử lấy thông tin nha sĩ từ bảng NHASI
    BEGIN TRY
      -- Sử dụng cơ chế khóa là RowLock để khóa từng hàng được truy vấn
      SELECT * FROM NHANVIEN WITH (ROWLOCK);

      -- Nếu không có lỗi, kết thúc giao tác và thoát khỏi vòng lặp
      COMMIT TRANSACTION;
      BREAK;
    END TRY
    BEGIN CATCH
      -- Nếu có lỗi, hủy bỏ giao tác và giảm biến retry đi 1
      ROLLBACK TRANSACTION;
      SET @retry = @retry - 1;

      -- Nếu lỗi là do deadlock, thì chờ 1 giây rồi thử lại
      IF ERROR_NUMBER() = 1205
      BEGIN
        WAITFOR DELAY '00:00:01';
      END
      -- Nếu lỗi khác, thì báo lỗi và thoát khỏi vòng lặp
      ELSE
      BEGIN
        DECLARE @ErrorMessage NVARCHAR(4000);
		SET @ErrorMessage = ERROR_MESSAGE();
		RAISERROR('Lỗi khi truy vấn thông tin nha sĩ: %s', 16, 1, @ErrorMessage);
        BREAK;
      END
    END CATCH
  END
END

GO

--Cật nhật mật khẩu bởi khách hàng
CREATE PROCEDURE UpdatePasswordByUser
    @MaKH CHAR(20),
    @SoDT CHAR(15),
    @newPassword CHAR(50)
AS
BEGIN
    -- Khởi tạo biến retry
    DECLARE @retry INT;
    SET @retry = 5;

    -- Sử dụng vòng lặp while để thử lại nếu có lỗi xảy ra
    WHILE @retry > 0
    BEGIN
        SET @retry = @retry - 1;
        BEGIN TRY
            -- Bắt đầu giao tác
            BEGIN TRANSACTION;

            -- Sử dụng mức cô lập SERIALIZABLE để tránh dirty read, lost update, phantom read và unrepeatable read
            SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

            -- Cập nhật mật khẩu
            UPDATE KHACHHANG
            SET MatKhau = @newPassword
            WHERE MaKH = @MaKH AND SoDT = @SoDT;

            -- Kết thúc giao tác
            COMMIT TRANSACTION;

            -- Thoát khỏi vòng lặp while
            BREAK;
        END TRY
        BEGIN CATCH
            -- Nếu có lỗi xảy ra, hủy giao tác
            IF @@TRANCOUNT > 0
                ROLLBACK TRANSACTION;

            -- Nếu còn lần thử lại, đợi 1 giây rồi thử lại
            IF @retry > 0
                WAITFOR DELAY '00:00:01';
            ELSE
                -- Nếu hết lần thử lại, đưa ra lỗi
                THROW;
        END CATCH;
    END;
END;

GO

CREATE PROCEDURE UpdateProfilePicture
    @MaNguoiDung char(20),
    @SoDT char(15),
    @AvatarUrl varchar(200)
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
        IF EXISTS (SELECT 1 FROM LUUTRUANH WITH (UPDLOCK, HOLDLOCK) WHERE MaNguoiDung = @MaNguoiDung)
            UPDATE LUUTRUANH SET AvatarUrl = @AvatarUrl WHERE MaNguoiDung = @MaNguoiDung
        ELSE
            INSERT INTO LUUTRUANH (MaNguoiDung, SoDT ,AvatarUrl) VALUES (@MaNguoiDung,@SoDT,@AvatarUrl)
        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        THROW;
    END CATCH
END

GO

CREATE PROCEDURE getDoctorDetailsByUser
    @MaNS char(20),
    @retry INT = 5
AS
BEGIN
    -- Khai báo biến
    DECLARE @retry_count INT = 0;
    DECLARE @wait_time INT = 500; -- thời gian chờ (ms)

    -- Bắt đầu vòng lặp while
    WHILE @retry_count < @retry
    BEGIN
        BEGIN TRY
            -- Bắt đầu giao dịch
            BEGIN TRANSACTION;

            -- Đặt mức cô lập
            SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

            -- Truy vấn dữ liệu
            SELECT * FROM NHASI WITH (ROWLOCK, READCOMMITTED)
            WHERE MaNS = @MaNS;

            -- Kết thúc giao dịch
            COMMIT TRANSACTION;

            -- Thoát khỏi vòng lặp
            BREAK;
        END TRY
        BEGIN CATCH
            -- Kiểm tra xem giao dịch có đang hoạt động không
            IF @@TRANCOUNT > 0
            BEGIN
                -- Hủy giao dịch
                ROLLBACK TRANSACTION;
            END;

            -- Tăng biến đếm lỗi
            SET @retry_count += 1;

            -- Nếu số lần thử lại vượt quá giới hạn, đưa ra lỗi
            IF @retry_count >= @retry
            BEGIN
                THROW;
            END;

            -- Chờ một khoảng thời gian trước khi thử lại
            WAITFOR DELAY @wait_time;
        END CATCH;
    END;
END;

GO

CREATE PROCEDURE getAppointmentByUser
    @MaKH char(20),
    @retry INT = 5
AS
BEGIN
    -- Khai báo biến
    DECLARE @retry_count INT = 0;
    DECLARE @wait_time INT = 500; -- thời gian chờ (ms)

    -- Bắt đầu vòng lặp while
    WHILE @retry_count < @retry
    BEGIN
        BEGIN TRY
            -- Bắt đầu giao dịch
            BEGIN TRANSACTION;

            -- Đặt mức cô lập
            SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

            -- Truy vấn dữ liệu
            SELECT L.*, N.HoTen FROM LICHHEN L WITH (ROWLOCK, READCOMMITTED)
            JOIN NHASI N ON L.MaNS = N.MaNS
            WHERE MaKH = @MaKH;

            -- Kết thúc giao dịch
            COMMIT TRANSACTION;

            -- Thoát khỏi vòng lặp
            BREAK;
        END TRY
        BEGIN CATCH
            -- Kiểm tra xem giao dịch có đang hoạt động không
            IF @@TRANCOUNT > 0
            BEGIN
                -- Hủy giao dịch
                ROLLBACK TRANSACTION;
            END;

            -- Tăng biến đếm lỗi
            SET @retry_count += 1;

            -- Nếu số lần thử lại vượt quá giới hạn, đưa ra lỗi
            IF @retry_count >= @retry
            BEGIN
                THROW;
            END;

            -- Chờ một khoảng thời gian trước khi thử lại
            WAITFOR DELAY @wait_time;
        END CATCH;
    END;
END;

GO


CREATE PROCEDURE AddMedicineByAdmin
    @MaThuoc char(30),
    @TenThuoc nvarchar(100),
    @DonViTinh nvarchar(100),
    @ChiDinh nvarchar(200),
    @SoLuong int,
    @NgayHetHan date,
    @GiaThuoc bigint
AS
BEGIN
    BEGIN TRANSACTION
    BEGIN TRY
        INSERT INTO LOAITHUOC VALUES (@MaThuoc, @TenThuoc, @DonViTinh, @ChiDinh, @SoLuong, @NgayHetHan, @GiaThuoc)
        COMMIT
    END TRY
    BEGIN CATCH
        ROLLBACK
    END CATCH
END

GO

CREATE PROCEDURE DeleteMedicineByAdmin
    @MaThuoc char(30)
AS
BEGIN
    BEGIN TRANSACTION
    BEGIN TRY
        DELETE FROM LOAITHUOC WHERE MaThuoc = @MaThuoc
        COMMIT
    END TRY
    BEGIN CATCH
        ROLLBACK
    END CATCH
END

GO

CREATE PROCEDURE UpdateMedicineByAdmin
    @MaThuoc char(30),
    @SoLuong int
AS
BEGIN
    BEGIN TRANSACTION
    BEGIN TRY
        UPDATE LOAITHUOC SET SoLuong = @SoLuong WHERE MaThuoc = @MaThuoc
        COMMIT
    END TRY
    BEGIN CATCH
        ROLLBACK
    END CATCH
END

GO

CREATE PROCEDURE GetAllMedicine
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
        SELECT * FROM LOAITHUOC WITH (ROWLOCK);
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrMsg nvarchar(4000), @ErrSeverity int;
        SELECT @ErrMsg = ERROR_MESSAGE(),
               @ErrSeverity = ERROR_SEVERITY();
        RAISERROR(@ErrMsg, @ErrSeverity, 1);
    END CATCH;
END;

GO


CREATE PROCEDURE AddUser
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
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
        INSERT INTO KHACHHANG VALUES (@MaKH, @SoDT, @HoTen, @Phai, @NgaySinh, @DiaChi, @MatKhau, @Email, GETDATE());
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrMsg nvarchar(4000), @ErrSeverity int;
        SELECT @ErrMsg = ERROR_MESSAGE(),
               @ErrSeverity = ERROR_SEVERITY();
        RAISERROR(@ErrMsg, @ErrSeverity, 1);
    END CATCH;
END;

GO

CREATE PROCEDURE DeleteUser
    @MaKH char(20)
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
        DELETE FROM KHACHHANG WHERE MaKH = @MaKH;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrMsg nvarchar(4000), @ErrSeverity int;
        SELECT @ErrMsg = ERROR_MESSAGE(),
               @ErrSeverity = ERROR_SEVERITY();
        RAISERROR(@ErrMsg, @ErrSeverity, 1);
    END CATCH;
END;

GO

CREATE PROCEDURE UpdateUser
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
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
        UPDATE KHACHHANG SET SoDT = ISNULL(@SoDT,SoDT), 
		HoTen = ISNULL(@HoTen,HoTen), 
		Phai = ISNULL(@Phai,Phai), 
		NgaySinh = ISNULL(@NgaySinh,NgaySinh), 
		DiaChi = ISNULL(@DiaChi,DiaChi), 
		MatKhau = ISNULL(@MatKhau,MatKhau), 
		Email = ISNULL(@Email,Email) 
		WHERE MaKH = @MaKH;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrMsg nvarchar(4000), @ErrSeverity int;
        SELECT @ErrMsg = ERROR_MESSAGE(),
               @ErrSeverity = ERROR_SEVERITY();
        RAISERROR(@ErrMsg, @ErrSeverity, 1);
    END CATCH;
END;

GO

CREATE PROCEDURE GetAllMedicalRecord
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
    BEGIN TRANSACTION;
    SELECT * FROM HOSOBENH;
    COMMIT TRANSACTION;
END;

GO


CREATE PROCEDURE InsertMedicalRecord
    @SoDT char(15),
    @STT int,
    @NgayKham datetime,
    @DanDo nvarchar(300),
    @MaNS char(20),
    @TenDV nvarchar(40),
    @TenThuoc nvarchar(100),
    @TinhTrangXuatHoaDon CHAR(10)
AS
BEGIN
	DECLARE @MaKH char(20)
	SELECT @MaKH = MaKH from KHACHHANG where SoDT = @SoDT

	DECLARE @MaDV char(10)
	SELECT @MaDV = MaDV from LOAIDICHVU where TenDV = @TenDV

	DECLARE @MaThuoc char(30)
	SELECT @MaThuoc = MaThuoc from LOAITHUOC where Tenthuoc = @TenThuoc
	
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    INSERT INTO HOSOBENH VALUES (@MaKH, @SoDT, @STT, @NgayKham, @DanDo, @MaNS, @MaDV, @MaThuoc, @TinhTrangXuatHoaDon);
    COMMIT TRANSACTION;
END;

GO

CREATE PROCEDURE DeleteMedicalRecordBySoDT
    @SoDT char(15)
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
    BEGIN TRANSACTION;
    DELETE FROM HOSOBENH WHERE SoDT = @SoDT;
    COMMIT TRANSACTION;
END;

GO

CREATE PROCEDURE UpdateMedicalRecord
    @MaKH char(20),
    @SoDT char(15),
    @STT int,
    @NgayKham datetime,
    @DanDo nvarchar(300),
    @MaNS char(20),
    @MaDV char(10),
    @MaThuoc char(30),
    @TinhTrangXuatHoaDon CHAR(10)
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
    BEGIN TRANSACTION;
    UPDATE HOSOBENH
    SET NgayKham = ISNULL(@NgayKham,NgayKham), 
	DanDo = ISNULL(@DanDo,DanDo), 
	MaNS = ISNULL(@MaNS,MaNS), 
	MaDV = ISNULL(@MaDV,MaDV), 
	MaThuoc = ISNULL(@MaThuoc,MaThuoc),
	TinhTrangXuatHoaDon = ISNULL(@TinhTrangXuatHoaDon,TinhTrangXuatHoaDon),
	STT = ISNULL(@STT,STT)
    WHERE MaKH = @MaKH AND SoDT = @SoDT 
    COMMIT TRANSACTION;
END;

GO


CREATE PROCEDURE ThemLichNhaSi
    @MaNS char(20),
    @STT int,
    @GioBatDau datetime,
    @GioKetThuc datetime,
    @TinhTrangCuocHen char(20),
    @MaKH char(20) = NULL,
    @SoDT char(15) = NULL
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
        INSERT INTO LICHNHASI(MaNS, STT, GioBatDau, GioKetThuc, TinhTrangCuocHen, MaKH, SoDT)
        VALUES (@MaNS, @STT, @GioBatDau, @GioKetThuc, @TinhTrangCuocHen, @MaKH, @SoDT);
        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        THROW;
    END CATCH
END;

GO
DROP PROCEDURE SuaLichNhaSi

CREATE PROCEDURE SuaLichNhaSi
    @MaNS char(20),
    @STT int,
    @GioBatDau datetime,
    @GioKetThuc datetime
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
        DECLARE @TinhTrangCuocHen char(20);
        SELECT @TinhTrangCuocHen = TinhTrangCuocHen FROM LICHNHASI WHERE MaNS = @MaNS AND STT = @STT;

        IF @TinhTrangCuocHen = 'ChuaHen'
        BEGIN
            UPDATE LICHNHASI
            SET GioBatDau = ISNULL(@GioBatDau,GioBatDau), 
                GioKetThuc = ISNULL(@GioKetThuc,GioKetThuc)
            WHERE MaNS = @MaNS AND STT = @STT;
        END
        ELSE IF @TinhTrangCuocHen = 'DaHen'
        BEGIN
            THROW 51000, 'ko thể sửa lịch do khách hàng đã đặt giờ đó', 1;
        END

        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        THROW;
    END CATCH
END;



GO

CREATE PROCEDURE GetAllLoaiDichVu
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
        SELECT * FROM LOAIDICHVU;
        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        THROW;
    END CATCH
END;

GO

CREATE PROCEDURE GetAllLoaiThuoc
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
        SELECT * FROM LOAITHUOC;
        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        THROW;
    END CATCH
END;

GO


CREATE PROCEDURE AddDentist
    @MaNS char(20),
    @TenDangNhap char(50),
    @HoTen nvarchar(50),
    @Phai char(1),
    @GioiThieu nvarchar(300),
    @MatKhau char(50)
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
        INSERT INTO NHASI VALUES (@MaNS, @TenDangNhap, @HoTen, @Phai, @GioiThieu, @MatKhau);
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrMsg nvarchar(4000), @ErrSeverity int;
        SELECT @ErrMsg = ERROR_MESSAGE(),
               @ErrSeverity = ERROR_SEVERITY();
        RAISERROR(@ErrMsg, @ErrSeverity, 1);
    END CATCH;
END;

GO

CREATE PROCEDURE DeleteDentist
    @MaNS char(20)
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
        DELETE FROM NHASI WHERE MaNS = @MaNS;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrMsg nvarchar(4000), @ErrSeverity int;
        SELECT @ErrMsg = ERROR_MESSAGE(),
               @ErrSeverity = ERROR_SEVERITY();
        RAISERROR(@ErrMsg, @ErrSeverity, 1);
    END CATCH;
END;

GO

CREATE PROCEDURE UpdateDentist
    @MaNS char(20),
    @TenDangNhap char(50),
    @HoTen nvarchar(50),
    @Phai char(1),
    @GioiThieu nvarchar(300),
    @MatKhau char(50)
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
        UPDATE NHASI SET 
		TenDangNhap = ISNULL(@TenDangNhap,TenDangNhap), 
		HoTen = ISNULL(@HoTen,HoTen), 
		Phai = ISNULL(@Phai,Phai), 
		GioiThieu = ISNULL(@GioiThieu,GioiThieu), 
		MatKhau = ISNULL(@MatKhau,MatKhau)
		WHERE MaNS = @MaNS;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrMsg nvarchar(4000), @ErrSeverity int;
        SELECT @ErrMsg = ERROR_MESSAGE(),
               @ErrSeverity = ERROR_SEVERITY();
        RAISERROR(@ErrMsg, @ErrSeverity, 1);
    END CATCH;
END;

GO

CREATE PROCEDURE AddEmployee
    @MaNV char(20),
    @HoTen nvarchar(100),
    @Phai char(1),
    @TenDangNhap char(50),
    @MatKhau char(50)
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
        INSERT INTO NHANVIEN VALUES (@MaNV, @HoTen, @Phai, @TenDangNhap, @MatKhau);
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrMsg nvarchar(4000), @ErrSeverity int;
        SELECT @ErrMsg = ERROR_MESSAGE(),
               @ErrSeverity = ERROR_SEVERITY();
        RAISERROR(@ErrMsg, @ErrSeverity, 1);
    END CATCH;
END;

GO

CREATE PROCEDURE DeleteEmployee
    @MaNV char(20)
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
        DELETE FROM NHANVIEN WHERE MaNV = @MaNV;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrMsg nvarchar(4000), @ErrSeverity int;
        SELECT @ErrMsg = ERROR_MESSAGE(),
               @ErrSeverity = ERROR_SEVERITY();
        RAISERROR(@ErrMsg, @ErrSeverity, 1);
    END CATCH;
END;

GO

CREATE PROCEDURE UpdateEmployee
    @MaNV char(20),
    @HoTen nvarchar(100),
    @Phai char(1),
    @TenDangNhap char(50),
    @MatKhau char(50)
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
        UPDATE NHANVIEN SET 
		HoTen = ISNULL(@HoTen,HoTen), 
		Phai = ISNULL(@Phai,Phai), 
		TenDangNhap = ISNULL(@TenDangNhap,TenDangNhap), 
		MatKhau = ISNULL(@MatKhau,MatKhau)
		WHERE MaNV = @MaNV;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrMsg nvarchar(4000), @ErrSeverity int;
        SELECT @ErrMsg = ERROR_MESSAGE(),
               @ErrSeverity = ERROR_SEVERITY();
        RAISERROR(@ErrMsg, @ErrSeverity, 1);
    END CATCH;
END;

GO


CREATE PROCEDURE GetAllLichHen
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRY
        BEGIN TRANSACTION;
        SELECT * FROM LICHHEN;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
    END CATCH
END;
GO

CREATE PROCEDURE GetAllHoaDon
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRY
        BEGIN TRANSACTION;
        SELECT * FROM HOADON;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
    END CATCH
END;
GO



CREATE PROCEDURE CreateHoaDon
    @MaHoaDon char(20),
    @SoDT char(15),
    @NgayXuat datetime,
    @TongChiPhi bigint,
    @TinhTrangThanhToan char(30),
    @MaNV char(20),
    @TenDV nvarchar(40)
AS
BEGIN
    DECLARE @MaKH char(20);
    SELECT @MaKH = MaKH FROM KHACHHANG WHERE SoDT = @SoDT;

	DECLARE @MaDV char(20);
    SELECT @MaDV = MaDV FROM LOAIDICHVU WHERE TenDV = @TenDV;

	
	DECLARE @STT int;
    SELECT @STT = STT FROM HOSOBENH WHERE MaKH = @MaKH;

    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRY
        BEGIN TRANSACTION;
        INSERT INTO HOADON(MaHoaDon, MaKH, SoDT, STT, NgayXuat, TongChiPhi, TinhTrangThanhToan, MaNV, MaDV)
        VALUES (@MaHoaDon, @MaKH, @SoDT, @STT, @NgayXuat, @TongChiPhi, @TinhTrangThanhToan, @MaNV, @MaDV);
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
    END CATCH
END;

GO


CREATE PROCEDURE UpdateLichHen
    @MaSoHen char(20),
	@MaKH char(20),
    @NgayGioKham datetime,
    @LyDoKham nvarchar(100),
    @MaNS char(20),
    @SoDT char(15)
AS
BEGIN
    

    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRY
	    
        BEGIN TRANSACTION;
        UPDATE LICHHEN
        SET NgayGioKham = ISNULL(@NgayGioKham,NgayGioKham), 
		LyDoKham = ISNULL(@LyDoKham,LyDoKham), 
		MaNS = ISNULL(@MaNS,MaNS), 
		MaKH = ISNULL(@MaKH,MaKH), 
		SoDT = ISNULL(@SoDT,SoDT)
        WHERE MaSoHen = @MaSoHen;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
    END CATCH
END;
GO

CREATE PROCEDURE DeleteLichHen
    @MaSoHen char(20)
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRY
        BEGIN TRANSACTION;
        DELETE FROM LICHHEN WHERE MaSoHen = @MaSoHen;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
    END CATCH
END;
GO


CREATE PROCEDURE UpdateHoaDon
    @MaHoaDon char(20),
    @SoDT char(15),
    @STT int,
	@MaKH char(20),
    @NgayXuat datetime,
    @TongChiPhi bigint,
    @TinhTrangThanhToan char(30),
    @MaNV char(20),
    @MaDV char(10)
AS
BEGIN
	

    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRY
        BEGIN TRANSACTION;
        UPDATE HOADON
        SET MaKH = ISNULL(@MaKH,MaKH), 
		SoDT = ISNULL(@SoDT,SoDT), 
		STT = ISNULL(@STT,STT), 
		NgayXuat = ISNULL(@NgayXuat,NgayXuat), 
		TongChiPhi = ISNULL(@TongChiPhi,TongChiPhi), 
		TinhTrangThanhToan = ISNULL(@TinhTrangThanhToan,TinhTrangThanhToan), 
		MaNV = ISNULL(@MaNV,MaNV), 
		MaDV = ISNULL(@MaDV,MaDV)
        WHERE MaHoaDon = @MaHoaDon;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
    END CATCH
END;
GO



CREATE PROCEDURE DeleteHoaDon
    @MaHoaDon char(20)
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRY
        BEGIN TRANSACTION;
        DELETE FROM HOADON WHERE MaHoaDon = @MaHoaDon;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
    END CATCH
END;
GO

CREATE PROCEDURE GetDentistScheduleByMaNS
    @MaNS char(20)
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
        SELECT * FROM LICHNHASI WHERE MaNS = @MaNS;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrMsg nvarchar(4000), @ErrSeverity int;
        SELECT @ErrMsg = ERROR_MESSAGE(),
               @ErrSeverity = ERROR_SEVERITY();

        RAISERROR(@ErrMsg, @ErrSeverity, 1);
    END CATCH;
END;

GO

CREATE PROCEDURE XoaLichNhaSi
    @MaNS char(20),
    @STT int
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
        DELETE FROM LICHNHASI WHERE MaNS = @MaNS AND STT = @STT;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrMsg nvarchar(4000), @ErrSeverity int;
        SELECT @ErrMsg = ERROR_MESSAGE(),
               @ErrSeverity = ERROR_SEVERITY();

        RAISERROR(@ErrMsg, @ErrSeverity, 1);
    END CATCH;
END;

GO

CREATE PROCEDURE GetDetailMedicineByUser
    @MaKH char(20)
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
        SELECT *
        FROM CHITIETTHUOC
        WHERE MaKH = @MaKH;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;

go

CREATE PROCEDURE CreateCHITIETTHUOC
    @TenThuoc nvarchar(100),
    @HoTen nvarchar(50),
    @SoDT char(15),
    @SoLuong int,
    @ThoiDiemDung nvarchar(50)
AS
BEGIN

	DECLARE @MaThuoc char(30);
    SELECT @MaThuoc = MaThuoc FROM LOAITHUOC WHERE TenThuoc = @TenThuoc;

	DECLARE @MaKH char(20);
    SELECT @MaKH = MaKH FROM KHACHHANG WHERE HoTen = @HoTen;

	DECLARE @STT int;
    SELECT @STT =STT FROM HOSOBENH WHERE SoDT= @SoDT;

    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRY
        BEGIN TRANSACTION;
        INSERT INTO CHITIETTHUOC(MaThuoc, MaKH, SoDT, STT, SoLuong, ThoiDiemDung)
        VALUES (@MaThuoc, @MaKH, @SoDT, @STT, @SoLuong, @ThoiDiemDung);
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
    END CATCH
END;

go

CREATE PROCEDURE UpdateCHITIETTHUOC
    @MaThuoc char(30),
    @MaKH char(20),
    @SoDT char(15),
    @STT int,
    @SoLuong int,
    @ThoiDiemDung nvarchar(50)
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRY
        BEGIN TRANSACTION;
        UPDATE CHITIETTHUOC
        SET SoLuong = ISNULL(@SoLuong,SoLuong), 
            ThoiDiemDung = ISNULL(@ThoiDiemDung,ThoiDiemDung)
        WHERE MaThuoc = @MaThuoc AND MaKH = @MaKH AND SoDT = @SoDT AND STT = @STT;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
    END CATCH
END;

go

CREATE PROCEDURE DeleteCHITIETTHUOC
    @MaThuoc char(30),
    @MaKH char(20),
    @SoDT char(15),
    @STT int
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRY
        BEGIN TRANSACTION;
        DELETE FROM CHITIETTHUOC WHERE MaThuoc = @MaThuoc AND MaKH = @MaKH AND SoDT = @SoDT AND STT = @STT;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
    END CATCH
END;

go

CREATE PROCEDURE GetAllCHITIETTHUOC
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
    BEGIN TRY
        BEGIN TRANSACTION;
        SELECT *
        FROM CHITIETTHUOC;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
    END CATCH
END;

go



-----------------------------------------------------PHÂN QUYỀN----------------------------------------------------------------------------
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



--Phân quyền người dùng(trên nodejs đã code phân quyền ng dùng nên ko cần phân quyền trên sql server nữa)
USE MASTER;
GO
CREATE LOGIN KH03
WITH PASSWORD = 'password110',
CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF,
DEFAULT_DATABASE = PHONGKHAMNHASI
GO

USE PHONGKHAMNHASI
GO 
CREATE USER KH03
for login KH03
GO

USE PHONGKHAMNHASI
GO
GRANT SELECT, UPDATE 
ON KHACHHANG TO KH03
            
USE PHONGKHAMNHASI
GO
GRANT SELECT,UPDATE, INSERT
ON LICHHEN TO KH03
GO

USE PHONGKHAMNHASI
GO
GRANT SELECT
ON HOSOBENH TO KH03
GO

USE PHONGKHAMNHASI
GO
GRANT SELECT
ON NHASI TO KH03
GO

USE PHONGKHAMNHASI
GO
GRANT SELECT,DELETE,UPDATE,INSERT
ON LUUTRUANH TO KH03
GO

USE PHONGKHAMNHASI
GO
GRANT SELECT,UPDATE
ON HOADON TO KH03
GO

GRANT EXECUTE ON UpdateUserInfo TO KH03
GRANT EXECUTE ON InsertAppointment TO KH03
GRANT EXECUTE ON GetMedicalRecordByID TO KH03
GRANT EXECUTE ON GetAllDentistInfoByUser TO KH03
GRANT EXECUTE ON GetAllLICHNHASI TO KH03
GRANT EXECUTE ON UpdatePasswordByUser TO KH03
GRANT EXECUTE ON UpdateProfilePicture TO KH03
GRANT EXECUTE ON getDoctorDetailsByUser TO KH03
GRANT EXECUTE ON getAppointmentByUser TO KH03
GRANT EXECUTE ON GetAllLoaiDichVu TO KH03
GRANT EXECUTE ON GetDetailMedicineByUser TO KH03



--------KH02
USE MASTER;
GO
CREATE LOGIN KH02
WITH PASSWORD = 'password110',
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

USE PHONGKHAMNHASI
GO
GRANT SELECT,DELETE,UPDATE,INSERT
ON LUUTRUANH TO KH02
GO

USE PHONGKHAMNHASI
GO
GRANT SELECT,UPDATE
ON HOADON TO KH02
GO

GRANT EXECUTE ON UpdateUserInfo TO KH02
GRANT EXECUTE ON InsertAppointment TO KH02
GRANT EXECUTE ON GetMedicalRecordByID TO KH02
GRANT EXECUTE ON GetAllDentistInfoByUser TO KH02
GRANT EXECUTE ON GetAllLICHNHASI TO KH02
GRANT EXECUTE ON UpdatePasswordByUser TO KH02
GRANT EXECUTE ON UpdateProfilePicture TO KH02
GRANT EXECUTE ON getDoctorDetailsByUser TO KH02
GRANT EXECUTE ON getAppointmentByUser TO KH02
GRANT EXECUTE ON GetAllLoaiDichVu TO KH02
GRANT EXECUTE ON GetDetailMedicineByUser TO KH02




--Phân quyền quản trị viên
USE MASTER;
GO
CREATE LOGIN QTV01
WITH PASSWORD = '123456',
CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF,
DEFAULT_DATABASE = PHONGKHAMNHASI
GO

USE PHONGKHAMNHASI
GO 
CREATE USER QTV01
for login QTV01
GO

EXEC sp_addrolemember 'db_owner', 'QTV01';
GO

USE master;
GO
GRANT ALTER ANY LOGIN TO QTV01;
GO
USE PHONGKHAMNHASI;
GO
GRANT ALTER ANY USER TO QTV01;
GO



--Phân quyền nha sĩ
USE MASTER;
GO
CREATE LOGIN NS01
WITH PASSWORD = '123456',
CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF,
DEFAULT_DATABASE = PHONGKHAMNHASI
GO

CREATE LOGIN NS02
WITH PASSWORD = 'abcdf',
CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF,
DEFAULT_DATABASE = PHONGKHAMNHASI
GO

CREATE LOGIN NS03
WITH PASSWORD = 'ghijkl',
CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF,
DEFAULT_DATABASE = PHONGKHAMNHASI
GO

USE PHONGKHAMNHASI
GO 
CREATE USER NS01
for login NS01
GO

CREATE USER NS02
for login NS02
GO

CREATE USER NS03
for login NS03
GO

--Nha sĩ NS01
USE PHONGKHAMNHASI
GO
GRANT SELECT,UPDATE, INSERT, DELETE
ON HOSOBENH TO NS01

USE PHONGKHAMNHASI
GO
GRANT SELECT,UPDATE, INSERT, DELETE
ON LICHNHASI TO NS01

USE PHONGKHAMNHASI
GO
GRANT SELECT
ON LOAITHUOC TO NS01

USE PHONGKHAMNHASI
GO
GRANT SELECT
ON LOAIDICHVU TO NS01

USE PHONGKHAMNHASI
GO
GRANT SELECT
ON LICHHEN TO NS01

USE PHONGKHAMNHASI
GO
GRANT SELECT,DELETE,UPDATE,INSERT
ON LUUTRUANH TO NS01

GRANT EXECUTE ON UpdateProfilePicture TO NS01
GRANT EXECUTE ON GetAllMedicalRecord TO NS01
GRANT EXECUTE ON InsertMedicalRecord TO NS01
GRANT EXECUTE ON UpdateMedicalRecord TO NS01
GRANT EXECUTE ON DeleteMedicalRecordBySoDT TO NS01
GRANT EXECUTE ON ThemLichNhaSi TO NS01
GRANT EXECUTE ON SuaLichNhaSi TO NS01
GRANT EXECUTE ON GetAllLoaiDichVu TO NS01
GRANT EXECUTE ON GetAllLoaiThuoc TO NS01
GRANT EXECUTE ON GetDentistScheduleByMaNS TO NS01
GRANT EXECUTE ON XoaLichNhaSi TO NS01
GRANT EXECUTE ON CreateCHITIETTHUOC TO NS01
GRANT EXECUTE ON UpdateCHITIETTHUOC TO NS01
GRANT EXECUTE ON DeleteCHITIETTHUOC TO NS01
GRANT EXECUTE ON GetAllCHITIETTHUOC TO NS01


--Nha sĩ NS02
USE PHONGKHAMNHASI
GO
GRANT SELECT,UPDATE, INSERT, DELETE
ON HOSOBENH TO NS02

USE PHONGKHAMNHASI
GO
GRANT SELECT,UPDATE, INSERT, DELETE
ON LICHNHASI TO NS02

USE PHONGKHAMNHASI
GO
GRANT SELECT
ON LOAITHUOC TO NS02

USE PHONGKHAMNHASI
GO
GRANT SELECT
ON LOAIDICHVU TO NS02

USE PHONGKHAMNHASI
GO
GRANT SELECT
ON LICHHEN TO NS02

USE PHONGKHAMNHASI
GO
GRANT SELECT,DELETE,UPDATE,INSERT
ON LUUTRUANH TO NS02

GRANT EXECUTE ON UpdateProfilePicture TO NS02
GRANT EXECUTE ON GetAllMedicalRecord TO NS02
GRANT EXECUTE ON InsertMedicalRecord TO NS02
GRANT EXECUTE ON UpdateMedicalRecord TO NS02
GRANT EXECUTE ON DeleteMedicalRecordBySoDT TO NS02
GRANT EXECUTE ON ThemLichNhaSi TO NS02
GRANT EXECUTE ON SuaLichNhaSi TO NS02
GRANT EXECUTE ON GetAllLoaiDichVu TO NS02
GRANT EXECUTE ON GetAllLoaiThuoc TO NS02
GRANT EXECUTE ON GetDentistScheduleByMaNS TO NS02
GRANT EXECUTE ON XoaLichNhaSi TO NS02
GRANT EXECUTE ON CreateCHITIETTHUOC TO NS02
GRANT EXECUTE ON UpdateCHITIETTHUOC TO NS02
GRANT EXECUTE ON DeleteCHITIETTHUOC TO NS02
GRANT EXECUTE ON GetAllCHITIETTHUOC TO NS02


--Nha sĩ NS03
USE PHONGKHAMNHASI
GO
GRANT SELECT,UPDATE, INSERT, DELETE
ON HOSOBENH TO NS03

USE PHONGKHAMNHASI
GO
GRANT SELECT,UPDATE, INSERT, DELETE
ON LICHNHASI TO NS03

USE PHONGKHAMNHASI
GO
GRANT SELECT
ON LOAITHUOC TO NS03

USE PHONGKHAMNHASI
GO
GRANT SELECT
ON LOAIDICHVU TO NS03

USE PHONGKHAMNHASI
GO
GRANT SELECT
ON LICHHEN TO NS03

USE PHONGKHAMNHASI
GO
GRANT SELECT,DELETE,UPDATE,INSERT
ON LUUTRUANH TO NS03

GRANT EXECUTE ON UpdateProfilePicture TO NS03
GRANT EXECUTE ON GetAllMedicalRecord TO NS03
GRANT EXECUTE ON InsertMedicalRecord TO NS03
GRANT EXECUTE ON UpdateMedicalRecord TO NS03
GRANT EXECUTE ON DeleteMedicalRecordBySoDT TO NS03
GRANT EXECUTE ON ThemLichNhaSi TO NS03
GRANT EXECUTE ON SuaLichNhaSi TO NS03
GRANT EXECUTE ON GetAllLoaiDichVu TO NS03
GRANT EXECUTE ON GetAllLoaiThuoc TO NS03
GRANT EXECUTE ON GetDentistScheduleByMaNS TO NS03
GRANT EXECUTE ON XoaLichNhaSi TO NS03
GRANT EXECUTE ON CreateCHITIETTHUOC TO NS03
GRANT EXECUTE ON UpdateCHITIETTHUOC TO NS03
GRANT EXECUTE ON DeleteCHITIETTHUOC TO NS03
GRANT EXECUTE ON GetAllCHITIETTHUOC TO NS03


-------------------------
--Phân quyền nhân viên
USE MASTER;
GO
CREATE LOGIN NV01
WITH PASSWORD = 'nhanvien01',
CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF,
DEFAULT_DATABASE = PHONGKHAMNHASI
GO

USE PHONGKHAMNHASI
GO 
CREATE USER NV01
for login NV01
GO

USE PHONGKHAMNHASI
GO
GRANT SELECT,DELETE,UPDATE,INSERT
ON LICHHEN TO NV01
GO

USE PHONGKHAMNHASI
GO
GRANT SELECT,DELETE,UPDATE,INSERT
ON HOADON TO NV01
GO

GRANT SELECT
ON NHASI TO NV01

GRANT SELECT
ON KHACHHANG TO NV01


GRANT EXECUTE ON InsertAppointmentByEmployee TO NV01
GRANT EXECUTE ON GetAllLichHen TO NV01
GRANT EXECUTE ON GetAllHoaDon TO NV01
GRANT EXECUTE ON CreateHoaDon TO NV01
GRANT EXECUTE ON UpdateHoaDon TO NV01
GRANT EXECUTE ON UpdateLichHen TO NV01
GRANT EXECUTE ON DeleteLichHen TO NV01
GRANT EXECUTE ON DeleteHoaDon TO NV01


--------------------------------------NV294
USE MASTER;
GO
CREATE LOGIN NV294
WITH PASSWORD = 'password113',
CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF,
DEFAULT_DATABASE = PHONGKHAMNHASI
GO

USE PHONGKHAMNHASI
GO 
CREATE USER NV294
for login NV294
GO

USE PHONGKHAMNHASI
GO
GRANT SELECT,DELETE,UPDATE,INSERT
ON LICHHEN TO NV294
GO

USE PHONGKHAMNHASI
GO
GRANT SELECT,DELETE,UPDATE,INSERT
ON HOADON TO NV294
GO

GRANT SELECT
ON NHASI TO NV294

GRANT SELECT
ON KHACHHANG TO NV294


GRANT EXECUTE ON InsertAppointmentByEmployee TO NV294
GRANT EXECUTE ON GetAllLichHen TO NV294
GRANT EXECUTE ON GetAllHoaDon TO NV294
GRANT EXECUTE ON CreateHoaDon TO NV294
GRANT EXECUTE ON UpdateHoaDon TO NV294
GRANT EXECUTE ON UpdateLichHen TO NV294
GRANT EXECUTE ON DeleteLichHen TO NV294
GRANT EXECUTE ON DeleteHoaDon TO NV294





























