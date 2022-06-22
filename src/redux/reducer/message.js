import { createSlice } from '@reduxjs/toolkit';
import messageConstants from '../constants/message';
const { SHOW_MESSAGE, HIDE_MESSAGE } = messageConstants;
export const messageSlice = createSlice({
    name: 'message',
    initialState: {
        open: [],
        message: [],
        autoHideDuration: [],
        severity: [],
        createAt: [],
    },
    reducers: {
        [SHOW_MESSAGE]: (state, action) => {
            let payload = action.payload;
            return (state = {
                ...state,
                open: state.open.concat([true]),
                message: state.message.concat([payload.message]),
                autoHideDuration: state.autoHideDuration.concat([
                    payload.autoHideDuration ? payload.autoHideDuration : 6000,
                ]),
                severity: state.severity.concat([payload.severity || 'info']),
                createAt: state.createAt.concat([Date.now()]),
            });
        },
        [HIDE_MESSAGE]: (state, action) => {
            let _index = action.payload.index;
            return (state = {
                ...state,
                open: state.open.filter((item, index) => index !== _index),
                message: state.message.filter((item, index) => index !== _index),
                autoHideDuration: state.autoHideDuration.filter((item, index) => index !== _index),
                createAt: state.createAt.filter((item, index) => index !== _index),
                severity: state.severity.filter((item, index) => index !== _index),
            });
        },
    },
});

export const messageActions = messageSlice.actions;
export default messageSlice.reducer;
