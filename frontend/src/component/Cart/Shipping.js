import React, { Fragment,useState } from 'react'
import "./Shipping.css"
import { useDispatch,useSelector } from 'react-redux'
import { saveShippingInfo } from '../../actions/cartAction'
import MetaData from '../layout/MetaData'
import PinDropIcon from '@mui/icons-material/PinDrop'
import HomeIcon from '@mui/icons-material/Home'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import PublicIcon from '@mui/icons-material/Public'
import PhoneIcon from "@mui/icons-material/Phone"
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation"
import {Country ,State} from "country-state-city"
import { useAlert } from 'react-alert'
import CheckoutSteps from "./CheckoutSteps.js"
import { useNavigate } from 'react-router-dom'

const Shipping = () => {
  
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()
    const {shippingInfo} = useSelector((store)=>store.cart)
    
    const [address,setAddress] = useState(shippingInfo?.address)
    const [city,setCity] = useState(shippingInfo?.city)
    const [state,setState] = useState(shippingInfo?.state)
    const [country,setCountry] = useState(shippingInfo?.country)
    const [pinCode,setPinCode] = useState(shippingInfo?.pinCode)
    const [phoneNumber,setPhoneNumber] = useState(shippingInfo?.phoneNumber)
   
    const shippingSubmit = (e) => {
        e.preventDefault()
        
        if(phoneNumber.length < 10 || phoneNumber.length > 10){
            alert.error("Phone Number should be 10 digits")
            return
        }
        dispatch(saveShippingInfo({address,city,state,country,pinCode,phoneNumber}))
        navigate(`/order/confirm`)
    }

  return (
    <Fragment>
      <MetaData title="Shipping Details" />
    
      <CheckoutSteps activeStep={0} />

      <div className='shippingContainer'>
            <div className='shippingBox'>

                <h2 className='shippingHeading'>Shipping Details</h2>

                <form 
                className='shippingForm'
                enctype="multipart/form-data"
                onSubmit={shippingSubmit}
                >

                    <div>
                        <HomeIcon />
                        <input
                        type="text"
                        placeholder='Address'
                        required
                        value={address}
                        onChange={(e)=>setAddress(e.target.value)}
                        />
                    </div>
                    <div>
                        <LocationCityIcon />
                        <input
                        type="text"
                        placeholder='City'
                        required
                        value={city}
                        onChange={(e)=>setCity(e.target.value)}
                        />
                    </div>
                    <div>
                        <PinDropIcon />
                        <input
                            type="number"
                            placeholder="Pin Code"
                            required
                            value={pinCode}
                            onChange={(e) => setPinCode(e.target.value)}
                        />
                    </div>
                    <div>
                        <PhoneIcon />
                        <input
                            type="number"
                            placeholder="Phone Number"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            size="10"
                        />
                    </div>
                    <div>
                        <PublicIcon/>
                        <select
                            required
                            value={country}
                            onChange={(e)=>setCountry(e.target.value)}
                        >
                            <option value="" defaultChecked>Country</option>
                            {
                             Country && Country.getAllCountries().map((item)=>{
                                return <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                              })  
                            }
                        </select>
                    </div>


                    {/* as first user choose country then show state */}
                    {
                        country &&
                        <div>
                            <TransferWithinAStationIcon />
                            <select
                                required
                                value={state}
                                onChange={(e)=>setState(e.target.value)}
                            >
                                <option value="" defaultChecked>State</option>
                                {
                                   State && State.getStatesOfCountry(country).map((item)=>{
                                        return <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                                    })
                                }
                            </select>
                        </div>
                    }

                    <input
                        type="submit"
                        value="Continue"
                        className="shippingBtn"
                        disabled={state ? false : true} // when state is selected and only work
                    />

                </form>

            </div>
      </div>
    </Fragment>
  )
}

export default Shipping