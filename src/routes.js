import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import New from './pages/New';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props =>
        localStorage.getItem('user') != null ? (
            <Component {...props} />
        ) : (
            <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )
    }/>
);

console.log(localStorage.getItem('user'));

export default function routes() {

    return(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Login} />
                <PrivateRoute path="/dashboard" component={Dashboard} />
                <Route path="/new" component={New} />
                <Route path="" component={() => <h1 style={{ textAlign:'center' }}>404 Not Found!</h1>} />
            </Switch>
        </BrowserRouter>
    )

}
