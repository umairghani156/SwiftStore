import { createAsyncThunk } from "@reduxjs/toolkit";
import { addSpecialIssueAPI, getAllIssuesAPI, getIssueStatusCountAPI, getSpecialIssueAPI, getUserIssuesAPI, updateIssueAPI } from "../../api/issuesAPI";
import toast from "react-hot-toast";


export const getAllIssues = createAsyncThunk("issue/getAllIssues", async (pag, thunkAPI) => {
  try {
    const res = await getAllIssuesAPI(pag);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});


export const updateIssueThunk = createAsyncThunk("issue/updateIssue", async (data, thunkAPI) => {
  try {
  
   const res = await updateIssueAPI(data);
   return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});


export const getIssueStatusCountThunk = createAsyncThunk("issue/getIssueStatusCount", async (_, thunkAPI) => {
  try {
    const issueStatusCount = await getIssueStatusCountAPI();
    return issueStatusCount.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
  }
});

// Get a User's All Issues 

export const getUserIssuesThunk = createAsyncThunk("issue/getUserIssues", async (pagination, thunkAPI) => {
  try {
    const res = await getUserIssuesAPI(pagination);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
  }
});


// Add Issue 

export const addIssueThunk = createAsyncThunk("issue/addIssue", async (data, thunkAPI) => {
  try {

    const res = await addIssueAPI(data);
  
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
  }
});

// Get a Special Issue

export const getSpecialIssueThunk = createAsyncThunk("issue/getIssue", async (name, thunkAPI) => {
  try {
    const res = await getSpecialIssueAPI(name);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
  }
});

export const addSpecialUserIssueThunk = createAsyncThunk("issue/addSpecialIssue", async (data, thunkAPI) => {
  try {
    const res = await addSpecialIssueAPI(data);
   
    if(res.success){
      toast.success(res.message);
    }
    return res.data;
  } catch (error) {
    toast.error(error.response.data.message || "Something went wrong");
    return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
  }
})