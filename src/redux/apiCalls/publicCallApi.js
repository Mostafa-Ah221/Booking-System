import axios from "axios";

const BASE_URL = "https://api.appointroll.com/api/public";

export async function fetchPublicPlans() {
  const response = await axios.get(`${BASE_URL}/plans`);
  return response.data;
}

export async function sendContactMail(payload) {
  const response = await axios.post(`${BASE_URL}/contact/send-mail`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}