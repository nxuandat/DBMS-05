import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TextField, Box, Button } from "@mui/material";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 1,
  },
  {
    field: "drugName",
    headerName: "Tên thuốc",
    flex: 2,
  },
  {
    field: "unit",
    headerName: "Đơn vị tính",
    flex: 1,
    align: "center",
  },
  {
    field: "indication",
    headerName: "Chỉ định",
    flex: 3,
  },
  {
    field: "quantity",
    headerName: "Số lượng",
    flex: 1,
    align: "center",
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
    align: "center",
  },
  {
    field: "actions",
    headerName: "Thao tác",
    flex: 2,
    renderCell: (params: GridCellParams) => (
      <div>
        <Button
          variant='outlined'
          color='success'
          onClick={() => handleEdit(params.row.id)}
          style={{ marginRight: "10px" }}
        >
          SỬA
        </Button>
        <Button
          variant='outlined'
          color='error'
          onClick={() => handleDelete(params.row.id)}
        >
          XÓA
        </Button>
      </div>
    ),
  },
];
// test
const initialRows = [
  {
    id: 0,
    drugName: "",
    unit: "",
    indication: "",
    quantity: 0,
    expiryDate: "",
    price: 0,
  },
];

export default function ListMedicine() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [rows, setRows] = React.useState(initialRows);

  const navigate = useNavigate();

  function handleEdit(id: number) {
    // Handle edit action here...
  }

  function handleDelete(id: number) {
    // Handle delete action here...
  }

  React.useEffect(() => {
    setRows(
      initialRows.filter((row) =>
        row.drugName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_SERVER_PORT}/admin/get-all-medicine`, {
        withCredentials: true,
      })
      .then((response) => {
        setRows(
          response.data.medicines.map((medicine) => ({
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
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
    // <div style={{ height: 400, width: "100%" }}>
    <div>
      <h1>QUẢN LÝ THUỐC</h1>
      <Box display='flex' justifyContent='flex-end' m={1} p={1}>
        <Button
          variant='contained'
          color='success'
          onClick={() => navigate("/addMedicine")}
        >
          THÊM THUỐC
        </Button>
      </Box>
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
