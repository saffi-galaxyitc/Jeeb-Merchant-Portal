import { fetchApi } from "@/lib/axios";

export const getSettings = () => {
  const reqObj = {
    url: `/merchant/store_theme`,
    payload: {},
    headers: {},
  };
  return fetchApi(reqObj);
};
export const updateSettings = ({ payload }) => {
  const reqObj = {
    url: `/merchant/store_theme/update`,
    payload,
    headers: {},
  };
  return fetchApi(reqObj);
};
