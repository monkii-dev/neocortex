
/**
 * First we will load all of this project's JavaScript dependencies which
 * include Vue and Vue Resource. This gives a great starting point for
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');
var App = require('./App.vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.http.options.root = 'api';

Vue.component('app', App);
Vue.component('item-display-queue', require('./components/ItemDisplayQueue.vue'));
Vue.component('full-screen-queue-item', require('./components/FullScreenQueueItem.vue'));
Vue.component('item-image', require('./components/Items/Image.vue'));
Vue.component('item-video', require('./components/Items/Video.vue'));
Vue.component('item-youtube', require('./components/Items/YouTube.vue'));
Vue.component('item-vimeo', require('./components/Items/Vimeo.vue'));
Vue.component('item-weather', require('./components/Items/Weather.vue'));

require('./queueIndex.js');
require('./randomImage.js');

if (window.location.pathname === '/') {
    const app = new Vue({
      el: '#main',
      template: '<app/>'
    });
}
