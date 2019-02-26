export default class Auth {
  static getAccessToken() {
    return window.localStorage.getItem('access_token');
  }
}
