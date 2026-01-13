import React, { useState, useEffect } from 'react';
import PollList from '../../poll/PollList';
import { getUserProfile } from '../../util/APIUtils';
import { Avatar, Tabs, Button, Icon, Row, Col, Card } from 'antd';
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
        <div className="profile">
            {user ? (
                <div className="user-profile">
                    
                    {/* Header with Cover */}
                    <div className="user-profile-header">
                        <div className="user-cover-photo">
                            {/* Optional: Add pattern or overlay here if needed */}
                        </div>
                        <div className="user-details-container">
                            <div className="user-avatar-box">
                                <Avatar 
                                    className="user-avatar-circle" 
                                    style={{ backgroundColor: getAvatarColor(user.name) }}
                                >
                                    {user.name[0].toUpperCase()}
                                </Avatar>
                            </div>
                            <div className="user-info-box">
                                <div className="user-main-info">
                                    <h2 className="full-name">{user.name}</h2>
                                    <p className="username">@{user.username}</p>
                                </div>
                                <div className="user-meta-info">
                                    <span className="joined-date">
                                        <Icon type="calendar" /> Joined {formatDate(user.joinedAt)}
                                    </span>
                                    <Button className="edit-profile-btn" icon="edit" ghost type="primary">Edit Profile</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="user-stats-row">
                        <Row gutter={16} type="flex" justify="center">
                            <Col xs={24} sm={12} md={10}>
                                <Card className="stat-card" bordered={false}>
                                    <div className="stat-content">
                                        <div className="stat-icon-bg purple">
                                            <Icon type="bar-chart" />
                                        </div>
                                        <div className="stat-text">
                                            <div className="stat-value">{user.pollCount}</div>
                                            <div className="stat-title">Polls Created</div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={10}>
                                <Card className="stat-card" bordered={false}>
                                    <div className="stat-content">
                                        <div className="stat-icon-bg green">
                                            <Icon type="check-circle" />
                                        </div>
                                        <div className="stat-text">
                                            <div className="stat-value">{user.voteCount}</div>
                                            <div className="stat-title">Votes Cast</div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    {/* Tabs Section */}
                    <div className="user-poll-details">
                        <Tabs defaultActiveKey="1" animated={false} size="large" className="profile-tabs">
                            <TabPane 
                                tab={<span><Icon type="solution" /> Created Polls</span>} 
                                key="1"
                            >
                                <PollList username={props.match.params.username} type="USER_CREATED_POLLS" />
                            </TabPane>
                            <TabPane 
                                tab={<span><Icon type="check-square" /> Voted Polls</span>} 
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