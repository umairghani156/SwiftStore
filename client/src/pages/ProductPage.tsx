import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useResolvedPath } from "react-router-dom";
import { getProduct, Product, productPending, updateProduct } from "../redux/useProductStore";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const ProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct, loading } = useSelector((state: any) => state.product);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
  })

  
  const {id} = useParams();

  useEffect(() => {
   async function fetchtProduct(){
      dispatch(getProduct(id));
    }
    fetchtProduct();
    console.log(currentProduct);

  }, []);


  const updateProductHandler = async (e, productId: number) => {
    e.preventDefault();
    console.log(formData, productId);
    console.log(loading);
    if(!formData.name || !formData.price || !formData.image || !formData.description) {
      toast.error("All fields are required")
      return
    }
    dispatch(productPending() );
    try {
      let updateVal: Product ={
        id: productId,
        name: formData.name,
        price: formData.price,
        image: formData.image,
        description: formData.description,
        created_at: currentProduct?.created_at
      }
     dispatch<any>(updateProduct(updateVal));
     
      toast.success("Product updated successfully")
       navigate("/");
    } catch (error) {
      toast.error(error.response.data.message)
    }
   
  }

  // Delete Product Handler

  const deleteProductHandler = async (id: number) => {
    try {
      const result = await axios.delete(`${import.meta.env.VITE_BASE_URL}products/${id}`);
      toast.success("Product deleted successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button className="btn btn-ghost mb-8" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="size-4 mr-2" />
          Back to Products
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-lg overflow-hidden shadow-lg bg-base-100">
            <img src={currentProduct?.image} alt="Shoes" className="w-full h-full object-cover"/>
          </div>
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Edit Product</h2>
              <form action="" onSubmit={(e)=>updateProductHandler(e, currentProduct?.id)}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Product Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Product name"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Price</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Price"
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Image Url</span>
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="Image url"
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Description"
                    className="input input-bordered"
                  />
                </div>
                <div className="w-full flex justify-end mt-4">
                  <button className="btn btn-error mr-2" type="button" onClick={() => deleteProductHandler(currentProduct?.id)}>
                    <Trash2Icon className="size-4 mr-2"/>
                    Delete
                  </button>
                  <button className="btn btn-primary" type="submit">
                   {
                    loading ? 
                    <span className="loading loading-spinner"/>
                    
                    : "Save Changes"
                   }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toaster
  position="top-center"
  reverseOrder={false}
/>
    </>
  );
};

export default ProductPage;
