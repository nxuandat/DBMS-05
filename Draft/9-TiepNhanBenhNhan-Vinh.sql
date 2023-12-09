--Xem những lịch hẹn tiếp theo
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

--Xóa lịch hẹn
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
