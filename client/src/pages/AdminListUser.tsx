import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TextField, Box, Button } from "@mui/material";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 1,
  },
  {
    field: "fullName",
    headerName: "Họ và tên",
    flex: 2,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 3,
  },
  {
    field: "role",
    headerName: "Vai trò",
    flex: 2,
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
const initialRows = [
  {
    id: 1,
    fullName: "Snow Jon",
    email: "jon.snow@example.com",
    role: "Bác sĩ",
  },
  {
    id: 2,
    fullName: "Lannister Cersei",
    email: "cersei.lannister@example.com",
    role: "Nhân viên",
  },
  {
    id: 3,
    fullName: "Lannister Jaime",
    email: "jaime.lannister@example.com",
    role: "Nhân viên",
  },
  {
    id: 4,
    fullName: "Stark Arya",
    email: "arya.stark@example.com",
    role: "Bệnh nhân",
  },
  {
    id: 5,
    fullName: "Targaryen Daenerys",
    email: "daenerys.targaryen@example.com",
    role: "Bệnh nhân",
  },
  {
    id: 6,
    fullName: "Melisandre",
    email: "melisandre@example.com",
    role: "Bác sĩ",
  },
  {
    id: 7,
    fullName: "Clifford Ferrara",
    email: "clifford.ferrara@example.com",
    role: "Nhân viên",
  },
  {
    id: 8,
    fullName: "Frances Rossini",
    email: "frances.rossini@example.com",
    role: "Bác sĩ",
  },
  {
    id: 9,
    fullName: "Roxie Harvey",
    email: "roxie.harvey@example.com",
    role: "Bệnh nhân",
  },
];

export default function DataTable() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [rows, setRows] = React.useState(initialRows);

  function handleEdit(id: number) {
    // Handle edit action here...
  }

  function handleDelete(id: number) {
    // Handle delete action here...
  }

  React.useEffect(() => {
    setRows(
      initialRows.filter((row) =>
        row.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);
  return (
    // <div style={{ height: 400, width: "100%" }}>
    <div>
      <h1>QUẢN LÝ NGƯỜI DÙNG</h1>
      <Box display='flex' justifyContent='flex-end' m={1} p={1}>
        <Button variant='contained' color='success'>
          THÊM NGƯỜI DÙNG
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
