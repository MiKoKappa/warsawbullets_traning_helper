import React, { useState } from 'react'

const SessionPlanner = ({ trainingSession, setTrainingSession, availableDogs, setAvailableDogs, title, enterID }) => {

    const [previousValue, setPreviousValue] = useState('');


    return (
        <>
            {Array.isArray(trainingSession) && Array.isArray(availableDogs) ? <div className="block">
                <h3 className="title is-size-5 has-text-black">{title}</h3>
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
                    {trainingSession.sort((a, b) => a.id - b.id).map((v, i) =>
                        <>
                            <div className="columns mt-4">
                                <div className="column is-1">
                                    <span className="tag is-black">{i + 1}</span>
                                </div>
                                <div className="column">
                                    <textarea value={v.activity} onChange={(e) => { setTrainingSession([...trainingSession.filter(elem => elem.id !== v.id), { id: v.id, dogs: v.dogs, activity: e.target.value }]) }} className="textarea" placeholder="Opis ..."></textarea>
                                </div>
                                <div className="column is-2">
                                    {/* Select with already selected dogs */}
                                    {v.dogs.sort((a, b) => a - b).map(elem =>
                                        <div className="select is-fullwidth block">
                                            <select value={elem} onClick={(e) => { setPreviousValue(e.target.value) }} onChange={
                                                (e) => {
                                                    setTrainingSession(
                                                        [...trainingSession.filter(element => element.id !== v.id), {
                                                            id: v.id, dogs: e.target.value === "-" ?
                                                                [...v.dogs.filter(e => e !== elem)]
                                                                :
                                                                [...v.dogs.filter(e => e !== elem), e.target.value], activity: v.activity
                                                        }]);
                                                    if (e.target.value !== "-") {
                                                        const prevDog = { ...availableDogs.find(item => item.name === previousValue) };
                                                        prevDog[enterID] = false;
                                                        const newDog = { ...availableDogs.find(item => item.name === e.target.value) };
                                                        newDog[enterID] = true;
                                                        setAvailableDogs(
                                                            [...availableDogs.filter(item => (item.name !== previousValue && item.name !== e.target.value)),
                                                                prevDog,
                                                                newDog
                                                            ])
                                                    }
                                                    else {
                                                        const prevDog = { ...availableDogs.find(item => item.name === previousValue) };
                                                        prevDog[enterID] = false;
                                                        setAvailableDogs(
                                                            [...availableDogs.filter(item => (item.name !== previousValue && item.name !== e.target.value)),
                                                                prevDog
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
                                        <select onChange={(e) => { setTrainingSession([...trainingSession.filter(elem => elem.id !== v.id), { id: v.id, dogs: [...v.dogs, e.target.value], activity: v.activity }]); const newDog = { ...availableDogs.find(item => item.name === e.target.value) }; newDog[enterID] = true; setAvailableDogs([...availableDogs.filter(item => item.name !== e.target.value), newDog]); e.target.value = "-" }}>
                                            <option>-</option>
                                            {availableDogs.filter(item => !v.dogs.includes(item.name)).map(elem =>
                                                <option value={elem.name}>{elem.name}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="column is-3">
                                    <textarea value={v.tasks} onChange={(e) => { setTrainingSession([...trainingSession.filter(elem => elem.id !== v.id), { id: v.id, dogs: v.dogs, activity: v.activity, tasks: e.target.value }]) }} className="textarea" placeholder="Zadania ..."></textarea>
                                </div>
                                <div className="column is-1">
                                    <button onClick={(e) => { setTrainingSession([...trainingSession.filter(elem => elem.id !== v.id)]); setAvailableDogs([...availableDogs.map(item => { if (!v.dogs.includes(item.name)) { return item } else { return { ...item, secondEnter: false } } })]) }} className="button ml-2 mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon text-bad">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                    {
                                        i !== 0 ?
                                            <button onClick={(e) => {
                                                const upper = trainingSession.sort((a, b) => a.id - b.id)[i - 1];
                                                setTrainingSession([...trainingSession.filter(elem => ((elem.id !== v.id) && (elem.id !== upper.id))), { ...upper, id: v.id }, { ...v, id: upper.id }]);
                                            }} className="button ml-2 my-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                                                </svg>

                                            </button> : null}
                                    {
                                        i !== trainingSession.length - 1 ?
                                            <button onClick={(e) => {
                                                const lower = trainingSession.sort((a, b) => a.id - b.id)[i + 1];
                                                setTrainingSession([...trainingSession.filter(elem => ((elem.id !== v.id) && (elem.id !== lower.id))), { ...lower, id: v.id }, { ...v, id: lower.id }]);
                                            }} className="button ml-2 my-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                                                </svg>

                                            </button> : null}
                                </div>
                            </div>
                            {i !== trainingSession.length - 1 ?
                                <hr className="navbar-divider" />
                                : null}</>

                    )}
                </div>
                <button onClick={() => { setTrainingSession([...trainingSession, { id: new Date().getTime(), dogs: [], activity: "", tasks: "" }]) }} className={`button is-good has-text-weight-semibold`}><span className="has-text-weight-semibold">Dodaj ćwiczenie</span> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                </button>
            </div> : null}</>
    )
}

export default SessionPlanner