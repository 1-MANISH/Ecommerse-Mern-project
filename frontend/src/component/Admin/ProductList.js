import React ,{useEffect,Fragment, useState} from 'react'
import "./ProductList.css"
import { DataGrid } from '@mui/x-data-grid'
import { useSelector,useDispatch } from 'react-redux'
import { 
    clearErrors, 
    getAdminProducts ,
    deleteProduct
} from '../../actions/productAction'
import { Link, useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { Button } from '@mui/material'
import MetaData from '../layout/MetaData'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SideBar from './Sidebar'
import Loader from '../layout/Loader/Loader'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
} from "@mui/material"
import { DELETE_PRODUCT_RESET } from '../../constants/productConstant'

const ProductList = () => {

   const [open,setOpen] = useState(false)
   const [id,setId] = useState(null)
 
   const dispatch = useDispatch()
   const alert = useAlert()
   const navigate = useNavigate()

   const {error,products,loading} = useSelector((store)=>store.products)
   const {error:deleteProductError,isDeleted} = useSelector(store=>store.deleteProduct)


   useEffect(()=>{

    if(error){
        alert.error(error)
        dispatch(clearErrors())
    }
    if(deleteProductError){
        alert.error(deleteProductError)
        dispatch(clearErrors())
    }
    if(isDeleted){
        alert.success("Product Deleted Successfully")
        setId(null)
        dispatch({type:DELETE_PRODUCT_RESET})
        navigate("/admin/dashboard")
    }
    dispatch(getAdminProducts())

   },[dispatch,error,alert,deleteProductError,isDeleted,navigate])

   const columns = [
    {
        field: "id",
        headerName: "Product ID",
        minWidth: 250,
        flex: 0.5,
    },
    {
        field: "name",
        headerName: "Name",
        minWidth: 140,
        flex: 1,
    },
    {
        field: "stock",
        headerName: "Stock",
        minWidth: 150,
        flex: 0.3,
        type: "number",
    },
    {
        field: "price",
        headerName: "Price",
        minWidth: 270,
        flex: 0.5,  
        type: "number",
    },
    {
        field: "actions",
        flex: 0.3,
        headerName: "Actions",
        minWidth: 150,
        type: "number",
        sortable: false,
        renderCell: (params) => {

            return (
                <Fragment>
                    <Link to={`/admin/product/${params.row.id}`}>
                        <EditIcon />
                    </Link>

                    <Button >
                        <DeleteIcon onClick={()=>{
                            deleteButtonToggle()
                            setId(params.row.id)
                        }}/>
                    </Button>
                </Fragment>
            )
        },
    },
   ]

   const rows = []

   products && 
   products?.forEach((item) => {
       rows.push({
           id:item?._id,
           stock:item?.stock,
           price:`${item?.price}`,
           name:item?.name,
       })
   })

   const deleteProductHandler = () => {
        dispatch(deleteProduct(id))
        navigate("/admin/products")
   }

   const deleteButtonToggle = () =>{
        open ? setOpen(false) : setOpen(true)
   }

  

  return (
    <Fragment>

        <MetaData title={`ALL PRODUCTS - Admin`} />

        <div className="dashboard">
            <SideBar />
            <div className='productListContainer'>
                <h1 id="productListHeading">ALL PRODUCTS</h1>
                
                {
                    loading ? 
                    (
                        <Loader />
                    ) :
                    (
                        <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className="productListTable"
                        autoHeight
                        />
                    )
                } 

                <Dialog
                    open={open}
                    onClose={deleteButtonToggle}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                    >
                        <DialogTitle id='simple-dialog-title'>Delete Product : {id}</DialogTitle>

                        <DialogContent className='submitDialog'>
                            <DialogContentText id='alert-dialog-description'>
                                    Are you sure you want to delete this product?
                            </DialogContentText>

                        </DialogContent>

                        <DialogActions>
                            <Button onClick={deleteButtonToggle} color='secondary'>Cancel</Button>
                            <Button onClick={()=>deleteProductHandler()}  color='primary' >Yes</Button>
                        </DialogActions>
                </Dialog>      
                
            </div>
        </div>
    </Fragment>
  )
}

export default ProductList