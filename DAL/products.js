import { fetchApi } from "@/lib/axios";
export const getProducts = ({ payload = {} } = {}) => {
  const reqObj = {
    url: "/merchant/products",
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const getCategories = ({ payload = {} } = {}) => {
  const reqObj = {
    url: "/merchant/categories",
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const getTags = ({ payload = {} } = {}) => {
  const reqObj = {
    url: "/merchant/tags",
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const handleCreateUpdateTag = ({ payload = {} } = {}) => {
  const reqObj = {
    url: "/merchant/tags/add",
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const getProductDetails = ({ id }) => {
  console.log("product getProductDetails", id);
  const reqObj = {
    url: `/merchant/product/${id}`,
    payload: {},
    headers: {},
  };

  return fetchApi(reqObj);
};
export const updateProduct = ({ payload, id }) => {
  console.log("product updateProduct", id, payload);
  const reqObj = {
    url: `/merchant/product/update/${id}`,
    payload: { vals: payload },
    headers: {},
  };

  return fetchApi(reqObj);
};
export const createProduct = ({ payload }) => {
  console.log("product updateProduct", payload);
  const reqObj = {
    url: `/merchant/product/create`,
    payload: { vals: payload },
    headers: {},
  };

  return fetchApi(reqObj);
};
