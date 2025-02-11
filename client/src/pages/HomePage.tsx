import { CirclePlus, PlusIcon, RefreshCcw } from "lucide-react";
import Card from "../components/Card";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Product, productError, productPending, productSuccess } from "../redux/useProductStore";

const HomePage = () =>{
    const dispatch = useDispatch();

    const {product, loading, error} = useSelector((state: any) => state.product);
    console.log(product);
   // console.log(data);
  
    useEffect(() => {
      async function fetchData() {
        dispatch(productPending({type: "product/pending"}));
       try {
        
        const productsFetch = await axios.get("http://localhost:3000/api/products");
      //  console.log(productsFetch.data.data);
        dispatch(productSuccess(productsFetch.data.data));
        //console.log(product);
       } catch (error) {
        console.log(error);
        dispatch(productError(error));
       }
      }
      fetchData();
    },[])
    return(
        <div className="max-w-6xl mx-auto mt-2">
            <div className="flex justify-between">
             <button className="btn btn-accent rounded-full">
                <CirclePlus/>
                <span className="ml-2 text[16px] text-semibold">
                    Add Product
                </span>
             </button>
             <button className="btn border-none bg-transparent rounded-full shadow-none hover:rounded-full">
                <RefreshCcw/>
             </button>
               
            </div>
            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
               {
                product.map((prod: Product) => <Card key={prod.id} product={prod}/>)
               }
                </div>
                

            </main>
        </div>
    )
};

export default HomePage;