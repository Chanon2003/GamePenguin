const SummaryApi = {
  register: {
    url: '/api/user/signup-email',
    method: 'post',
  },
  login: {
    url: '/api/user/signin-email',
    method: 'post',
  },
  logout: {
    url: '/api/user/logout',
    method: 'get',
  },
  refreshToken: {
    url: '/api/user/refresh-token',
    method: 'post'
  },
}

export default SummaryApi





