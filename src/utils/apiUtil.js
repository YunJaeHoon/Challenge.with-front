import axios from "axios";

export const sendApi = async (url, method, needAuthority, data) => {
  
  const headers = needAuthority ? {
    Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };

  let response = null;

  try {
    if(method === "GET") {
      response = await axios.get(url, {
        headers: headers,
        params: data
      });
    }
    else if(method === "POST") {
      response = await axios.post(url, data, {
        headers: headers
      });
    }
    else if(method === "PATCH") {
      response = await axios.patch(url, data, {
        headers: headers
      });
    }
    else if(method === "DELETE") {
      response = await axios.delete(url, {
        headers: headers,
        params: data
      });
    }

    return response.data?.data;
  } catch(error) {
    throw error;
  }
}