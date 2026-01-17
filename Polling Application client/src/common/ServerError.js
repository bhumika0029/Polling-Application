import React from 'react';
import './ServerError.css';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'antd';

const ServerError = () => {
    
    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="server-error-page">
            <div className="server-error-content">
                {/* 1. Animated Illustration */}
                <div className="server-icon-container">
                    <Icon type="cloud-sync" className="server-error-icon" />
                    <div className="server-shadow"></div>
                </div>

                {/* 2. Text Content */}
                <h1 className="server-error-title">500</h1>
                
                <div className="server-error-desc">
                    <strong>Oops! Something went wrong.</strong>
                    <p>It's not you, it's us. The server encountered an internal error.</p>
                </div>
                
                {/* 3. Action Buttons */}
                <div className="server-error-buttons">
                    <Button 
                        type="primary" 
                        size="large" 
                        icon="reload" 
                        onClick={handleRetry}
                        className="server-btn retry-btn"
                    >
                        Retry Connection
                    </Button>

                    <Link to="/" className="server-btn-link">
                        <Button 
                            className="server-btn server-back-btn" 
                            size="large" 
                            ghost
                            type="primary"
                            icon="home"
                        >
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ServerError;