import React, { useEffect, useState } from 'react'
import { Card, Carousel, Row, Col, Container, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { GetPopularProduct, GETCART } from '../config/myService'
import '../Css/Dashborad.css'
import '../Css/DashBoradResponsive.css'
import ReactStarsRating from 'react-awesome-stars-rating'
import ReactPaginate from 'react-paginate'
import { useDispatch, useSelector } from 'react-redux'
import jwt_decode from 'jwt-decode'
import { ADDTOCART, GETCARTCOUNT } from '../config/myService'
import { cartActions } from '../State/actions/cartActions'
import { useSnackbar } from 'react-simple-snackbar'
const options = {
    position: 'top-center',
    style: {
        fontSize: '20px',
        textAlign: 'center',
        color: 'white',
    },
    closeStyle: {
        color: 'lightcoral',
        fontSize: '16px',
    },
}
export default function Dashborad() {
    const [ProductData, setProductData] = useState('')
    const [CartIDS, setCartIDS] = useState('');
    const [Show, setShow] = useState(false);
    const history = useNavigate()
    const dispatch = useDispatch()
    const Login = useSelector(state => state.loginReducer.Login)
    const uuid = useSelector(state => state.loginReducer.uuid)
    const [pagenumber, setpagenumber] = useState(0)
    const [openSnackbar] = useSnackbar(options)
    const productsPerPage = 4;
    const pageVisited = pagenumber * productsPerPage
    const pageCount = Math.ceil(ProductData.length / productsPerPage)
    useEffect(() => {
        GetPopularProduct()
            .then(res => {
                setProductData(res.data.data)
            })
            .catch(err => {
                if (err) {
                    history('/ServerError')
                }
            })
        if (Login) {
            let token = localStorage.getItem('_token')
            let decode = jwt_decode(token);
            let data = decode.uid[0]._id;
            let id = { id: data }
            GETCART(id)
                .then(res => {
                    let arr = []
                    res.data.cartData.map((ele) =>
                        arr.push(ele.product_id._id)
                    )
                    setCartIDS(arr)
                })
                .catch(err => {
                    if (err) {
                        history('/ServerError')
                    }
                })
        }
        else {
            let id = { id: uuid }
            GETCART(id)
                .then(res => {
                    let arr = []
                    res.data.cartData.map((ele) =>
                        arr.push(ele.product_id._id)
                    )
                    setCartIDS(arr)
                })
                .catch(err => {
                    if (err) {
                        history('/ServerError')
                    }
                })
        }
    }, [Show])

    const DisplayProduct = (element) => {
        history('/ProductDetails', { state: element })
    }
    const handlePageClicked = ({ selected }) => {
        setpagenumber(selected)
    }
    const AddToCart = (element) => {
        if (Login) {
            let token = localStorage.getItem('_token')
            let decode = jwt_decode(token);
            let data = { customer_id: decode.uid[0]._id, product_id: element._id, product_cost: element.product_cost }
            ADDTOCART(data)
                .then(res => {
                    let data = { id: decode.uid[0]._id }
                    openSnackbar(res.data.msg)
                    GETCARTCOUNT(data)
                        .then(res => {
                            dispatch(cartActions(res.data.count))
                            // dispatch({ type: 'cart', payload: res.data.count })
                            setShow(true)
                        })
                        .catch(err => {
                            if (err) {
                                history('/ServerError')
                            }
                        })
                })
                .catch(err => {
                    if (err) {
                        history('/ServerError')
                    }
                })
            setShow(false)
        }
        else {
            let data = { customer_id: uuid, product_id: element._id, product_cost: element.product_cost }
            ADDTOCART(data)
                .then(res => {
                    let data = { id: uuid }
                    openSnackbar(res.data.msg)
                    GETCARTCOUNT(data)
                        .then(res => {
                            dispatch(cartActions(res.data.count))
                            // dispatch({ type: 'cart', payload: res.data.count })
                            setShow(true)
                        })
                        .catch(err => {
                            if (err) {
                                history('/ServerError')
                            }
                        })
                })
                .catch(err => {
                    if (err) {
                        history('/ServerError')
                    }
                })
            setShow(false)
        }
    }
    return (
        <div className='allpadding'>
            <Carousel className='mt-3 mb-3'>
                <Carousel.Item>
                    <img
                        className="d-block w-100 BannerImage"
                        src="/Image/Banner1.jpg"
                        alt="First slide"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 BannerImage"
                        src="/Image/Banner2.jpg"
                        alt="Second slide"
                    />

                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 BannerImage"
                        src="/Image/Banner3.jpg"
                        alt="Third slide"
                    />

                </Carousel.Item>
            </Carousel>
            <Container fluid>
                <Row>
                    <h3 className='text-center'>Popular Product</h3>
                    {
                        ProductData && ProductData.slice(pageVisited, pageVisited + productsPerPage).map((ele) =>
                            <Col lg={3} md={6} sm={12} xs={12} key={ele._id}>
                                <Card className='cardSIze' border='light'  >
                                    <Card.Img variant="top" src={`/Image/${ele.product_image}`} className='CardImage' onClick={() => DisplayProduct(ele)} />
                                    <Card.Body className='Cardsize'>
                                        <Card.Title className='text-center' > <span className='cardtext'> {ele.product_name}</span></Card.Title>
                                        <Card.Text className='text-center'>
                                            <b>Rs.{ele.product_cost}</b><br />

                                            {CartIDS && CartIDS.includes(ele._id) ?
                                                <Button disabled >Added</Button> :
                                                <Button onClick={() => AddToCart(ele)} >Add to Cart</Button>
                                            }
                                            {/* <Button onClick={() => AddToCart(ele)} >Add to Cart</Button> */}
                                            <br />
                                            <ReactStarsRating value={parseFloat(ele.product_rating)} isEdit={false} isHalf={true} className='mt-2' />

                                        </Card.Text>

                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    }
                    <ReactPaginate
                        previousLabel={"<<"}
                        nextLabel={">>"}
                        pageCount={pageCount}
                        onPageChange={handlePageClicked}
                        containerClassName={'pagination justify-content-center'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                        previousClassName={'page-item'}
                        previousLinkClassName={'page-link'}
                        nextClassName={'page-item'}
                        nextLinkClassName={'page-link'}
                        activeClassName={'active'}

                    />
                </Row>
            </Container>
        </div>
    )
}
