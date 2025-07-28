import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  id: string
  name: string
  email: string
  avatar: string
  last_login_date: string
  role: string
}

const initialState: UserState = {
  id: '',
  name: '',
  email: '',
  avatar: '',
  last_login_date: '',
  role: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id
      state.name = action.payload.name
      state.email = action.payload.email
      state.avatar = action.payload.avatar
      state.last_login_date = action.payload.last_login_date
      state.role = action.payload.role
    },
    logout: (state) => {
      state.id = ''
      state.name = ''
      state.email = ''
      state.avatar = ''
      state.last_login_date = ''
      state.role = ''
    },
  },
})

export const { setUserDetails, logout } = userSlice.actions

export default userSlice.reducer
