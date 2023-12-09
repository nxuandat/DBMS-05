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
