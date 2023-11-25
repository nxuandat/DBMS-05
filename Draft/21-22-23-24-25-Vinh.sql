--21 giống 13
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

