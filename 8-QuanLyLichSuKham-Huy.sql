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

