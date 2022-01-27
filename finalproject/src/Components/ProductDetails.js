import React, { useState, useEffect } from 'react'
import { Button, Col, Container, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom'
import '../Css/ProductDetails.css'
import ReactStarsRating from 'react-awesome-stars-rating'
import { ShareFill } from 'react-bootstrap-icons'
import { FacebookIcon, FacebookShareButton, WhatsappShareButton, WhatsappIcon, TwitterShareButton, TwitterIcon, PinterestShareButton, PinterestIcon, RedditShareButton, RedditIcon, } from 'react-share'
import { SETRATING } from '../config/myService';
import { useDispatch, useSelector } from 'react-redux';
import ReactImageMagnify from 'react-image-magnify'
import jwt_decode from 'jwt-decode'
import { ADDTOCART, GETCARTCOUNT } from '../config/myService';
import { useSnackbar } from 'react-simple-snackbar'
import { loginDisable } from '../State/actions/loginAction';
import { cartActions } from '../State/actions/cartActions'
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
// import {SideBySideMagnifier} from 'react-image-magnifiers'
// import ReactImageZoom from 'react-image-zoom'
function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}
export default function ProductDetails() {
    const location = useLocation()
    const history = useNavigate()
    const [MainImage, setMainImage] = useState('')
    const [openSnackbar] = useSnackbar(options)
    const [ShowRating, setShowRating] = useState(false)
    const dispatch = useDispatch()
    const [key, setkey] = useState('desc')
    const Login = useSelector(state => state.Login)
    const uuid = useSelector(state => state.uuid)
    const [ProductRATING, setProductRATING] = useState(location.state.product_rating)
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [ImageDimension, setImageDimension] = useState({ imageHeight: 0, imageWidth: 0 })
    useEffect(() => {
        setMainImage(location.state.product_image)
        checkScreen()
        setWindowDimensions(getWindowDimensions());
    }, [])
    const checkScreen = () => {
        if (windowDimensions.width == 360) {
            console.log('inside 360');
            setImageDimension({
                imageHeight: 330, imageWidth: 330
            })
        }
        else if (windowDimensions.width == 411) {
            setImageDimension({
                imageHeight: 380, imageWidth: 380
            })
        }
        else if (windowDimensions.width == 320) {
            setImageDimension({
                imageHeight: 295, imageWidth: 295
            })
        }
        else if (windowDimensions.width == 375) {
            setImageDimension({
                imageHeight: 350, imageWidth: 350
            })
        }
        else if (windowDimensions.width == 414) {
            setImageDimension({
                imageHeight: 390, imageWidth: 390
            })
        }
        else if (windowDimensions.width == 280) {
            setImageDimension({
                imageHeight: 250, imageWidth: 255
            })
        }
        else if (windowDimensions.width == 1280) {
            setImageDimension({
                imageHeight: 450, imageWidth: 450
            })
        }
        else if (windowDimensions.width == 1024) {
            setImageDimension({
                imageHeight: 450, imageWidth: 450
            })
        }
        else if (windowDimensions.width == 1440) {
            setImageDimension({
                imageHeight: 450, imageWidth: 450
            })
        }

        else if (windowDimensions.width == 412) {
            console.log(windowDimensions.width);
            setImageDimension({
                imageHeight: 380, imageWidth: 390
            })
        }
        else if (windowDimensions.width == 390) {
            setImageDimension({
                imageHeight: 380, imageWidth: 360
            })
        }
        else {
            setImageDimension({
                imageHeight: 450, imageWidth: 450
            })
        }
    }
    const setImage = (ele) => {
        setMainImage(ele)
    }
    const Cut = () => {
        history('/Product')
    }
    const Rating = (value) => {
        console.log(value);

        let finalRating = ((parseFloat(value) + parseFloat(location.state.product_rating)) / 2);
        console.log(finalRating);
        let data = { product_id: location.state._id, product_rating: finalRating }
        console.log(data);
        SETRATING(data)
            .then(res => {
                if (res.data.err == 1) {
                    console.log(res.data.msg);
                    openSnackbar(res.data.msg)
                }
                else {
                    openSnackbar(res.data.msg)
                    setProductRATING(finalRating)
                    setShowRating(false)
                }
            })
            .catch(err => {
                if (err.message != 'Network Error') {
                    localStorage.clear()
                    openSnackbar('Session expired Login again please')
                    dispatch(loginDisable(''))
                    // dispatch({ type: 'disable' })
                    history('/LoginPage')
                }
                else {
                    history('/ServerError')
                }
            })
    }
    const ProductRating = () => {
        if (localStorage.getItem('_token')) {
            setShowRating(true)
        }
        else {
            history('/LoginPage')
        }
    }
    const AddToCart = (element) => {
        if (Login) {
            console.log('inside login');
            let token = localStorage.getItem('_token')
            let decode = jwt_decode(token);
            console.log(decode.uid[0]);
            let data = { customer_id: decode.uid[0]._id, product_id: element._id, product_cost: element.product_cost }
            ADDTOCART(data)
                .then(res => {
                    console.log(res.data.msg);
                    let data = { id: decode.uid[0]._id }
                    openSnackbar(res.data.msg)
                    GETCARTCOUNT(data)
                        .then(res => {
                            console.log(res.data.count);
                            dispatch(cartActions(res.data.count))
                            // dispatch({ type: 'cart', payload: res.data.count })
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
        }
        else {
            console.log('Inside not login');
            console.log(uuid);
            let data = { customer_id: uuid, product_id: element._id, product_cost: element.product_cost }
            console.log(data);
            ADDTOCART(data)
                .then(res => {
                    console.log(res.data.msg);
                    let data = { id: uuid }
                    openSnackbar(res.data.msg)
                    GETCARTCOUNT(data)
                        .then(res => {
                            console.log(res.data.count);
                            dispatch(cartActions(res.data.count))
                            // dispatch({ type: 'cart', payload: res.data.count })
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
        }
    }
    return (
        <div className='allpadding'>
            <Container >
                <Row>
                    <Col lg={12} className='text-end'>
                        <Button variant='dark' className='crossbutton mt-2' onClick={Cut} style={{ borderRadius: '50%' }} >X</Button>
                    </Col>
                    <Col lg={6} >
                        <ReactImageMagnify {...{
                            smallImage: {
                                alt: 'Wristwatch by Ted Baker London',
                                // isFluidWidth: false,
                                width: parseInt(ImageDimension.imageWidth),
                                height: parseInt(ImageDimension.imageHeight),
                                src: `/Image/${MainImage}`,
                                // sizes:"(min-width: 360px)330vw"
                            },
                            largeImage: {
                                src: `/Image/${MainImage}`,
                                width: 1200,
                                height: 1800
                            }
                        }} />
                        {/* <img src={`/Image/${MainImage}`}  className='MainImage' /> */}
                        <div>
                            <img src={`/Image/${location.state.product_image}`} className='navimage' onMouseOver={() => setImage(location.state.product_image)} onClick={() => setImage(location.state.product_image)} />
                            {location.state.product_subImages.map((ele, index) =>
                                <span key={index}>
                                    <img src={`/Image/${ele}`} className='navimage' onMouseOver={() => setImage(ele)} onClick={() => setImage(ele)} />
                                </span>
                            )
                            }
                        </div>
                    </Col>
                    <Col lg={6}>
                        <h3 className='mt-5'>{location.state.product_name}</h3>

                        <ReactStarsRating value={parseFloat(ProductRATING)} isEdit={false} isHalf={true} className='mt-2' />
                        <p>Price: Rs. {location.state.product_cost}</p>
                        <p>Color: <span className='ms-3 ps-4 pe-4 pt-2 pb-2 box' style={{ backgroundColor: location.state.color_id.color_code }} ></span> </p>
                        <p>Share <ShareFill /> </p>
                        <p>
                            <span>
                                <FacebookShareButton className=' m-2' ><FacebookIcon className='social' /></FacebookShareButton>
                                <WhatsappShareButton className=' m-2' ><WhatsappIcon className='social' /></WhatsappShareButton>
                                <PinterestShareButton className='m-2'><PinterestIcon className='social' /></PinterestShareButton>
                                <TwitterShareButton className=' m-2' ><TwitterIcon className='social' /></TwitterShareButton>
                                <RedditShareButton className='m-2'><RedditIcon className='social' /></RedditShareButton>
                            </span>
                        </p>
                        <p>
                            <Button className=' m-2 ' onClick={() => AddToCart(location.state)}>ADD TO CART</Button>
                            <Button variant='danger' className='m-2' onClick={ProductRating} >RATE PRODUCT</Button>
                        </p>

                    </Col>
                    <Col lg={12}>
                        <Tabs id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k) => setkey(k)}
                            className="mb-3">
                            <Tab eventKey="desc" title="Description">
                                {location.state.product_desc}
                            </Tab>
                            <Tab eventKey="feature" title="Features">
                                <ul>
                                    <li>Dimensions:{location.state.product_dimension}</li>
                                    <li>Material:{location.state.product_material}</li>
                                    <li>cost:{location.state.product_cost}</li>
                                </ul>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
                <Modal show={ShowRating} onHide={() => setShowRating(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Please Rate :{location.state.product_name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ReactStarsRating onChange={Rating} value={parseFloat(ProductRATING)} />
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    )
}
