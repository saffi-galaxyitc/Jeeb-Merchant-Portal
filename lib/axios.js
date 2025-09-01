import axios from "axios";

export const fetchApi = async ({
  url = "",
  method = "POST",
  headers = {},
  params = {},
  payload = {},
  raw = false, // 👈 added flag
} = {}) => {
  try {
    const data = raw
      ? payload // send as-is (e.g., URLSearchParams)
      : {
          jsonrpc: "2.0",
          method: "call",
          params: {
            ...payload,
          },
        };

    const response = await axios({
      url: `/api${url}`,
      method,
      headers,
      params,
      data,
    });
    return response;
  } catch (e) {
    console.error("Error while fetching Api", {
      url,
      error: { ...e },
      message: e.message,
    });
    return null;
  }
};
//
