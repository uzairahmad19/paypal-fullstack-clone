import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AddMoneyModal from './AddMoneyModal';
import SendMoneyModal from './SendMoneyModal';

const Dashboard = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]); // Re-add transactions state
    const [notifications, setNotifications] = useState([]);
    const [user, setUser] = useState(null); // Initialize user as null
    const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
    const [showSendMoneyModal, setShowSendMoneyModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Dashboard useEffect - token:', token);
        if (token) {
            fetchUser();
        } else {
            console.log('No token found, navigating to /login');
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (user) {
            console.log('User object updated:', user);
            fetchBalance(user.id);
            fetchTransactions(user.id); // Re-add fetchTransactions call
            fetchNotifications(user.id);
        }
    }, [user]); // Fetch data when user state is updated

    const fetchUser = async () => {
        try {
            console.log('Fetching user details...');
            const response = await api.get('/users/me'); // Assuming /users/me returns the logged-in user's details
            console.log('User details API response:', response.data);
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user details', error.response ? error.response.data : error.message);
            navigate('/login'); // Redirect to login if user details cannot be fetched
        }
    };

    const fetchBalance = async (userId) => {
        try {
            console.log('Fetching balance for user:', userId);
            const response = await api.get(`/wallets/user/${userId}`);
            console.log('Balance API response:', response.data);
            setBalance(response.data.balance);
        } catch (error) {
            console.error('Failed to fetch balance', error.response ? error.response.data : error.message);
        }
    };

    const fetchTransactions = async (userId) => {
        try {
            console.log('Fetching transactions for user:', userId);
            const response = await api.get(`/transactions/user/${userId}`);
            console.log('Transactions API response:', response.data);
            setTransactions(response.data);
        } catch (error) {
            console.error('Failed to fetch transactions', error.response ? error.response.data : error.message);
        }
    };

    const fetchNotifications = async (userId) => {
        try {
            console.log('Fetching notifications for user:', userId);
            const response = await api.get(`/notifications/user/${userId}`);
            console.log('Notifications API response:', response.data);
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications', error.response ? error.response.data : error.message);
        }
    };

    const handleAddMoney = async (amount) => {
        if (amount && user) {
            try {
                console.log('Adding money:', amount, 'for user:', user.id);
                await api.post('/wallets/credit', { userId: user.id, amount: parseFloat(amount) });
                console.log('Money added successfully.');
                fetchBalance(user.id);
            } catch (error) {
                console.error('Failed to add money', error.response ? error.response.data : error.message);
            }
        }
    };

    const handleSendMoney = async (recipientEmail, amount) => {
        if (recipientEmail && amount && user) {
            try {
                console.log('Sending money:', amount, 'to:', recipientEmail, 'from user:', user.id);
                await api.post('/transactions', { senderId: user.id, recipientEmail, amount: parseFloat(amount) });
                console.log('Money sent successfully.');
                fetchBalance(user.id);
                fetchTransactions(user.id);
            } catch (error) {
                console.error('Failed to send money', error.response ? error.response.data : error.message);
            }
        }
    };

    const handleLogout = () => {
        console.log('Logging out...');
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!user) {
        return <div className="d-flex justify-content-center align-items-center vh-100">Loading...</div>;
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">PayPal Clone</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <span className="nav-link">Welcome, {user.name}</span>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-8">
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h5 className="card-title text-primary">Main Account</h5>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="card-text text-muted mb-0">Current Balance</p>
                                        <p className="card-text fs-1 fw-bold">${balance.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <button className="btn btn-primary me-2" onClick={() => setShowAddMoneyModal(true)}>
                                            <i className="bi bi-plus-circle me-1"></i> Add Money
                                        </button>
                                        <button className="btn btn-success" onClick={() => setShowSendMoneyModal(true)}>
                                            <i className="bi bi-send me-1"></i> Send Money
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title text-primary">Recent Activity</h5>
                                <ul className="list-group list-group-flush">
                                    {transactions.length > 0 ? transactions.map(tx => (
                                        <li key={tx.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="mb-0 fw-bold">{tx.description}</p>
                                                <small className="text-muted">{new Date(tx.timestamp).toLocaleString()} - Status: {tx.status}</small>
                                            </div>
                                            <span className={`badge fs-6 bg-${tx.status === 'COMPLETED' ? (tx.type === 'DEBIT' ? 'danger' : 'success') : 'warning'}`}>
                                                {tx.type === 'DEBIT' ? '-' : '+'}${tx.amount.toFixed(2)}
                                            </span>
                                        </li>
                                    )) : <p className="text-center text-muted">No transactions yet.</p>}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title text-primary">
                                    <i className="bi bi-bell-fill me-2"></i>Notifications
                                </h5>
                                <ul className="list-group list-group-flush">
                                    {notifications.length > 0 ? notifications.map(notification => (
                                        <li key={notification.id} className="list-group-item">{notification.message}</li>
                                    )) : <p className="text-center text-muted">No new notifications.</p>}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddMoneyModal 
                show={showAddMoneyModal} 
                handleClose={() => setShowAddMoneyModal(false)} 
                handleAddMoney={handleAddMoney} 
            />

            <SendMoneyModal 
                show={showSendMoneyModal} 
                handleClose={() => setShowSendMoneyModal(false)} 
                handleSendMoney={handleSendMoney} 
            />
        </>
    );
};

export default Dashboard;
