import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridCellParams } from "@mui/x-data-grid";
import {
  Box,
  Button,
  TextField,
  Modal,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

interface User {
  MaKH: string;
  HoTen: string;
  SoDT: string;
  Email: string;
  NgaySinh: string;
  DiaChi: string;
  Phai: string;
  MatKhau: string;
}

export default function TableListUser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const navigate = useNavigate();

  function handleDelete(id: string) {
    // Prepare the data in the required format
    const requestData = {
      MaKH: id,
    };

    axios
      .delete(`${import.meta.env.VITE_REACT_SERVER_PORT}/admin/delete-user`, {
        withCredentials: true,
        data: requestData, // Use the data property to send the payload in the request body
      })
      .then((response) => {
        // Handle successful deletion, you might want to update the state or refresh the data
        console.log(`User with ID ${id} deleted successfully`);
        // Update the state or reload data
        reloadData();
      })
      .catch((error) => {
        // Handle error during deletion
        console.error(`Error deleting user with ID ${id}`, error);
      });
  }

  function handleEdit(user: User) {
    setEditingUser(user);
    setEditModalOpen(true);
  }

  function handleEditModalClose() {
    setEditModalOpen(false);
    setEditingUser(null);
  }

  function handleSaveChanges() {
    if (editingUser) {
      // Prepare the updated user data
      const updatedUserData = {
        MaKH: editingUser.id,
        Phai: editingUser.gender,
        HoTen: editingUser.fullName,
        DiaChi: editingUser.address,
        SoDT: editingUser.phoneNumber,
        Email: editingUser.email,
        MatKhau: editingUser.password,
      };

      axios
        .put(
          `${import.meta.env.VITE_REACT_SERVER_PORT}/admin/update-user`,
          updatedUserData,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(`User with ID ${editingUser.id} updated successfully`);
          reloadData();
          handleEditModalClose();
          toast.success("Sửa thành công!");
        })
        .catch((error) => {
          console.error(`Error updating user with ID ${editingUser.id}`, error);
        });
    }
  }
  function reloadData() {
    axios
      .get(`${import.meta.env.VITE_REACT_SERVER_PORT}/admin/get-all-users`, {
        withCredentials: true,
      })
      .then((response) => {
        setRows(
          response.data.users.map((user) => ({
            id: user.MaKH,
            fullName: user.HoTen,
            phoneNumber: user.SoDT,
            birthDate: new Date(user.NgaySinh).toLocaleDateString("en-GB"),
            address: user.DiaChi,
            email: user.Email,
            gender: user.Phai,
            password: user.MatKhau,
          }))
        );
      })
      .catch((error) => {
        console.error("There was an error reloading data!", error);
      });
  }

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_SERVER_PORT}/admin/get-all-users`, {
        withCredentials: true,
      })
      .then((response) => {
        setRows(
          response.data.users.map((user: User) => ({
            id: user.MaKH,
            fullName: user.HoTen,
            phoneNumber: user.SoDT,
            birthDate: new Date(user.NgaySinh).toLocaleDateString("en-GB"),
            address: user.DiaChi,
            email: user.Email,
            gender: user.Phai,
            password: user.MatKhau,
          }))
        );
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

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
      field: "phoneNumber",
      headerName: "Số ĐT",
      flex: 2,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
    },
    {
      field: "gender",
      headerName: "Giới tính",
      flex: 1,
    },
    {
      field: "birthDate",
      headerName: "Ngày sinh",
      flex: 2,
    },
    {
      field: "address",
      headerName: "Địa chỉ",
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

  return (
    <div>
      <h2>Danh sách người dùng (Bệnh nhân)</h2>
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
      <Modal
        open={isEditModalOpen}
        onClose={handleEditModalClose}
        disableEnforceFocus
        disableAutoFocus
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: "8px",
            padding: "50px",
            minWidth: "500px", // Adjust the width as needed
          }}
        >
          {/* Render the fields of the editingUser for modification */}
          <TextField
            label='Họ và tên'
            variant='outlined'
            value={editingUser?.fullName || ""}
            onChange={(e) =>
              setEditingUser((prevUser) => ({
                ...prevUser!,
                fullName: e.target.value,
              }))
            }
            sx={{ width: "100%", marginBottom: "16px" }}
          />

          <TextField
            label='Số điện thoại'
            variant='outlined'
            value={editingUser?.phoneNumber || ""}
            onChange={(e) =>
              setEditingUser((prevUser) => ({
                ...prevUser!,
                phoneNumber: e.target.value,
              }))
            }
            sx={{ width: "100%", marginBottom: "16px" }}
          />

          <TextField
            label='Email'
            variant='outlined'
            value={editingUser?.email || ""}
            onChange={(e) =>
              setEditingUser((prevUser) => ({
                ...prevUser!,
                email: e.target.value,
              }))
            }
            sx={{ width: "100%", marginBottom: "16px" }}
          />

          {/* Gender (Phai) Radio Group */}
          <RadioGroup
            aria-label='Giới tính'
            name='gender'
            value={editingUser?.gender || ""}
            onChange={(e) =>
              setEditingUser((prevUser) => ({
                ...prevUser!,
                gender: e.target.value,
              }))
            }
            sx={{ flexDirection: "row", marginBottom: "16px" }}
          >
            <FormControlLabel value='M' control={<Radio />} label='Male' />
            <FormControlLabel value='F' control={<Radio />} label='Female' />
          </RadioGroup>

          {/* Address (DiaChi) TextField */}
          <TextField
            label='Địa chỉ'
            variant='outlined'
            value={editingUser?.address || ""}
            onChange={(e) =>
              setEditingUser((prevUser) => ({
                ...prevUser!,
                address: e.target.value,
              }))
            }
            sx={{ width: "100%", marginBottom: "16px" }}
          />

          <TextField
            label='Mật khẩu'
            variant='outlined'
            value={editingUser?.password || ""}
            onChange={(e) =>
              setEditingUser((prevUser) => ({
                ...prevUser!,
                password: e.target.value,
              }))
            }
            sx={{ width: "100%", marginBottom: "16px" }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginTop: "16px",
            }}
          >
            <Button
              onClick={handleSaveChanges}
              sx={{
                marginTop: "16px",
                backgroundColor: "#2AB178",
                color: "white",
                width: "120px",
                borderRadius: "5px",
                ":hover": {
                  backgroundColor: "#31B373",
                },
              }}
            >
              Lưu thay đổi
            </Button>
            <Button
              onClick={handleEditModalClose}
              sx={{
                marginTop: "16px",
                backgroundColor: "red",
                color: "white",
                width: "120px",
                marginLeft: "2rem",
                borderRadius: "5px",
                ":hover": {
                  backgroundColor: "darkred",
                },
              }}
            >
              Hủy
            </Button>
          </Box>
        </Box>
      </Modal>
      <ToastContainer />
    </div>
  );
}
