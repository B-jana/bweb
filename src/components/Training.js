import React, { useState } from 'react';

const Training = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        mobile: '',
        course: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://bwebbackend.onrender.com/api/training', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                const savedTraining = await response.json();
                setMessage(`Thank you ${savedTraining.name}, your ${savedTraining.course} is booked on ${savedTraining.date}. We will contact you at ${savedTraining.mobile}!`);
                setForm({ name: '', email: '', mobile: '', course: '' });

                setTimeout(() => {
        setMessage('');
    }, 5000);
            } else {
                setMessage('Booking failed. Please try again.');
            }
        } catch (error) {
            console.error("error", error);
            setMessage('Something went wrong. Please try again.');
        }


    };


    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Beautician Training Registration</h2>
            <p style={styles.subheading}>Join our expert-led training and become a certified beautician.</p>

            {message && <p style={styles.success}>{message}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    style={styles.input}
                />
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    style={styles.input}
                />
                <input
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="Mobile Number"
                    required
                    pattern="[6-9]{1}[0-9]{9}"
                    title="Enter a valid 10-digit mobile number"
                    style={styles.input}
                />
                <select
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    required
                    style={styles.input}
                >
                    <option value="">Select Beautician Course</option>
                    <option value="Basic Makeup Course">Basic Makeup Course</option>
                    <option value="Advanced Bridal Makeup">Advanced Bridal Makeup</option>
                    <option value="Hairstyling & Draping">Hairstyling & Draping</option>
                    <option value="Professional Beautician Program">Professional Beautician Program</option>
                </select>

                <button type="submit" style={styles.button}>Enroll Now</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '450px',
        margin: '3rem auto',
        padding: '2rem',
        border: '1px solid #ddd',
        borderRadius: '10px',
        backgroundColor: '#fff8f9',
        boxShadow: '0 0 12px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        textAlign: 'center',
        color: '#d81b60',
        marginBottom: '0.5rem',
    },
    subheading: {
        textAlign: 'center',
        color: '#555',
        fontSize: '14px',
        marginBottom: '1.5rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    input: {
        padding: '10px',
        fontSize: '15px',
        borderRadius: '6px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '12px',
        fontSize: '16px',
        backgroundColor: '#e91e63',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    success: {
        color: 'green',
        textAlign: 'center',
        marginBottom: '1rem',
        fontWeight: 'bold',
    },
};

export default Training;
