import React, { Fragment, useEffect, useState } from 'react'
import "./Products.css"
import { useSelector,useDispatch } from 'react-redux'
import { clearErrors,getProducts } from '../../actions/productAction'
import Loader from '../layout/Loader/Loader'
import ProductCard from '../Home/ProductCard'
import { useParams } from 'react-router-dom'
import Pagination from "react-js-pagination"
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import {useAlert} from "react-alert"
import MetaData from '../layout/MetaData'
const categories = [
  "All",
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
  "Mobile",

];

const Products = () => {

  const [currentPage,setCurrentPage] = useState(1)
  const [price , setPrice] = useState([0,125000])
  const [category, setCategory] = useState("");
  const [ratings,setRatings]=useState(0)

  const params = useParams()

  const dispatch = useDispatch();
  const alert = useAlert()

  const { loading, error, products ,productCounts,resultPerPage , filteredProductCounts } = useSelector((store) => store.products)
 
  const keyword = params.keyword


  const setCurrentPageNo = (e) => {
    setCurrentPage(e)
  }

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice)
  }

 

 useEffect(()=>{
  if(error){
    alert.error(error)
    dispatch(clearErrors())
  }
    dispatch(getProducts(keyword,currentPage,price,category,ratings))
 },[dispatch,keyword,currentPage,price,category,ratings,error,alert])


 let count =  filteredProductCounts

 
  return (
    <Fragment>
      {
        loading ? 
        (
          <Loader />  
        ):
        (
          <Fragment>

            <MetaData title="PRODUCTS -- ECOMMERCE" />

            <h2 className="productsHeading">Products</h2>
            <div className="products">
              {
              products &&
                products.map((product) => (
                  <ProductCard key={product?._id} product={product} />
                ))
              }
            </div>

            <div className="filterBox">
                <Typography>Price</Typography>
                <Slider
                    value={price}
                    onChange={priceHandler}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    min={0}
                    max={125000}
                />

                <Typography>Categories</Typography>
                <ul className="categoryBox">
                  {
                    categories.map((category) => (
                      <li
                        className="category-link"
                        key={category}
                        onClick={() => setCategory(category)}
                      >
                      {category}
                      </li>
                  ))}
                </ul>


                <fieldset>
                  <Typography component="legend">Ratings Above</Typography>
                  <Slider 
                  value={ratings}
                  onChange={(e,newRating)=>setRatings(newRating)}
                  aria-labelledby="continuous-slider" 
                  min={0}
                  max={5}
                  valueLabelDisplay="auto"
                  />
                </fieldset>
            </div>


            {
              resultPerPage < count && (
             <div className="paginationBox">
                  <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resultPerPage}
                    totalItemsCount={productCounts}
                    onChange={setCurrentPageNo}
                    nextPageText="Next"
                    prevPageText="Prev"
                    firstPageText="1st"
                    lastPageText="Last"
                    itemClass="page-item"
                    linkClass="page-link"
                    activeClass="pageItemActive"
                    activeLinkClass="pageLinkActive"
                  />
             </div>
              )
            }
          </Fragment>
        )
      }
    </Fragment>
  )
}

export default Products