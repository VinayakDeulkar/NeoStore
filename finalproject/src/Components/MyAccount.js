import React, { useEffect, useState } from 'react'
import {Button, Card, Col, Form, Modal, Row} from 'react-bootstrap'
import { ArrowLeftRight, List, Newspaper, PersonBadge } from 'react-bootstrap-icons'
import { BrowserRouter as Router, Link, Outlet, Route,  Routes, useNavigate,   } from 'react-router-dom'
import { ProfilePicUpdate } from '../config/myService'
import jwt_decode from 'jwt-decode'
import { useDispatch } from 'react-redux'

export default function MyAccount() {
    const [Show, setShow] = useState(false)
    const [User, setUser] = useState('')
    const history=useNavigate()
    const dispatch=useDispatch()
    useEffect(() => {
        if(localStorage.getItem('_token')){
            let token=localStorage.getItem('_token')
            let decode=jwt_decode(token);
            console.log(decode.uid[0]);
            let data=decode.uid[0];
            setUser(data)
        }
    }, [localStorage.getItem('_token')])
    const showdata=()=>{
        setShow(true)
    }
    const updateImage=()=>{
        let data=new FormData();
        data.append('file',document.getElementById('profile').files[0])
        data.append('email',User.email)
        if(document.getElementById('profile').files[0]){
            ProfilePicUpdate(data)
            .then((res)=>{
                console.log(res.data);
                if(res.data.err==0){
                    localStorage.setItem('_token',res.data.token)
                    let decode=jwt_decode(res.data.token);
                    console.log(decode.uid[0]);
                    let data=decode.uid[0];
                    setUser(data)
                }
                else{
                 alert(res.data.msg)
                }
            })
            .catch(err=>{
                if(err.message!='Network Error'){
                    localStorage.clear()
                    dispatch({type:'disable'})
                    history('/LoginPage')
                }
                else{
                    history('/ServerError')
                }
            })
        }
        else{
            alert('select file')
        }
            
        setShow(false)
    }
    return (   
        <div className='container-fluid'>
            <Row>
                <Col lg={12}>
                    <h2>My Account</h2>
                    <hr/>
                    <Row>
                        <Col lg={4} className='text-center'>
                            <img src={`/Image/${User.profilepic}`} className='rounded-circle mb-3' alt='Upload profile page' height='200px' width='200px' />
                            <br/>
                            <h4>{User.firstname} {User.lastname}</h4>
                            <Button  onClick={showdata}>Upload Profile Picture</Button>
                            
                           <Link to='' className='nav-link text-dark'> <List/> Order</Link>
                           <Link to='Profile' className='nav-link text-dark' > <PersonBadge/> Profile</Link>
                           <Link to='Address' className='nav-link text-dark'> <Newspaper/> Address</Link>
                           {User.soical==false?<Link to='ChangePassword' className='nav-link text-dark'> <ArrowLeftRight/> Change Password</Link>:
                           <Link to='#' className='nav-link text-dark ' style={{opacity:0.5}} > <ArrowLeftRight/> Change Password</Link>
                           }
                        </Col>
                        <Col lg={8}>
                            <Card className='p-2'>
                                <Outlet/>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modal
            centered
            show={Show}
            onHide={() => setShow(false)}
            >
                    <Form className='m-3'>
                        <h3>Choose Image</h3>
                        <Form.Control type='file' name='myfile' id="profile" className='m-2'/>
                        <Button onClick={updateImage} className='m-2'>Change</Button>
                    </Form>
                            </Modal>
        </div>
    )
}
