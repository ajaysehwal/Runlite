"use client";
import { store } from "@/store";
import { Provider } from "react-redux";
// reduxprovider
export const ReduxProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Provider store={store}>{children}</Provider>;
};
