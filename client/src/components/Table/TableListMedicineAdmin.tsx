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
import ButtonAdd from "@mui/material/Button";
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

export default function TableListMedicineAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
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

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_SERVER_PORT}/admin/get-all-medicine`, {
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

  function handleEdit(medicine: Medicine) {
    setEditingMedicine(medicine);
    setEditModalOpen(true);
  }

  function handleEditModalClose() {
    setEditModalOpen(false);
    setEditingMedicine(null);
  }

  function handleDelete(id: string) {
    // Prepare the data in the required format
    const requestData = {
      MaThuoc: id,
    };

    axios
      .delete(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/admin/delete-medicine`,
        {
          withCredentials: true,
          data: requestData,
        }
      )
      .then((response) => {
        // Handle successful deletion, you might want to update the state or refresh the data
        console.log(`Medicine with ID ${id} deleted successfully`);
        // Update the state or reload data
        reloadData();
      })
      .catch((error) => {
        // Handle error during deletion
        console.error(`Error deleting medicine with ID ${id}`, error);
        // You can provide more specific error handling based on the status code
        if (error.response && error.response.status === 404) {
          // Handle Not Found error
          console.error(`Medicine with ID ${id} not found`);
        } else {
          // Handle other types of errors
          console.error("An error occurred during deletion");
        }
      });
  }

  function reloadData() {
    axios
      .get(`${import.meta.env.VITE_REACT_SERVER_PORT}/admin/get-all-medicine`, {
        withCredentials: true,
      })
      .then((response) => {
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
      })
      .catch((error) => {
        console.error("There was an error reloading data!", error);
      });
  }

  function handleSaveChanges() {
    if (editingMedicine) {
      // Prepare the updated user data
      const updatedMedicineData = {
        MaThuoc: editingMedicine.id,
        TenThuoc: editingMedicine.drugName,
        DonViTinh: editingMedicine.unit,
        ChiDinh: editingMedicine.indication,
        SoLuong: editingMedicine.quantity,
        NgayHetHan: editingMedicine.expiryDate,
        GiaThuoc: editingMedicine.price,
      };

      axios
        .put(
          `${import.meta.env.VITE_REACT_SERVER_PORT}/admin/update-medicine`,
          updatedMedicineData,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(
            `Medicine with ID ${editingMedicine.MaThuoc} updated successfully`
          );
          reloadData();
          handleEditModalClose();
        })
        .catch((error) => {
          console.error(
            `Error updating medicine with ID ${editingMedicine.MaThuoc}`,
            error
          );
        });
    }
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAddMedicine = () => {
    navigate("/addMedicine");
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
      <Box display='flex' justifyContent='flex-end' m={1} p={1}>
        <ButtonAdd
          variant='contained'
          color='success'
          onClick={handleAddMedicine}
        >
          Thêm thuốc
        </ButtonAdd>
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
            label='Tên thuốc'
            variant='outlined'
            value={editingMedicine?.drugName || ""}
            onChange={(e) =>
              setEditingMedicine((prevMedicine) => ({
                ...prevMedicine!,
                drugName: e.target.value,
              }))
            }
            sx={{ width: "100%", marginBottom: "16px" }}
          />

          <TextField
            label='Đơn vị tính'
            variant='outlined'
            value={editingMedicine?.unit || ""}
            onChange={(e) =>
              setEditingMedicine((prevMedicine) => ({
                ...prevMedicine!,
                unit: e.target.value,
              }))
            }
            sx={{ width: "100%", marginBottom: "16px" }}
          />
          <TextField
            label='Chỉ định'
            variant='outlined'
            value={editingMedicine?.indication || ""}
            onChange={(e) =>
              setEditingMedicine((prevMedicine) => ({
                ...prevMedicine!,
                indication: e.target.value,
              }))
            }
            sx={{ width: "100%", marginBottom: "16px" }}
          />
          <TextField
            label='Số lượng'
            variant='outlined'
            value={editingMedicine?.quantity || ""}
            onChange={(e) =>
              setEditingMedicine((prevMedicine) => ({
                ...prevMedicine!,
                quantity: e.target.value,
              }))
            }
            sx={{ width: "100%", marginBottom: "16px" }}
          />
          <TextField
            label='Giá thuốc'
            variant='outlined'
            value={editingMedicine?.price || ""}
            onChange={(e) =>
              setEditingMedicine((prevMedicine) => ({
                ...prevMedicine!,
                price: e.target.value,
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
    </div>
  );
}
