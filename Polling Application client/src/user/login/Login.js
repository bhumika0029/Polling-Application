import React, { useState } from 'react';
import { login } from '../../util/APIUtils';
import './Login.css';
import { Link } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../constants';
import { Form, Input, Button, Icon, notification, Checkbox } from 'antd';

const Login = (props) => {
    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-header">
                    <h1 className="page-title">Welcome Back</h1>
                    <div className="login-illustration">
                        <Icon type="user" style={{ fontSize: '64px', color: '#722ed1' }} />
                    </div>
                </div>
                <LoginForm onLogin={props.onLogin} />
            </div>
        </div>
    );
}

const LoginForm = (props) => {
    const [usernameOrEmail, setUsernameOrEmail] = useState({ value: '', validateStatus: 'success', errorMsg: null });
    const [password, setPassword] = useState({ value: '', validateStatus: 'success', errorMsg: null });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const validation = validateInput(value);

        if (name === 'usernameOrEmail') {
            setUsernameOrEmail({ value, ...validation });
        } else if (name === 'password') {
            setPassword({ value, ...validation });
        }
    };

    const validateInput = (input) => {
        if(input.length === 0) return { validateStatus: 'error', errorMsg: 'This field is required' };
        return { validateStatus: 'success', errorMsg: null };
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(usernameOrEmail.value.length === 0 || password.value.length === 0) {
             notification.error({ message: 'Error', description: 'Please fill in all fields.' });
             return;
        }

        setLoading(true);
        login({ usernameOrEmail: usernameOrEmail.value, password: password.value })
            .then(response => {
                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                props.onLogin();
            })
            .catch(error => {
                setLoading(false);
                notification.error({
                    message: 'Login Failed',
                    description: error.status === 401 ? 'Incorrect credentials.' : (error.message || 'Server error.')
                });
            });
    };

    return (
        <Form onSubmit={handleSubmit} className="login-form">
            <Form.Item validateStatus={usernameOrEmail.validateStatus} help={usernameOrEmail.errorMsg} hasFeedback>
                <Input
                    prefix={<Icon type="user" className="input-icon" />}
                    size="large"
                    name="usernameOrEmail"
                    value={usernameOrEmail.value}
                    onChange={handleInputChange}
                    placeholder="Username or Email"
                />
            </Form.Item>
            
            <Form.Item validateStatus={password.validateStatus} help={password.errorMsg} hasFeedback>
                <Input
                    prefix={<Icon type="lock" className="input-icon" />}
                    size="large"
                    name="password"
                    type="password"
                    value={password.value}
                    onChange={handleInputChange}
                    placeholder="Password"
                />
            </Form.Item>

            <Form.Item> 
                <div className="remember-forgot-container">
                    <Checkbox className="remember-me">Remember me</Checkbox>
                    <Link className="forgot-link" to="/forgot-password">Forgot password?</Link>
                </div>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
                <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large" 
                    loading={loading}
                    block
                >
                    Log in
                </Button>
                <div className="register-link">
                    Or <Link to="/signup">register now!</Link>
                </div>
            </Form.Item>
        </Form>
    );
}

export default Login;