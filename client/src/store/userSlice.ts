import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  id: string
  name: string
  email: string
  avatar: string
  last_login_date: string
  role: string
  is_active: boolean
  is_verified: boolean
  created_at:string
}

const initialState: UserState = {
  id: '',
  name: '',
  email: '',
  avatar: '',
  last_login_date: '',
  role: '',
  is_active: false,
  is_verified: false,
  created_at: '',
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
      state.is_active = action.payload.is_active
      state.is_verified = action.payload.is_verified
      state.created_at = action.payload.created_at
    },
    logout: (state) => {
      state.id = ''
      state.name = ''
      state.email = ''
      state.avatar = ''
      state.last_login_date = ''
      state.role = ''
      state.is_active = false
      state.is_verified = false
      state.created_at = ''
    },
  },
})

export const { setUserDetails, logout } = userSlice.actions

export default userSlice.reducer
