import { CirclePlus, PlusIcon, RefreshCcw } from "lucide-react";

const HomePage = () =>{
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
        </div>
    )
};

export default HomePage;