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
    -- Khởi tạo biến retry
    DECLARE @retry INT;
    SET @retry = 5;

  WHILE @retry > 0
    WHILE @retry > 0
    BEGIN
    SET @retry = @retry - 1;
        SET @retry = @retry - 1;

    BEGIN TRY
        BEGIN TRY
            -- Khởi tạo giao tác
            BEGIN TRANSACTION;

            -- Đặt mức cô lập SERIALIZABLE
            SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

            -- Kiểm tra xem số điện thoại đã tồn tại chưa
            IF EXISTS (SELECT 1
    FROM KHACHHANG WITH (UPDLOCK, HOLDLOCK)
    WHERE SoDT = @SoDT)
            IF EXISTS (SELECT 1 FROM KHACHHANG WITH (UPDLOCK, HOLDLOCK) WHERE SoDT = @SoDT)
            BEGIN
      RAISERROR ('Số điện thoại đã tồn tại.', 16, 1);
      ROLLBACK TRANSACTION;
      RETURN;
    END
                RAISERROR ('Số điện thoại đã tồn tại.', 16, 1);
                ROLLBACK TRANSACTION;
                RETURN;
            END

            -- Thêm người dùng mới vào cơ sở dữ liệu
            INSERT INTO KHACHHANG
      (MaKH, SoDT, HoTen, Phai, NgaySinh, DiaChi, MatKhau,Email)
    VALUES
      (@MaKH, @SoDT, @HoTen, @Phai, @NgaySinh, @DiaChi, @MatKhau, @Email);
            INSERT INTO KHACHHANG (MaKH, SoDT, HoTen, Phai, NgaySinh, DiaChi, MatKhau,Email)
            VALUES (@MaKH, @SoDT, @HoTen, @Phai, @NgaySinh, @DiaChi, @MatKhau,@Email);

            -- Nếu không có lỗi, commit giao tác
            COMMIT TRANSACTION;
@@ -1038,75 +815,72 @@ BEGIN
            -- Nếu lỗi là do deadlock, thử lại giao tác
            IF ERROR_NUMBER() = 1205 AND @retry > 0
            BEGIN
      WAITFOR DELAY '00:00:05';
      CONTINUE;
    END
				WAITFOR DELAY '00:00:05';
                CONTINUE;
            END
            ELSE
            BEGIN
                THROW;
            END
    END CATCH
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
    DECLARE @retry INT;
    SET @retry = 5;

  WHILE @retry > 0
    WHILE @retry > 0
    BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;
    BEGIN TRY
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
            SELECT * FROM KHACHHANG WITH (TABLOCKX) ORDER BY MaKH;

			WAITFOR DELAY '00:00:01';

            COMMIT TRANSACTION; 

            SELECT *
    FROM @users;
            SELECT * FROM @users;

            SET @retry = 0;
        END TRY
        BEGIN CATCH
            SET @retry = @retry - 1;
            ROLLBACK TRANSACTION;
        END CATCH
  END
    END
END;


--cập nhật thông tin người khám
CREATE PROCEDURE UpdateUserInfo
  @MaKH char(20),
  @HoTen nvarchar(50),
  @Phai char(1),
  @NgaySinh datetime,
  @DiaChi nvarchar(100)
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
    -- Khởi tạo giao tác
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Đặt mức cô lập
        SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

@@ -1127,30 +901,30 @@ BEGIN
        -- Nếu có deadlock, thử lại giao tác
        IF ERROR_NUMBER() = 1205
        BEGIN
    WAITFOR DELAY '00:00:05';
    EXEC UpdateUserInfo @MaKH, @HoTen, @Phai, @NgaySinh, @DiaChi;
  END
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
    -- Khai báo biến
    DECLARE @retry INT;
    SET @retry = 5;

  -- Bắt đầu vòng lặp
  WHILE @retry > 0
    -- Bắt đầu vòng lặp
    WHILE @retry > 0
    BEGIN
    BEGIN TRY
        BEGIN TRY
            -- Bắt đầu giao tác
            BEGIN TRANSACTION;

