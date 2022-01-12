import React, { useEffect, useState, useRef } from 'react'
import jwt_decode from 'jwt-decode'
import { CONFIRMORDER, DELETECONFIRMEDORDER, GETCART, GETCARTCOUNT } from '../config/myService';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Nav, Row, Tab, Table, Card, Button, Form, Modal, FormGroup } from 'react-bootstrap'
import { X } from 'react-bootstrap-icons';
import { UserAddress, DELETEAddress, EDITADDRESS } from '../config/myService'
import '../Css/CheckOut.css'
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
export default function CheckOut() {
    const [openSnackbar] = useSnackbar(options)
    const [CartItems, setCartItems] = useState('')
    const [UserData, setUserData] = useState('')
    const dispatch = useDispatch()
    const [SelectedAddress, setSelectedAddress] = useState('')
    const history = useNavigate()
    const [Review, setReview] = useState({ Subtotal: 0, GST: 0, OrderTotal: 0 })
    const [Show, setShow] = useState('')
    const [EditShow, setEditShow] = useState(false)
    const [UpdateAddress, setUpdateAddress] = useState('')
    const [show, setshow] = useState(false)
    const Address = useRef('')
    const Pincode = useRef('')
    const City = useRef('')
    const State = useRef('')
    const Country = useRef('')
    useEffect(() => {
        let token = localStorage.getItem('_token')
        let decode = jwt_decode(token);
        console.log(decode.uid[0]);
        let data = decode.uid[0]._id;
        setUserData(decode.uid[0])
        let id = { id: data }
        GETCART(id)
            .then(res => {
                setCartItems(res.data.cartData)
                let Subtotal = 0;
                let GST = 0;
                let OrderTotal = 0;
                res.data.cartData.forEach(element => {
                    Subtotal = Subtotal + element.total_Productcost;
                });
                GST = (Subtotal * (5 / 100)) / 100;
                OrderTotal = Subtotal + GST;
                setReview({
                    ...Review, Subtotal: Subtotal, GST: GST, OrderTotal: OrderTotal
                })
            })
            .catch(err => {
                console.log(err.message);
                if (err.message != 'Network Error') {
                    localStorage.clear()
                    dispatch({ type: 'disable' })
                    openSnackbar('Session expired Login again please')
                    history('/LoginPage')
                }
                else {
                    history('/ServerError')
                }
            })
    }, [])
    const orderconfirm = async () => {
        console.log(SelectedAddress);
        if (SelectedAddress) {
            let data = { delivery_address: SelectedAddress, product_id: CartItems, total_Productcost: Review.OrderTotal, customer_id: UserData._id }
            console.log(data);
             CONFIRMORDER(data)
                .then((res) => {
                    if (res.data.err == 0) {
                        console.log(res.data.err);
                        let id1 = { id: UserData._id }
                        console.log(id1);
                        openSnackbar(res.data.msg)
                         DELETECONFIRMEDORDER(id1).then(res => {
                                console.log(res.data);
                                if (res.data.err == 0) {
                                    console.log(res.data);
                                    let id2 = { id: UserData._id }
                                    GETCARTCOUNT(id2)
                                        .then((res) => {
                                            console.log(res.data.count);
                                            let count = res.data.count
                                            dispatch({ type: 'cart', payload: count })
                                            handleShow()
                                        })
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                if (err.message != 'Network Error') {
                                    localStorage.clear()
                                    dispatch({type:'disable'})
                                    openSnackbar('Session expired Login again please')
                                    history('/LoginPage')
                                }
                                else {
                                    history('/ServerError')
                                }
                            })
                    }

                })
            .catch(err => {
                console.log(err);
                if (err.message != 'Network Error') {
                    openSnackbar('Session expired Login again please')
                    localStorage.clear()
                    dispatch({type:'disable'})
                    history('/LoginPage')
                }
                else {
                    history('/ServerError')
                }
            })
            

                
        }
        else {
            openSnackbar('Please select Address')
        }
    }
    const handleClose = () => {
        setshow(false)
        history('/Order')
    };
    const handleShow = () => setshow(true);
    const NewAddress = () => {
        setShow(true)
    }
    const AddAddress = () => {
        let data = { address: Address.current.value, PinCode: Pincode.current.value, City: City.current.value, State: State.current.value, Country: Country.current.value }
        let finalData = { email: UserData.email, ADDRESS: data }
        console.log(finalData);
        UserAddress(finalData)
            .then(res => {
                if (res.data.err == 1) { 
                    openSnackbar(res.data.msg)
                }
                else {
                    localStorage.setItem('_token', res.data.token)
                    let decode = jwt_decode(res.data.token);
                    let data = decode.uid[0];
                    setUserData(data)
                     openSnackbar(res.data.msg)
                }
            })
            .catch(err => {
                console.log(err.message);
                if (err.message != 'Network Error') {
                    localStorage.clear()
                    dispatch({ type: 'disable' })
                    dispatch({type:'cart',payload:0})
                    openSnackbar('Session expired Login again please')
                    history('/LoginPage')
                }
                else {
                    history('/ServerError')
                }
            })
        setShow(false)
    }
    const deleteAddress = (element) => {
        let data = { email: UserData.email, address_id: element }
        console.log(data);
        DELETEAddress(data)
            .then(res => {
                if (res.data.err == 1) {
                    openSnackbar(res.data.msg)
                }
                else {
                    localStorage.setItem('_token', res.data.token)
                    let decode = jwt_decode(res.data.token);
                    let data = decode.uid[0];
                    openSnackbar(res.data.msg)
                    setUserData(data)
                }
            })
            .catch(err => {
                if (err.message != 'Network Error') {
                    localStorage.clear()
                    dispatch({ type: 'disable' })
                    dispatch({type:'cart',payload:0})
                    openSnackbar('Session expired Login again please')
                    history('/LoginPage')
                }
                else {
                    history('/ServerError')
                }
            })
    }
    const Editstart = (element) => {
        console.log(element);
        setEditShow(true)
        setUpdateAddress(element)
    }
    const Updateaddress = () => {
        console.log(UpdateAddress);
        let data = { email: UserData.email, address: UpdateAddress }
        EDITADDRESS(data)
            .then(res => {
                if (res.data.err == 1) {
                    openSnackbar(res.data.msg)
                }
                else {
                    localStorage.setItem('_token', res.data.token)
                    let decode = jwt_decode(res.data.token);
                    let data = decode.uid[0];
                    setUserData(data)
                    setEditShow(false)
                    openSnackbar(res.data.msg)
                }
            })
            .catch(err => {
                if (err.message != 'Network Error') {
                    dispatch({ type: 'disable' })
                    dispatch({type:'cart',payload:0})
                    openSnackbar('Session expired Login again please')
                    history('/LoginPage')
                    localStorage.clear()
                }
                else {
                    history('/ServerError')
                }
            })
    }
    return (
        <div>
            <Container fluid>
                <Tab.Container id="left-tabs-example" defaultActiveKey="Order">
                    <Row>
                        <Col lg={3} className='text-center mt-2'>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link eventKey="Order" className='bottom-border'>Order</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="Address" className='bottom-border '>Address</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col lg={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="Order">
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Qauntity</th>
                                                <th>Price</th>
                                                <th>Total</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {CartItems && CartItems.map((element) =>
                                                <tr key={element._id}>
                                                    <td>
                                                        <table >
                                                            <tbody >
                                                                <tr>
                                                                    <td>
                                                                        <img src={`/Image/${element.product_id.product_image}`} className='imagesize' />
                                                                    </td>
                                                                    <td>
                                                                        <span className='productname'>{element.product_id.product_name}</span> <br />
                                                                        <span className='margincheck'>Status :<span className='stock '>In Stock</span></span>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                    <td>
                                                        <span > {element.quantity}</span>
                                                    </td>
                                                    <td >
                                                        {element.product_cost}
                                                    </td>
                                                    <td>
                                                        {element.total_Productcost}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                    <Card className='review'>
                                        <Card.Header>
                                            <h3> Review Order</h3>
                                        </Card.Header>
                                        <Card.Body>
                                            <Table>
                                                <tr>
                                                    <td height='50px'>Subtotal</td>
                                                    <td className='text-end'> {Review.Subtotal} </td>
                                                </tr>
                                                <tr>
                                                    <td height='50px'>GST (5%)</td>
                                                    <td className='text-end'> {Review.GST} </td>
                                                </tr>
                                                <tr>
                                                    <td height='50px'>OrderTotal</td>
                                                    <td className='text-end'> {Review.OrderTotal} </td>
                                                </tr>
                                            </Table>
                                        </Card.Body>

                                    </Card>
                                </Tab.Pane>
                                <Tab.Pane eventKey="Address">
                                    <div className='addresstab'>

                                        <h3>Shipping Address</h3>
                                        <hr />
                                        <Form>{
                                            UserData.Address && UserData.Address.map((ele) =>
                                                <Form.Check
                                                    type='radio'
                                                    name='address'
                                                    key={ele._id}
                                                    onChange={() => setSelectedAddress(ele)}
                                                    id={ele}
                                                    className='mt-3 mb-3'
                                                    label={
                                                        <Card className='p-3 addresssec'  >
                                                            <Row>
                                                                <Col lg={10}>
                                                                    {ele.address}<br />
                                                                    {ele.City}-{ele.PinCode}<br />
                                                                    {ele.State},{ele.Country}<br />
                                                                    <Button onClick={() => Editstart(ele)}>Edit</Button>
                                                                </Col>
                                                                <Col lg={2} className='float-end'>
                                                                    <Button variant='danger' onClick={() => deleteAddress(ele.Address_id)}><X /></Button>
                                                                </Col>
                                                            </Row>
                                                        </Card>
                                                    } />
                                            )}
                                        </Form>
                                        <Button variant='outline-dark' onClick={NewAddress} className='buttonmargin'>Add Address</Button>

                                    </div>
                                    <div className='text-center m-3'>
                                        <Button onClick={orderconfirm} >Confirm Order</Button>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
                <Modal centered
                    show={Show}
                    onHide={() => setShow(false)}>

                    <Form className='m-5'>
                        <h3>Add new Address</h3><hr />
                        <FormGroup className='m-2'>
                            <Form.Control as='textarea' name='address' ref={Address} placeholder='Address' />
                            <Form.Text className="text-muted">
                                Max 100 characters
                            </Form.Text>
                        </FormGroup>
                        <FormGroup className='m-2'>
                            <Form.Control type='text' name='pincode' ref={Pincode} placeholder='pincode' />
                        </FormGroup>
                        <FormGroup className='m-2'>
                            <Form.Control type='text' name='city' ref={City} placeholder='City' />
                        </FormGroup >
                        <FormGroup className='m-2'>
                            <Form.Control type='text' name='state' ref={State} placeholder='State' />
                        </FormGroup>
                        <FormGroup className='m-2'>
                            <Form.Control type='text' name='country' ref={Country} placeholder='Country' />
                        </FormGroup>
                        <Button variant="outline-dark" onClick={AddAddress}>Add Address</Button>
                    </Form>
                </Modal>
                <Modal centered
                    show={EditShow}
                    onHide={() => setEditShow(false)}>

                    <Form className='m-5'>
                        <h3>Edit Address</h3><hr />
                        <FormGroup className='m-2'>
                            <Form.Control as='textarea' name='address' value={UpdateAddress.address} onChange={(e) => setUpdateAddress({ ...UpdateAddress, address: e.target.value })} placeholder='Address' />
                            <Form.Text className="text-muted">
                                Max 100 characters
                            </Form.Text>
                        </FormGroup>
                        <FormGroup className='m-2'>
                            <Form.Control type='text' name='pincode' value={UpdateAddress.PinCode} onChange={(e) => setUpdateAddress({ ...UpdateAddress, PinCode: e.target.value })} placeholder='pincode' />
                        </FormGroup>
                        <FormGroup className='m-2'>
                            <Form.Control type='text' name='city' value={UpdateAddress.City} onChange={(e) => setUpdateAddress({ ...UpdateAddress, City: e.target.value })} placeholder='City' />
                        </FormGroup >
                        <FormGroup className='m-2'>
                            <Form.Control type='text' name='state' value={UpdateAddress.State} onChange={(e) => setUpdateAddress({ ...UpdateAddress, State: e.target.value })} placeholder='State' />
                        </FormGroup>
                        <FormGroup className='m-2'>
                            <Form.Control type='text' name='country' value={UpdateAddress.Country} onChange={(e) => setUpdateAddress({ ...UpdateAddress, Country: e.target.value })} placeholder='Country' />
                        </FormGroup>
                        <Button onClick={Updateaddress}>Edit Address</Button>
                    </Form>
                </Modal>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Order Confirmed</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='text-center'>
                        <img src='/Image/orderconfirmed.gif' height='200px' width='200px' />
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    )
}
