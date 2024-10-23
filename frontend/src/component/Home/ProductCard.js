import React from "react";
import { Link } from "react-router-dom";
import { Rating } from '@mui/material';
import dummyProductImage from "../../images/dummyProduct.jpg"

const ProductCard = ({ product }) => {

  const options = {
    value:product?.ratings,
    size:'small',
    readOnly:true,
    precision:0.5
  };

  return (
    <Link className="productCard" to={`/product/${product?._id}`} key={product?._id}>
      <img src={ product?.images[0]?.url.startsWith("http") ? product?.images[0]?.url : dummyProductImage   } alt={product?.name} />
      <p>{product?.name}</p>
      <div>
        <Rating {...options} />
        <span className="productCardSpan">
          ({product?.numberOfReviews} Reviews)
        </span>
      </div>
      <span>{`₹${product?.price}`}</span>
    </Link>
  );
};

export default ProductCard;
