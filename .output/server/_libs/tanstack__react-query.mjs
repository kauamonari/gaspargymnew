import { r as reactExports, j as jsxRuntimeExports } from "./react.mjs";
const QueryClientContext = reactExports.createContext(void 0);
const QueryClientProvider = ({ client, children }) => {
  reactExports.useEffect(() => {
    client.mount();
    return () => {
      client.unmount();
    };
  }, [client]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientContext.Provider, {
    value: client,
    children
  });
};
export {
  QueryClientProvider as Q
};
