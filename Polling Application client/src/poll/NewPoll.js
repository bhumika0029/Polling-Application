import React, { useState } from 'react';
import { createPoll } from '../util/APIUtils';
import { MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH } from '../constants';
import './NewPoll.css';
import { Form, Input, Button, Icon, Select, Col, Row, notification, Tooltip } from 'antd';

const Option = Select.Option;
const { TextArea } = Input;

const NewPoll = (props) => {
    const [question, setQuestion] = useState({ text: '', validateStatus: 'success', errorMsg: null });
    const [choices, setChoices] = useState([
        { text: '', validateStatus: 'success', errorMsg: null },
        { text: '', validateStatus: 'success', errorMsg: null }
    ]);
    const [pollLength, setPollLength] = useState({ days: 1, hours: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validation Handlers
    const validateQuestion = (text) => {
        if (text.length === 0) return { validateStatus: 'error', errorMsg: 'Please enter your question!' };
        if (text.length > POLL_QUESTION_MAX_LENGTH) return { validateStatus: 'error', errorMsg: `Max ${POLL_QUESTION_MAX_LENGTH} chars` };
        return { validateStatus: 'success', errorMsg: null };
    };

    const validateChoice = (text) => {
        if (text.length === 0) return { validateStatus: 'error', errorMsg: 'Please enter a choice!' };
        if (text.length > POLL_CHOICE_MAX_LENGTH) return { validateStatus: 'error', errorMsg: `Max ${POLL_CHOICE_MAX_LENGTH} chars` };
        return { validateStatus: 'success', errorMsg: null };
    };

    // Form Handlers
    const handleQuestionChange = (event) => {
        const text = event.target.value;
        setQuestion({ text, ...validateQuestion(text) });
    };

    const handleChoiceChange = (event, index) => {
        const text = event.target.value;
        const newChoices = [...choices];
        newChoices[index] = { text, ...validateChoice(text) };
        setChoices(newChoices);
    };

    const addChoice = () => setChoices([...choices, { text: '', validateStatus: 'success', errorMsg: null }]);
    const removeChoice = (indexToRemove) => setChoices(choices.filter((_, index) => index !== indexToRemove));
    const handlePollDaysChange = (value) => setPollLength({ ...pollLength, days: value });
    const handlePollHoursChange = (value) => setPollLength({ ...pollLength, hours: value });

    const isFormInvalid = () => {
        if (question.validateStatus !== 'success') return true;
        return choices.some(c => c.validateStatus !== 'success' || c.text.length === 0);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        const pollData = { question: question.text, choices: choices.map(c => ({ text: c.text })), pollLength };

        createPoll(pollData)
            .then(() => props.history.push("/"))
            .catch(error => {
                setIsSubmitting(false);
                notification.error({ message: 'Error', description: error.message || 'Something went wrong.' });
            });
    };

    return (
        <div className="new-poll-container">
            <div className="new-poll-content">
                <h1 className="page-title">Create Poll</h1>
                <Form onSubmit={handleSubmit} layout="vertical">
                    
                    {/* Question */}
                    <Form.Item 
                        validateStatus={question.validateStatus} 
                        help={question.errorMsg} 
                        label={<span className="form-label">Question</span>}
                    >
                        <TextArea
                            placeholder="What's on your mind?"
                            autosize={{ minRows: 3, maxRows: 6 }}
                            value={question.text}
                            onChange={handleQuestionChange}
                            className="poll-textarea"
                        />
                        <div className="char-count">{question.text.length}/{POLL_QUESTION_MAX_LENGTH}</div>
                    </Form.Item>

                    {/* Choices */}
                    <div className="choices-section">
                        <label className="form-label">Choices</label>
                        {choices.map((choice, index) => (
                            <PollChoice 
                                key={index} 
                                choice={choice} 
                                index={index} 
                                remove={removeChoice} 
                                onChange={handleChoiceChange} 
                            />
                        ))}
                        <Button 
                            type="dashed" 
                            onClick={addChoice} 
                            disabled={choices.length === MAX_CHOICES} 
                            block 
                            icon="plus"
                            className="add-choice-btn"
                        >
                            Add Choice
                        </Button>
                    </div>

                    {/* Duration Grid */}
                    <div className="duration-section">
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} md={8}>
                                <span className="form-label">Close Poll In:</span>
                            </Col>
                            <Col xs={12} md={8}>
                                <Select value={pollLength.days} onChange={handlePollDaysChange} style={{ width: '100%' }}>
                                    {[...Array(8).keys()].map(i => <Option key={i} value={i}>{i} Days</Option>)}
                                </Select>
                            </Col>
                            <Col xs={12} md={8}>
                                <Select value={pollLength.hours} onChange={handlePollHoursChange} style={{ width: '100%' }}>
                                    {[...Array(24).keys()].map(i => <Option key={i} value={i}>{i} Hours</Option>)}
                                </Select>
                            </Col>
                        </Row>
                    </div>

                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        size="large" 
                        block 
                        loading={isSubmitting} 
                        disabled={isFormInvalid()}
                        className="submit-poll-btn"
                    >
                        Launch Poll
                    </Button>
                </Form>
            </div>
        </div>
    );
};

const PollChoice = ({ choice, index, remove, onChange }) => (
    <Form.Item validateStatus={choice.validateStatus} help={choice.errorMsg} className="choice-item">
        <div className="choice-input-wrapper">
            <Input 
                placeholder={`Choice ${index + 1}`} 
                value={choice.text} 
                onChange={(e) => onChange(e, index)} 
                size="large"
            />
            {index > 1 && (
                <Icon type="minus-circle" className="delete-choice-icon" onClick={() => remove(index)} />
            )}
        </div>
    </Form.Item>
);

export default NewPoll;