import {
  combineReducers,
  configureStore,
  PreloadedState,
} from '@reduxjs/toolkit';

import { adsmApiSlice } from 'Store/apiSlices/mainAPISlice';
import messagesReducer from 'Store/reducer/messageReducer';
import timelineReducer from 'Store/reducer/timelineReducer';

const rootReducer = combineReducers({
  timelineReducer,
  messages: messagesReducer,
  [adsmApiSlice.reducerPath]: adsmApiSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(adsmApiSlice.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (defaultMiddleware) =>
      defaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }).concat(adsmApiSlice.middleware),
    preloadedState,
  });
};

export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
