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
