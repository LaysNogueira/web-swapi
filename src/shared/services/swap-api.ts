import { ListaStarships } from "../interfaces/starships";

const url = "http://swapi.dev/api";

export const getStarShips = async () => {
    const response = await fetch(`${url}/starships`);
    const data: ListaStarships = await response.json();
    return data;
}

export const getNextOrPrevious = async (nextUrl: string) => {
    const response = await fetch(nextUrl);
    const data: ListaStarships = await response.json();
    return data;
}
