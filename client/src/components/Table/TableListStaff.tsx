import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridCellParams } from "@mui/x-data-grid";
import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import axios from "axios";

interface Staff {
  MaNS: string;
  TenDangNhap: string;
  HoTen: string;
  Phai: string;
  MatKhau: string;
}
const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 1,
  },
  {
    field: "userName",
    headerName: "Tên đăng nhập",
    flex: 2,
  },
  {
    field: "fullName",
    headerName: "Họ và tên",
    flex: 2,
  },
  {
    field: "gender",
    headerName: "Giới tính",
    flex: 1,
  },
  {
    field: "password",
    headerName: "Mật Khẩu",
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

export default function TableListStaff() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/admin/get-all-employees`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data && response.data.employees) {
          setRows(
            response.data.employees.map((user: Staff) => ({
              id: user.MaNV,
              userName: user.TenDangNhap,
              fullName: user.HoTen,
              gender: user.Phai,
              password: user.MatKhau,
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

  function handleEdit(id: number) {
    // Handle edit action here...
  }

  function handleDelete(id: number) {
    // Handle delete action here...
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddStaff = () => {
    navigate("/addStaff");
    handleClose();
  };

  const handleAddDoctor = () => {
    navigate("/addDoctor");
    handleClose();
  };

  const handleAddUser = () => {
    navigate("/addUser");
    handleClose();
  };

  function handleEdit(id: number) {
    // Handle edit action here...
  }

  function handleDelete(id: number) {
    // Handle delete action here...
  }

  useEffect(() => {
    setRows(
      rows.filter((row) =>
        row.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  return (
    <div>
      <h2>Danh sách Nhân viên</h2>
      <Box display='flex' justifyContent='flex-end' m={1} p={1}>
        <Dropdown>
          <Dropdown.Toggle variant='success' id='dropdown-basic'>
            Thêm người dùng
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleAddStaff}>Nhân viên</Dropdown.Item>
            <Dropdown.Item onClick={handleAddDoctor}>Nha sĩ</Dropdown.Item>
            <Dropdown.Item onClick={handleAddUser}>Bệnh nhân</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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
