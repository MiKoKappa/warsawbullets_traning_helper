import React, { useRef } from 'react'

const FilePage = ({ loaded, date, setDate, setFile, availableDogs, setEditing }) => {

    const dateInput = useRef();
    const fileInput = useRef();

    return (
        <section className="hero is-fullheight">
            <div className="navbar ml-6 is-fixed-bottom">
                <p className="has-text-weight-bold" style={{ opacity: 0.7 }}>Created by <a className="text-good" href="https://github.com/MiKoKappa">Tkaczyk</a></p>
            </div>
            <div className="hero-body">
                <div className="container has-text-centered">
                    <div className="column is-4 is-offset-4">
                        <div className="columns is-centered">
                            <img alt="Warsaw Bullets Logo" className="image" src={require("../../src/bullets.png")} />
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
                                            <input id="file-upload" className="input" type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" ref={fileInput} onChange={(e) => setFile(e.target.files[0])} />
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
    )
}

export default FilePage