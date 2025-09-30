import { fetchApi } from "@/lib/axios";

export const getTemplates = () => {
  const reqObj = {
    url: `/merchant/app/apps`,
    payload: {},
    headers: {},
  };

  return fetchApi(reqObj);
};
export const createTemplate = ({ payload }) => {
  const reqObj = {
    url: `/merchant/app/create`,
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const updateTemplate = ({ payload }) => {
  const reqObj = {
    url: `/merchant/app/update`,
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const getPages = ({ payload }) => {
  const reqObj = {
    url: `/merchant/app/pages`,
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const getPage = ({ payload }) => {
  const reqObj = {
    url: `/merchant/app/page`,
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const createPage = ({ payload }) => {
  const reqObj = {
    url: `/merchant/app/page/create`,
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const updatePage = ({ payload }) => {
  const reqObj = {
    url: `/merchant/app/page/update`,
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const deletePage = ({ payload }) => {
  const reqObj = {
    url: `/merchant/app/page/delete`,
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const addComponent = ({ payload }) => {
  const reqObj = {
    url: `/merchant/app/component/create`,
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const deleteComponent = ({ payload }) => {
  const reqObj = {
    url: `/merchant/app/component/delete`,
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const updateComponentGeneral = ({ payload }) => {
  const reqObj = {
    url: `/merchant/app/component/update`,
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const createComponentItem = ({ payload }) => {
  const reqObj = {
    url: `/merchant/app/component/item/create`,
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const updateComponentItem = ({ payload }) => {
  const reqObj = {
    url: `/merchant/app/component/item/update`,
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const deleteComponentItem = ({ payload }) => {
  const reqObj = {
    url: `/merchant/app/component/item/delete`,
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const getProductsComponentItem = ({ payload }) => {
  const reqObj = {
    url: `/merchant/app/component/item/products`,
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
