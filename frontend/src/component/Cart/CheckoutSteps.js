import React, { Fragment } from 'react'
import "./CheckoutSteps.css"
import { Step, StepLabel, Stepper, Typography } from '@mui/material'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import LibraryAndCheckIcon from "@mui/icons-material/LibraryBooks"
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"

const CheckoutSteps = ({activeStep}) => {

    const steps = [
        {
            label:<Typography>Shipping Details</Typography>,
            item:<LocalShippingIcon/>
        },
        {
            label:<Typography>Confirm Order</Typography>,
            item:<LibraryAndCheckIcon/>
        },
        {
            label:<Typography>Payments</Typography>,
            item:<AccountBalanceIcon/>
        }
    ]

    const stepStyles = {
        boxSizing: "border-box",

    }
  

  return (
    <Fragment>
        <Stepper 
            alternativeLabel
            activeStep={activeStep} 
            style={stepStyles}
        >
            {
                steps.map((item,index)=>(
                     <Step
                        key={index}
                        active={activeStep === index ? true : false}
                        completed={activeStep >= index ? true : false}

                     >
                        <StepLabel
                          icon={item.item}
                            style={{
                                color:activeStep >= index ? "tomato" : "rgba(0, 0, 0, 0.649)"
                            }}
                        >
                            {item.label}
                        </StepLabel>

                     </Step>
                ))
            }

        </Stepper>
    </Fragment>
  )
}

export default CheckoutSteps