import React, { useState } from 'react'
import SessionPlanner from './SessionPlanner';
import constructPDF from './constructPDF';
import Modal from './Modal';
import Navbar from './Navbar';

const EditPage = ({ availableDogs, setAvailableDogs, setEditing, firstSession, setFirstSession, secondSession, setSecondSession, date, people }) => {

    const [warningModal, setWarningModal] = useState(false);

    return (
        <section className="container">
            <Modal action={() => { constructPDF(date, firstSession, secondSession) }} isActive={warningModal} setIsActive={setWarningModal} availableDogs={availableDogs} />
            <Navbar people={people} backAction={() => { setEditing(false); setFirstSession([...firstSession.map(v => { return { ...v, dogs: [] } })]); setSecondSession([...secondSession.map(v => { return { ...v, dogs: [] } })]); setAvailableDogs([...availableDogs.map(e => { return { name: e.name, firstEnter: false, secondEnter: false } })]) }} availableDogs={availableDogs} date={date} />
            <div className="block box mt-6">
                <SessionPlanner trainingSession={firstSession} setTrainingSession={setFirstSession} availableDogs={availableDogs} setAvailableDogs={setAvailableDogs} title={"Wejście I"} enterID={"firstEnter"} />
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
                </div>
            </div>
        </section>
    )
}

export default EditPage