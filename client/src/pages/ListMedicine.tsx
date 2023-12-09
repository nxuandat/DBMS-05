import React from "react";
import { useNavigate } from "react-router-dom";

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
    id: 1,
    drugName: "Fluoride Toothpaste",
    unit: "g",
    indication: "Chăm sóc răng",
    quantity: 100,
    expiryDate: "2023-12-31",
    price: 4.99,
  },
  {
    id: 2,
    drugName: "Mouthwash",
    unit: "ml",
    indication: "Vệ sinh miệng",
    quantity: 150,
    expiryDate: "2024-02-28",
    price: 6.49,
  },
  {
    id: 3,
    drugName: "Topical Anesthetic Gel",
    unit: "g",
    indication: "Gây tê cho các thủ tục nha khoa",
    quantity: 30,
    expiryDate: "2023-11-30",
    price: 8.99,
  },
  {
    id: 4,
    drugName: "Dental Floss",
    unit: "m",
    indication: "Vệ sinh giữa răng",
    quantity: 50,
    expiryDate: "2023-10-15",
    price: 2.99,
  },
  {
    id: 5,
    drugName: "Fluoride Mouth Rinse",
    unit: "ml",
    indication: "Ngăn chặn sâu răng",
    quantity: 200,
    expiryDate: "2024-01-20",
    price: 9.99,
  },
  {
    id: 6,
    drugName: "Toothbrush",
    unit: "unit",
    indication: "Chăm sóc răng hàng ngày",
    quantity: 10,
    expiryDate: "2023-09-30",
    price: 3.99,
  },
  {
    id: 7,
    drugName: "Dental Cement",
    unit: "g",
    indication: "Nha khoa phục hình",
    quantity: 25,
    expiryDate: "2024-03-15",
    price: 12.99,
  },
  {
    id: 8,
    drugName: "Oral Antibiotic",
    unit: "mg",
    indication: "Phòng ngừa nhiễm trùng sau phẫu thuật",
    quantity: 20,
    expiryDate: "2023-08-25",
    price: 14.49,
  },
  {
    id: 9,
    drugName: "Orthodontic Wax",
    unit: "g",
    indication: "Thoải mái với các thiết bị nha khoa",
    quantity: 15,
    expiryDate: "2023-07-10",
    price: 5.99,
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
