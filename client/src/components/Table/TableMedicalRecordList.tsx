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

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label='customized table'>
        <TableHead>
          <TableRow>
            <StyledTableCell>MaKH</StyledTableCell>
            <StyledTableCell align='right'>Số điện thoại</StyledTableCell>
            <StyledTableCell align='right'>STT Khám</StyledTableCell>
            <StyledTableCell align='right'>Ngày khám</StyledTableCell>
            <StyledTableCell align='right'>Dặn dò</StyledTableCell>
            <StyledTableCell align='right'>Mã nha sĩ</StyledTableCell>
            <StyledTableCell align='right'>Mã dịch vụ</StyledTableCell>
            <StyledTableCell align='right'>Mã thuốc</StyledTableCell>
            <StyledTableCell align='right'>Xuất hóa đơn</StyledTableCell>
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
                  <StyledTableCell align='right'>{record.SoDT}</StyledTableCell>
                  <StyledTableCell align='right'>{record.STT}</StyledTableCell>
                  <StyledTableCell align='right'>
                    {new Date(record.NgayKham).toLocaleDateString()}
                  </StyledTableCell>
                  <StyledTableCell align='right'>
                    {record.DanDo}
                  </StyledTableCell>
                  <StyledTableCell align='right'>{record.MaNS}</StyledTableCell>
                  <StyledTableCell align='right'>{record.MaDV}</StyledTableCell>
                  <StyledTableCell align='right'>
                    {record.MaThuoc}
                  </StyledTableCell>
                  <StyledTableCell align='right'>
                    {record.TinhTrangXuatHoaDon === "ChuaXuat"
                      ? "Chưa xuất"
                      : record.TinhTrangXuatHoaDon === "DaXuat"
                      ? "Đã xuất"
                      : "Lỗi!"}
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
