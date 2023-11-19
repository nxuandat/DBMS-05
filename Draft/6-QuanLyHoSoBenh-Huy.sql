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


