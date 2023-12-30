import TableListMedicineAdmin from "../components/Table/TableListMedicineAdmin";
import TableExpiredMedicineAdmin from "../components/Table/TableExpiredMedicineAdmin";
export default function AdminListUser() {
  return (
    <div>
      <h1>DANH SÁCH THUỐC</h1>
      <TableListMedicineAdmin />
      <hr />
      <TableExpiredMedicineAdmin />
      <hr />
    </div>
  );
}
