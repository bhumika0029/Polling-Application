import React from 'react';
import './NotFound.css';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'antd';

const NotFound = () => {
    return (
        <div className="page-not-found">
            <div className="not-found-content">
                {/* Animated Illustration */}
                <div className="illustration-container">
                    <Icon type="frown" className="not-found-icon" />
                    <div className="shadow"></div>
                </div>

                {/* Content */}
                <h1 className="title">404</h1>
                <p className="desc">
                    Oops! The page you're looking for doesn't exist.
                </p>
                
                {/* Action Buttons */}
                <div className="action-buttons">
                    <Link to="/" className="btn-wrapper">
                        <Button className="go-back-btn" type="primary" size="large" icon="home" block>
                            Go Home
                        </Button>
                    </Link>
                    
                    <Button 
                        className="report-btn btn-wrapper" 
                        size="large" 
                        icon="warning"
                        block
                    >
                        Report Issue
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default NotFound;