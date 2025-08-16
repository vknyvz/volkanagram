import {createSlice, Draft, PayloadAction} from '@reduxjs/toolkit'
import {DefaultUserProfile, IProfileSliceState, IUserProfile} from '@/types/user'

const initialState: IProfileSliceState = {
  data: DefaultUserProfile,
  isLoading: false,
  error: null
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<IUserProfile>) => {
      state.data = action.payload
      state.error = null
    },

    updateProfileField: <K extends keyof IUserProfile> (
      state: Draft<IProfileSliceState>,
      action: PayloadAction<{
        field: K
        value: IUserProfile[K]
      }>
    ) => {
      if (state.data) {
        state.data[action.payload.field] = action.payload.value
      }
    },

    updatePostsCount: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.postsCount = action.payload
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    }
  }
})

export const {
  setProfile,
  updateProfileField,
  updatePostsCount,
  setLoading,
  setError
} = profileSlice.actions

export default profileSlice.reducer