import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirm_password: '',
        address: '',
        phone: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('confirm_password', formData.confirm_password);
            formDataToSend.append('address', formData.address);
            formDataToSend.append('phone', formData.phone);

            const response = await axios.post('http://127.0.0.1:8000/api/register/', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'  
                }
            });
            console.log('Registration successful:', response.data);
            navigate('/login');
            // Redirect or show success message
        } catch (error) {
            console.error('Registration error:', error.response.data);
            // Handle registration error (e.g., show error message)
        }
    };

    return (
        <div className='signup template d-flex justify-content-center align-items-center vh-100 bg-primary'>
            <div className='form_container p-5 rounded bg-white'>
                <form onSubmit={handleSubmit}>
                    <h3 className='text-center'>Sign Up</h3>
                    <div className='mb-2'>
                        <label htmlFor='email'>Email</label>
                        <input type='email' name='email' placeholder='Enter Email' className='form-control' onChange={handleChange} value={formData.email} />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor='password'>Password</label>
                        <input type='password' name='password' placeholder='Enter Password' className='form-control' onChange={handleChange} value={formData.password} />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor='confirm_password'>Confirm Password</label>
                        <input type='password' name='confirm_password' placeholder='Enter Password' className='form-control' onChange={handleChange} value={formData.confirm_password} />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor='address'>Address</label>
                        <input type='text' name='address' placeholder='Enter Address' className='form-control' onChange={handleChange} value={formData.address} />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor='phone'>Phone</label>
                        <input type='text' name='phone' placeholder='Enter Phone' className='form-control' onChange={handleChange} value={formData.phone} />
                    </div>
                    <div className='d-grid'>
                        <Button className='bg-primary'>Sign Up</Button>
                    </div>
                    <p className='text-end mt-2'>
                        Already Registered
                        <Link to='/' className='ms-2'>Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signup;