@@ -1160,10 +934,8 @@ BEGIN
            -- Thực hiện truy vấn INSERT với mức cô lập SERIALIZABLE để tránh dirty read, lost update, phantom read và unrepeatable read
            SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

            INSERT INTO LICHHEN
      (MaSoHen, NgayGioKham, LyDoKham, MaNS, MaKH, SoDT)
    VALUES
      (@MaSoHen, @NgayGioKham, @LyDoKham, @MaNS, @MaKH, @SoDT);
            INSERT INTO LICHHEN (MaSoHen, NgayGioKham, LyDoKham, MaNS, MaKH, SoDT) 
            VALUES (@MaSoHen, @NgayGioKham, @LyDoKham, @MaNS, @MaKH, @SoDT);

            -- Kết thúc giao tác
            COMMIT TRANSACTION;
@@ -1182,23 +954,23 @@ BEGIN
            IF @retry = 0
                THROW;
        END CATCH
  END
    END
END;

--Lấy thông tin hồ sơ bệnh án theo mã người dùng
CREATE PROCEDURE GetMedicalRecordByID
  @MaKH CHAR(20),
  @retry INT = 5
    @MaKH CHAR(20),
    @retry INT = 5
AS
BEGIN
  -- Khai báo biến
  DECLARE @retry_count INT = 0;
  DECLARE @wait_time INT = 500;
  -- thời gian chờ (ms)
    -- Khai báo biến
    DECLARE @retry_count INT = 0;
    DECLARE @wait_time INT = 500; -- thời gian chờ (ms)

  -- Sử dụng vòng lặp while để thử lại nếu xảy ra deadlock
  WHILE @retry_count < @retry
    -- Sử dụng vòng lặp while để thử lại nếu xảy ra deadlock
    WHILE @retry_count < @retry
    BEGIN
    BEGIN TRY
        BEGIN TRY
            -- Bắt đầu giao dịch
            BEGIN TRANSACTION;

@@ -1207,8 +979,8 @@ BEGIN

            -- Lấy thông tin từ bảng HOSOBENH
            SELECT *
    FROM HOSOBENH WITH (ROWLOCK, HOLDLOCK)
    WHERE MaKH = @MaKH;
            FROM HOSOBENH WITH (ROWLOCK, HOLDLOCK)
            WHERE MaKH = @MaKH;

            -- Kết thúc giao dịch
            COMMIT TRANSACTION;
