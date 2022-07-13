import { createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../../App/store';
import {RootState} from '../../App/rootReducer';
import { UserProfile } from '../../shared-libs/UserProfile';


export interface AuthState {
    user: UserProfile | null;
    token: null;//change type
}

export const initialState: AuthState = {
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const {user, accessToken} = action.payload;
            state.user = user;
            state.token = accessToken;
        },
        logOut: (state, action) => {
            state.user = null;
            state.token = null;
        }

    },

});

export const {setCredentials, logOut} = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state: AuthState)=> state.user;
export const selectCurrentToken = (state: AuthState)=> state.token;

