import React, { useState } from 'react'
import { useEffect } from 'react';
import { Button, Col, Container, Card, Row, Dropdown } from 'react-bootstrap'
import { ArrowDown, ArrowUp, EmojiFrown, Coin, StarFill } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom';
import { ADDTOCART, FILTERPRODUCT, GETCARTCOUNT, GetCategory, GetColor, GetProduct, GETCART } from '../config/myService';
import ReactStarsRating from 'react-awesome-stars-rating'
import '../Css/Product.css'
import '../Css/ProductResponsive.css'
import ReactPaginate from 'react-paginate'
import { useDispatch, useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode'
import { useSnackbar } from 'react-simple-snackbar'
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
export default function Product() {
    const [ProductData, setProductData] = useState('')
    const [openSnackbar] = useSnackbar(options)
    const [Show, setShow] = useState(false)
    const [FilterProduct, setFilterProduct] = useState('')
    const [CartIDS, setCartIDS] = useState('');
    const [Category, setCategory] = useState('');
    const [Color, setColor] = useState('')
    const history = useNavigate()
    const [Selected, setSelected] = useState({ SelectedCategory: '', SelectedColor: '' })
    const [pagenumber, setpagenumber] = useState(0)
    const productsPerPage = 3;
    const pageVisited = pagenumber * productsPerPage
    const pageCount = Math.ceil(FilterProduct.length / productsPerPage)
    const searchItem = useSelector(state => state.searchReducer.searchitem)
    const Login = useSelector(state => state.loginReducer.Login)
    const uuid = useSelector(state => state.loginReducer.uuid)
    const dispatch = useDispatch()
    useEffect(() => {
        GetProduct()
            .then(res => {
                setFilterProduct(res.data.data)
                setProductData(res.data.data)
            })
            .catch(err => { if (err) { history('/ServerError') } })
        GetCategory()
            .then(res => {
                setCategory(res.data.data)
            })
            .catch(err => { if (err) { history('/ServerError') } })
        GetColor()
            .then(res => {
                setColor(res.data.data)
            })
            .catch(err => { if (err) { history('/ServerError') } })
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
    useEffect(() => {
        if (searchItem == '') {
            setFilterProduct(ProductData)
        }
        else {
            let data = ProductData.filter(product => {
                if (searchItem === '') {

                } else if (product.product_name.toLowerCase().includes(searchItem.toLowerCase())) {
                    return product;
                }
            })
            setFilterProduct(data)
        }
    }, [searchItem])

    const CategoryFilter = (element) => {
        let SelectedCategory = { category_name: element.category_name, color_name: Selected.SelectedColor }

        FILTERPRODUCT(SelectedCategory)
            .then(res => {
                setSelected({
                    ...Selected, SelectedCategory: element.category_name
                })
                setFilterProduct(res.data.data)
            })
            .catch(err => { if (err) { history('/ServerError') } })


    }
    const ColorFilter = (element) => {
        let SelectedColor = { category_name: Selected.SelectedCategory, color_name: element.color_name }

        FILTERPRODUCT(SelectedColor)
            .then(res => {
                setSelected({
                    ...Selected, SelectedColor: element.color_name
                })
                setFilterProduct(res.data.data)
            })
            .catch(err => { if (err) { history('/ServerError') } })
    }
    const showAll = () => {
        setFilterProduct(ProductData)
        setSelected({ SelectedColor: '', SelectedCategory: '' })
    }
    const SortByRating = () => {
        let Sorteddata = FilterProduct.sort((a, b) => {
            return b.product_rating - a.product_rating
        })
        setFilterProduct([...Sorteddata])

    }
    const SortPriceup = () => {
        let Sorteddata = FilterProduct.sort((a, b) => {
            return b.product_cost - a.product_cost
        })
        setFilterProduct([...Sorteddata])
    }
    const SortPriceDown = () => {
        let Sorteddata = FilterProduct.sort((a, b) => {
            return a.product_cost - b.product_cost
        })
        setFilterProduct([...Sorteddata])

    }
    const handlePageClicked = ({ selected }) => {
        setpagenumber(selected)
    }
    const DisplayProduct = (element) => {
        history('/ProductDetails', { state: element })
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
                            // dispatch({ type: 'cart', payload: count })
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
            <Container fluid>
                <Row className='mt-2'>
                    <Col lg={3} className='text-center   '>
                        <span variant='light' size="lg" onClick={showAll} className='bottom-border '>All Product</span>
                        {Category ?
                            <Dropdown className='filter'>
                                <Dropdown.Toggle variant="light" id="dropdown-basic" className='bottom-border '>
                                    Category
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {
                                        Category.map((ele) =>
                                            <Dropdown.Item key={ele._id} style={{ width: '100%' }} onClick={() => CategoryFilter(ele)}>{ele.category_name}</Dropdown.Item>
                                        )
                                    }
                                </Dropdown.Menu>
                            </Dropdown> : ''}
                        {Color ?
                            <Dropdown className='filter'>
                                <Dropdown.Toggle variant="light" id="dropdown-basic" className='bottom-border '>
                                    Color
                                </Dropdown.Toggle>

                                <Dropdown.Menu className='colormenu text-center'>
                                    {
                                        Color.map((ele) =>
                                            <Dropdown.Item key={ele._id} onClick={() => ColorFilter(ele)}><Button key={ele._id} size='lg' className='m-2 p-3 ' style={{ backgroundColor: ele.color_code }} onClick={() => ColorFilter(ele)}></Button></Dropdown.Item>
                                        )
                                    }
                                </Dropdown.Menu>
                            </Dropdown> : ''}

                    </Col>
                    <Col lg={9}>
                        <Row>
                            <Col lg={6} >
                                Filters: <i>{Selected.SelectedCategory}</i> <i>{Selected.SelectedColor} </i>
                            </Col>
                            <Col lg={6} className='text-end'>
                                <div className='me-4 sortfilter'>
                                    Sort By:
                                    <span className='m-2' onClick={SortByRating}><StarFill size='25px' /></span>
                                    <span className='m-2' onClick={SortPriceup}><Coin /><ArrowUp size='25px' /></span>
                                    <span className='m-2' onClick={SortPriceDown}><Coin /><ArrowDown size='25px' /></span>
                                </div>

                            </Col>


                            {
                                FilterProduct && FilterProduct.slice(pageVisited, pageVisited + productsPerPage).map((ele) =>
                                    <Col lg={4} md={6} key={ele._id} className='mt-2 mb-2 card-effect text-center'>
                                        <Card style={{ width: '300px' }} border='light' className='ms-4'  >
                                            <Card.Img variant="top" src={`/Image/${ele.product_image}`} height='298px' className='cardImage' onClick={() => DisplayProduct(ele)} />
                                            <Card.Body className='cardbody'>
                                                <Card.Title className='cardtext'>{ele.product_name}</Card.Title>
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
                            {FilterProduct && FilterProduct.length === 0 ? (<h3 className='text-center mt-2' style={{ height: '250px' }} > <EmojiFrown /> Sorry Product not Found</h3>) : ''}
                        </Row>
                    </Col>
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
