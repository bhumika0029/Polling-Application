import React, { useState } from 'react';
import { signup, checkUsernameAvailability, checkEmailAvailability } from '../../util/APIUtils';
import './Signup.css';
import { Link } from 'react-router-dom';
import { 
    NAME_MIN_LENGTH, NAME_MAX_LENGTH, 
    USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH,
    EMAIL_MAX_LENGTH,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH
} from '../../constants';

import { Form, Input, Button, notification, Icon, Progress } from 'antd';

const FormItem = Form.Item;

const Signup = (props) => {
    const [name, setName] = useState({ value: '', validateStatus: null, errorMsg: null });
    const [username, setUsername] = useState({ value: '', validateStatus: null, errorMsg: null });
    const [email, setEmail] = useState({ value: '', validateStatus: null, errorMsg: null });
    const [password, setPassword] = useState({ value: '', validateStatus: null, errorMsg: null });
    const [isLoading, setIsLoading] = useState(false);

    // Logic for validation remains the same as your provided code...
    const handleInputChange = (event, validationFun, setStateFun) => {
        const target = event.target;
        const inputValue = target.value;
        setStateFun({ value: inputValue, ...validationFun(inputValue) });
    };

    // ... (Keep your validateName, validateEmail, validateUsername, validatePassword functions)

    const isFormInvalid = () => {
        return !(name.validateStatus === 'success' &&
                 username.validateStatus === 'success' &&
                 email.validateStatus === 'success' &&
                 password.validateStatus === 'success');
    };

    const getPasswordStrength = () => {
        const len = password.value.length;
        if (len === 0) return 0;
        if (len < 6) return 30;
        if (len < 10) return 70;
        return 100;
    };
    
    const getPasswordColor = () => {
        const len = password.value.length;
        if (len < 6) return '#ff4d4f'; 
        if (len < 10) return '#faad14'; 
        return '#52c41a'; 
    };

    return (
        <div className="signup-container">
            <div className="signup-content">
                <div className="signup-header">
                    <h1 className="page-title">Create Account</h1>
                    <p className="page-subtitle">Join our community to start polling</p>
                </div>
                
                <Form onSubmit={handleSubmit} className="signup-form" layout="vertical">
                    <FormItem label="Full Name" validateStatus={name.validateStatus} help={name.errorMsg}>
                        <Input 
                            size="large" name="name" autoComplete="off"
                            prefix={<Icon type="idcard" className="input-icon" />}
                            placeholder="Your full name"
                            value={name.value} 
                            onChange={(e) => handleInputChange(e, validateName, setName)} />    
                    </FormItem>

                    <FormItem label="Username" hasFeedback validateStatus={username.validateStatus} help={username.errorMsg}>
                        <Input 
                            size="large" name="username" autoComplete="off"
                            prefix={<Icon type="user" className="input-icon" />}
                            placeholder="A unique username"
                            value={username.value} 
                            onBlur={validateUsernameAvailability}
                            onChange={(e) => handleInputChange(e, validateUsername, setUsername)} />    
                    </FormItem>

                    <FormItem label="Email" hasFeedback validateStatus={email.validateStatus} help={email.errorMsg}>
                        <Input 
                            size="large" name="email" type="email" autoComplete="off"
                            prefix={<Icon type="mail" className="input-icon" />}
                            placeholder="Your email"
                            value={email.value} 
                            onBlur={validateEmailAvailability}
                            onChange={(e) => handleInputChange(e, validateEmail, setEmail)} />    
                    </FormItem>

                    <FormItem label="Password" validateStatus={password.validateStatus} help={password.errorMsg}>
                        <Input 
                            size="large" name="password" type="password" autoComplete="off"
                            prefix={<Icon type="lock" className="input-icon" />}
                            placeholder="A strong password" 
                            value={password.value} 
                            onChange={(e) => handleInputChange(e, validatePassword, setPassword)} />
                        
                        {password.value.length > 0 && (
                            <div className="password-strength-wrapper">
                                <Progress 
                                    percent={getPasswordStrength()} 
                                    showInfo={false} 
                                    strokeColor={getPasswordColor()} 
                                    size="small"
                                />
                                <span className="strength-text">Password Strength</span>
                            </div>
                        )}
                    </FormItem>

                    <FormItem style={{ marginBottom: 0 }}>
                        <Button type="primary" htmlType="submit" size="large" 
                            className="signup-form-button" loading={isLoading}
                            disabled={isFormInvalid() || isLoading} block>
                            Sign Up
                        </Button>
                        <div className="login-link-container">
                            Already have an account? <Link to="/login">Login here!</Link>
                        </div>
                    </FormItem>
                </Form>
            </div>
        </div>
    );
};

export default Signup;