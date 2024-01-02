import TableListMedicineDentist from "../components/Table/TableListMedicineDentist";
import TableListDetailMedicine from "../components/Table/TableListDetailMedicine";

export default function DentistListMedicine() {
  return (
    <div>
      <TableListMedicineDentist />
      <hr />
      <TableListDetailMedicine />
    </div>
  );
}