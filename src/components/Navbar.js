import React, { useRef } from 'react'

const Navbar = ({ backAction, setAvailableDogs, availableDogs, date, people }) => {
    const addDogInputRef = useRef();

    return (
        <nav className="navbar container mt-2" role="navigation" aria-label="main navigation">
            <img alt="Warsaw Bullets Logo" style={{ zIndex: 100 }} src={require("../../src/bullets.png")} />
            <div className="navbar-end">
                <div className="navbar-item">
                    <button onClick={backAction} className={`button has-text-weight-semibold`}><span className="has-text-weight-semibold">Powrót do wyboru</span> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>


                    </button>
                </div>
                <span className="navbar-item has-text-weight-semibold is-size-5">
                    Trening: {date.toLocaleDateString()}
                </span>
                <span className="navbar-item has-text-weight-semibold is-size-5 navbar-item has-dropdown is-hoverable">
                    <div className="navbar-link">
                        <span className="mr-2">{people.length}</span>
                        osób
                    </div>
                    <div className="navbar-dropdown">
                        {people.sort(function (a, b) { return (a > b ? 1 : (a === b ? 0 : -1)) }).map(v =>
                            <span key={v} className="navbar-item">
                                {v}
                            </span>
                        )}
                    </div>
                </span>
                <span className="navbar-item has-text-weight-semibold is-size-5 navbar-item has-dropdown is-hoverable">
                    <div className="navbar-link">
                        <span className="text-good is-size-3 mr-2">{availableDogs.length}</span>
                        psów |
                        <span className={`${availableDogs.filter(v => !v.firstEnter && !v.secondEnter).length > 0 ? "text-bad" : "text-good"} is-size-3 mx-2`}>{availableDogs.filter(v => !v.firstEnter && !v.secondEnter).length}</span>
                        do uzupełnienia
                    </div>
                    <div className="navbar-dropdown">
                        <div className="navbar-item is-align-items-end">
                            <div className="control">
                                <label className="label">Dodaj psa</label>
                                <input ref={addDogInputRef} className="input is-small" type="text" />
                            </div>
                            <div className='button is-small ml-2' onClick={() => {
                                const newDog = addDogInputRef.current.value;
                                if (newDog.length > 0) {
                                    addDogInputRef.current.value = '';
                                    setAvailableDogs([...availableDogs, { firstEnter: false, secondEnter: false, name: newDog }]);
                                }
                            }}> + </div>
                        </div>
                        <hr className="navbar-divider" />
                        {availableDogs.filter(v => !v.firstEnter && !v.secondEnter).sort(function (a, b) { return (a.name > b.name ? 1 : (a.name === b.name ? 0 : -1)) }).map(v =>
                            <span key={v.name} className="navbar-item text-bad">
                                {v.name}
                            </span>
                        )}
                        {
                            (availableDogs.filter(v => !v.firstEnter && !v.secondEnter).length > 0 && (availableDogs.filter(v => v.firstEnter && !v.secondEnter).length > 0 || availableDogs.filter(v => !v.firstEnter && v.secondEnter).length > 0)) ||
                                (availableDogs.filter(v => !v.firstEnter && !v.secondEnter).length > 0 && availableDogs.filter(v => v.firstEnter && v.secondEnter).length > 0) ? <hr className="navbar-divider" /> : null
                        }
                        {availableDogs.filter(v => (v.firstEnter && !v.secondEnter) || (!v.firstEnter && v.secondEnter)).sort(function (a, b) { return (a.name > b.name ? 1 : (a.name === b.name ? 0 : -1)) }).map(v =>
                            <span key={v.name} className="navbar-item text-warning">
                                {v.name}
                            </span>
                        )}
                        {
                            (availableDogs.filter(v => v.firstEnter && v.secondEnter).length > 0 && (availableDogs.filter(v => v.firstEnter && !v.secondEnter).length > 0 || availableDogs.filter(v => !v.firstEnter && v.secondEnter).length > 0)) ? <hr className="navbar-divider" /> : null
                        }
                        {availableDogs.filter(v => v.firstEnter && v.secondEnter).sort(function (a, b) { return (a.name > b.name ? 1 : (a.name === b.name ? 0 : -1)) }).map(v =>
                            <span key={v.name} className="navbar-item text-good">
                                {v.name}
                            </span>
                        )}
                    </div>
                </span>
            </div>
        </nav>
    )
}

export default Navbar