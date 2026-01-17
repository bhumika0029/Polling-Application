import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './AppHeader.css';
import pollIcon from '../poll.svg';
import { Layout, Menu, Dropdown, Icon, Avatar, Button, Drawer, Grid } from 'antd';

const { Header } = Layout;
const { useBreakpoint } = Grid;

const AppHeader = (props) => {
    const [visible, setVisible] = useState(false);
    const screens = useBreakpoint(); // Detects screen size (xs, sm, md, lg)

    const showDrawer = () => setVisible(true);
    const onClose = () => setVisible(false);

    const handleMenuClick = ({ key }) => {
        if (key === "logout") {
            props.onLogout();
        }
        setVisible(false); // Close drawer on click
    };

    // --- Menu Items Logic ---
    const getMenuItems = () => {
        if (props.currentUser) {
            return [
                <Menu.Item key="/">
                    <Link to="/" onClick={onClose}><Icon type="home" /> Home</Link>
                </Menu.Item>,
                <Menu.Item key="/poll/new">
                    <Link to="/poll/new" onClick={onClose}>
                        <img src={pollIcon} alt="poll" className="poll-icon" style={{ width: 18, marginRight: 8 }} /> 
                        Create Poll
                    </Link>
                </Menu.Item>,
                <Menu.Item key="/profile" className="profile-menu">
                    <ProfileDropdownMenu 
                        currentUser={props.currentUser} 
                        handleMenuClick={handleMenuClick} 
                        isMobile={!screens.md}
                    />
                </Menu.Item>
            ];
        } else {
            return [
                <Menu.Item key="/login">
                    <Link to="/login" onClick={onClose}><Button type="primary" ghost>Login</Button></Link>
                </Menu.Item>,
                <Menu.Item key="/signup">
                    <Link to="/signup" onClick={onClose}><Button type="primary">Signup</Button></Link>
                </Menu.Item>
            ];
        }
    };

    return (
        <Header className="app-header">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="app-title">
                    <Link to="/">
                        <Icon type="api" style={{ marginRight: '8px', color: '#722ed1' }} />
                        Polling App
                    </Link>
                </div>

                {/* Desktop Menu: Hidden on small screens */}
                {screens.md ? (
                    <Menu
                        className="app-menu"
                        mode="horizontal"
                        selectedKeys={[props.location.pathname]}
                        style={{ lineHeight: '64px', borderBottom: 'none' }}
                    >
                        {getMenuItems()}
                    </Menu>
                ) : (
                    /* Mobile Hamburger: Visible on small screens */
                    <>
                        <Button type="primary" onClick={showDrawer} icon="menu" />
                        <Drawer
                            title="Menu"
                            placement="right"
                            onClose={onClose}
                            visible={visible}
                        >
                            <Menu
                                mode="vertical"
                                selectedKeys={[props.location.pathname]}
                                style={{ borderRight: 'none' }}
                            >
                                {getMenuItems()}
                            </Menu>
                        </Drawer>
                    </>
                )}
            </div>
        </Header>
    );
}

const ProfileDropdownMenu = ({ currentUser, handleMenuClick, isMobile }) => {
    const initial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U';

    const dropdownMenu = (
        <Menu onClick={handleMenuClick} className="profile-dropdown-menu">
            <Menu.Item key="user-info" disabled>
                <div style={{ fontWeight: 'bold' }}>{currentUser.name}</div>
                <div style={{ fontSize: '12px' }}>@{currentUser.username}</div>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="profile">
                <Link to={`/users/${currentUser.username}`}><Icon type="user" /> Profile</Link>
            </Menu.Item>
            <Menu.Item key="logout">
                <Icon type="logout" /> Logout
            </Menu.Item>
        </Menu>
    );

    // On Mobile, we might want to just show the items directly or use the dropdown
    return (
        <Dropdown overlay={dropdownMenu} trigger={['click']}>
            <a className="ant-dropdown-link" href="#!" onClick={e => e.preventDefault()}>
                <Avatar style={{ backgroundColor: '#87d068', marginRight: 8 }}>{initial}</Avatar>
                {!isMobile && <Icon type="down" />}
            </a>
        </Dropdown>
    );
}

export default withRouter(AppHeader);