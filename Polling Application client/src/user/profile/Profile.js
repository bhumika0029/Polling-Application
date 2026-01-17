import React, { useState, useEffect } from 'react';
import PollList from '../../poll/PollList';
import { getUserProfile } from '../../util/APIUtils';
import { Avatar, Tabs, Icon, Row, Col, Card } from 'antd';
import { getAvatarColor } from '../../util/Colors';
import { formatDate } from '../../util/Helpers';
import LoadingIndicator from '../../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';

const TabPane = Tabs.TabPane;

const Profile = (props) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [serverError, setServerError] = useState(false);

    const loadUserProfile = (username) => {
        setIsLoading(true);
        getUserProfile(username)
            .then(response => {
                setUser(response);
                setIsLoading(false);
            })
            .catch(error => {
                if (error.status === 404) {
                    setNotFound(true);
                } else {
                    setServerError(true);
                }
                setIsLoading(false);
            });
    };

    useEffect(() => {
        const username = props.match.params.username;
        loadUserProfile(username);
    }, [props.match.params.username]);

    if (isLoading) return <LoadingIndicator />;
    if (notFound) return <NotFound />;
    if (serverError) return <ServerError />;

    return (
        <div className="profile-container">
            {user ? (
                <div className="user-profile-wrapper">
                    <div className="user-profile-header-section">
                        <div className="user-cover-bg"></div>
                        <div className="user-header-content">
                            <div className="user-avatar-wrapper">
                                <Avatar 
                                    className="user-avatar-circle" 
                                    style={{ backgroundColor: getAvatarColor(user.name) }}
                                >
                                    {user.name[0].toUpperCase()}
                                </Avatar>
                            </div>
                            <div className="user-info-text">
                                <h2 className="full-name">{user.name}</h2>
                                <p className="username">@{user.username}</p>
                                <div className="user-joined-date">
                                    <Icon type="calendar" /> Joined {formatDate(user.joinedAt)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="user-stats-section">
                        <Row gutter={[16, 16]} type="flex" justify="center">
                            <Col xs={24} sm={12} md={8}>
                                <Card className="stat-card" bordered={false}>
                                    <div className="stat-flex">
                                        <div className="stat-icon primary-blue"><Icon type="bar-chart" /></div>
                                        <div className="stat-details">
                                            <div className="stat-value">{user.pollCount}</div>
                                            <div className="stat-label">Polls Created</div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Card className="stat-card" bordered={false}>
                                    <div className="stat-flex">
                                        <div className="stat-icon success-teal"><Icon type="check-circle" /></div>
                                        <div className="stat-details">
                                            <div className="stat-value">{user.voteCount}</div>
                                            <div className="stat-label">Votes Cast</div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    <div className="user-tabs-section">
                        <Tabs defaultActiveKey="1" size="large" animated={false} className="profile-tabs">
                            <TabPane 
                                tab={<span><Icon type="solution" /> <span className="tab-text">Created</span></span>} 
                                key="1"
                            >
                                <PollList username={props.match.params.username} type="USER_CREATED_POLLS" />
                            </TabPane>
                            <TabPane 
                                tab={<span><Icon type="check-square" /> <span className="tab-text">Voted</span></span>} 
                                key="2"
                            >
                                <PollList username={props.match.params.username} type="USER_VOTED_POLLS" />
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default Profile;