import { fetchApi } from "@/lib/axios";
import { DB_NAME } from "@/lib/utils";

export const getResetPasswprdOTP = ({ payload = {} } = {}) => {
  const reqObj = {
    url: "/merchant/password/reset/send",
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const verifyResetPasswprdOTP = ({ payload = {} } = {}) => {
  const reqObj = {
    url: "/merchant/password/reset/verify",
    payload,
    headers: {},
  };

  return fetchApi(reqObj);
};
export const resetPassword = ({
  csrf_token,
  login,
  password,
  confirm_password,
  token,
}) => {
  const urlencoded = new URLSearchParams();
  urlencoded.append("csrf_token", csrf_token);
  urlencoded.append("login", login);
  urlencoded.append("password", password);
  urlencoded.append("confirm_password", confirm_password);
  urlencoded.append("redirect", "");

  const reqObj = {
    url: `/web/reset_password?db=${DB_NAME}&token=${token}`,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    payload: urlencoded,
    raw: true, // 👈 tell fetchApi not to wrap
  };

  return fetchApi(reqObj);
};
