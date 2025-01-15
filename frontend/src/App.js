import React, { useState, useEffect } from 'react';

const App = () => {
    const [applications, setApplications] = useState([]);
    const [newApplication, setNewApplication] = useState({
        company: '',
        position: '',
        status: '',
    });
    const [updateStatus, setUpdateStatus] = useState('');

    // Fetch applications on load
    useEffect(() => {
        fetch('http://localhost:5000/applications')
            .then((res) => res.json())
            .then((data) => setApplications(data))
            .catch((err) => console.error('Error fetching applications:', err));
    }, []);

    // Add a new application
    const addApplication = async () => {
        if (!newApplication.company || !newApplication.position || !newApplication.status) {
            alert('Please fill out all fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newApplication),
            });

            if (!response.ok) {
                throw new Error('Failed to add application');
            }

            const addedApplication = await response.json();
            setApplications([...applications, addedApplication]); // Update state with new application
            setNewApplication({ company: '', position: '', status: '' }); // Clear the form
        } catch (error) {
            console.error('Error adding application:', error);
            alert('Failed to add application');
        }
    };

    // Update the status of an application
    const updateApplication = async (id) => {
        if (!updateStatus) {
            alert('Please enter a new status');
            return;
        }

        const response = await fetch(`http://localhost:5000/applications/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: updateStatus }),
        });

        if (response.ok) {
            setApplications(
                applications.map((app) =>
                    app.id === id ? { ...app, status: updateStatus } : app
                )
            );
            setUpdateStatus(''); // Clear the status input field
        } else {
            console.error('Error updating application');
        }
    };

    // Remove an application
    const removeApplication = async (id) => {
        const response = await fetch(`http://localhost:5000/applications/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setApplications(applications.filter((app) => app.id !== id)); // Remove application from state
        } else {
            console.error('Error removing application');
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Job Application Tracker</h1>

            <div style={styles.form}>
                <h2 style={styles.subHeader}>Add New Application</h2>
                <input
                    type="text"
                    placeholder="Company"
                    value={newApplication.company}
                    onChange={(e) => setNewApplication({ ...newApplication, company: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Position"
                    value={newApplication.position}
                    onChange={(e) => setNewApplication({ ...newApplication, position: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Status"
                    value={newApplication.status}
                    onChange={(e) => setNewApplication({ ...newApplication, status: e.target.value })}
                    style={styles.input}
                />
                <button onClick={addApplication} style={styles.addButton}>
                    Add Application
                </button>
            </div>

            <h2 style={styles.subHeader}>Applications</h2>
            {applications.length > 0 ? (
                <ul style={styles.list}>
                    {applications.map((app) => (
                        <li key={app.id} style={styles.listItem}>
                            <div>
                                <strong>Company:</strong> {app.company} <br />
                                <strong>Position:</strong> {app.position} <br />
                                <strong>Status:</strong> {app.status}
                            </div>
                            <div style={styles.actions}>
                                <input
                                    type="text"
                                    placeholder="New Status"
                                    value={updateStatus}
                                    onChange={(e) => setUpdateStatus(e.target.value)}
                                    style={styles.input}
                                />
                                <button onClick={() => updateApplication(app.id)} style={styles.updateButton}>
                                    Update
                                </button>
                                <button onClick={() => removeApplication(app.id)} style={styles.removeButton}>
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={styles.noApplications}>No applications found.</p>
            )}
        </div>
    );
};

export default App;

// Styles
const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        margin: '20px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    header: {
        textAlign: 'center',
        color: '#333',
    },
    subHeader: {
        color: '#555',
    },
    form: {
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    input: {
        margin: '5px 0',
        padding: '10px',
        width: '100%',
        boxSizing: 'border-box',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    addButton: {
        padding: '10px 15px',
        marginTop: '10px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    list: {
        listStyleType: 'none',
        padding: 0,
    },
    listItem: {
        padding: '15px',
        marginBottom: '10px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    actions: {
        marginTop: '10px',
    },
    updateButton: {
        marginRight: '10px',
        padding: '8px 12px',
        backgroundColor: '#2196F3',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    removeButton: {
        padding: '8px 12px',
        backgroundColor: '#f44336',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    noApplications: {
        color: '#777',
        textAlign: 'center',
    },
};
