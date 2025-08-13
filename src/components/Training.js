import React, { useState } from 'react';
import Swal from "sweetalert2";

const Training = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        mobile: '',
        course: '',
    });
    const [message, setMessage] = useState('');

    const [errors, setErrors] = useState({});


    // Validation function for all fields
    const validate = () => {
        const errs = {};

        if (!form.name.trim()) {
            errs.name = "Name is required";
        }

         if (!form.email.trim()) {
            errs.email = "Email is required";
        }
        if (!form.mobile.trim()) {
            errs.mobile = "Mobile number is required";
        } else if (!/^[6-9][0-9]{9}$/.test(form.mobile)) {
            errs.mobile = "Enter a valid 10-digit mobile number starting with 6-9";
        }

        if (!form.course) {
            errs.course = "Please select a course";
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

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to confirm your enrollment?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, enroll me!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#e91e63',
        });
        if (result.isConfirmed){
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

                 // Dispatch event so AdminDashboard knows about new training
                const event = new CustomEvent('new-training', { detail: savedTraining });
                window.dispatchEvent(event);
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Enrollment Confirmed!',
                    html: `
                        <p>Thank you <strong>${savedTraining.name}</strong>!</p>
                        <p>You are enrolled in the <strong>${savedTraining.course}</strong> course.</p>
                        <p>We will contact you at <strong>${savedTraining.mobile}</strong> or <strong>${savedTraining.email}</strong>.</p>
                    `,
                    confirmButtonColor: '#e91e63',
                });

                setForm({ name: '', email: '', mobile: '', course: '' });
                setMessage('');
            } else {
                Swal.fire('Oops!', 'Enrollment failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error("error", error);
            Swal.fire('Oops!', 'Something went wrong. Please try again.', 'error');
        }
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
                   
                    style={styles.input}
                />
                    {errors.name && <p style={styles.error}>{errors.name}</p>}
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                   
                    style={styles.input}
                />
                    {errors.email && <p style={styles.error}>{errors.email}</p>}
                <input
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="Mobile Number"
                    
                    pattern="[6-9]{1}[0-9]{9}"
                    title="Enter a valid 10-digit mobile number"
                    style={styles.input}
                />
                      {errors.mobile && <p style={styles.error}>{errors.mobile}</p>}
                <select
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                   
                    style={styles.input}
                >
                    <option value="">Select Beautician Course</option>
                    <option value="Basic Makeup Course">Basic Makeup Course</option>
                    <option value="Advanced Bridal Makeup">Advanced Bridal Makeup</option>
                    <option value="Hairstyling & Draping">Hairstyling & Draping</option>
                    <option value="Professional Beautician Program">Professional Beautician Program</option>
                </select>
                 {errors.course && <p style={styles.error}>{errors.course}</p>}

                     
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
     error: {
        color: "red",
        fontSize: "0.85rem",
        marginTop: "-0.75rem",
        marginBottom: "0.75rem",
    },
};

export default Training;
