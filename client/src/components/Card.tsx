import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, Product, productError } from "../redux/useProductStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Card({product}:{product:Product}) {
  const navigate = useNavigate()  
  const dispatch = useDispatch();

  const deleteHandler = (e) => {
    console.log(e);
  }
  const opendeleteModal = async (id:number) => {
   console.log(id);
    
    try {
      const result = await  axios.delete(`http://localhost:3000/api/products/${id}`);
      console.log(result.data.data);
      dispatch(deleteProduct(id));
      toast.success("Product deleted successfully");
    
    } catch (error) {
      console.log(error);
      dispatch(productError(error));
    }
    // const my_modal_5 = document.getElementById("my_modal_5") as HTMLDialogElement;
    // my_modal_5.showModal();
  }

  return (
    <>
    <div className="card bg-base-100 w-86 h-96 shadow-xl hover:shadow-2xl transition-shadow duration-200">
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
        <p>{product?.description}</p>
        <div className="card-actions justify-end">
          <button className="btn bg-green-600" onClick={()=>navigate(`/product/${product?.id}`)}>Edit</button>
          <button 
          className="btn bg-red-500" onClick={()=>opendeleteModal(product?.id)}>Delete</button>

        </div>
      </div>
      
    </div>
    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure?</h3>
          <p className="py-4">
            Are you sure you want to delete this product?
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-primary">Close</button>
              <button className="btn btn-error" onClick={(e)=>deleteHandler(e)}>Delete</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default Card;
