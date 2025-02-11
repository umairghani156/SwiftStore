import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Product } from "../redux/useProductStore";

function Card({product}:{product:Product}) {
  console.log("Products", product);

  return (
    <div className="card bg-base-100 w-86 h-96 shadow-xl">
      <figure>
        <img
          src={product?.image}
          alt="Shoes"
          className="w-100 h-100 object-contain"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {product?.name}
          <div className="badge badge-secondary">NEW</div>
        </h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div className="card-actions justify-end">
          <button className="btn bg-green-600">Edit</button>
          <button className="btn bg-red-600">Delete</button>

        </div>
      </div>
    </div>
  );
}

export default Card;
