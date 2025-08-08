import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddMoneyModal = ({ show, handleClose, handleAddMoney }) => {
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddMoney(amount);
        setAmount('');
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Money</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control 
                            type="number" 
                            placeholder="Enter amount" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            autoFocus
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                        Add
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddMoneyModal;
