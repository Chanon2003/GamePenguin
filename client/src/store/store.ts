// src/app/store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  type PersistConfig,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // ใช้ localStorage

// 👇 กำหนด type สำหรับ state รวมทั้งหมด
const rootReducer = combineReducers({
  user: userReducer,
})

// 👇 สร้าง persist config พร้อมระบุ type
const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: 'root',
  storage,
}

// 👇 ใช้ persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// 👇 สร้าง store พร้อม middleware ที่ compatible กับ redux-persist
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

// 👇 export persistor สำหรับใช้กับ PersistGate
export const persistor = persistStore(store)

// 👇 export types สำหรับการใช้งานใน component
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