@@ -1220,1215 +992,363 @@ BEGIN
            -- Kiểm tra xem lỗi có phải là deadlock hay không
            IF ERROR_NUMBER() = 1205 AND @retry_count < @retry
            BEGIN
      -- Tăng biến đếm thử lại
      SET @retry_count = @retry_count + 1;
                -- Tăng biến đếm thử lại
                SET @retry_count = @retry_count + 1;

      -- Chờ một khoảng thời gian trước khi thử lại
      WAITFOR DELAY @wait_time;
                -- Chờ một khoảng thời gian trước khi thử lại
                WAITFOR DELAY @wait_time;

      -- Tiếp tục vòng lặp
      CONTINUE;
    END
                -- Tiếp tục vòng lặp
                CONTINUE;
            END
            ELSE
            BEGIN
      -- Nếu không phải deadlock hoặc đã vượt quá số lần thử lại, rollback giao dịch
      ROLLBACK TRANSACTION;
                -- Nếu không phải deadlock hoặc đã vượt quá số lần thử lại, rollback giao dịch
                ROLLBACK TRANSACTION;

      -- Đưa ra thông báo lỗi
      THROW;
    END
                -- Đưa ra thông báo lỗi
                THROW;
            END
        END CATCH
  END
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
--Lấy tất cả thông tin nha sĩ theo người dùng
CREATE PROCEDURE GetAllDentistInfoByUser
AS
BEGIN
  -- Khai báo biến retry để kiểm soát số lần thử lại giao tác
  DECLARE @retry INT;
  SET @retry = 5;
  SET @retry = 3;

  -- Bắt đầu một vòng lặp while
  WHILE @retry > 0
  BEGIN
    SET @retry = @retry - 1;

    BEGIN TRY
      BEGIN TRANSACTION;

      SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    -- Bắt đầu một giao tác
    BEGIN TRANSACTION;

      -- Tạo mã số hẹn
      DECLARE @MaSoHen char(20);
      SET @MaSoHen = NEWID();
    -- Thiết lập mức cô lập là Read Committed
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

      INSERT INTO LICHHEN
      (MaSoHen, NgayGioKham, LyDoKham, MaNS, MaKH, SoDT)
    VALUES
      (@MaSoHen, @NgayGioKham, @LyDoKham, @MaNS, @MaKH, @SoDT);
    -- Thử lấy thông tin nha sĩ từ bảng NHASI
    BEGIN TRY
      -- Sử dụng cơ chế khóa là RowLock để khóa từng hàng được truy vấn
      SELECT MaNS, HoTen, Phai, GioiThieu FROM NHASI WITH (ROWLOCK);

      -- Nếu không có lỗi, kết thúc giao tác và thoát khỏi vòng lặp
      COMMIT TRANSACTION;

      SET @retry = 0;
      BREAK;
    END TRY
    BEGIN CATCH
      -- Nếu có lỗi, hủy bỏ giao tác và giảm biến retry đi 1
      ROLLBACK TRANSACTION;
      SET @retry = @retry - 1;

      IF ERROR_NUMBER() = 1205 AND @retry > 0
      -- Nếu lỗi là do deadlock, thì chờ 1 giây rồi thử lại
      IF ERROR_NUMBER() = 1205
      BEGIN
      WAITFOR DELAY '00:00:05';
      CONTINUE;
    END
        WAITFOR DELAY '00:00:01';
      END
      -- Nếu lỗi khác, thì báo lỗi và thoát khỏi vòng lặp
      ELSE
      BEGIN
        THROW;
        DECLARE @ErrorMessage NVARCHAR(4000);
		SET @ErrorMessage = ERROR_MESSAGE();
		RAISERROR('Lỗi khi truy vấn thông tin nha sĩ: %s', 16, 1, @ErrorMessage);
        BREAK;
      END
    END CATCH
  END
END;
END

--4. Procedure khách hàng hủy lịch hẹn (được phép hủy trước 2h so với thời gian hẹn)
CREATE PROCEDURE HuyLichHen
  @MaSoHen char(20)
--Lấy Tất Cả Thông Tin lịch của nha sĩ
CREATE PROCEDURE GetAllLICHNHASI
AS
BEGIN
  DECLARE @retry INT;
  SET @retry = 5;
    -- Khởi tạo biến retry
    DECLARE @retry INT;
    SET @retry = 5;

  WHILE @retry > 0
  BEGIN
    SET @retry = @retry - 1;
    -- Bắt đầu vòng lặp while
    WHILE @retry > 0
    BEGIN
        SET @retry = @retry - 1;
        BEGIN TRY
            -- Bắt đầu giao tác
            BEGIN TRANSACTION;

    BEGIN TRY
      BEGIN TRANSACTION;
            -- Đặt mức cô lập
            SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

      SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
            -- Truy vấn dữ liệu
            SELECT * FROM LICHNHASI;

      IF NOT EXISTS (SELECT 1
    FROM LICHHEN WITH (UPDLOCK, HOLDLOCK)
    WHERE MaSoHen = @MaSoHen)
      BEGIN
      RAISERROR ('Mã số hẹn không tồn tại.', 16, 1);
      ROLLBACK TRANSACTION;
      RETURN;
    END
            -- Kết thúc giao tác
            COMMIT TRANSACTION;

      -- Kiểm tra xem mã số hẹn có thể hủy không
      IF NOT EXISTS (SELECT 1
    FROM LICHHEN WITH (UPDLOCK, HOLDLOCK)
    WHERE MaSoHen = @MaSoHen AND NgayGioKham > DATEADD(HOUR, 2, GETDATE()))
      BEGIN
      RAISERROR ('Không thể hủy lịch hẹn.', 16, 1);
      ROLLBACK TRANSACTION;
      RETURN;
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

      DELETE FROM LICHHEN WHERE MaSoHen = @MaSoHen;
