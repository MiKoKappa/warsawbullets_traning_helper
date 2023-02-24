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
  const [people, setPeople] = useState([]);

  useEffect(() => {
    setAvailableDogs([]);
    setPeople([]);
    setLoaded(false);
    const dogs = [];
    const peopleTemp = [];
    if (typeof (file) === "object") {
      const fileReader = new FileReader();
      fileReader.onloadend = async e => {
        setLoaded(true);
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(e.target.result);
        const worksheetDogs = workbook.getWorksheet(1);
        const worksheetPeople = workbook.getWorksheet('OwnerData');
        for (let index = 1; index < worksheetDogs._columns.length; index++) {
          const column = worksheetDogs.getColumn(index);
          let cell = column.values[3];
          if (typeof (cell) === "object" && date && cell.toLocaleDateString() === date.toLocaleDateString()) {
            let index = 6;
            while (worksheetDogs.getCell(index, 1).value?.length > 0) {
              cell = column.values[index];
              if (cell && /[tT].*/.test(cell)) {
                const dogName = worksheetDogs.getCell(index, 1).value
                let i = 1;
                while (worksheetPeople.getCell(i, 1).value !== dogName && i < worksheetPeople.rowCount) {
                  i++;
                }
                if (worksheetPeople.getCell(i, 1).value === dogName) {
                  worksheetPeople.getCell(i, 2).value.split(',').forEach(element => {
                    const personName = element[0] === " " ? element.substring(1) : element;
                    if (!peopleTemp.includes(personName)) {
                      peopleTemp.push(personName);
                    }
                  });
                }
                if (worksheetPeople.getCell(i, 1).value !== worksheetPeople.getCell(i, 2).value) {
                  dogs.push({
                    name: dogName,
                    firstEnter: false,
                    secondEnter: false
                  });
                }
              }
              index++;
            }
          }
        }
        setAvailableDogs(dogs);
        setPeople(peopleTemp);
      };
      fileReader.readAsArrayBuffer(file);
    }

  }, [file, date]);

  return (
    <>
      {editing ?
        <EditPage availableDogs={availableDogs} setAvailableDogs={setAvailableDogs} setEditing={setEditing} firstSession={firstSession} setFirstSession={setFirstSession} secondSession={secondSession} setSecondSession={setSecondSession} date={date} people={people} />
        :
        <FilePage loaded={loaded} date={date} setDate={setDate} setFile={setFile} availableDogs={availableDogs} setEditing={setEditing} />
      }
    </>
  );
}

export default App;
