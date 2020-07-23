import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

import './styles.css';

import { ListaStarships, Starships } from "../../shared/interfaces/starships";
import { TypeTime } from "../../shared/classes/time";
import icon_yoda from "../../assets/images/icon-yoda.png";

import * as swapService from '../../shared/services/swap-api'


const StarShips = () => {

    const [starships, setStarships] = useState<ListaStarships>();
    const [distance, setDistance] = useState<number>();
    const [loading, setLoading] = useState<boolean>(false);

    function handleBtnCalculate() {
        setLoading(true);
        swapService.getStarShips().then(data => {
            insertStops(data);
            setLoading(false);
        })
    }

    function insertStops(data: ListaStarships) {
        if (!distance) return;
        const _starships = {
            ...data,
            ...data.results,
            results: data.results.map(starship => {
                const stops = calculateStops(distance, starship);
                return {
                    ...starship,
                    stops
                }
            })
        }
        setStarships(_starships);
    }

    function handleNextPage() {
        if (starships?.next) {
            setLoading(true);
            swapService.getNextOrPrevious(starships.next).then(data => {
                insertStops(data);
                setLoading(false);
            });
        }
    }

    function handlePreviousPage() {
        if (starships?.previous) {
            setLoading(true);
            swapService.getNextOrPrevious(starships.previous).then(data => {
                insertStops(data);
                setLoading(false);
            });
        }
    }

    function handleChangeDistance(event: any) {
        setDistance(event.target.value)
    }

    function calculateStops(distance: number, starships: Starships) {
        const types = new TypeTime().types;
        const { MGLT, consumables } = starships;
        const array = consumables.split(" ");
        const typeTime = array[1];
        const time = parseFloat(array[0]);

        const totalHours = distance / parseInt(MGLT);
        const consumablesHours = time * types[typeTime];

        let stops;

        if (consumables === 'unknown' || MGLT === 'unknown') return stops = '-';

        stops = totalHours / consumablesHours;
        return Math.floor(stops);
    }

    return (
        <div>
            <nav className="navbar navbar-light bg-dark">
                <span className="icon-star-wars" />
            </nav>
            <div className="container page">

                <div className="input-group">
                    <input value={distance} onChange={handleChangeDistance} type="number" className="form-control btn-distance mr-1" placeholder="Digite a distância em mega lights" aria-describedby="basic-addon2" />
                    <button type="button" className="btn btn-success" onClick={handleBtnCalculate} disabled={!distance}>Calcular</button>
                </div>
                <div>
                    {loading ? <div className="spinner-border text-dark mb-3 loading-yoda" role="status">
                        <img src={icon_yoda} alt="yoda icon loading" />
                    </div> : ''}
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Nome</th>
                            <th scope="col">MGLT</th>
                            <th scope="col">Consumables</th>
                            <th scope="col">Stops</th>
                        </tr>
                    </thead>
                    <tbody>

                        {starships?.results.map(starship => (
                            <tr key={starship.name}>
                                <td>{starship.name}</td>
                                <td>{starship.MGLT}</td>
                                <td>{starship.consumables}</td>
                                <td>{starship.stops}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>
                <div>
                    <ul className="pagination">
                        <li className="page-item"><button type="button" className="btn btn-dark text-light mr-1" onClick={handlePreviousPage} disabled={!starships?.previous} data-toggle="tooltip" data-placement="top" title={!starships?.previous ? 'No items' : ''}>Previous</button></li>
                        <li className="page-item"><button type="button" className="btn btn-dark text-light pr-4 pl-4" onClick={handleNextPage} disabled={!starships?.next} title={!starships?.next ? 'No items' : ''}>Next</button></li>
                    </ul>
                </div>

            </div>
        </div>
    );
}

export default StarShips;