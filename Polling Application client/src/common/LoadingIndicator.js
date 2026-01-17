import React from 'react';
import { Spin, Icon } from 'antd';
import './LoadingIndicator.css';

export default function LoadingIndicator(props) {
    const { size, text, color } = props;

    const antIcon = (
        <Icon 
            type="loading-3-quarters" 
            className="spinner-icon"
            style={{ 
                fontSize: size === 'small' ? 24 : 40, 
                color: color || '#722ed1' 
            }} 
            spin 
        />
    );

    return (
        <div className={`loading-container ${size === 'small' ? 'small-loader' : 'full-page'}`}>
            <div className="loading-content">
                <Spin indicator={antIcon} />
                <h3 className="loading-text">
                    {text || "Loading..."}
                </h3>
            </div>
        </div>
    );
}