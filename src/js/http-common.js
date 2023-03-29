import axios from 'axios';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
export const HTTP = axios.create({
  baseURL: ``,
  headers: {
    Authorization: 'Bearer {token}'
  }
})