--Lấy tất cả thông tin nha sĩ theo quản trị viên
CREATE PROCEDURE GetAllDentistInfoByAdmin
AS
BEGIN
  -- Khai báo biến retry để kiểm soát số lần thử lại giao tác
  DECLARE @retry INT;
  SET @retry = 3;

      COMMIT TRANSACTION;
  -- Bắt đầu một vòng lặp while
  WHILE @retry > 0
  BEGIN
    -- Bắt đầu một giao tác
    BEGIN TRANSACTION;

      SET @retry = 0;
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

      IF ERROR_NUMBER() = 1205 AND @retry > 0
      -- Nếu lỗi là do deadlock, thì chờ 1 giây rồi thử lại
      IF ERROR_NUMBER() = 1205
      BEGIN
      WAITFOR DELAY '00:00:05';
      CONTINUE;
    END
        WAITFOR DELAY '00:00:01';
      END
      -- Nếu lỗi khác, thì báo lỗi và thoát khỏi vòng lặp
      ELSE
      BEGIN
        THROW;
        DECLARE @ErrorMessage NVARCHAR(4000);
		SET @ErrorMessage = ERROR_MESSAGE();
		RAISERROR('Lỗi khi truy vấn thông tin nha sĩ: %s', 16, 1, @ErrorMessage);
        BREAK;
      END
    END CATCH
  END
END;
END

--5. Procedure khách hàng/ nha sĩ xem hồ sơ bệnh án
CREATE PROCEDURE XemHoSoBenh
  @MaKH char(20),
  @SoDT char(15)
--Lấy tất cả thông tin nhân viên theo quản trị viên
CREATE PROCEDURE GetAllEmployee
AS
BEGIN
  -- Khai báo biến retry để kiểm soát số lần thử lại giao tác
  DECLARE @retry INT;
  SET @retry = 5;
  SET @retry = 3;

  -- Bắt đầu một vòng lặp while
  WHILE @retry > 0
  BEGIN
    SET @retry = @retry - 1;

    BEGIN TRY
      BEGIN TRANSACTION;

      SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    -- Bắt đầu một giao tác
    BEGIN TRANSACTION;

      IF NOT EXISTS (SELECT 1
    FROM KHACHHANG WITH (UPDLOCK, HOLDLOCK)
    WHERE MaKH = @MaKH AND SoDT = @SoDT)
      BEGIN
      RAISERROR ('Mã khách hàng không tồn tại.', 16, 1);
      ROLLBACK TRANSACTION;
      RETURN;
    END
    -- Thiết lập mức cô lập là Read Committed
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

      -- Lấy thông tin hồ sơ bệnh án
      SELECT *
    FROM HOSOBENH
    WHERE MaKH = @MaKH AND SoDT = @SoDT;
    -- Thử lấy thông tin nha sĩ từ bảng NHASI
    BEGIN TRY
      -- Sử dụng cơ chế khóa là RowLock để khóa từng hàng được truy vấn
      SELECT * FROM NHANVIEN WITH (ROWLOCK);

      -- Nếu không có lỗi, kết thúc giao tác và thoát khỏi vòng lặp
      COMMIT TRANSACTION;

      SET @retry = 0;
      BREAK;
    END TRY
    BEGIN CATCH
      -- Nếu có lỗi, hủy bỏ giao tác và giảm biến retry đi 1
      ROLLBACK TRANSACTION;
      SET @retry = @retry - 1;

      IF ERROR_NUMBER() = 1205 AND @retry > 0
      -- Nếu lỗi là do deadlock, thì chờ 1 giây rồi thử lại
      IF ERROR_NUMBER() = 1205
      BEGIN
      WAITFOR DELAY '00:00:05';
      CONTINUE;
    END
        WAITFOR DELAY '00:00:01';
      END
      -- Nếu lỗi khác, thì báo lỗi và thoát khỏi vòng lặp
      ELSE
      BEGIN
        THROW;
        DECLARE @ErrorMessage NVARCHAR(4000);
		SET @ErrorMessage = ERROR_MESSAGE();
		RAISERROR('Lỗi khi truy vấn thông tin nha sĩ: %s', 16, 1, @ErrorMessage);
        BREAK;
      END
    END CATCH
  END
