import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
  get getUrl() {
    return window.location.pathname === '/';
  }
}
