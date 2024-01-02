import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridCellParams } from "@mui/x-data-grid";
import {
  Box,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Medicine {
  MaThuoc: string;
  TenThuoc: string;
  DonViTinh: string;
  ChiDinh: string;
  SoLuong: number;
  NgayHetHan: string;
  GiaThuoc: string;
}

export default function TableListMedicineDentist() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "drugName",
      headerName: "Tên thuốc",
      flex: 1,
    },
    {
      field: "unit",
      headerName: "Đơn vị tính",
      flex: 1,
    },
    {
      field: "indication",
      headerName: "Chỉ định",
      flex: 2,
    },
    {
      field: "quantity",
      headerName: "Số lượng",
      flex: 1,
    },
    {
      field: "expiryDate",
      headerName: "Ngày hết hạn",
      flex: 2,
    },
    {
      field: "price",
      headerName: "Giá thuốc",
      flex: 1,
    },
  ];

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_SERVER_PORT}/dentist/get-all-medicines`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data && response.data.medicines) {
          setRows(
            response.data.medicines.map((medicine: Medicine) => ({
              id: medicine.MaThuoc,
              drugName: medicine.TenThuoc,
              unit: medicine.DonViTinh,
              indication: medicine.ChiDinh,
              quantity: medicine.SoLuong,
              expiryDate: new Date(medicine.NgayHetHan).toLocaleDateString(
                "vi-VN"
              ),
              price: medicine.GiaThuoc,
            }))
          );
        } else {
          console.error("Unexpected API response", response);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);



  useEffect(() => {
    setRows(
      rows.filter((row) =>
        row.drugName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  return (
    <div>
        <h1>DANH SÁCH THUỐC</h1>
        <hr />
      <Box display='flex' justifyContent='center' m={1} p={1}>
        <TextField
          label='Tìm kiếm theo tên'
          variant='outlined'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 350 }}
        />
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}