END;
END

--6	NS	Quan ly ho so benh nhan: them, xoa ho so benh
--them ho so benh
CREATE PROCEDURE ThemHoSoBenh
--Cật nhật mật khẩu bởi khách hàng
CREATE PROCEDURE UpdatePasswordByUser
    @MaKH CHAR(20),
    @SoDT CHAR(15),
    @STT INT,
    @NgayKham DATETIME,
    @DanDo NVARCHAR(300),
    @MaNS CHAR(20),
    @MaDV CHAR(10),
    @MaThuoc CHAR(30),
    @TinhTrangXuatHoaDon CHAR(10)
    @newPassword CHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION WITH ISOLATION LEVEL READ COMMITTED; -- Set the isolation level
    -- Khởi tạo biến retry
    DECLARE @retry INT;
    SET @retry = 5;

        -- Check if the record already exists
        IF NOT EXISTS (SELECT 1 FROM HOSOBENH WHERE MaKH = @MaKH AND SoDT = @SoDT AND STT = @STT)
        BEGIN
        -- Insert the new record
        INSERT INTO HOSOBENH (MaKH, SoDT, STT, NgayKham, DanDo, MaNS, MaDV, MaThuoc, TinhTrangXuatHoaDon)
        VALUES (@MaKH, @SoDT, @STT, @NgayKham, @DanDo, @MaNS, @MaDV, @MaThuoc, @TinhTrangXuatHoaDon);
    -- Sử dụng vòng lặp while để thử lại nếu có lỗi xảy ra
    WHILE @retry > 0
    BEGIN
        SET @retry = @retry - 1;
        BEGIN TRY
            -- Bắt đầu giao tác
            BEGIN TRANSACTION;

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
            -- Sử dụng mức cô lập SERIALIZABLE để tránh dirty read, lost update, phantom read và unrepeatable read
            SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

--xoa ho so benh
CREATE PROCEDURE XoaHoSoBenh
    @MaKH CHAR(20),
    @SoDT CHAR(15),
    @STT INT
AS
BEGIN
    -- Set NOCOUNT to ON to suppress "xx rows affected" messages
    SET NOCOUNT ON;
            -- Cập nhật mật khẩu
            UPDATE KHACHHANG
            SET MatKhau = @newPassword
            WHERE MaKH = @MaKH AND SoDT = @SoDT;

    BEGIN TRY
        -- Start a new transaction with READ COMMITTED isolation level
        BEGIN TRANSACTION WITH ISOLATION LEVEL READ COMMITTED;
            -- Kết thúc giao tác
            COMMIT TRANSACTION;

        -- Check if the record exists
        IF EXISTS (SELECT 1 FROM HOSOBENH WHERE MaKH = @MaKH AND SoDT = @SoDT AND STT = @STT)
        BEGIN
        -- Delete the record from the HOSOBENH table
        DELETE FROM HOSOBENH WHERE MaKH = @MaKH AND SoDT = @SoDT AND STT = @STT;
            -- Thoát khỏi vòng lặp while
            BREAK;
        END TRY
        BEGIN CATCH
            -- Nếu có lỗi xảy ra, hủy giao tác
            IF @@TRANCOUNT > 0
                ROLLBACK TRANSACTION;

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
            -- Nếu còn lần thử lại, đợi 1 giây rồi thử lại
            IF @retry > 0
                WAITFOR DELAY '00:00:01';
            ELSE
                -- Nếu hết lần thử lại, đưa ra lỗi
                THROW;
        END CATCH;
    END;
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
--Phân quyền code mẫu
USE MASTER;
GO
CREATE LOGIN AW_UserThuong
	WITH PASSWORD = 'AW_UserThuong',
	CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF,
	DEFAULT_DATABASE = PHONGKHAMNHASI
GO

    END CATCH
END;
USE PHONGKHAMNHASI
GO 
CREATE USER AW_UserThuong
	for login AW_UserThuong
GO

--them lich nha si
CREATE PROCEDURE ThemLichHenNhaSi
    @MaNS char(20),
    @GioBatDau datetime,
    @GioKetThuc datetime,
    @TinhTrangCuocHen char(20)
