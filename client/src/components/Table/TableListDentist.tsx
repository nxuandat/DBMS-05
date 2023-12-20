import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridCellParams } from "@mui/x-data-grid";
import { Box, Button, TextField, Modal, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import axios from "axios";
interface Dentist {
  MaNS: string;
  TenDangNhap: string;
  HoTen: string;
  Phai: string;
  GioiThieu: string;
  MatKhau: string;
}


export default function TableListDentist() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Dentist | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_SERVER_PORT}/admin/get-all-dentists`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data && response.data.dentists) {
          setRows(
            response.data.dentists.map((user: Dentist) => ({
              id: user.MaNS,
              userName: user.TenDangNhap,
              fullName: user.HoTen,
              gender: user.Phai,
              dentistInfo: user.GioiThieu,
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

  function handleEdit(user: Dentist) {
    setEditingUser(user);
    setEditModalOpen(true);
  }

  function handleEditModalClose() {
    setEditModalOpen(false);
    setEditingUser(null);
  }

  function handleDelete(id: string) {
    // Prepare the data in the required format
    const requestData = {
      MaNS: id,
    };
  
    axios
      .delete(`${import.meta.env.VITE_REACT_SERVER_PORT}/admin/delete-dentist`, {
        withCredentials: true,
        data: requestData,
      })
      .then((response) => {
        // Handle successful deletion, you might want to update the state or refresh the data
        console.log(`Dentist with ID ${id} deleted successfully`);
        // Update the state or reload data
        reloadData();
      })
      .catch((error) => {
        // Handle error during deletion
        console.error(`Error deleting Dentist with ID ${id}`, error);
        // You can provide more specific error handling based on the status code
        if (error.response && error.response.status === 404) {
          // Handle Not Found error
          console.error(`Dentist with ID ${id} not found`);
        } else {
          // Handle other types of errors
          console.error("An error occurred during deletion");
        }
      });
  }
  function reloadData() {
    axios
      .get(`${import.meta.env.VITE_REACT_SERVER_PORT}/admin/get-all-dentists`, {
        withCredentials: true,
      })
      .then((response) => {
        setRows(
          response.data.dentists.map((user: Dentist) => ({
            id: user.MaNS,
            userName: user.TenDangNhap,
            fullName: user.HoTen,
            gender: user.Phai,
            dentistInfo: user.GioiThieu,
            password: user.MatKhau,
          }))
        );
      })
      .catch((error) => {
        console.error("There was an error reloading data!", error);
      });
  }

  function handleSaveChanges() {
    if (editingUser) {
      // Prepare the updated user data
      const updatedUserData = {
        MaNS: editingUser.id,
        Phai: editingUser.gender,
        TenDangNhap: editingUser.userName,
        HoTen: editingUser.fullName,
        GioiThieu: editingUser.dentistInfo,
        MatKhau: editingUser.password,
      };

      axios
        .put(
          `${import.meta.env.VITE_REACT_SERVER_PORT}/admin/update-dentist`,
          updatedUserData,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(`Dentist with ID ${editingUser.id} updated successfully`);
          reloadData();
          handleEditModalClose();
        })
        .catch((error) => {
          console.error(`Error updating dentist with ID ${editingUser.id}`, error);
        });
    }
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

  useEffect(() => {
    setRows(
      rows.filter((row) =>
        row.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

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
      field: "dentistInfo",
      headerName: "Giới thiệu",
      flex: 2,
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
            onClick={() => handleEdit(params.row)}
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

  return (
    <div>
      <h2>Danh sách Nha sĩ</h2>
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
      <Modal open={isEditModalOpen} onClose={handleEditModalClose} disableEnforceFocus disableAutoFocus>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            borderRadius: '8px',
            padding: '50px',
            minWidth: '500px', // Adjust the width as needed
          }}
        >
          {/* Render the fields of the editingUser for modification */}
          <TextField
            label='Ten dang nhap'
            variant='outlined'
            value={editingUser?.userName || ""}
            onChange={(e) =>
              setEditingUser((prevUser) => ({
                ...prevUser!,
                userName: e.target.value,
              }))
            }
            sx={{ width: '100%', marginBottom: '16px' }}
          />

          <TextField
            label='Ho Ten'
            variant='outlined'
            value={editingUser?.fullName || ""}
            onChange={(e) =>
              setEditingUser((prevUser) => ({
                ...prevUser!,
                fullName: e.target.value,
              }))
            }
            sx={{ width: '100%', marginBottom: '16px' }}
          />

          {/* Gender (Phai) Radio Group */}
          <RadioGroup
            aria-label='Gioi tinh'
            name='gender'
            value={editingUser?.gender || ""}
            onChange={(e) =>
              setEditingUser((prevUser) => ({
                ...prevUser!,
                gender: e.target.value,
              }))
            }
            sx={{ flexDirection: 'row', marginBottom: '16px'}}
          >
            <FormControlLabel value='M' control={<Radio />} label='Male' />
            <FormControlLabel value='F' control={<Radio />} label='Female' />
          </RadioGroup>

          <TextField
            label='Gioi thieu'
            variant='outlined'
            value={editingUser?.dentistInfo || ""}
            onChange={(e) =>
              setEditingUser((prevUser) => ({
                ...prevUser!,
                dentistInfo: e.target.value,
              }))
            }
            sx={{ width: '100%', marginBottom: '16px' }}
          />

          <TextField
            label='Mat Khau'
            variant='outlined'
            value={editingUser?.password || ""}
            onChange={(e) =>
              setEditingUser((prevUser) => ({
                ...prevUser!,
                password: e.target.value,
              }))
            }
            sx={{ width: '100%', marginBottom: '16px' }}
          />

        <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                marginTop: '16px',
              }}
            >
          <Button onClick={handleSaveChanges}
            sx={{
              marginTop: '16px',
              backgroundColor: 'blue',
              color: 'white',
              width: '120px',
              borderRadius: '5px',
              ":hover": {
                backgroundColor: 'darkblue' 
              },
            }}
          >
            Save Changes
          </Button>
          <Button
            onClick={handleEditModalClose}
            sx={{
              marginTop: '16px',
              backgroundColor: 'red',
              color: 'white',
              width: '120px',
              marginLeft: '2rem',
              borderRadius: '5px',
              ":hover": {
                backgroundColor: 'darkred',
              },
            }}
          >
                Cancel
              </Button>
          </Box>
        </Box>
      </Modal>

    </div>
  );
}
