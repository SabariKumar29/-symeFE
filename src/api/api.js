import queryString from "query-string";
import { getSessionId } from "../utils/localStorage";
import axios from "axios";

const backendUrl = process.env.BACKEND_HOST || "http://localhost:3001/";

const httpMethods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
};

const createQueryFromParams = (params) => {
  let query = "";
  if (params && Object.keys(params).length) {
    query = `/?${queryString.stringify(params)}`;
  }
  return query;
};

const getAuthHeader = () => {
  const sessionId = getSessionId() || "";

  return { Authorization: sessionId };
};

export const api = {
  get: async (url, params) => {
    const query = createQueryFromParams(params);
    const fullUrl = `${backendUrl}${url}${query}`;
    const response = await fetch(fullUrl, {
      method: httpMethods.GET,
      headers: { ...getAuthHeader() },
    });
    const responseJson = await response.json();
    return responseJson;
  },
  post: async (url, body, params) => {
    const query = createQueryFromParams(params);
    const fullUrl = `${backendUrl}${url}${query}`;
    const response = await fetch(fullUrl, {
      method: httpMethods.POST,
      headers: {
        "Content-type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(body),
    });
    const responseJson = await response.json();
    return responseJson;
  },
  postUpload: async (url, file) => {
    const fullUrl = `${backendUrl}${url}`;
    const response = await axios.post(fullUrl, file);

    return response;
  },
  put: async (url, body, params) => {
    const query = createQueryFromParams(params);
    const fullUrl = `${backendUrl}${url}${query}`;
    const response = await fetch(fullUrl, {
      method: httpMethods.PUT,
      headers: {
        "Content-type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(body),
    });
    const responseJson = await response.json();
    return responseJson;
  },
  patch: async (url, body, params) => {
    const query = createQueryFromParams(params);
    const fullUrl = `${backendUrl}${url}${query}`;
    const response = await fetch(fullUrl, {
      method: httpMethods.PATCH,
      headers: {
        "Content-type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(body),
    });
    const responseJson = await response.json();
    return responseJson;
  },
  delete: async (url, body) => {
    const fullUrl = `${backendUrl}${url}`;

    const requestInit = {
      method: httpMethods.DELETE,
      headers: {
        "Content-type": "application/json",
        ...getAuthHeader(),
      },
    };

    if (body) {
      requestInit.body = JSON.stringify(body);
    }
    const response = await fetch(fullUrl, requestInit);
    const responseJson = await response.json();
    return responseJson;
  },
};
