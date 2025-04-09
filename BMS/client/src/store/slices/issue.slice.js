import { createSlice } from "@reduxjs/toolkit";
import { addIssueThunk, addSpecialUserIssueThunk, getAllIssues, getIssueStatusCountThunk, getSpecialIssueThunk, getUserIssuesThunk, updateIssueThunk } from "../thunks/issue.thunk";



const initailState = {
    issues: null,
    issueStatusCount: null,
    userIssues: null,
    specialIssue: null,
    loading: false,
    error: null
}

const issueSlice = createSlice({
    name: 'issue',
    initialState: initailState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllIssues.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllIssues.fulfilled, (state, action) => {
                state.loading = false;
                state.issues = action.payload;
                state.error = null;
            })
            .addCase(getAllIssues.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateIssueThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateIssueThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.issues.issues = state.issues.issues.map((issue) => {
                    if (issue._id === action.payload._id) {
                        return action.payload;
                    }
                    return issue;
                });
                state.error = null;
            })
            .addCase(updateIssueThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Issue status Count

            .addCase(getIssueStatusCountThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getIssueStatusCountThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.issueStatusCount = action.payload;
                state.error = null;
            })
            .addCase(getIssueStatusCountThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get a User's All Issues

            .addCase(getUserIssuesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserIssuesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.userIssues = action.payload;
                state.error = null;
            })
            .addCase(getUserIssuesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Issue
            .addCase(addIssueThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addIssueThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.issues = [...state.issues, action.payload];
                state.error = null;
            })
            .addCase(addIssueThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Special Issue
            .addCase(getSpecialIssueThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSpecialIssueThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.specialIssue = action.payload;
                state.error = null;
            })
            .addCase(getSpecialIssueThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            
            // Add Special User Issue
            .addCase(addSpecialUserIssueThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSpecialUserIssueThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.userIssues.issues = state.userIssues.issues ? [...state.userIssues.issues, action.payload] : [action.payload];
                state.error = null;
            })
            .addCase(addSpecialUserIssueThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
            

         
    }
});

export default issueSlice.reducer;