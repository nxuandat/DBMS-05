import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";

interface DetailMedicine {
  STT: number;
  MaThuoc: string;
  MaKH: string;
  SoDT: string;
  SoLuong: number;
  ThoiDiemDung: string;
}

export default function TableListDetailMedicineUser() {
  const [rows, setRows] = useState<DetailMedicine[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const columns: GridColDef[] = [
    { field: "stt", headerName: "STT", flex: 1 },
    { field: "id", headerName: "ID", flex: 1 },
    { field: "makh", headerName: "Mã khách hàng", flex: 1 },
    { field: "sodt", headerName: "Số điện thoại", flex: 1 },
    { field: "quantity", headerName: "Số lượng", flex: 1 },
    { field: "thoidiemdung", headerName: "Thời điểm dùng", flex: 1 },
  ];

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_SERVER_PORT}/user/get-detail-medicine`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data && response.data.medicines) {
          setRows(
            response.data.medicines.map((medicine: DetailMedicine) => ({
              stt: medicine.STT,
              id: medicine.MaThuoc,
              makh: medicine.MaKH,
              sodt: medicine.SoDT,
              quantity: medicine.SoLuong,
              thoidiemdung: new Date(medicine.ThoiDiemDung).toLocaleDateString(
                "vi-VN"
              ),
            }))
          );
        } else {
          console.error("Unexpected API response", response);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error.response); // Log the response for more details
      });
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div>
      <h1>DANH SÁCH CHI TIẾT THUỐC</h1>
      <hr />

      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
      />
    </div>
  );
}
