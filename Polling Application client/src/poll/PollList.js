import React, { useState, useEffect, useCallback } from 'react';
import { getAllPolls, getUserCreatedPolls, getUserVotedPolls, castVote } from '../util/APIUtils';
import Poll from './Poll';
import LoadingIndicator from '../common/LoadingIndicator';
import { Button, Icon, notification, Row, Col } from 'antd';
import { POLL_LIST_SIZE } from '../constants';
import { withRouter, Link } from 'react-router-dom';
import './PollList.css';

const PollList = (props) => {
    const [polls, setPolls] = useState([]);
    const [page, setPage] = useState(0);
    const [last, setLast] = useState(true);
    const [currentVotes, setCurrentVotes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadPollList = useCallback((pageIndex = 0) => {
        let promise;
        if (props.username) {
            if (props.type === 'USER_CREATED_POLLS') {
                promise = getUserCreatedPolls(props.username, pageIndex, POLL_LIST_SIZE);
            } else if (props.type === 'USER_VOTED_POLLS') {
                promise = getUserVotedPolls(props.username, pageIndex, POLL_LIST_SIZE);
            }
        } else {
            promise = getAllPolls(pageIndex, POLL_LIST_SIZE);
        }

        if (!promise) return;
        setIsLoading(true);

        promise
            .then(response => {
                const newPolls = pageIndex === 0 ? response.content : polls.concat(response.content);
                const newVotes = pageIndex === 0 
                    ? Array(response.content.length).fill(null) 
                    : currentVotes.concat(Array(response.content.length).fill(null));

                setPolls(newPolls);
                setPage(response.page);
                setLast(response.last);
                setCurrentVotes(newVotes);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [props.username, props.type, polls, currentVotes]);

    useEffect(() => {
        loadPollList(0);
    }, [props.isAuthenticated, props.username]); 

    const handleLoadMore = () => loadPollList(page + 1);
    const handleRefresh = () => {
        setPolls([]);
        setPage(0);
        loadPollList(0);
    };

    const handlePollDelete = (pollId) => {
        const pollIndex = polls.findIndex(p => p.id === pollId);
        const newPolls = polls.filter(poll => poll.id !== pollId);
        const newVotes = [...currentVotes];
        if (pollIndex > -1) newVotes.splice(pollIndex, 1);

        setPolls(newPolls);
        setCurrentVotes(newVotes);
    };

    const handleVoteChange = (event, pollIndex) => {
        const newVotes = [...currentVotes];
        newVotes[pollIndex] = event.target.value;
        setCurrentVotes(newVotes);
    };

    const handleVoteSubmit = (event, pollIndex) => {
        event.preventDefault();
        if (!props.isAuthenticated) {
            props.history.push("/login");
            notification.info({ message: 'Polling App', description: "Please login to vote." });
            return;
        }

        const poll = polls[pollIndex];
        const selectedChoice = currentVotes[pollIndex];
        castVote({ pollId: poll.id, choiceId: selectedChoice })
            .then(response => {
                const newPolls = [...polls];
                newPolls[pollIndex] = response;
                setPolls(newPolls);
                notification.success({ message: 'Polling App', description: "Vote cast successfully!" });
            })
            .catch(error => {
                notification.error({ message: 'Error', description: error.message || 'Something went wrong.' });
            });
    };

    const renderHero = () => {
        if (props.username) return null;
        return (
            <div className="hero-section">
                <div className="hero-inner">
                    <h1 className="hero-title">Have a question?</h1>
                    <p className="hero-subtitle">Ask the community and get real-time answers.</p>
                    <Link to="/poll/new">
                        <Button type="primary" size="large" shape="round" icon="plus" className="hero-btn">
                            Create a Poll
                        </Button>
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <div className="poll-list-wrapper">
            {renderHero()}
            
            <div className="polls-container">
                {!props.username && (
                    <div className="polls-header-row">
                        <h3 className="section-title">
                            <Icon type="fire" theme="twoTone" twoToneColor="#eb2f96" /> Trending
                        </h3>
                        <Button shape="circle" icon="reload" onClick={handleRefresh} />
                    </div>
                )}

                {/* Grid-based layout for polls */}
                <Row gutter={[24, 24]}>
                    {polls.map((poll, index) => (
                        <Col xs={24} lg={12} xl={12} key={poll.id}>
                            <Poll
                                poll={poll}
                                currentUser={props.currentUser}
                                handlePollDelete={handlePollDelete}
                                currentVote={currentVotes[index]}
                                handleVoteChange={(event) => handleVoteChange(event, index)}
                                handleVoteSubmit={(event) => handleVoteSubmit(event, index)}
                            />
                        </Col>
                    ))}
                </Row>

                {!isLoading && polls.length === 0 && (
                    <div className="no-polls-found">
                        <Icon type="inbox" className="no-polls-icon" />
                        <div className="no-polls-text">No polls found yet.</div>
                        <Link to="/poll/new"><Button type="primary">Create Poll</Button></Link>
                    </div>
                )}

                {!isLoading && !last && (
                    <div className="load-more-polls">
                        <Button type="dashed" onClick={handleLoadMore} block size="large">
                            Load more
                        </Button>
                    </div>
                )}

                {isLoading && <LoadingIndicator />}
            </div>
        </div>
    );
}

export default withRouter(PollList);