import React from 'react'; 
import { Route, BrowserRouter} from 'react-router-dom';

import Starships from './pages/Starships';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Starships} path="/" exact/>
        </BrowserRouter>
    );
}

export default Routes;