AS
BEGIN
    SET NOCOUNT ON;
USE PHONGKHAMNHASI
GO
GRANT SELECT, INSERT, DELETE, UPDATE 
ON BANGGIDO TO AW_UserThuong

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
--Phân quyền người dùng(trên nodejs đã code phân quyền ng dùng nên ko cần phân quyền trên sql server nữa)
USE MASTER;
GO
CREATE LOGIN KH02
WITH PASSWORD = 'password113',
CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF,
DEFAULT_DATABASE = PHONGKHAMNHASI
GO

        -- Print the error message
        PRINT 'Cannot insert the schedule. An error occurred: ' + ERROR_MESSAGE();
    END CATCH;
END;
USE PHONGKHAMNHASI
GO 
CREATE USER KH02
for login KH02
GO

--xoa lich nha si
CREATE PROCEDURE XoaLichHenNhaSi
    @MaNS char(20),
    @STT int
AS
BEGIN
    SET NOCOUNT ON;
USE PHONGKHAMNHASI
GO
GRANT SELECT, UPDATE 
ON KHACHHANG TO KH02

USE PHONGKHAMNHASI
GO
GRANT SELECT,UPDATE, INSERT
ON LICHHEN TO KH02
GO

    BEGIN TRY
        BEGIN TRANSACTION;
USE PHONGKHAMNHASI
GO
GRANT SELECT
ON HOSOBENH TO KH02
GO

        -- Delete the schedule
        DELETE FROM LICHNHASI
        WHERE MaNS = @MaNS AND STT = @STT;
USE PHONGKHAMNHASI
GO
GRANT SELECT
ON NHASI TO KH02
GO

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;
GRANT EXECUTE ON UpdateUserInfo TO KH02
GRANT EXECUTE ON InsertAppointment TO KH02
GRANT EXECUTE ON GetMedicalRecordByID TO KH02
GRANT EXECUTE ON GetAllDentistInfoByUser TO KH02
GRANT EXECUTE ON GetAllLICHNHASI TO KH02
GRANT EXECUTE ON UpdatePasswordByUser TO KH02

        -- Print the error message
        PRINT 'Cannot delete the schedule. An error occurred: ' + ERROR_MESSAGE();
    END CATCH;
END;
--Phân quyền quản trị viên
USE MASTER;
GO
CREATE LOGIN QTV01
WITH PASSWORD = '567890',
CHECK_POLICY = OFF, CHECK_EXPIRATION = OFF,
DEFAULT_DATABASE = PHONGKHAMNHASI
GO

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
USE PHONGKHAMNHASI
GO 
CREATE USER QTV01
for login QTV01
GO

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
EXEC sp_addrolemember 'db_owner', 'QTV01';
GO

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

--22
CREATE PROCEDURE TaoHoaDon
    @MaHoaDon CHAR(20),
    @MaKH CHAR(20),
    @SoDT CHAR(15),
    @STT INT,
    @MaNV CHAR(20),
    @MaDV CHAR(10),
    @NgayXuat DATETIME,
    @TongChiPhi BIGINT,
    @TinhTrangThanhToan CHAR(30)
AS
BEGIN
    -- Khởi tạo giao dịch
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Đặt mức cô lập giao dịch
        SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

        -- Kiểm tra và đọc thông tin số lượng thuốc
        DECLARE @SoLuongThuoc INT;
        SELECT @SoLuongThuoc = SoLuong FROM LOAITHUOC
        WHERE MaThuoc = (SELECT MaThuoc FROM HOSOBENH WHERE MaKH = @MaKH AND STT = @STT);

        -- Kiểm tra điều kiện số lượng thuốc trước khi tạo hóa đơn
        IF @SoLuongThuoc > 0
        BEGIN
            -- Tạo hóa đơn
            INSERT INTO HOADON (MaHoaDon, MaKH, SoDT, STT, NgayXuat, TongChiPhi, TinhTrangThanhToan, MaNV, MaDV)
            VALUES (@MaHoaDon, @MaKH, @SoDT, @STT, @NgayXuat, @TongChiPhi, @TinhTrangThanhToan, @MaNV, @MaDV);
        END
        ELSE
        BEGIN
            RAISERROR ('Số lượng thuốc không đủ để tạo hóa đơn.', 16, 1);
        END

        -- Commit giao dịch
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback trong trường hợp có lỗi
        ROLLBACK TRANSACTION;
        -- Thông báo lỗi
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;

