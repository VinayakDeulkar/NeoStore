import React,{useRef, useState} from 'react'
import { Button, Col, Form, FormControl, InputGroup, FormLabel,  Row } from 'react-bootstrap'
import { Facebook,  Phone } from 'react-bootstrap-icons';
import SocialButton from './SocialButton'
import { Link ,useNavigate} from 'react-router-dom';
import { ChangeUuid, CheckUser, UserSocialLogin,GETCARTCOUNT } from '../config/myService';
import jwt_decode from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux';

import {useSnackbar} from 'react-simple-snackbar'
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
export default function LoginPage() {
    const Email = useRef('')
    const Password = useRef('')
    const [Error, setError] = useState({Erroremail:'',ErrorPassword:''})
    const history=useNavigate()
    const dispatch = useDispatch()
    const [openSnackbar] = useSnackbar(options)
    const Uuid = useSelector(state => state.uuid)
    const regForEmail=RegExp(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/);
    const regForPassword=RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/);
    const handle=(event)=>{
        const name=event.target.name;
        switch(name){
            case "Email":
            let error_for_email=regForEmail.test(Email.current.value)?'':'Enter Valid Email';
            setError({
                ...Error,Erroremail:error_for_email
            })
            break;
            case "Password":
                let error_for_password=regForPassword.test(Password.current.value)?'':'Enter Valid patterin '
                setError({
                    ...Error,ErrorPassword:error_for_password
                })
            break;
        }
    }
    const setnull=(event)=>{
        const name=event.target.name;
        switch(name){
            case "Email":
            setError({
                ...Error,Erroremail:''
            })
            break;
            case "Password":
                setError({
                    ...Error,ErrorPassword:''
                })
            break;
        }
    }
    const handleSocialLogin = (user) => {
        console.log(user);
        console.log(user._profile.profilePicURL);
        if (user) {
            UserSocialLogin(user._profile)
            .then(res=>{
                if(res.data.err==1){
                    console.log(res.data.msg);
                    openSnackbar(res.data.msg)
                }
                else{
                    localStorage.removeItem('uuid')
                    localStorage.setItem('_token',res.data.token)
                    console.log(Uuid);
                        let decode=jwt_decode(res.data.token);
                        console.log(decode.uid[0]);
                        let data={id:decode.uid[0]._id,cartid:Uuid}
                        openSnackbar(res.data.msg)
                        ChangeUuid(data)
                        .then(res=>{
                            if(res.data.err==0){
                                dispatch({type:'enable'})
                                let data={id:decode.uid[0]._id}
                                GETCARTCOUNT(data)
                                .then(res=>{
                                    console.log(res.data.count);
                                    dispatch({type:'cart',payload:res.data.count})
                                })
                                .catch(err=>{
                                    if(err){
                                        history('/ServerError')
                                    }
                                })
                                history("/");
                            }
                        
                        })
                        .catch(err=>{
                            if(err){
                                localStorage.clear()
                                history('/ServerError')
                            }
                        })
                }
            })
            .catch(err=>{
                if(err){
                    history('/ServerError')
                }
            })
        }
    };

    const handleSocialLoginFailure = (err) => {
        openSnackbar('Unable to Login')
    };
    const checkuser=()=>{
        let data={email:Email.current.value,password:Password.current.value}
        console.log(data);
        CheckUser(data)
        .then((res) => {
            console.log(res);
    
            if (res.data.err == 0) {
              console.log(res);
              localStorage.removeItem('uuid')
              localStorage.setItem('_token',res.data.token)
              let decode=jwt_decode(res.data.token);
              console.log(decode.uid[0]);
              let data={id:decode.uid[0]._id,cartid:Uuid}
              openSnackbar(res.data.msg)
              ChangeUuid(data)
              .then(res=>{
                  if(res.data.err==0){
                    dispatch({type:'enable'})
                    let data={id:decode.uid[0]._id}
                                GETCARTCOUNT(data)
                                .then(res=>{
                                    console.log(res.data.count);
                                    dispatch({type:'cart',payload:res.data.count})
                                })
                                .catch(err=>{
                                    if(err){
                                        history('/ServerError')
                                    }
                                })
                    history("/");
                  }
               
            })
            .catch(err=>{
                if(err){
                    localStorage.clear()
                    history('/ServerError')
                }
            })
              
            } 
            else {
              console.log(res.data.msg);
              openSnackbar(res.data.msg)
            }
          })
        .catch(err=>{
            if(err){
                history('/ServerError')
            }
        })
    }
    return (
        <>
        
        <div className='container-fluid'>

            <Row className='paddingfooter marginlogin mt-5'>
                <Col lg={6} className='text-center'>
                
                <SocialButton
                    provider="facebook"
                    appId="2362435687224371"
                    onLoginSuccess={handleSocialLogin}
                    onLoginFailure={handleSocialLoginFailure}
                    className='SocialButton facebook text-white'
                    size="lg"
                >
                    <Facebook/> sign in with Facebook
                </SocialButton><br/>
                <SocialButton
                    provider="google"
                    appId="57326886237-e5s64g1s5givufhqfckv4ucj5iegp14f.apps.googleusercontent.com"
                    onLoginSuccess={handleSocialLogin}
                    onLoginFailure={handleSocialLoginFailure}
                    className='SocialButton google'
                    size="lg"
                >
                    <img src='Image/Google-Symbol.png' height='30px' width='45px'/> sign in with Google
                    </SocialButton>
                </Col>
                <Col lg={6} className='verticalline bg-light'>
                    <Form>
                        <FormLabel ><h3>Login To NeoSTORE</h3></FormLabel>
                        <InputGroup  className='p-2 mt-2 mb-2'>
                        <FormControl type='text' placeholder='Email Address' name='Email'  ref={Email} onBlur={handle} onFocus={setnull}/>
                        <InputGroup.Text><Phone/></InputGroup.Text>
                        </InputGroup>
                        <FormLabel style={{color:'red'}} >{Error.Erroremail}</FormLabel>
                        <InputGroup  className='p-2 mt-2 mb-2'>
                        <FormControl type='password' placeholder='Password ' name='Password' ref={Password} onBlur={handle} onFocus={setnull} />
                        
                        </InputGroup>
                        <FormLabel style={{color:'red'}} >{Error.ErrorPassword}</FormLabel>
                        <br/>
                        <Button className='p-2 mt-2 mb-2' onClick={checkuser} >Login</Button>
                    </Form>
                </Col>
                <Col lg={12} className='mt-3'>
                    <Row>
                        <Col lg={6} xs={6} sm={6} md={6} className='text-end'>
                            <Link to='/RegisterPage' className='nav-link'>Register Page</Link>
                        </Col>
                        <Col lg={6} xs={6} sm={6} md={6} className='verticalline'>
                            <Link to='/Forgotten' className='nav-link'>Forgotten?</Link>
                        </Col>
                    </Row>
                </Col>
            </Row>


        </div>
        </>
    )
}
