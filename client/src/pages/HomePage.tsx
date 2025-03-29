import { CirclePlus, PackageIcon, PlusIcon, RefreshCcw } from "lucide-react";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  addProduct,
  Product,
  productError,
  productPending,
  productSuccess,
} from "../redux/useProductStore";
import toast, { Toaster } from "react-hot-toast";

const HomePage = () => {
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector(
    (state: any) => state.product
  );
  const [pageLoad, setPageLoad] = useState<boolean>(false);
  console.log(product);
  // console.log(data);

  useEffect(() => {
    async function fetchData() {
      dispatch(productPending({ type: "product/pending" }));
      try {
        const productsFetch = await axios.get(
          `${import.meta.env.VITE_BASE_URL}products`
        );
        //  console.log(productsFetch.data.data);
        dispatch(productSuccess(productsFetch.data.data));
        //console.log(product);
      } catch (error) {
        console.log(error);
        dispatch(productError(error));
      }
    }
    fetchData();
  }, [dispatch, pageLoad]);

  const addProductHandler = () => {
    const modal = document.getElementById(
      "add_product_modal"
    ) as HTMLDialogElement;
    if (modal) modal.showModal();
  };
//Add Product Modal
  const addProductHandlerModal = async (e) => {
    e.preventDefault();

   const productData = new FormData(e.target);
  
   let productObj: { [key: string]: any } = {};
  productData.forEach((value, key) => {
    productObj[key] = value;
  });
  
  // Log the product data as an object
  dispatch(productPending());
   try {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}products`, productObj);

    console.log(response.data.data);
    if(!response.data.success === true){
       toast.error(response.data.message);
       return
    }
    dispatch(addProduct(response.data.data));
    toast.success("Product added successfully");
    const modal = document.getElementById(
      "add_product_modal"
    ) as HTMLDialogElement;
    if (modal) modal.close();
   } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
   }
  }
//Close Modal Handler
  const closeModal = () => {
    const modal = document.getElementById(
      "add_product_modal"
    ) as HTMLDialogElement;
    if (modal) modal.close();
  }
  return (
    <>
      <div className="max-w-6xl mx-auto mt-2">
        <div className="flex justify-between">
          <button
            className="btn btn-accent rounded-full"
            onClick={addProductHandler}
          >
            <CirclePlus />
            <span className="ml-2 text[16px] text-semibold">Add Product</span>
          </button>
          <button
            className="btn border-none bg-transparent rounded-full shadow-none hover:rounded-full"
            onClick={() => setPageLoad(!pageLoad)}
          >
            <RefreshCcw />
          </button>
        </div>
        <main className="max-w-6xl mx-auto px-4 py-8">
          {error && (
            <div className="alert alert-error shadow-lg">
              <div>
                <span>{error}</span>
              </div>
            </div>
          )}
          {product.length === 0 && !loading && (
            <div className="flex flex-col justify-center items-center h-96 space-y-4">
              <div className="bg-base-100 rounded-full p-6">
                <PackageIcon className="size-12" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold ">No products found</h3>
                <p className="text-gray-500 max-w-sm">
                  Get started by adding your first product to the inventory
                </p>
              </div>
            </div>
          )}
          {loading ? (
            <div className="w-full h-[400px] flex justify-center">
              <span className="loading loading-bars loading-lg"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {product.map((prod: Product) => (
                <Card key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </main>
      </div>
      <dialog
        id="add_product_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <form onSubmit={addProductHandlerModal}>
            <h3 className="font-bold text-lg">Add Product</h3>
            <div>
              <label className="label py-2">
                <span className="label-text text-sm font-semibold">
                  Product Name
                </span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Product name"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label py-2">
                <span className="label-text text-sm font-semibold">
                  Image Url
                </span>
              </label>
              <input
                type="text"
                name="image"
                placeholder="Enter image url"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label py-2">
                <span className="label-text text-sm font-semibold">Price</span>
              </label>
              <input
                type="text"
                name="price"
                placeholder="Enter price"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label py-2">
                <span className="label-text text-sm font-semibold">Description</span>
              </label>
              <input
                type="text"
                name="description"
                placeholder="Enter Description"
                className="input input-bordered w-full"
              />
            </div>

              <div className="flex justify-end mt-4">
                <button className="btn" type="button" onClick={closeModal}>Close</button>
                <button className="btn btn-primary" type="submit">{
                  loading ? <span className="loading loading-spinner"></span> : "Add Product"}</button>
                </div>
             
          </form>
        </div>
      </dialog>
      <Toaster
  position="top-center"
  reverseOrder={false}
/>
    </>
  );
};

export default HomePage;
