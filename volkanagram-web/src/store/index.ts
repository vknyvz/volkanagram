import {configureStore} from '@reduxjs/toolkit'
import authReducer from './authSlice'
import loadingReducer from './loadingSlice'
import profileReducer from "@/store/profileSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    profile: profileReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
