import React, { useState } from "react";
import Register from "./views/Register";
import Login from "./views/Login";
import Albums from "./views/Albums";
import "./App.css";

const App = () => {
    // When the app first renders, no user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUserId, setCurrentUserId] = useState("");
    const [showLogin, setShowLogin] = useState(true);

    // logout button
    const logout = () => {
        setCurrentUserId("");
        setIsLoggedIn(false);
        setShowLogin(true);
    };
    // deregister button

    const deregister = async event => {
        const settings = {
            method: "DELETE"
        };

        const response = await fetch(process.env.REACT_APP_SERVER_URL + `/users/${currentUserId}`, settings);
        const parsedRes = await response.json();

        try {
            // If the request was successful...
            if (response.ok) {
                alert(parsedRes.message);
                setIsLoggedIn(false);
                setShowLogin(true);
                setCurrentUserId("");
                // If the request was unsuccessful...
            } else {
                throw new Error(parsedRes.message);
            }
        } catch (err) {
            alert(err.message);
        }

    };


    // If no user is currently logged in
    if (!isLoggedIn) {
        // Display the login view
        if (showLogin) {
            return <Login setShowLogin={setShowLogin} setIsLoggedIn={setIsLoggedIn} setCurrentUserId={setCurrentUserId} />;
            // Display the register view
        } else {
            return <Register setShowLogin={setShowLogin} setIsLoggedIn={setIsLoggedIn} setCurrentUserId={setCurrentUserId} />;
        }
        // Else, if a user is logged in, display the "albums" page for that user
    } else {
        return <Albums currentUserId={currentUserId} logout={logout} deregister={deregister} />;
    }
};

export default App;