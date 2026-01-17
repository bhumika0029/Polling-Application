import React, { useEffect } from 'react';
import { Route, Redirect } from "react-router-dom";
import { notification } from 'antd';

// Feature 1: Responsive Redirect Component
const RedirectToLogin = ({ location }) => {
    
    useEffect(() => {
        // We detect screen size to adjust notification placement
        const isMobile = window.innerWidth <= 768;

        notification.warning({
            message: 'Access Denied',
            description: 'Please login to continue.',
            duration: 3,
            // Placement: Top-right for desktop, Top for mobile (better visibility)
            placement: isMobile ? 'top' : 'topRight',
            style: {
                borderRadius: '8px',
                marginTop: isMobile ? '10px' : '0'
            }
        });
    }, []); 

    return (
        <Redirect
            to={{
                pathname: '/login',
                state: { from: location }
            }}
        />
    );
};

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            authenticated ? (
                <Component {...rest} {...props} />
            ) : (
                <RedirectToLogin location={props.location} />
            )
        }
    />
);

export default PrivateRoute;