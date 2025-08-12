import React, { useState } from 'react';

const Booking = () => {


    const [form, setForm] = useState({
        name: '',
        mobile: '',
        date: '',
        service: '',
    });
    

    const [message, setMessage] = useState('');

    const [errors, setErrors] = useState({});


    // Validation function for all fields
    const validate = () => {
        const errs = {};

        if (!form.name.trim()) {
            errs.name = "Name is required";
        }

        if (!form.mobile.trim()) {
            errs.mobile = "Mobile number is required";
        } else if (!/^[6-9][0-9]{9}$/.test(form.mobile)) {
            errs.mobile = "Enter a valid 10-digit mobile number starting with 6-9";
        }

        if (!form.date) {
            errs.date = "Date is required";
        } else {
            const selectedDate = new Date(form.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                errs.date = "Date cannot be in the past";
            }
        }

        if (!form.service) {
            errs.service = "Please select a service";
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };


    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
         if (!validate()) {
            return;
        }
        try {
            const response = await fetch('https://bwebbackend.onrender.com/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                const savedBooking = await response.json();
                setMessage(`Thank you ${savedBooking.name}, your ${savedBooking.service} is booked on ${savedBooking.date}. We will contact you at ${savedBooking.mobile}!`);
                setForm({ name: '', mobile: '', date: '', service: '' });
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
            <h2 style={styles.heading}>Book Your Makeup Appointment</h2>

            {message && <p style={styles.success}>{message}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                   
                    style={styles.input}
                />
                    {errors.name && <p style={styles.error}>{errors.name}</p>}
                <input
                    name="mobile"
                    type="tel"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="Mobile Number"
                   
                    pattern="[6-9]{1}[0-9]{9}"
                    title="Enter a valid 10-digit mobile number"
                    style={styles.input}
                />
                    {errors.mobile && <p style={styles.error}>{errors.mobile}</p>}
                <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    placeholder="Date"
                    style={styles.input}
                />
                    {errors.date && <p style={styles.error}>{errors.date}</p>}
                <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                   
                    style={styles.input}
                >
                       
                    <option value="">Select Service</option>
                    <option value="Bridal Makeup">Bridal Makeup</option>
                    <option value="Party Makeup">Party Makeup</option>
                    <option value="Fashion Makeup">Fashion Makeup</option>
                </select>
                         {errors.service && <p style={styles.error}>{errors.service}</p>}

                <button
                    type="submit"
                    style={styles.button}
                   
                >
                    Book Now
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '400px',
        margin: '3rem auto',
        padding: '2rem',
        border: '1px solid #ccc',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '1rem',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        backgroundColor: '#e91e63',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    },
    success: {
        color: 'green',
        textAlign: 'center',
        marginBottom: '1rem',
        fontWeight: 'bold',
    },
    error: {
        color: "red",
        fontSize: "0.85rem",
        marginTop: "-0.75rem",
        marginBottom: "0.75rem",
    },
};

export default Booking;
