import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { render as rtlRender, RenderOptions } from '@testing-library/react';

import { adsmApiSlice } from 'Store/apiSlices/mainAPISlice';
import messagesReducer from 'Store/reducer/messageReducer';
import timelineReducer from 'Store/reducer/timelineReducer';
import { AppStore, RootState } from 'Store/store';

interface RenderStoreOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
  initialEntries?: string[];
  routerType?: 'FROM_MEMORY' | 'FROM_BROWSER' | 'NONE';
}

function renderWithStore(
  ui: React.ReactElement,
  {
    preloadedState,
    store = configureStore({
      reducer: {
        timelineReducer,
        messages: messagesReducer,
        [adsmApiSlice.reducerPath]: adsmApiSlice.reducer,
      },
      middleware: (defaultMiddleware) =>
        defaultMiddleware().concat(adsmApiSlice.middleware),
      preloadedState,
    }),
    initialEntries = [],
    routerType = 'FROM_MEMORY',
    ...renderOptions
  }: RenderStoreOptions = {}
) {
  setupListeners(store.dispatch);
  function Wrapper({ children }: { children: React.ReactNode }): JSX.Element {
    if (routerType === 'FROM_BROWSER')
      return (
        <Provider store={store}>
          <BrowserRouter>{children}</BrowserRouter>
        </Provider>
      );
    if (routerType === 'NONE')
      return <Provider store={store}>{children}</Provider>;
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </Provider>
    );
  }
  const rendered = rtlRender(ui, { wrapper: Wrapper, ...renderOptions });

  return {
    ...rendered,
    rerender: (rerenderUi: React.ReactElement, options: RenderOptions) =>
      renderWithStore(rerenderUi, {
        container: rendered.container,
        ...options,
      }),
  };
}

export * from '@testing-library/react';
export { renderWithStore };