--23
USE PHONGKHAMNHASI;
GO

CREATE PROCEDURE ReadAppointmentData
    @MaKH CHAR(20)
AS
BEGIN
    -- Khai báo biến lưu trữ lịch hẹn
    DECLARE @LichHen TABLE (
        MaSoHen CHAR(20),
        NgayGioKham DATETIME,
        LyDoKham NVARCHAR(100)
    );

    -- Đặt mức độ cô lập cho giao dịch là READ COMMITTED
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
    
    BEGIN TRANSACTION;

    -- Lấy thông tin lịch hẹn đầu tiên
    INSERT INTO @LichHen (MaSoHen, NgayGioKham, LyDoKham)
    SELECT MaSoHen, NgayGioKham, LyDoKham
    FROM LICHHEN
    WHERE MaKH = @MaKH;

    -- Giả lập thời gian đọc dữ liệu dài hơn
    WAITFOR DELAY '00:00:05';

    -- Lấy thông tin lịch hẹn lần thứ hai
    INSERT INTO @LichHen (MaSoHen, NgayGioKham, LyDoKham)
    SELECT MaSoHen, NgayGioKham, LyDoKham
    FROM LICHHEN
    WHERE MaKH = @MaKH;

    COMMIT TRANSACTION;

    -- Trả về kết quả của hai lần đọc
    SELECT * FROM @LichHen;
END;
GO

-- Stored Procedure để cập nhật thông tin lịch hẹn
CREATE PROCEDURE UpdateAppointmentData
    @MaSoHen CHAR(20),
    @NgayGioKham DATETIME,
    @LyDoKham NVARCHAR(100)
AS
BEGIN
    -- Đặt mức độ cô lập cho giao dịch là REPEATABLE READ
    SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
    
    BEGIN TRANSACTION;
    
    -- Cập nhật thông tin lịch hẹn
    UPDATE LICHHEN
    SET NgayGioKham = @NgayGioKham, LyDoKham = @LyDoKham
    WHERE MaSoHen = @MaSoHen;

    COMMIT TRANSACTION;
END;
GO

--24
-- Store Procedure đọc thông tin số lượng thuốc (Nhân viên T)
CREATE PROCEDURE ReadThuocInfo
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
    BEGIN TRANSACTION;

    -- Đọc thông tin số lượng thuốc
    SELECT MaThuoc, SoLuong FROM LOAITHUOC;

    COMMIT TRANSACTION;
END;
GO

-- Store Procedure xóa thuốc (Quản trị viên S)
CREATE PROCEDURE DeleteThuoc
    @MaThuoc CHAR(30)
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;

    -- Xóa thông tin thuốc
    DELETE FROM LOAITHUOC WHERE MaThuoc = @MaThuoc;

    COMMIT TRANSACTION;
END;
GO

--25
CREATE PROCEDURE ViewPatientInfo
AS
BEGIN
    -- Đặt mức cô lập TRANSACTION ISOLATION LEVEL để mô phỏng phantom read
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

    BEGIN TRANSACTION;
    TRY
        -- Truy vấn lấy thông tin bệnh nhân
        SELECT * FROM KHACHHANG;
        COMMIT TRANSACTION;
    CATCH
        ROLLBACK TRANSACTION;
    END TRY
END;

CREATE PROCEDURE AddNewPatient
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
    BEGIN TRANSACTION;
    TRY
        -- Thêm bệnh nhân mới
        INSERT INTO KHACHHANG (MaKH, SoDT, HoTen, Phai, NgaySinh, DiaChi, MatKhau, Email)
        VALUES (@MaKH, @SoDT, @HoTen, @Phai, @NgaySinh, @DiaChi, @MatKhau, @Email);
        COMMIT TRANSACTION;
    CATCH
        ROLLBACK TRANSACTION;
    END TRY
END;

