import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:5000",
});

export const postVote = async (params) => {
  const response = await api.post("/vote", params);
  console.log(response);
  return response.data;
};
