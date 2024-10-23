import React, { Fragment, useEffect, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { clearErrors,updateProduct, getProductDetails } from '../../actions/productAction'
import { useAlert } from 'react-alert'
import { Button } from '@mui/material'
import MetaData from '../layout/MetaData'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import DescriptionIcon from '@mui/icons-material/Description'
import StorageIcon from '@mui/icons-material/Storage'
import SpellcheckIcon from "@mui/icons-material/Spellcheck"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import SideBar from './Sidebar'
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstant'
import { useNavigate, useParams } from 'react-router-dom'


const UpdateProduct = () => {

    const categories = ["Laptop", "Footwear", "Bottom", "Tops", "Attire", "Camera", "SmartPhones", "Mobile"]

    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()
    const params = useParams()

    const productId = params.id

    const [name,setName] = useState("")
    const [description,setDescription] = useState("")
    const [category, setCategory] = useState("");
    const [stock,setStock] = useState(0)
    const [price,setPrice] = useState(0)
    const [images, setImages] = useState([])
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])

    const {error,product} = useSelector((store)=>store.product)
    const {loading,error:updateProductError,isUpdated} = useSelector((store)=>store.deleteProduct)
    
    useEffect(()=>{

        
        if(product && product?._id !== productId)
        {
            dispatch(getProductDetails(productId))
        }
        else
        {
            setName(product?.name)
            setDescription(product?.description)
            setCategory(product?.category)
            setPrice(product?.price)
            setStock(product?.stock)
            setOldImages(product?.images)
        }

        if(error)
        {
            alert.error(error)
            dispatch(clearErrors())
        }

        if(updateProductError)
        {
            alert.error(updateProductError)
            dispatch({
                type:UPDATE_PRODUCT_RESET
            })
        }
        if(isUpdated)
        {
            alert.success("Product Updated Successfully");
            dispatch({
                type:UPDATE_PRODUCT_RESET
            })
            navigate("/admin/products")
        }

    },[dispatch,error,product,params,alert,isUpdated,updateProductError,navigate,productId])

    const updateProductSubmitHandler  = (e) => {
        e.preventDefault()

        const myForm = new FormData()
        myForm.set("name",name)
        myForm.set("price",price)
        myForm.set("description",description)
        myForm.set("category",category)
        myForm.set("stock",stock)

        images.forEach((image) => {
            myForm.append("images", image)
        })
        dispatch(updateProduct(myForm, productId))
    }

    const updateProductImagesChange  = (e) => {

        const files = Array.from(e.target.files)

        setImages([]);
        setImagesPreview([]);
        setOldImages([]);

        files.forEach((file) => {
            const reader = new FileReader()

            reader.onload = () => { 
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result])
                    setImages((old) => [...old, reader.result])
                }
            }
            reader.readAsDataURL(file)
        })
    }


  return (

    <Fragment>
        <MetaData title="Update Product" />
        <div className="dashboard">
            <SideBar />
            <div className="newProductContainer">
                <form
                className="createProductForm"
                encType="multipart/form-data"
                onSubmit={updateProductSubmitHandler }
                >
                    <h1>Update Product</h1>

                    <div>
                        <SpellcheckIcon />
                        <input
                        type="text"
                        placeholder="Product Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <AttachMoneyIcon />
                        <input
                        type="number"
                        placeholder="Price"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    <div>
                        <DescriptionIcon />

                        <textarea
                        placeholder="Product Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        cols="30"
                        rows="1"
                        ></textarea>
                    </div>

                    <div>
                        <AccountTreeIcon />
                        <select onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Choose Category</option>
                            {
                                    categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <StorageIcon />
                        <input
                        type="number"
                        placeholder="Stock"
                        required
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        />
                    </div>

                    <div id="createProductFormFile">
                        <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={updateProductImagesChange}
                        multiple
                        />
                    </div>
                    <div id="createProductFormImage">
                    {
                        oldImages &&
                        oldImages?.map((image, index) => (
                            <img key={index} src={image.url} alt="Old Product Preview" />
                        ))
                    }
                    </div>

                    <div id="createProductFormImage">
                        {
                            imagesPreview?.map((image, index) => (
                                <img key={index} src={image} alt="Product Preview" />
                            ))
                        }
                    </div>

                    <Button
                        id="createProductBtn"
                        type="submit"
                        disabled={loading ? true : false}
                    >
                        Update
                    </Button>
                </form>
            </div>
        </div>
    </Fragment>
  )
}

export default UpdateProduct