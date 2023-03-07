import React, { useState } from 'react'
import SessionPlanner from './SessionPlanner';
import constructPDF from './constructPDF';
import Modal from './Modal';
import Navbar from './Navbar';
import fileDownload from "js-file-download";

const EditPage = ({ availableDogs, setAvailableDogs, setEditing, firstSession, setFirstSession, secondSession, setSecondSession, date, people }) => {

    const handleDownload = () => {
        fileDownload(JSON.stringify({ date: date, people: people, availableDogs: availableDogs, firstSession: firstSession, secondSession: secondSession }), date.toLocaleDateString() + "_zapis.json");
    }

    const [warningModal, setWarningModal] = useState(false);

    return (
        <section className="container">
            <Modal action={() => { constructPDF(date, firstSession, secondSession) }} isActive={warningModal} setIsActive={setWarningModal} availableDogs={availableDogs} />
            <Navbar people={people} backAction={() => { setEditing(false); setFirstSession([...firstSession.map(v => { return { ...v, dogs: [] } })]); setSecondSession([...secondSession.map(v => { return { ...v, dogs: [] } })]); setAvailableDogs([...availableDogs.map(e => { return { name: e.name, firstEnter: false, secondEnter: false } })]) }} availableDogs={availableDogs} date={date} />
            <div className="block box mt-6">
                <SessionPlanner copyOne={(v) => { setSecondSession([...secondSession, { ...v, id: new Date().getTime() }]); setAvailableDogs(availableDogs.map(i => v.dogs.includes(i.name) ? { ...i, secondEnter: true } : i)) }} copyAll={() => { setSecondSession(firstSession); setAvailableDogs(availableDogs.map(i => i.firstEnter ? { ...i, secondEnter: true } : i)) }} trainingSession={firstSession} setTrainingSession={setFirstSession} availableDogs={availableDogs} setAvailableDogs={setAvailableDogs} title={"Wejście I"} enterID={"firstEnter"} />
                <hr className="navbar-divider" />
                <SessionPlanner trainingSession={secondSession} setTrainingSession={setSecondSession} availableDogs={availableDogs} setAvailableDogs={setAvailableDogs} title={"Wejście II"} enterID={"secondEnter"} />
                <hr className="navbar-divider" />
                <div className="block mt-5">
                    <button onClick={() => {
                        if (availableDogs.filter(item => !item.firstEnter || !item.secondEnter).length > 0) {
                            setWarningModal(true);
                        }
                        else {
                            constructPDF(date, firstSession, secondSession);
                        }
                    }} className={`button is-large is-good has-text-weight-semibold`}><span className="has-text-weight-semibold">Eksportuj do PDF</span> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon ml-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>

                    </button>
                    <button onClick={handleDownload} className={`button is-large has-text-weight-semibold ml-4`}><span className="has-text-weight-semibold">Pobierz zapis treningu</span> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>


                    </button>
                </div>
            </div>
        </section>
    )
}

export default EditPage