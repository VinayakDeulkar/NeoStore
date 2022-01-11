import React, { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'
import { GETORDER } from '../config/myService'
import { Button, Container, Table } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import '../Css/Order.css'
export default function Order() {
    const [Order, setOrder] = useState('')
    const dispatch = useDispatch()
    const history = useNavigate()
    useEffect(() => {
        let token = localStorage.getItem('_token')
        let decode = jwt_decode(token);
        console.log(decode.uid[0]);
        let data = decode.uid[0]._id;
        let id = { id: data }
        GETORDER(id)
            .then(res => {
                console.log(res.data);
                setOrder(res.data.order)
            })
            .catch(err => {
                console.log(err.message);
                if (err.message != 'Network Error') {
                    localStorage.clear()
                    dispatch({ type: 'disable' })
                    history('/LoginPage')
                }
                else {
                    history('/ServerError')
                }
            })
    }, [])
    const OpenPdf=(ele)=>{
        history('/Pdf',{state:ele})
    }
    return (
        <div>
            <Container fluid>

                <Table>
                    <thead>
                        <tr>
                            <td>
                                Product
                            </td>
                            <td>
                                Delivery Address
                            </td>
                            <td>
                                Delivery Status
                            </td>
                            <td>
                                Total Amount
                            </td>
                            <td>
                                Product book date
                            </td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {Order && Order.map((ele)=>
                        <tr key={ele._id}>
                            <td width='350px'>
                            {ele.product_id.map((element)=>
                                <span key={element._id}>
                                    <img src={`/Image/${element.product_id.product_image}`} className='orderimg m-1'/>
                                </span>
                            )}
                            </td>
                            <td>
                                <p>{ele.delivery_address.address}</p>
                                <p>{ele.delivery_address.City}-{ele.delivery_address.PinCode}</p>
                                <p>{ele.delivery_address.State},{ele.delivery_address.Country}</p>
                            </td>
                            <td>{ ele.isDelivered?<span style={{color:'Green'}}>True</span>:<span style={{color:'red'}}>False</span>}</td>
                            <td>
                               Rs. {ele.total_Productcost}
                            </td>
                            <td>{ele.order_date}</td>
                            <td>
                                <Button onClick={()=>OpenPdf(ele)} >Open Pdf</Button>
                            </td>
                        </tr>
                        )}
                    </tbody>
                </Table>
            </Container>
        </div>
    )
}
