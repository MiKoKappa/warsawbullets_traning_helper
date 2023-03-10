import { useEffect, useState } from "react";
import axios from 'axios'
import "./App.css"
import EditPage from "./components/EditPage";
import FilePage from "./components/FilePage";


function App() {
  const [loaded, setLoaded] = useState(false);
  const [date, setDate] = useState(new Date());
  const [availableDogs, setAvailableDogs] = useState([]);
  const [editing, setEditing] = useState(false);
  const [firstSession, setFirstSession] = useState([]);
  const [secondSession, setSecondSession] = useState([]);
  const [people, setPeople] = useState([]);
  const [file, setFile] = useState();

  useEffect(() => {
    const firstSessionDogs = firstSession.map(v => v.dogs).flat();
    const secondSessionDogs = secondSession.map(v => v.dogs).flat();
    setAvailableDogs(availableDogs.map(i => { return { name: i.name, firstEnter: firstSessionDogs.includes(i.name), secondEnter: secondSessionDogs.includes(i.name) } }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstSession, secondSession])

  useEffect(() => {
    if (typeof (file) === "object") {
      const fileReader = new FileReader();
      fileReader.onloadend = async e => {
        const decoder = new TextDecoder('UTF-8');
        const data = JSON.parse(decoder.decode(e.target.result));
        console.log(data.availableDogs);
        if (data.availableDogs.length > 0) {
          setAvailableDogs([...data.availableDogs]);
          setPeople(data.people);
          setFirstSession(data.firstSession);
          setSecondSession(data.secondSession);
          setEditing(true);
        }
      }
      fileReader.readAsArrayBuffer(file);
    };
  }, [file]);

  useEffect(() => {
    setAvailableDogs([]);
    setPeople([]);
    setLoaded(false);

    const url = "https://script.google.com/macros/s/AKfycbzd6TDalEvb3B4J1I-hfIHSfmup7GhVMeFnxmMhUkV31UaEE6coJQrYp-IGfajc7eppCQ/exec?date=" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear();

    axios.get(url, {
      headers: {
        'Content-Type': "text/plain",
      }
    }).then(res => {
      if (res.data.data === "ERR") {
        setLoaded(true);
      }
      else {
        setLoaded(true);
        if (res.data.data.dogs.length > 0) {

          setAvailableDogs(res.data.data.dogs.map(i => { return { name: i, firstEnter: false, secondEnter: false } }));
        }
        if (res.data.data.people.length > 0)
          setPeople(res.data.data.people);
      }
    }).catch(e => { console.log(e) });
  }, [date]);

  return (
    <>
      {editing ?
        <EditPage availableDogs={availableDogs} setAvailableDogs={setAvailableDogs} setEditing={setEditing} firstSession={firstSession} setFirstSession={setFirstSession} secondSession={secondSession} setSecondSession={setSecondSession} date={date} people={people} />
        :
        <FilePage loaded={loaded} date={date} setDate={setDate} availableDogs={availableDogs} setEditing={setEditing} setFile={setFile} />
      }
    </>
  );
}

export default App;
