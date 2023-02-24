import { useEffect, useState } from "react";
import ExcelJS from 'exceljs'
import "./App.css"
import EditPage from "./components/EditPage";
import FilePage from "./components/FilePage";


function App() {
  const [file, setFile] = useState();
  const [loaded, setLoaded] = useState(false);
  const [date, setDate] = useState(new Date());
  const [availableDogs, setAvailableDogs] = useState([]);
  const [editing, setEditing] = useState(false);
  const [firstSession, setFirstSession] = useState([]);
  const [secondSession, setSecondSession] = useState([]);

  useEffect(() => {
    setAvailableDogs([]);
    setLoaded(false);
    const dogs = [];
    if (typeof (file) === "object") {
      const fileReader = new FileReader();
      fileReader.onloadend = async e => {
        setLoaded(true);
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(e.target.result);
        const worksheet = workbook.getWorksheet('rok 2023');
        for (let index = 1; index < worksheet._columns.length; index++) {
          const column = worksheet.getColumn(index);
          let cell = column.values[3];
          if (typeof (cell) === "object" && date && cell.toLocaleDateString() === date.toLocaleDateString()) {
            let index = 6;
            while (worksheet.getCell(index, 1).value?.length > 0) {
              cell = column.values[index];
              console.log(`${worksheet.getCell(index, 1)} - ${cell}`);
              if (cell && /[tT].*/.test(cell)) {
                dogs.push({
                  name: worksheet.getCell(index, 1).value,
                  firstEnter: false,
                  secondEnter: false
                });
              }
              index++;
            }
          }
        }
        setAvailableDogs(dogs);
      };
      fileReader.readAsArrayBuffer(file);
    }

  }, [file, date]);

  return (
    <>
      {editing ?
        <EditPage availableDogs={availableDogs} setAvailableDogs={setAvailableDogs} setEditing={setEditing} firstSession={firstSession} setFirstSession={setFirstSession} secondSession={secondSession} setSecondSession={setSecondSession} date={date} />
        :
        <FilePage loaded={loaded} date={date} setDate={setDate} setFile={setFile} availableDogs={availableDogs} setEditing={setEditing} />
      }
    </>
  );
}

export default App;
