import { useEffect, useRef, useState } from "react";
import ExcelJS from 'exceljs'
import "./App.css"
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function App() {
  const fileInput = useRef();
  const dateInput = useRef();
  const [file, setFile] = useState();
  const [loaded, setLoaded] = useState(false);
  const [date, setDate] = useState(new Date());
  const [availableDogs, setAvailableDogs] = useState([]);
  const [editing, setEditing] = useState(false);
  const [firstSession, setFirstSession] = useState([]);
  const [secondSession, setSecondSession] = useState([]);
  const [previousValue, setPreviousValue] = useState("");
  const [warningModal, setWarningModal] = useState(false);

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


  function constructPDF() {
    const dd = {
      content: [
        'Trening: ' + date.toLocaleDateString(),
        { text: 'Wejście I', style: 'header' },
        {
          table: {
            headerRows: 1,
            body: [
              [{ text: 'N.p.', bold: true }, { text: 'Opis ćwiczenia', bold: true }, { text: 'Psy', bold: true }, { text: 'Zadania', bold: true }, { text: 'Odznaczanie', bold: true }],

            ]
          },
          pageBreak: 'after'
        },
        { text: 'Wejście II', style: 'header' },
        {
          table: {
            headerRows: 1,
            body: [
              [{ text: 'N.p.', bold: true }, { text: 'Opis ćwiczenia', bold: true }, { text: 'Psy', bold: true }, { text: 'Zadania', bold: true }, { text: 'Odznaczanie', bold: true }],
            ]
          }
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      }
    }
    firstSession.sort((a, b) => a.id - b.id).map((v, i) => [String(i + 1), String(v.activity), String(v.dogs.join(", ")), String(v.tasks), " "]).forEach(elem => {
      dd.content[2].table.body.push(elem);
    });
    secondSession.sort((a, b) => a.id - b.id).map((v, i) => [String(i + 1), String(v.activity), String(v.dogs.join(", ")), String(v.tasks), " "]).forEach(elem => {
      dd.content[4].table.body.push(elem);
    });
    pdfMake.createPdf(dd).download("WarsawBullets_Trening_" + date.toLocaleDateString() + ".pdf");
  }

  return (
    <>
      {editing ?
        <section className="container">
          <div className={`modal ${warningModal ? "is-active" : null}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">Brak wejść dla psów!</p>
                <button onClick={() => { setWarningModal(false) }} className="delete" aria-label="close"></button>
              </header>
              <section className="modal-card-body">
                <div className="columns">
                  {availableDogs.filter(item => !item.firstEnter && !item.secondEnter).length > 0 ?
                    <div className="column">
                      <p>Następujące psy nie mają wejść:</p>
                      <ul>
                        {availableDogs.filter(item => !item.firstEnter && !item.secondEnter).map(elem =>
                          <li className="text-bad">
                            {elem.name}
                          </li>
                        )}
                      </ul>
                    </div>
                    : null
                  }
                  {availableDogs.filter(item => (!item.firstEnter && item.secondEnter) || (item.firstEnter && !item.secondEnter)).length > 0 ?
                    <div className="column">
                      <p>Następujące psy mają ćwiczenia tylko w jednym wejściu:</p>
                      <ul>
                        {availableDogs.filter(item => (!item.firstEnter && item.secondEnter) || (item.firstEnter && !item.secondEnter)).map(elem =>
                          <li className="text-warning">
                            {elem.name}
                          </li>
                        )}
                      </ul>
                    </div>
                    : null
                  }
                </div>

              </section>
              <footer className="modal-card-foot">
                <button onClick={() => { constructPDF() }} className="button is-good has-text-weight-semibold">Eksportuj mimo tego</button>
                <button onClick={() => { setWarningModal(false) }} className="button">Oh shit go back!</button>
              </footer>
            </div>
          </div>
          <nav className="navbar container mt-2" role="navigation" aria-label="main navigation">
            <img alt="Warsaw Bullets Logo" style={{ zIndex: 100 }} src={require("../src/bullets.png")} />
            <div className="navbar-end">
              <div className="navbar-item">
                <button onClick={() => { setEditing(false); setFirstSession([]); setSecondSession([]); setAvailableDogs([...availableDogs.map(e => { return { name: e.name, firstEnter: false, secondEnter: false } })]) }} className={`button has-text-weight-semibold`}><span className="has-text-weight-semibold">Powrót do wyboru</span> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>


                </button>
              </div>
              <span className="navbar-item has-text-weight-semibold is-size-5">
                Trening: {date.toLocaleDateString()}
              </span>
              <span className="navbar-item has-text-weight-semibold is-size-5 navbar-item has-dropdown is-hoverable">
                <div className="navbar-link">
                  <span className="text-good is-size-3 mr-2">{availableDogs.length}</span>
                  psów |
                  <span className={`${availableDogs.filter(v => !v.firstEnter && !v.secondEnter).length > 0 ? "text-bad" : "text-good"} is-size-3 mx-2`}>{availableDogs.filter(v => !v.firstEnter && !v.secondEnter).length}</span>
                  do uzupełnienia
                </div>
                <div className="navbar-dropdown">
                  {availableDogs.filter(v => !v.firstEnter && !v.secondEnter).map(v =>
                    <span className="navbar-item text-bad">
                      {v.name}
                    </span>
                  )}
                  {
                    (availableDogs.filter(v => !v.firstEnter && !v.secondEnter).length > 0 && (availableDogs.filter(v => v.firstEnter && !v.secondEnter).length > 0 || availableDogs.filter(v => !v.firstEnter && v.secondEnter).length > 0)) ||
                      (availableDogs.filter(v => !v.firstEnter && !v.secondEnter).length > 0 && availableDogs.filter(v => v.firstEnter && v.secondEnter).length > 0) ? <hr className="navbar-divider" /> : null
                  }
                  {availableDogs.filter(v => (v.firstEnter && !v.secondEnter) || (!v.firstEnter && v.secondEnter)).map(v =>
                    <span className="navbar-item text-warning">
                      {v.name}
                    </span>
                  )}
                  {
                    (availableDogs.filter(v => v.firstEnter && v.secondEnter).length > 0 && (availableDogs.filter(v => v.firstEnter && !v.secondEnter).length > 0 || availableDogs.filter(v => !v.firstEnter && v.secondEnter).length > 0)) ? <hr className="navbar-divider" /> : null
                  }
                  {availableDogs.filter(v => v.firstEnter && v.secondEnter).map(v =>
                    <span className="navbar-item text-good">
                      {v.name}
                    </span>
                  )}
                </div>
              </span>
            </div>
          </nav>
          <div className="block box mt-6">
            <div className="block">
              <h3 className="title is-size-5 has-text-black">Wejście I</h3>
              <div className="block">
                <div className="columns">
                  <div className="column is-1">
                    <span className="has-text-weight-semibold">N.p.</span>
                  </div>
                  <div className="column">
                    <span className="has-text-weight-semibold">Opis ćwiczenia</span>
                  </div>
                  <div className="column is-2">
                    <span className="has-text-weight-semibold">Ćwiczące psy</span>
                  </div>
                  <div className="column is-3">
                    <span className="has-text-weight-semibold">Zadania</span>
                  </div>
                  <div className="column is-1">
                    <span className="has-text-weight-semibold">Akcje</span>
                  </div>
                </div>
                <hr className="navbar-divider" />
                {firstSession.sort((a, b) => a.id - b.id).map((v, i) =>
                  <>
                    <div className="columns mt-4">
                      <div className="column is-1">
                        <span className="tag is-black">{i + 1}</span>
                      </div>
                      <div className="column">
                        <textarea value={v.activity} onChange={(e) => { setFirstSession([...firstSession.filter(elem => elem.id !== v.id), { id: v.id, dogs: v.dogs, activity: e.target.value }]) }} className="textarea" placeholder="Opis ..."></textarea>
                      </div>
                      <div className="column is-2">
                        {/* Select with already selected dogs */}
                        {v.dogs.sort((a, b) => a - b).map(elem =>
                          <div className="select is-fullwidth block">
                            <select value={elem} onClick={(e) => { setPreviousValue(e.target.value) }} onChange={
                              (e) => {
                                setFirstSession(
                                  [...firstSession.filter(element => element.id !== v.id), {
                                    id: v.id, dogs: e.target.value === "-" ?
                                      [...v.dogs.filter(e => e !== elem)]
                                      :
                                      [...v.dogs.filter(e => e !== elem), e.target.value], activity: v.activity
                                  }]);
                                if (e.target.value !== "-") {
                                  console.log(previousValue, e.target.value)
                                  setAvailableDogs(
                                    [...availableDogs.filter(item => (item.name !== previousValue && item.name !== e.target.value)),
                                    { ...availableDogs.find(item => item.name === e.target.value), firstEnter: true },
                                    { ...availableDogs.find(item => item.name === previousValue), firstEnter: false }
                                    ])
                                }
                                else {
                                  console.log(previousValue, e.target.value)
                                  setAvailableDogs(
                                    [...availableDogs.filter(item => (item.name !== previousValue && item.name !== e.target.value)),
                                    { ...availableDogs.find(item => item.name === previousValue), firstEnter: false }
                                    ])
                                }
                              }}>
                              <option>-</option>
                              {availableDogs.filter(item => !v.dogs.includes(item.name) || item.name === elem).map(elem =>
                                <option value={elem.name}>{elem.name}</option>
                              )}
                            </select>
                          </div>
                        )}
                        {/* Select new doggo */}
                        <div className="select is-fullwidth block">
                          <select onChange={(e) => { setFirstSession([...firstSession.filter(elem => elem.id !== v.id), { id: v.id, dogs: [...v.dogs, e.target.value], activity: v.activity }]); setAvailableDogs([...availableDogs.filter(item => item.name !== e.target.value), { ...availableDogs.find(item => item.name === e.target.value), firstEnter: true }]); e.target.value = "-" }}>
                            <option>-</option>
                            {availableDogs.filter(item => !v.dogs.includes(item.name)).map(elem =>
                              <option value={elem.name}>{elem.name}</option>
                            )}
                          </select>
                        </div>
                      </div>
                      <div className="column is-3">
                        <textarea value={v.tasks} onChange={(e) => { setFirstSession([...firstSession.filter(elem => elem.id !== v.id), { id: v.id, dogs: v.dogs, activity: v.activity, tasks: e.target.value }]) }} className="textarea" placeholder="Zadania ..."></textarea>
                      </div>
                      <div className="column is-1">
                        <button onClick={(e) => { setFirstSession([...firstSession.filter(elem => elem.id !== v.id)]); setAvailableDogs([...availableDogs.map(item => { if (!v.dogs.includes(item.name)) { return item } else { return { ...item, firstEnter: false } } })]) }} className="button ml-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon text-bad">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {i !== firstSession.length - 1 ?
                      <hr className="navbar-divider" />
                      : null}</>

                )}
              </div>
              <button onClick={() => { setFirstSession([...firstSession, { id: new Date().getTime(), dogs: [], activity: "" }]) }} className={`button is-good has-text-weight-semibold`}><span className="has-text-weight-semibold">Dodaj ćwiczenie</span> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              </button>
            </div>
            <hr className="navbar-divider" />
            <div className="block">
              <h3 className="title is-size-5 has-text-black">Wejście II</h3>
              <div className="block">
                <div className="columns">
                  <div className="column is-1">
                    <span className="has-text-weight-semibold">N.p.</span>
                  </div>
                  <div className="column">
                    <span className="has-text-weight-semibold">Opis ćwiczenia</span>
                  </div>
                  <div className="column is-2">
                    <span className="has-text-weight-semibold">Ćwiczące psy</span>
                  </div>
                  <div className="column is-3">
                    <span className="has-text-weight-semibold">Zadania</span>
                  </div>
                  <div className="column is-1">
                    <span className="has-text-weight-semibold">Akcje</span>
                  </div>
                </div>
                <hr className="navbar-divider" />
                {secondSession.sort((a, b) => a.id - b.id).map((v, i) =>
                  <>
                    <div className="columns mt-4">
                      <div className="column is-1">
                        <span className="tag is-black">{i + 1}</span>
                      </div>
                      <div className="column">
                        <textarea value={v.activity} onChange={(e) => { setSecondSession([...secondSession.filter(elem => elem.id !== v.id), { id: v.id, dogs: v.dogs, activity: e.target.value }]) }} className="textarea" placeholder="Opis ..."></textarea>
                      </div>
                      <div className="column is-2">
                        {/* Select with already selected dogs */}
                        {v.dogs.sort((a, b) => a - b).map(elem =>
                          <div className="select is-fullwidth block">
                            <select value={elem} onClick={(e) => { setPreviousValue(e.target.value) }} onChange={
                              (e) => {
                                setSecondSession(
                                  [...secondSession.filter(element => element.id !== v.id), {
                                    id: v.id, dogs: e.target.value === "-" ?
                                      [...v.dogs.filter(e => e !== elem)]
                                      :
                                      [...v.dogs.filter(e => e !== elem), e.target.value], activity: v.activity
                                  }]);
                                if (e.target.value !== "-") {
                                  console.log(previousValue, e.target.value)
                                  setAvailableDogs(
                                    [...availableDogs.filter(item => (item.name !== previousValue && item.name !== e.target.value)),
                                    { ...availableDogs.find(item => item.name === e.target.value), secondEnter: true },
                                    { ...availableDogs.find(item => item.name === previousValue), secondEnter: false }
                                    ])
                                }
                                else {
                                  console.log(previousValue, e.target.value)
                                  setAvailableDogs(
                                    [...availableDogs.filter(item => (item.name !== previousValue && item.name !== e.target.value)),
                                    { ...availableDogs.find(item => item.name === previousValue), secondEnter: false }
                                    ])
                                }
                              }}>
                              <option>-</option>
                              {availableDogs.filter(item => !v.dogs.includes(item.name) || item.name === elem).map(elem =>
                                <option value={elem.name}>{elem.name}</option>
                              )}
                            </select>
                          </div>
                        )}
                        {/* Select new doggo */}
                        <div className="select is-fullwidth block">
                          <select onChange={(e) => { setSecondSession([...secondSession.filter(elem => elem.id !== v.id), { id: v.id, dogs: [...v.dogs, e.target.value], activity: v.activity }]); setAvailableDogs([...availableDogs.filter(item => item.name !== e.target.value), { ...availableDogs.find(item => item.name === e.target.value), secondEnter: true }]); e.target.value = "-" }}>
                            <option>-</option>
                            {availableDogs.filter(item => !v.dogs.includes(item.name)).map(elem =>
                              <option value={elem.name}>{elem.name}</option>
                            )}
                          </select>
                        </div>
                      </div>
                      <div className="column is-3">
                        <textarea value={v.tasks} onChange={(e) => { setFirstSession([...firstSession.filter(elem => elem.id !== v.id), { id: v.id, dogs: v.dogs, activity: v.activity, tasks: e.target.value }]) }} className="textarea" placeholder="Zadania ..."></textarea>
                      </div>
                      <div className="column is-1">
                        <button onClick={(e) => { setSecondSession([...secondSession.filter(elem => elem.id !== v.id)]); setAvailableDogs([...availableDogs.map(item => { if (!v.dogs.includes(item.name)) { return item } else { return { ...item, secondEnter: false } } })]) }} className="button ml-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon text-bad">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {i !== secondSession.length - 1 ?
                      <hr className="navbar-divider" />
                      : null}</>

                )}
              </div>
              <button onClick={() => { setSecondSession([...secondSession, { id: new Date().getTime(), dogs: [], activity: "" }]) }} className={`button is-good has-text-weight-semibold`}><span className="has-text-weight-semibold">Dodaj ćwiczenie</span> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              </button>
            </div>
            <hr className="navbar-divider" />
            <div className="block mt-5">
              <button onClick={() => {
                if (availableDogs.filter(item => !item.firstEnter || !item.secondEnter).length > 0) {
                  setWarningModal(true);
                }
                else {
                  constructPDF();
                }
              }} className={`button is-large is-good has-text-weight-semibold`}><span className="has-text-weight-semibold">Eksportuj do PDF</span> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>

              </button>
            </div>
          </div>
        </section>
        :
        <section className="hero is-fullheight">
          <div className="hero-body">
            <div className="container has-text-centered">
              <div className="column is-4 is-offset-4">
                <div className="columns is-centered">
                  <img alt="Warsaw Bullets Logo" className="image" src={require("../src/bullets.png")} />
                </div>
                <hr className="login-hr" />
                <p className="subtitle has-text-black">Dodaj plik z tabelką</p>
                <div className="box">
                  <form>
                    <div className={`block ${loaded ? "mb-6" : null}`}>
                      <div className="field">
                        <div className="control">
                          <label className="button is-fullwidth" for="file-upload"><span className="has-text-weight-semibold">Plik wejściowy</span> <span className="icon ml-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                          </svg></span>
                          </label>
                          <input id="file-upload" className="input" type="file" ref={fileInput} onChange={(e) => setFile(e.target.files[0])} />
                        </div>
                      </div>
                      {loaded ?
                        <div className="field">
                          <div className="control">
                            <label className="label">Data treningu</label>
                            <input ref={dateInput} className="input" type="date" onChange={e => { setDate(new Date(e.target.value)) }} value={date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2)} />
                          </div>
                        </div>
                        : null
                      }
                      {availableDogs.length > 0 ?
                        <div className="block"><p className="subtitle has-text-black">Na treningu pojawi się <span className="text-good">{availableDogs.length}</span> psów.</p></div>
                        : null
                      }
                    </div>
                    {loaded ? <button onClick={e => { e.preventDefault(); if (availableDogs.length > 0) { setEditing(true) } else { dateInput.current.focus() } }} className={`button is-block ${availableDogs.length > 0 ? "is-good" : "is-danger"} is-large is-fullwidth`}>{availableDogs.length > 0 ? "Potwierdź" : "Brak psów"} <i className="fa fa-sign-in" aria-hidden="true"></i></button> : null}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      }
    </>
  );
}

export default App;
