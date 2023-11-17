use PHONGKHAMNHASI

go
--5
-- Stored Procedure to book an appointment, checking for conflicts with personal schedules
CREATE PROCEDURE BookAppointment
    @MaSoHen varchar(20),
    @NgayGioKham datetime,
    @LyDoKham nvarchar(100),
    @MaNS varchar(20),
    @MaKH varchar(20),
    @SoDT varchar(15)
AS
BEGIN
    -- Set the isolation level to prevent dirty reads
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    BEGIN TRANSACTION;

    -- Check if the dentist has a personal appointment at the same time
    IF EXISTS (
        SELECT 1 FROM LICHNHASI
        WHERE MaNS = @MaNS AND GioBatDau <= @NgayGioKham AND GioKetThuc > @NgayGioKham
    )
    BEGIN
        -- Conflict found, raise an error
        RAISERROR ('The dentist has a personal appointment at this time.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- If no conflict, proceed to book the appointment
    INSERT INTO LICHHEN (MaSoHen, NgayGioKham, LyDoKham, MaNS, MaKH, SoDT)
    VALUES (@MaSoHen, @NgayGioKham, @LyDoKham, @MaNS, @MaKH, @SoDT);

    -- Commit the transaction
    COMMIT TRANSACTION;
END;
GO

--8
-- Stored Procedure for administrator to delete an expired drug
CREATE PROCEDURE DeleteExpiredDrug
    @MaThuoc CHAR(30)
AS
BEGIN
    -- Start transaction
    BEGIN TRANSACTION;

    -- Set the isolation level to serializable to lock the rows involved
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

    -- Check if the drug is expired and delete it if it is
    IF EXISTS (SELECT 1 FROM LOAITHUOC WHERE MaThuoc = @MaThuoc AND NgayHetHan < GETDATE())
    BEGIN
        DELETE FROM LOAITHUOC WHERE MaThuoc = @MaThuoc;
    END
    ELSE
    BEGIN
        -- Drug is not expired or not found, cannot delete
        RAISERROR ('Drug is not expired or not found', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- Commit the transaction
    COMMIT TRANSACTION;
END;
GO

-- Stored Procedure for dentist to prescribe a drug
CREATE PROCEDURE PrescribeDrug
    @MaThuoc CHAR(30),
    @MaKH CHAR(20),
    @SoDT CHAR(15),
    @STT INT,
    @SoLuong INT,
    @ThoiDiemDung NVARCHAR(50)
AS
BEGIN
    -- Start transaction
    BEGIN TRANSACTION;

    -- Set the isolation level to serializable to lock the rows involved
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

    -- Check if the drug exists and is not expired before prescribing
    IF EXISTS (SELECT 1 FROM LOAITHUOC WHERE MaThuoc = @MaThuoc AND NgayHetHan >= GETDATE())
    BEGIN
        -- Prescribe the drug
        INSERT INTO CHITIETTHUOC (MaThuoc, MaKH, SoDT, STT, SoLuong, ThoiDiemDung)
        VALUES (@MaThuoc, @MaKH, @SoDT, @STT, @SoLuong, @ThoiDiemDung);
    END
    ELSE
    BEGIN
        -- Drug does not exist or is expired, cannot prescribe
        RAISERROR ('Drug does not exist or is expired', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- Commit the transaction
    COMMIT TRANSACTION;
END;
GO

--13
-- Procedure to update medical records by a dentist
CREATE PROCEDURE UpdateMedicalRecord
    @MaKH CHAR(20),  -- Patient ID
    @SoDT CHAR(15),  -- Patient's phone number
    @STT INT,        -- Record number (sequence or visit number)
    @DentistID CHAR(20), -- ID of the dentist performing the update
    @DanDo NVARCHAR(300) -- New medical notes
AS
BEGIN
    -- Set the transaction isolation level to SERIALIZABLE to prevent concurrent updates
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

    BEGIN TRANSACTION;
    
    TRY
        -- Check if another dentist has already updated the record while this transaction was waiting
        DECLARE @LastUpdatedBy CHAR(20);
        SELECT @LastUpdatedBy = LastUpdatedBy
        FROM HOSOBENH
        WHERE MaKH = @MaKH AND SoDT = @SoDT AND STT = @STT;

        IF @LastUpdatedBy IS NULL OR @LastUpdatedBy = @DentistID
        BEGIN
            -- Proceed to update the medical record
            UPDATE HOSOBENH
            SET DanDo = @DanDo, LastUpdatedBy = @DentistID, LastUpdateTimestamp = CURRENT_TIMESTAMP
            WHERE MaKH = @MaKH AND SoDT = @SoDT AND STT = @STT;

            -- Commit the transaction
            COMMIT TRANSACTION;
        END
        ELSE
        BEGIN
            -- Another dentist has updated the record; do not override and raise an error
            RAISERROR ('Another dentist has updated the record. Please refresh.', 16, 1);
            ROLLBACK TRANSACTION;
        END
    CATCH
        -- Handle any errors that occurred during the transaction
        ROLLBACK TRANSACTION;
        -- Re-throw the caught error
        THROW;
    END TRY
END;
GO

--16
CREATE PROCEDURE UpdateCustomerAddress
    @MaKH CHAR(20), -- Customer ID
    @NewAddress NVARCHAR(100) -- New address to be updated
AS
BEGIN
    SET NOCOUNT ON;
    -- Set the transaction isolation level to serializable to avoid phantom reads
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    
    BEGIN TRY
        -- Start the transaction
        BEGIN TRANSACTION;
        
        -- Check if the new address already exists for another customer
        IF EXISTS (SELECT 1 FROM KHACHHANG WHERE DiaChi = @NewAddress AND MaKH <> @MaKH)
        BEGIN
            -- If it does, throw an error and do not proceed with the update
            RAISERROR('The address is already used by another customer.', 16, 1);
        END
        ELSE
        BEGIN
            -- If the address is not used, proceed to update the customer's address
            UPDATE KHACHHANG
            SET DiaChi = @NewAddress
            WHERE MaKH = @MaKH;
        END
        
        -- Commit the transaction
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- If an error occurs, roll back the transaction
        ROLLBACK TRANSACTION;
        -- Re-throw the caught error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH;
END;
GO


--20
-- Procedure for the customer to view dentist information
CREATE PROCEDURE ViewDentistInformation
    @MaNS CHAR(20) -- Dentist ID
AS
BEGIN
    SET TRANSACTION ISOLATION LEVEL REPEATABLE READ; -- This ensures the read data does not change during the transaction
    BEGIN TRANSACTION;
    -- Simulate a long-running read operation
    WAITFOR DELAY '00:00:05'; -- This delay is to simulate the customer taking time to read the information

    SELECT HoTen, GioiThieu FROM NHASI WHERE MaNS = @MaNS;

    COMMIT TRANSACTION;
END;
GO

-- Procedure for the administrator to update dentist information
CREATE PROCEDURE UpdateDentistInformation
    @MaNS CHAR(20), -- Dentist ID
    @NewHoTen NVARCHAR(50), -- New name
    @NewGioiThieu NVARCHAR(300) -- New introduction text
AS
BEGIN
    -- The default isolation level should be fine here
    BEGIN TRANSACTION;
    
    -- Update the dentist's information
    UPDATE NHASI
    SET HoTen = @NewHoTen, GioiThieu = @NewGioiThieu
    WHERE MaNS = @MaNS;

    COMMIT TRANSACTION;
END;
GO




