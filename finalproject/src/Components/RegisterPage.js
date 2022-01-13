import React, { useRef, useState } from 'react'
import { Card, Col, Form, FormControl, InputGroup, Row, FormLabel, Button, Alert } from 'react-bootstrap'
import SocialButton from './SocialButton'
import { useNavigate } from 'react-router-dom'
import { Facebook, Mailbox, Phone } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { AddUser, UserSocialLogin } from '../config/myService';

import { useSnackbar } from 'react-simple-snackbar'
const options = {
    position: 'bottom-left',
    style: {
        fontSize: '20px',
        textAlign: 'center',
        color: '#8A2BE2',
    },
    closeStyle: {
        color: 'lightcoral',
        fontSize: '16px',
    },
}
export default function RegisterPage() {
    const FirstName = useRef('');
    const LastName = useRef('');
    const Email = useRef('');
    const Password = useRef('');
    const ConfirmPassword = useRef('');
    const MobileNo = useRef('')
    const [openSnackbar] = useSnackbar(options)
    const regForEmail = RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/);
    const regForPassword = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/);
    const regFoMob = RegExp(/^[0-9]{10}$/)
    const regForName = RegExp(/[A-Za-z ]+/)
    const history = useNavigate()
    const [ErrorRegister, setErrorRegister] = useState({ Errorfirstname: '', Errorlastname: '', ErrorEmail: '', ErrorPassword: '', ErrorConfirm: '', ErrorMobile: '' })
    const handle = (event) => {
        const name = event.target.name;
        switch (name) {
            case "FirstName":
                let error_for_firstname = regForName.test(FirstName.current.value) ? '' : 'Enter Valid First Name';
                setErrorRegister({
                    ...ErrorRegister, Errorfirstname: error_for_firstname
                })
                break;
            case "LastName":
                let error_for_lastname = regForName.test(LastName.current.value) ? '' : 'Enter Valid Last  Name';
                setErrorRegister({
                    ...ErrorRegister, Errorlastname: error_for_lastname
                })
                break;
            case "MobileNo":
                let error_for_mobile = regFoMob.test(MobileNo.current.value) ? '' : 'Enter Valid mobile number';
                setErrorRegister({
                    ...ErrorRegister, ErrorMobile: error_for_mobile
                })
                break;
            case "ConfirmPassword":
                let error_for_confirm = Password.current.value === ConfirmPassword.current.value ? '' : 'Password must be match';
                setErrorRegister({
                    ...ErrorRegister, ErrorConfirm: error_for_confirm
                })
                break;
            case "Email":
                let error_for_email = regForEmail.test(Email.current.value) ? '' : 'Enter Valid Email';
                setErrorRegister({
                    ...ErrorRegister, ErrorEmail: error_for_email
                })
                break;
            case "Password":
                let error_for_password = regForPassword.test(Password.current.value) ? '' : 'Enter Valid patterin '
                setErrorRegister({
                    ...ErrorRegister, ErrorPassword: error_for_password
                })
                break;
        }
    }
    const setnull = (event) => {
        const name = event.target.name;
        switch (name) {
            case "FirstName":
                setErrorRegister({
                    ...ErrorRegister, Errorfirstname: ''
                })
                break;
            case "LastName":
                setErrorRegister({
                    ...ErrorRegister, Errorlastname: ''
                })
                break;
            case "MobileNo":
                setErrorRegister({
                    ...ErrorRegister, ErrorMobile: ''
                })
                break;
            case "ConfirmPassword":
                setErrorRegister({
                    ...ErrorRegister, ErrorConfirm: ''
                })
                break;
            case "Email":
                setErrorRegister({
                    ...ErrorRegister, ErrorEmail: ''
                })
                break;
            case "Password":
                setErrorRegister({
                    ...ErrorRegister, ErrorPassword: ''
                })
                break;
        }
    }
    const handleSocialLogin = (user) => {
        console.log(user);
        console.log(user._profile.firstName);
        if (user) {
            UserSocialLogin(user._profile)
                .then(res => {
                    if (res.data.err == 1) {
                        console.log(res.data.msg);
                        openSnackbar(res.data.msg)
                    }
                    else {
                        localStorage.setItem('_token', res.data.token)
                        openSnackbar(res.data.msg)
                        history("/dashboard");
                    }
                })
                .catch(err => {
                    if (err) {
                        history('/ServerError')
                    }
                })
        }
    };

    const handleSocialLoginFailure = (err) => {

        openSnackbar('Unable to login')
    };
    const RegisterUser = () => {
        let data = { firstname: FirstName.current.value, lastname: LastName.current.value, email: Email.current.value, password: Password.current.value, mobileno: MobileNo.current.value }
        console.log(data);
        if (ErrorRegister.ErrorConfirm == '' && ErrorRegister.ErrorEmail == '' && ErrorRegister.ErrorPassword == '' && ErrorRegister.Errorfirstname == '' && ErrorRegister.Errorlastname == '' && ErrorRegister.ErrorMobile == '') {
            AddUser(data)
                .then(res => {
                    console.log(res);
                    if (res.data.err == 0) {
                        openSnackbar(res.data.msg)
                        history('/LoginPage')
                    }
                    else {
                        openSnackbar(res.data.msg)
                        console.log('error occured');
                    }
                })
                .catch(err => {
                    if (err) {
                        history('/ServerError')
                    }
                })
        }
    }
    return (<>

        <div className=' container-fluid'>

            <Row className='padding marginlogin mt-3'>
                <Col lg={12} className='text-center mr-3'>
                    <SocialButton
                        provider="facebook"
                        appId="2362435687224371"
                        onLoginSuccess={handleSocialLogin}
                        onLoginFailure={handleSocialLoginFailure}
                        className='SocialButton facebook text-white  mb-5'
                        size="lg"
                    >
                        <Facebook /> sign in with Facebook
                    </SocialButton>
                    <SocialButton
                        provider="google"
                        appId="57326886237-e5s64g1s5givufhqfckv4ucj5iegp14f.apps.googleusercontent.com"
                        onLoginSuccess={handleSocialLogin}
                        onLoginFailure={handleSocialLoginFailure}
                        className='SocialButton google ms-3 '

                        size="lg"
                    >
                        <img src='Image/Google-Symbol.png' height='30px' width='45px' /> sign in with Google
                    </SocialButton>
                </Col>
                <Col lg={3} />
                <Col lg={6} >
                    <Card className='bg-light'>
                        <Form className='p-3'>
                            <FormLabel ><h3>Register To NeoSTORE</h3></FormLabel>
                            <InputGroup className=' mt-2 mb-2'>
                                <FormControl type='text' placeholder='First Name' aria-describedby="basic-addon2" name='FirstName' /* className=' mt-2 mb-2' */ ref={FirstName} onBlur={handle} onFocus={setnull} />
                                <InputGroup.Text id="basic-addon2" className="bg-light">T</InputGroup.Text>
                            </InputGroup>
                            <FormLabel style={{ color: 'red' }} >{ErrorRegister.Errorfirstname}</FormLabel>
                            <InputGroup className=' mt-2 mb-2'>
                                <FormControl type='text' placeholder='Last Name ' name='LastName' /* className='p-2 mt-2 mb-2' */ ref={LastName} onBlur={handle} onFocus={setnull} />
                                <InputGroup.Text id="basic-addon2" className="bg-light"> T </InputGroup.Text>
                            </InputGroup>
                            <FormLabel style={{ color: 'red' }} >{ErrorRegister.Errorlastname}</FormLabel>
                            <InputGroup className=' mt-2 mb-2'>
                                <FormControl type='text' placeholder='Email Address ' name='Email' /* className='p-2 mt-2 mb-2' */ ref={Email} onBlur={handle} onFocus={setnull} />
                                <InputGroup.Text id="basic-addon2" className="bg-light"><Mailbox /></InputGroup.Text>
                            </InputGroup>
                            <FormLabel style={{ color: 'red' }} >{ErrorRegister.ErrorEmail}</FormLabel>
                            <InputGroup className='mt-2 mb-2'>
                                <FormControl type='password' placeholder='Password ' name='Password' /* className='p-2 mt-2 mb-2' */ ref={Password} onBlur={handle} onFocus={setnull} />

                            </InputGroup>
                            <FormLabel style={{ color: 'red' }} >{ErrorRegister.ErrorPassword}</FormLabel>
                            <InputGroup className='mt-2 mb-2'>
                                <FormControl type='password' placeholder='Confirm Password ' name='ConfirmPassword' /* className='p-2 mt-2 mb-2' */ ref={ConfirmPassword} onBlur={handle} onFocus={setnull} />

                            </InputGroup>
                            <FormLabel style={{ color: 'red' }} >{ErrorRegister.ErrorConfirm}</FormLabel>
                            <InputGroup className=' mt-2 mb-2'>
                                <FormControl type='text' placeholder='Mobile No. ' name='MobileNo' /* className='p-2 mt-2 mb-2' */ ref={MobileNo} onBlur={handle} onFocus={setnull} />
                                <InputGroup.Text id="basic-addon2" className="bg-light"><Phone /></InputGroup.Text>
                            </InputGroup>
                            <FormLabel style={{ color: 'red' }} >{ErrorRegister.ErrorMobile}</FormLabel><br />
                            <Button onClick={RegisterUser} className='mt-3'>Register</Button>

                        </Form>
                        <Link to='/LoginPage' className='nav-link'>Existing User?</Link>
                    </Card>
                </Col>
                <Col lg={3} />
            </Row>
        </div>
    </>
    )
}
