import React from 'react'

const Modal = ({ isActive, setIsActive, availableDogs, action }) => {
    return (
        <div className={`modal ${isActive ? "is-active" : null}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Brak wejść dla psów!</p>
                    <button onClick={() => { setIsActive(false) }} className="delete" aria-label="close"></button>
                </header>
                <section className="modal-card-body">
                    <div className="columns">
                        {availableDogs.filter(item => !item.firstEnter && !item.secondEnter).length > 0 ?
                            <div className="column">
                                <p>Następujące psy nie mają wejść:</p>
                                <ul>
                                    {availableDogs.filter(item => !item.firstEnter && !item.secondEnter).map(elem =>
                                        <li key={elem.name} className="text-bad">
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
                                        <li key={elem.name} className="text-warning">
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
                    <button onClick={action} className="button is-good has-text-weight-semibold">Eksportuj mimo tego</button>
                    <button onClick={() => { setIsActive(false) }} className="button">Oh shit go back!</button>
                </footer>
            </div>
        </div>
    )
}

export default Modal