import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const SendMoneyModal = ({ show, handleClose, handleSendMoney }) => {
    const [recipientEmail, setRecipientEmail] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSendMoney(recipientEmail, amount);
        setRecipientEmail('');
        setAmount('');
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Send Money</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Recipient Email</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Enter recipient's email" 
                            value={recipientEmail} 
                            onChange={(e) => setRecipientEmail(e.target.value)} 
                            autoFocus
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control 
                            type="number" 
                            placeholder="Enter amount" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                        Send
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default SendMoneyModal;
