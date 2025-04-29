import { createAsyncThunk } from "@reduxjs/toolkit";
import { addVisitorAPI, checkInVisitorAPI, getAllAppoinmentsAPI, getAllVisitorsAPI, getHourlyVisitorFlowAPI, getVisitorCountAPI, getVisitorsAnalyticsAPI, updateVisitorAPI } from "../../api/visitorAPI";
import toast from "react-hot-toast";

// Add Visitor 
export const addVisitorThunk = createAsyncThunk("visitor/addVisitor", async (visitorData, thunkAPI) => {
 try {
    const res = await addVisitorAPI(visitorData);
    if(res.success){
      toast.success("Visitor Added Successfully");
    }
    return res.data;
 } catch (error) {
    toast.error(error.response.data.message || "Something went wrong");
    return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
 }
}
);

export const updateVisitorThunk = createAsyncThunk("visitor/updateVisitor", async (visitorData, thunkAPI) => {
  try {
   console.log("visitorData",visitorData);
     const res = await updateVisitorAPI(visitorData);
     if(res.success){
       toast.success("Visitor Updated Successfully");
     }
     console.log(res.data);
     return res.data;
  } catch (error) {
     toast.error(error.response.data.message || "Something went wrong");
     return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
  }
})


// Get All Visitors
export const getAllVisitorsThunk = createAsyncThunk("visitor/getAllVisitors", async (page, thunkAPI) => {
 try {
   
    const res = await getAllVisitorsAPI(page);
    
    return res.data;
 } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
 }
}
);

// Get Visitor Count

export const getVisitorCountThunk = createAsyncThunk("visitor/getVisitorCount", async (_, thunkAPI) => {
  try {
       const res = await getVisitorCountAPI();
       return res.data;
   } catch (error) {
       return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
   }
}
);

// Get Hourly Visitor Flow

export const getHourlyVisitorFlowThunk = createAsyncThunk("visitor/getHourlyVisitorFlow", async (_, thunkAPI) => {
  try {
         const res = await getHourlyVisitorFlowAPI();
         return res.data;
      } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
      }
});


export const getVisitorAnalyticsThunk = createAsyncThunk("visitor/getVisitorAnalytics", async (_, thunkAPI) => {
  try {
         const res = await getVisitorsAnalyticsAPI();
         return res.data;
      } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
      }
});

export const checkInVisitorThunk = createAsyncThunk("visitor/checkInVisitor", async (data, thunkAPI) => {
  try {
        console.log("data",data);
         const res = await checkInVisitorAPI(data);
         return res.data;
      } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
      }
});


export const getAllAppoinmentsThunk = createAsyncThunk('visitor/getAllAppoinments', async (pagination, thunkAPI) => {
  try {
    const res = await getAllAppoinmentsAPI(pagination);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
  }
});

export const addVisitorAppoinmentThunk = createAsyncThunk('visitor/addVisitorAppoinment', async (data, thunkAPI) => {
  try {
    const res = await addVisitorAPI(data);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
  }
})