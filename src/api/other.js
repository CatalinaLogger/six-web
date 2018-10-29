import axios from 'axios'

// 金山词霸每日一句
export function getDaily(date) {
  const url = '/api/getDaily'
  const data = {
    date: date
  }
  // Make a request for a user with a given ID
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res)
  }).catch(err => {
    console.log(err)
  })
}
