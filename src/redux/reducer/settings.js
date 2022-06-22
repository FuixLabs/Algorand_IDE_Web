import { createSlice } from '@reduxjs/toolkit';
import settingsConstants from '../constants/settings';
import colorThemes from '../../themes';
const { UPDATE_THEME } = settingsConstants;
let themeId = window.localStorage.getItem('themeId');
let theme = colorThemes[0];
if (themeId) {
    theme = colorThemes.find((item) => item.id === Number(themeId));
}

const initialSettings = {
    isRequesting: false,
    isFetching: false,
    theme: theme ? theme : colorThemes[0],
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: initialSettings,
    reducers: {
        [UPDATE_THEME]: (state, action) => {
            let payload = action.payload;
            window.localStorage.setItem('themeId', payload.theme.id);
            return { ...state, theme: payload.theme };
        },
        updateDappTheme(state, action) {
            //dapp use darkblue mode only
            state.theme = colorThemes[0];
        },
    },
});

export const settingsActions = settingsSlice.actions;
export default settingsSlice.reducer;
