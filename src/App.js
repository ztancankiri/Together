import React, { useState, useContext, useEffect } from "react";
import { AppContext } from 'context/Context.jsx';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import loadingAnimation from 'assets/ball-triangle.svg'
import TopBar from "components/top-bar/top-bar";
import api from 'api.js';
import Login from 'routes/Login/Login.jsx';
import Welcome from 'routes/Welcome/Welcome.jsx';
import CreateGroupForm from 'routes/CreateGroupForm/CreateGroupForm.jsx';
import CreateEventForm from 'routes/CreateEventForm/CreateEventForm.jsx';
import Profile from 'routes/Profile/Profile.jsx';
import EventDetails from 'routes/EventDetails/EventDetails.jsx';
import GroupDetails from 'routes/GroupDetails/GroupDetails.jsx';
import AdminPanel from 'routes/AdminPanel/AdminPanel.jsx';
import EditGroup from 'routes/EditGroup/EditGroup.jsx';
import Messages from 'routes/Messages/Messages.jsx';

function App() {
    const { dispatch } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        hydrateContextWithLocalStorage();
    }, [])

    const hydrateContextWithLocalStorage = async () => {
        try {
            if (localStorage.hasOwnProperty('token')) {
                const token = localStorage.getItem('token');
                api.setAuthToken(token);
                let { data } = await api.getProfileData();
                dispatch({ type: 'SET_USER_DATA', data: data });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const loadingScreen = () => {
        return (
            <div className="loading">
                <img src={loadingAnimation} alt="" />
            </div>
        );
    }

    const NoMatch = () => {
        return (
            <div>
                <h1>This page does not exist</h1>
            </div>
        );
    }

    const protectedRoutes = function () {
        let loggedIn = localStorage.getItem('loggedIn');
        if (!loggedIn) {
            return <Redirect to="/login" />;
        }
        return (
            <>
                <TopBar />
                <Route path="/" exact component={Welcome} />
                <Route path="/create-group" component={CreateGroupForm} />
                <Route path="/create-event" component={CreateEventForm} />
                <Route path="/profile/" exact component={Profile} />
                <Route path="/profile/:id" component={Profile} />
                <Route path="/event-details/:id" component={EventDetails} />
                <Route path="/group-details/:id" component={GroupDetails} />
                <Route path="/edit-group/:id" component={EditGroup} />
                <Route path="/messages" component={Messages} />
                <Route path="/admin-panel" component={AdminPanel} />
            </>
        );
    }

    return (
        <>
            {isLoading ? loadingScreen() :
                <BrowserRouter>
                    <Switch>
                        <Route path="/login" exact component={Login} />
                        {protectedRoutes()}
                    </Switch>
                </BrowserRouter>
            }
        </>
    );

}

export default App;
