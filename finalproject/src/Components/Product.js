import React,{useState} from 'react'
import { useEffect } from 'react';
import { Button, Col, Container, Card, Row } from 'react-bootstrap'
import {   ArrowDown, ArrowUp, CaretDownFill, CaretRightFill, Coin, Filter, StarFill } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom';
import { ADDTOCART, FILTERPRODUCT, GETCARTCOUNT, GetCategory, GetColor, GetProduct } from '../config/myService';
import ReactStarsRating  from 'react-awesome-stars-rating'
import '../Css/Product.css'
import ReactPaginate from 'react-paginate'
import { useDispatch, useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode'
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
export default function Product() {
    const [ProductData, setProductData] = useState('')
    const [openSnackbar] = useSnackbar(options)
    const [ShowCategory, setShowCategory] = useState(false);
    const [ShowColor, setShowColor] = useState(false)
    const [FilterProduct, setFilterProduct] = useState('')
    const [Category, setCategory] = useState('');
    const [Color, setColor] = useState('')  
    const history=useNavigate()
    const [Selected, setSelected] = useState({SelectedCategory:'',SelectedColor:''})
    const [pagenumber, setpagenumber] = useState(0)
    const productsPerPage = 3;
    const pageVisited = pagenumber * productsPerPage
    const pageCount = Math.ceil(FilterProduct.length / productsPerPage)
    const searchItem = useSelector(state => state.searchitem)
    const Login = useSelector(state => state.Login)
    const uuid = useSelector(state => state.uuid)
    const dispatch = useDispatch()
    useEffect(() => {
        GetProduct()
        .then(res=>{
            setFilterProduct(res.data.data)
            setProductData(res.data.data)
        })
        .catch(err=>{if(err){history('/ServerError')}})
        GetCategory()
        .then(res=>{
            setCategory(res.data.data)
        })
        .catch(err=>{if(err){history('/ServerError')}})
        GetColor()
        .then(res=>{
            setColor(res.data.data)
        })
        .catch(err=>{if(err){history('/ServerError')}})

    }, [])
    useEffect(() => {
        if(searchItem==''){
        setFilterProduct(ProductData)
    }
    else{
        let data=ProductData.filter(product => {
            if (searchItem === '') {
             
            } else if (product.product_name.toLowerCase().includes(searchItem.toLowerCase())) {
              return product;
            }
          })
          setFilterProduct(data)
    }
    }, [searchItem])
    
    const categoryButton=()=>{
        if(ShowCategory){
            setShowCategory(false)
        }
        else{
            setShowCategory(true)
        }
    }
    const colorButton=()=>{
        if(ShowColor){
            setShowColor(false)
        }
        else{
            setShowColor(true)
        }
    }
    const CategoryFilter=(element)=>{
        let SelectedCategory={category_name:element.category_name,color_name:Selected.SelectedColor}
        
        FILTERPRODUCT(SelectedCategory)
        .then(res=>{
            setSelected({
                ...Selected,SelectedCategory:element.category_name
            })
            setFilterProduct(res.data.data)
        })
        .catch(err=>{if(err){history('/ServerError')}})
    

    }
    const ColorFilter=(element)=>{
        let SelectedColor={category_name:Selected.SelectedCategory,color_name:element.color_name}
        
        FILTERPRODUCT(SelectedColor)
        .then(res=>{
            setSelected({
                ...Selected,SelectedColor:element.color_name
            })
            setFilterProduct(res.data.data)
        })
        .catch(err=>{if(err){history('/ServerError')}})
    }
    const showAll=()=>{
        setFilterProduct(ProductData)
        setSelected({SelectedColor:'',SelectedCategory:''})
    }
    const SortByRating=()=>{
        console.log('working on sort');
        let Sorteddata=FilterProduct.sort((a,b)=>{
            return b.product_rating-a.product_rating
        })
        setFilterProduct([...Sorteddata])
        
    }
    const SortPriceup=()=>{
        console.log('working on price sort');
        let Sorteddata=FilterProduct.sort((a,b)=>{
            return b.product_cost-a.product_cost
        })
        setFilterProduct([...Sorteddata])
    }
    const SortPriceDown=()=>{
        let Sorteddata=FilterProduct.sort((a,b)=>{
            return a.product_cost-b.product_cost
       })
       setFilterProduct([...Sorteddata])
        
    }
    const handlePageClicked=({selected})=>{
        setpagenumber(selected)
    }
    const DisplayProduct=(element)=>{
        history('/ProductDetails',{state:element})
    }
    const AddToCart=(element)=>{
        if(Login){
            console.log('inside login');
            let token=localStorage.getItem('_token')
            let decode=jwt_decode(token);
            console.log(decode.uid[0]);
            let data={customer_id:decode.uid[0]._id,product_id:element._id,product_cost:element.product_cost}
            ADDTOCART(data)
            .then(res=>{
                console.log(res.data.msg);
                let data={id:decode.uid[0]._id}
                console.log(data);
                openSnackbar(res.data.msg)
                GETCARTCOUNT(data)
                .then(res=>{
                    console.log(res.data.count);
                    let count=res.data.count
                    dispatch({type:'cart',payload:count})
                })
                .catch(err=>{
                    if(err){
                        history('/ServerError')
                    }
                })
            })
            .catch(err=>{
                if(err){
                    history('/ServerError')
                }
            })
        }
        else{
            console.log('Inside not login');
            console.log(uuid);
            let data={customer_id:uuid,product_id:element._id,product_cost:element.product_cost}
            console.log(data);
            ADDTOCART(data)
            .then(res=>{
                console.log(res.data.msg);
                let data={id:uuid}
                openSnackbar(res.data.msg)
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
            })
            .catch(err=>{
                if(err){
                    history('/ServerError')
                }
            })
        }
    }
    return (
        <div>
            <Container fluid>
                <Row className='mt-2'>
                    <Col lg={3} className='text-center   '>
                        <p variant='light' size='lg'  onClick={showAll} className='bottom-border'>All Product</p>
                        <p variant='light' onClick={categoryButton}  className='bottom-border ' >{ShowCategory?<CaretDownFill/>:<CaretRightFill/>}Category</p>
                        {ShowCategory?
                        <span>{Category.map((ele)=>
                            <p variant='light' key={ele._id} style={{width:'100%'}} onClick={()=>CategoryFilter(ele)} >{ele.category_name}</p>
                        )}</span>
                        :''}<br/>
                        <p variant='light' onClick={colorButton} size='lg'  className='bottom-border '> {ShowColor?<CaretDownFill/>:<CaretRightFill/>}Color</p>
                        {ShowColor?
                        <span>{Color.map((ele)=>
                            <Button style={{backgroundColor:ele.color_code}} key={ele._id} size='lg' className='m-2 p-3' onClick={()=>ColorFilter(ele)}></Button>
                        )}</span>
                        :''}<br/>
                    </Col>
                    <Col lg={9}>
                    <Row>
                    <Col lg={6} >
                        Filters: <i>{Selected.SelectedCategory}</i> <i>{Selected.SelectedColor} </i>
                        </Col>
                        <Col lg={6} className='text-end'>
                            <div className='me-4 sortfilter'>
                            Sort By:
                            <span className='m-2' onClick={SortByRating}><StarFill size='25px'/></span>
                            <span className='m-2' onClick={SortPriceup}><Coin/><ArrowUp size='25px'/></span>
                            <span className='m-2' onClick={SortPriceDown}><Coin/><ArrowDown size='25px'/></span>
                            </div>

                        </Col>

                        
                    {
                            FilterProduct && FilterProduct.slice(pageVisited, pageVisited + productsPerPage).map((ele)=>
                            <Col lg={4} md={6} key={ele._id} className='mt-2 mb-2 card-effect text-center'>
                            <Card style={{ width: '300px'}} border='light' className='ms-4'  >
                            <Card.Img variant="top" src={`/Image/${ele.product_image}`} height='298px' onClick={()=>DisplayProduct(ele)} />
                            <Card.Body>
                                <Card.Title className='cardtext'>{ele.product_name}</Card.Title>
                                <Card.Text className='text-center'>
                                <b>Rs.{ele.product_cost}</b><br/>
                                
                                <Button onClick={()=>AddToCart(ele)} >Add to Cart</Button>
                                <br/>
                                <ReactStarsRating value={parseFloat(ele.product_rating)} isEdit={false} isHalf={true} className='mt-2'/>
                                </Card.Text>
                                
                            </Card.Body>
                            </Card>
                            </Col>
                            )
                        }
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
