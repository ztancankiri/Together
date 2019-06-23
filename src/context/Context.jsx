import React, { useReducer } from 'react';

let reducer = (state, action) => {
    switch (action.type) {
        case "SET_USER_DATA":
            return { ...state, userData: action.data };
        default:
            return;
    }
};

const initialState = { userData: {} };
const AppContext = React.createContext(initialState);

const AppProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AppContext.Provider value={
            {
                state, dispatch
            }
        }>
            {props.children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };