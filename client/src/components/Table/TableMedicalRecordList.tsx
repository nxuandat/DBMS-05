import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import Button from "@mui/material/Button";

interface MedicalRecord {
  MaKH: string;
  SoDT: string;
  STT: number;
  NgayKham: Date;
  DanDo: string;
  MaNS: string;
  MaDV: string;
  MaThuoc: string;
  TinhTrangXuatHoaDon: string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function CustomizedTables() {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_SERVER_PORT
        }/dentist/get-all-medicalrecords`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setMedicalRecords(res.data.medicalRecords || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const groupedMedicalRecords: { [key: string]: MedicalRecord[] } = {};

  medicalRecords.forEach((record) => {
    if (!groupedMedicalRecords[record.MaKH]) {
      groupedMedicalRecords[record.MaKH] = [];
    }
    groupedMedicalRecords[record.MaKH].push(record);
  });

  function handleDelete(id: string) {
    // Prepare the data in the required format
    const requestData = {
      SoDT: id,
    };

    axios
      .delete(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/dentist/delete-medicalrecord`,
        {
          withCredentials: true,
          data: requestData,
        }
      )
      .then((response) => {
        // Handle successful deletion, you might want to update the state or refresh the data
        console.log(`Employee with ID ${id} deleted successfully`);
        // Update the state or reload data
        reloadData();
      })
      .catch((error) => {
        // Handle error during deletion
        console.error(`Error deleting medical record with SoDT: ${id}`, error);
        // You can provide more specific error handling based on the status code
        if (error.response && error.response.status === 404) {
          // Handle Not Found error
          console.error(`medical record with SoDT: ${id} not found`);
        } else {
          // Handle other types of errors
          console.error("An error occurred during deletion");
        }
      });
  }
  function reloadData() {
    axios
      .get(
        `${import.meta.env.VITE_REACT_SERVER_PORT}/dentist/get-all-medicalrecords`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setMedicalRecords(response.data.medicalRecords || []);
      })
      .catch((error) => {
        console.error("There was an error reloading data!", error);
      });
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label='customized table'>
        <TableHead>
          <TableRow>
            <StyledTableCell>MaKH</StyledTableCell>
            <StyledTableCell align='center'>Số điện thoại</StyledTableCell>
            <StyledTableCell align='center'>STT Khám</StyledTableCell>
            <StyledTableCell align='center'>Ngày khám</StyledTableCell>
            <StyledTableCell align='center'>Dặn dò</StyledTableCell>
            <StyledTableCell align='center'>Mã nha sĩ</StyledTableCell>
            <StyledTableCell align='center'>Mã dịch vụ</StyledTableCell>
            <StyledTableCell align='center'>Mã thuốc</StyledTableCell>
            <StyledTableCell align='center'>Xuất hóa đơn</StyledTableCell>
            <StyledTableCell align='center'>Xóa</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(groupedMedicalRecords).map((maKH) => (
            <Fragment key={maKH}>
              {groupedMedicalRecords[maKH].map((record, index) => (
                <StyledTableRow key={`${maKH}-${index}`}>
                  {index === 0 && (
                    <StyledTableCell
                      component='th'
                      scope='row'
                      rowSpan={groupedMedicalRecords[maKH].length}
                    >
                      {maKH}
                    </StyledTableCell>
                  )}
                  <StyledTableCell align='left'>{record.SoDT}</StyledTableCell>
                  <StyledTableCell align='left'>{record.STT}</StyledTableCell>
                  <StyledTableCell align='left'>
                    {new Date(record.NgayKham).toLocaleDateString()}
                  </StyledTableCell>
                  <StyledTableCell align='left'>
                    {record.DanDo}
                  </StyledTableCell>
                  <StyledTableCell align='left'>{record.MaNS}</StyledTableCell>
                  <StyledTableCell align='left'>{record.MaDV}</StyledTableCell>
                  <StyledTableCell align='left'>
                    {record.MaThuoc}
                  </StyledTableCell>
                  <StyledTableCell align='left'>
                    {record.TinhTrangXuatHoaDon === "ChuaXuat"
                      ? "Chưa xuất"
                      : record.TinhTrangXuatHoaDon === "DaXuat"
                      ? "Đã xuất"
                      : "Lỗi!"}
                  </StyledTableCell>
                  <StyledTableCell align='center'>
                    <Button
                      variant='contained'
                      // color='secondary'
                      onClick={() => handleDelete(record.SoDT)}
                    >
                      Xóa
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
