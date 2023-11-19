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

