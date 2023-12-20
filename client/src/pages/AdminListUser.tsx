// import React, { useState, useEffect } from "react";
// import { DataGrid, GridColDef, GridCellParams } from "@mui/x-data-grid";
// import { Box, Button, TextField } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { Dropdown } from "react-bootstrap";
// import axios from "axios";
// interface User {
//   MaKH: string;
//   HoTen: string;
//   SoDT: string;
//   Email: string;
//   NgaySinh: string;
//   DiaChi: string;
//   Phai: string;
//   MatKhau: string;
// }
// const columns: GridColDef[] = [
//   {
//     field: "id",
//     headerName: "ID",
//     flex: 1,
//   },
//   {
//     field: "fullName",
//     headerName: "Họ và tên",
//     flex: 2,
//   },
//   {
//     field: "phoneNumber",
//     headerName: "Số ĐT",
//     flex: 2,
//   },
//   {
//     field: "email",
//     headerName: "Email",
//     flex: 2,
//   },
//   {
//     field: "gender",
//     headerName: "Giới tính",
//     flex: 1,
//   },
//   {
//     field: "birthDate",
//     headerName: "Ngày sinh",
//     flex: 2,
//   },
//   {
//     field: "address",
//     headerName: "Địa chỉ",
//     flex: 2,
//   },
//   {
//     field: "password",
//     headerName: "Mật Khẩu",
//     flex: 2,
//   },
//   {
//     field: "actions",
//     headerName: "Thao tác",
//     flex: 2,
//     renderCell: (params: GridCellParams) => (
//       <div>
//         <Button
//           variant='outlined'
//           color='success'
//           onClick={() => handleEdit(params.row.id)}
//           style={{ marginRight: "10px" }}
//         >
//           SỬA
//         </Button>
//         <Button
//           variant='outlined'
//           color='error'
//           onClick={() => handleDelete(params.row.id)}
//         >
//           XÓA
//         </Button>
//       </div>
//     ),
//   },
// ];

// export default function DataTable() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [rows, setRows] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get(`${import.meta.env.VITE_REACT_SERVER_PORT}/admin/get-all-users`, {
//         withCredentials: true,
//       })
//       .then((response) => {
//         setRows(
//           response.data.users.map((user: User) => ({
//             id: user.MaKH,
//             fullName: user.HoTen,
//             phoneNumber: user.SoDT,
//             birthDate: new Date(user.NgaySinh).toLocaleDateString("en-GB"),
//             address: user.DiaChi,
//             email: user.Email,
//             gender: user.Phai,
//             password: user.MatKhau,
//           }))
//         );
//       })
//       .catch((error) => {
//         console.error("There was an error!", error);
//       });
//   }, []);

//   function handleEdit(id: number) {
//     // Handle edit action here...
//   }

//   function handleDelete(id: number) {
//     // Handle delete action here...
//   }

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleAddStaff = () => {
//     navigate("/addStaff");
//     handleClose();
//   };

//   const handleAddDoctor = () => {
//     navigate("/addDoctor");
//     handleClose();
//   };

//   const handleAddUser = () => {
//     navigate("/addUser");
//     handleClose();
//   };

//   function handleEdit(id: number) {
//     // Handle edit action here...
//   }

//   function handleDelete(id: number) {
//     // Handle delete action here...
//   }

//   useEffect(() => {
//     setRows(
//       rows.filter((row) =>
//         row.fullName.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   }, [searchTerm]);

//   return (
//     <div>
//       <h1>QUẢN LÝ NGƯỜI DÙNG</h1>
//       <Box display='flex' justifyContent='flex-end' m={1} p={1}>
//         <Dropdown>
//           <Dropdown.Toggle variant='success' id='dropdown-basic'>
//             Thêm người dùng
//           </Dropdown.Toggle>

//           <Dropdown.Menu>
//             <Dropdown.Item onClick={handleAddStaff}>Nhân viên</Dropdown.Item>
//             <Dropdown.Item onClick={handleAddDoctor}>Nha sĩ</Dropdown.Item>
//             <Dropdown.Item onClick={handleAddUser}>Bệnh nhân</Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>
//       </Box>
//       <Box display='flex' justifyContent='center' m={1} p={1}>
//         <TextField
//           label='Tìm kiếm theo tên'
//           variant='outlined'
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           sx={{ width: 350 }}
//         />
//       </Box>

//       <DataGrid
//         rows={rows}
//         columns={columns}
//         initialState={{
//           pagination: {
//             paginationModel: { page: 0, pageSize: 5 },
//           },
//         }}
//         pageSizeOptions={[5, 10]}
//         checkboxSelection
//       />
//     </div>
//   );
// }

import TableListUser from "../components/Table/TableListUser";
import TableListDentist from "../components/Table/TableListDentist";
import TableListStaff from "../components/Table/TableListStaff";

export default function AdminListUser() {
  return (
    <div>
      <h1>QUẢN LÝ NGƯỜI DÙNG</h1>
      <TableListUser />
      <hr />
      <TableListDentist />
      <hr />
      <TableListStaff />
    </div>
  );
}
