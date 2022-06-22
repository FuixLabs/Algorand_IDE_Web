import { createSlice } from '@reduxjs/toolkit';
import modelConstants from '../constants/model';
import Constants from '../../util/Constant';
import Example from '../../components/WorkBoard/Example';
const { UPDATE_MODEL, UPDATE_INSTANCE } = modelConstants;
let isExample = window.location.pathname === '/example';
let elements = window.localStorage.getItem('elements');
if (elements) {
    elements = JSON.parse(elements);
    elements.forEach((item) => {
        if (!Constants.isConnection(item)) {
            item.className = item.data.typeBlock;
        } else {
            item.animated = false;
            item.label = item.data.label;
        }
    });
} else {
    elements = [];
}
const initialModel = {
    isRequesting: false,
    isFetching: false,
    elements: isExample ? Example : elements,
    isExample,
    ref: null,
};

export const modelSlice = createSlice({
    name: 'model',
    initialState: initialModel,
    reducers: {
        [UPDATE_MODEL]: (state, action) => {
            let payload = action.payload;
            if (!isExample && Array.isArray(payload.elements)) {
                window.localStorage.setItem('elements', JSON.stringify(payload.elements));
            }
            return { ...state, elements: payload.elements };
        },
        [UPDATE_INSTANCE]: (state, action) => {
            let payload = action.payload;
            return { ...state, ref: payload.ref };
        },
    },
});

export const modelActions = modelSlice.actions;
export default modelSlice.reducer;
