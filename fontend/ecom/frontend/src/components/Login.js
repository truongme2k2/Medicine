import React, { useEffect, useState } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { Button } from 'react-bootstrap';

function Login() {
    const [email, setEmail] = useState('') // Thay đổi tên state thành 'email'
    const [password, SetPassword] = useState('')
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login_user/', {
                email: email, // Thay đổi key từ 'username' thành 'email'
                password: password
            });

            const data = response.data;
            // Kiểm tra xem có access_token trong phản hồi hay không
            if (data && data.access_token) {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('is_staff',data.user_data['is_staff']);
                localStorage.setItem('email',data.user_data['email'])
                console.log(localStorage.getItem("email"));

                let access_token = localStorage.getItem("access_token")
                const is_staff = localStorage.getItem('is_staff');
                if (access_token) {
                    if (is_staff === 'true') {
                        navigate('/admin')
                    }else{
                        navigate('/');
                    }
                    
                }
            } else {
                // Xử lý trường hợp không có access_token trong phản hồi
                setError('Không có access_token trong phản hồi từ máy chủ');
            }
        } catch (error) {
            // Xử lý lỗi nếu có lỗi xảy ra khi gửi yêu cầu
            console.error('Error during login:', error);
            setError('Đã xảy ra lỗi khi đăng nhập');
        }
    };

    return (
        <div className='login template d-flex justify-content-center align-items-center vh-100 bg-primary'>
            <div className='form_container p-5 rounded bg-white'>
                    <h3 className='text-center'>Sign In</h3>
                    <div className='mb-2'>
                        <label htmlFor='email'>Email</label> 
                        <input type='text' placeholder='Enter Email' className='form-control' value={email} onChange={(event) => setEmail(event.target.value)}></input> {/* Thay đổi value và onChange cho input */}
                    </div>
                    <div className='mb-2'>
                        <label htmlFor='password'>Password</label>
                        <input type='password' placeholder='Enter Password' className='form-control' value={password} onChange={(event) => SetPassword(event.target.value)}></input>
                    </div>
                    <div>
                        <input type='checkbox' className='custom-control custom-checkbox' id="check" />
                        <label htmlFor='check' className='custom-input-label ms-2'>
                            Remember me
                        </label>
                    </div>
                    <div className='d-grid'>
                        <Button className='bg-primary' onClick={() => handleLogin()}>Sign in</Button>
                    </div>
                    <p className='text-end mt-2'>
                        Forgot <a href=''>Password?</a>
                        <Link to='/signup' className='ms-2'>Sign up</Link>
                    </p>
            </div>
        </div>
    )
}

export default Login;
