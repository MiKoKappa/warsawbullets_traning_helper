import React, { useRef } from 'react'
import Loader from './Loader';

const FilePage = ({ loaded, date, setDate, availableDogs, setEditing }) => {

    const dateInput = useRef();

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
                        <div className="box">
                            <form>
                                <div className={`block ${loaded ? "mb-5" : null}`}>

                                    {loaded ?
                                        <div className="field">
                                            <div className="control">
                                                <label className="label">Data treningu</label>
                                                <input ref={dateInput} className="input" type="date" onChange={e => { setDate(new Date(e.target.value)) }} value={date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2)} />
                                            </div>
                                        </div>
                                        : <Loader />
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