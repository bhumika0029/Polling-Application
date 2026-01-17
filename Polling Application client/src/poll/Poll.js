import React from 'react';
import './Poll.css';
import { Avatar, Icon, Radio, Button, Progress, Tag, Tooltip, message } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';

const RadioGroup = Radio.Group;

const Poll = (props) => {
    
    const calculatePercentage = (choice) => {
        if (props.poll.totalVotes === 0) return 0;
        return (choice.voteCount * 100) / props.poll.totalVotes;
    };

    const isSelected = (choice) => props.poll.selectedChoice === choice.id;

    const getWinningChoice = () => {
        return props.poll.choices.reduce((prev, curr) =>
            curr.voteCount > prev.voteCount ? curr : prev,
            { voteCount: -Infinity }
        );
    };

    const getTimeRemaining = (poll) => {
        const expirationTime = new Date(poll.expirationDateTime).getTime();
        const currentTime = new Date().getTime();
        const diff = expirationTime - currentTime;

        if(diff < 0) return "Expired";

        const seconds = Math.floor((diff / 1000) % 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days > 0) return `${days}d left`;
        if (hours > 0) return `${hours}h left`;
        return `${minutes}m left`;
    };

    const handleShare = () => {
        const dummyUrl = window.location.origin + `/poll/${props.poll.id}`;
        navigator.clipboard.writeText(dummyUrl).then(() => {
            message.success("Link copied!");
        });
    };

    const pollChoices = [];
    if (props.poll.selectedChoice || props.poll.expired) {
        const winningChoice = getWinningChoice();
        props.poll.choices.forEach(choice => {
            pollChoices.push(
                <CompletedOrVotedPollChoice
                    key={choice.id}
                    choice={choice}
                    isWinner={props.poll.expired && choice.id === winningChoice.id}
                    isSelected={isSelected(choice)}
                    percentVote={calculatePercentage(choice)}
                />
            );
        });
    } else {
        props.poll.choices.forEach(choice => {
            pollChoices.push(
                <Radio 
                    className="poll-choice-radio" 
                    key={choice.id} 
                    value={choice.id}
                >
                    <span className="choice-text-wrap">{choice.text}</span>
                </Radio>
            );
        });
    }

    return (
        <div className="poll-content">
            <div className="poll-header">
                <div className="poll-creator-info">
                    <Link className="creator-link" to={`/users/${props.poll.createdBy.username}`}>
                        <Avatar 
                            className="poll-creator-avatar"
                            style={{ backgroundColor: getAvatarColor(props.poll.createdBy.name) }}
                        >
                            {props.poll.createdBy.name[0].toUpperCase()}
                        </Avatar>
                        <div className="creator-details">
                            <span className="poll-creator-name">{props.poll.createdBy.name}</span>
                            <span className="poll-creation-date">{formatDateTime(props.poll.creationDateTime)}</span>
                        </div>
                    </Link>
                    <div className="poll-actions">
                        <Tag color={props.poll.expired ? "red" : "green"}>
                            {props.poll.expired ? "Closed" : "Active"}
                        </Tag>
                        <Icon type="share-alt" className="share-icon" onClick={handleShare} />
                    </div>
                </div>

                <div className="poll-question">
                    {props.poll.question}
                </div>
            </div>

            <div className="poll-choices">
                <RadioGroup
                    className="poll-choice-radio-group"
                    onChange={props.handleVoteChange}
                    value={props.currentVote}
                >
                    {pollChoices}
                </RadioGroup>
            </div>

            <div className="poll-footer">
                <div className="poll-footer-meta">
                    <span className="meta-item"><Icon type="bar-chart" /> {props.poll.totalVotes} votes</span>
                    <span className="meta-item">
                        <Icon type="clock-circle-o" /> {props.poll.expired ? "Final results" : getTimeRemaining(props.poll)}
                    </span>
                </div>
                {!(props.poll.selectedChoice || props.poll.expired) && (
                    <Button 
                        className="vote-button" 
                        type="primary" 
                        block
                        disabled={!props.currentVote} 
                        onClick={props.handleVoteSubmit}
                    >
                        Vote
                    </Button>
                )}
            </div>
        </div>
    );
}

const CompletedOrVotedPollChoice = ({ choice, isWinner, isSelected, percentVote }) => (
    <div className={`cv-poll-choice ${isWinner ? 'winner' : ''}`}>
        <div className="cv-choice-header">
            <span className="cv-choice-text">
                {choice.text}
                {isSelected && <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" style={{marginLeft: 8}}/>}
            </span>
            <span className="cv-choice-count">{choice.voteCount} votes</span>
        </div>
        <Progress 
            percent={Math.round(percentVote)} 
            status={isWinner ? "success" : "normal"}
            strokeWidth={10}
        />
    </div>
);

export default Poll;