import { createSlice } from '@reduxjs/toolkit';
import contractConstants from '../constants/contract';
const { REQUEST_CONTRACTS, REQUEST_CONTRACTS_SUCCESS, REQUEST_CONTRACTS_FAILURE } = contractConstants;
export const contractSlice = createSlice({
    name: 'contract',
    initialState: {
        isRequesting: false,
        isFetching: false,
        listContract: [],
    },
    reducers: {
        [REQUEST_CONTRACTS]: (state) => {
            state.isRequesting = true;
        },
        [REQUEST_CONTRACTS_SUCCESS]: (state) => {
            state.isRequesting = false;
        },
        [REQUEST_CONTRACTS_FAILURE]: (state) => {
            state.isRequesting = false;
        },
    },
});

// export const {} = contractSlice.actions;
export default contractSlice.reducer;
