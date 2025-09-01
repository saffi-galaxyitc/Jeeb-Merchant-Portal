import { fetchApi } from "@/lib/axios";
import { DB_NAME } from "@/lib/utils";

export const getToken = async () => {
  try {
    const reqObj = {
      url: "/web/login",
      method: "GET",
      headers: {},
    };

    const response = await fetchApi(reqObj);

    if (response && typeof response.data === "string") {
      const resStr = response.data;

      const startIndex =
        resStr.indexOf('csrf_token: "') + 'csrf_token: "'.length;
      const endIndex = resStr.indexOf('"', startIndex);
      const csrfToken = resStr.substring(startIndex, endIndex);

      if (csrfToken) {
        return { success: true, token: csrfToken };
      } else {
        return { success: false, error: "CSRF token not found" };
      }
    } else {
      return { success: false, error: "Response is not a string" };
    }
  } catch (error) {
    console.error("Error in getToken:", error);
    return { success: false, error: error.message };
  }
};
export const webLoginApi = ({ login, password, csrfToken }) => {
  const urlencoded = new URLSearchParams();
  urlencoded.append("csrf_token", csrfToken);
  urlencoded.append("login", login);
  urlencoded.append("password", password);
  urlencoded.append("redirect", "");

  const reqObj = {
    url: "/web/login",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    payload: urlencoded,
    raw: true, // 👈 tell fetchApi not to wrap
  };

  return fetchApi(reqObj);
};
export const authRequest = async (login, password) => {
  try {
    const payload = {
      db: DB_NAME,
      login,
      password,
    };

    const reqObj = {
      url: "/web/session/authenticate",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      payload,
    };

    const response = await fetchApi(reqObj);

    if (!response) {
      return { success: false, error: "No response from server" };
    }

    const data = response.data; // Axios already parses JSON
    // console.log("session info", data);

    if (data.error) {
      return { success: false, error: data.error };
    }

    const result = data.result;
    return {
      success: true,
      company_id: result.company_id,
      user_id: result.uid,
      company_partner_id: [result.uid],
      context: result.user_context,
      username: result.name,
      ...result,
    };
  } catch (error) {
    console.error("An error occurred:", error);
    return { success: false, error: error.message };
  }
};
export async function logoutSession() {
  return fetchApi({
    url: "/web/session/logout",
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
    },
    raw: true, // 👈 ensures request is sent as-is, no jsonrpc wrapping
  });
}
