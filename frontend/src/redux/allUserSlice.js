import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwt_decode from "jwt-decode";
import axios from 'axios';
const token =localStorage.getItem('Token')

if(token && token !==  null ){
    const decoded = jwt_decode(token);
    const expiresIn = new Date(decoded.exp*1000);
    if(new Date() > expiresIn){
      localStorage.removeItem('Token');
      localStorage.removeItem('checked')
    }


}



const initialState = {
  allUserData:"",
  loading: false,
  token:token
}

export const getAllUser = createAsyncThunk('/user', async (values, thunkAPI) => {
  try {  
    const response=await  axios.get(`http://localhost:5001/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
       },
    })
    return response.data
  } catch (error) {
    console.log('this is the error: ', { error })
    return thunkAPI.rejectWithValue({
      err: error.response.data.message,
      status: error.response.status
    })
  }
})

const allUserSlice = createSlice({
  name: 'allUser',
  initialState,
  reducers: {},
  extraReducers: {
    [getAllUser.pending]: (state, action) => {
       state.loading=false
    },
    [getAllUser.fulfilled]: (state, action) => {
        state.allUserData=action.payload
        state.loading=false
    },
    [getAllUser.rejected]: (state, action) => {
      state.loading=false
    }
  }
});

export default allUserSlice.reducer;

