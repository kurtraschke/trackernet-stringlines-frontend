import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import {
  createHashHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClickHouseContext } from "./ClickHouseContext";
import { createClient } from "@clickhouse/client-web";
import NotFoundComponent from "./components/NotFoundRouteComponent.tsx";
import { MDXProvider } from "@mdx-js/react";
import { components } from "./components/PatternFlyMDXComponents.tsx";

import { routeTree } from "./routeTree.gen";

const hashHistory = createHashHistory();

const router = createRouter({
  routeTree,
  history: hashHistory,
  defaultNotFoundComponent: NotFoundComponent,
});

declare module "@tanstack/react-router" {
  // noinspection JSUnusedGlobalSymbols
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const client = createClient({
  url: import.meta.env.VITE_CLICKHOUSE_URL,
});

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ClickHouseContext value={client}>
          <MDXProvider components={components}>
            <RouterProvider router={router} />
          </MDXProvider>
        </ClickHouseContext>
      </QueryClientProvider>
    </StrictMode>,
  );
}
