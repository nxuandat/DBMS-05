--Xem các loại dịch vụ
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

--Thêm loại dịch vụ
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

--Sửa loại dịch vụ
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

