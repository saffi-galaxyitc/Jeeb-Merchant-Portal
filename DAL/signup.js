import { fetchApi } from "@/lib/axios";

export const email_check = ({ payload = {} } = {}) => {
  const reqObj = {
    url: "/merchant/email_check",
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const verify_send = ({ payload = {} } = {}) => {
  const reqObj = {
    url: "/merchant/email/verify/send",
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const verify_otp = ({ payload = {} } = {}) => {
  const reqObj = {
    url: "/merchant/email/verify/otp",
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const app_check = ({ payload = {} } = {}) => {
  const reqObj = {
    url: "/merchant/app_check",
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const domain_check = ({ payload = {} } = {}) => {
  const reqObj = {
    url: "/merchant/domain_check",
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const store_types = ({ payload = {} } = {}) => {
  const reqObj = {
    url: "/merchant/store_types",
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const signup = ({ payload = {} } = {}) => {
  const reqObj = {
    url: "/merchant/signup",
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
