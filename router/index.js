import Vue from 'vue'
import Router from 'vue-router'

// Function to create routes
// Is default lazy but can be changed
function route(path, view) {
  return {
    path: path,
    name: view,
    props: true,
    component: resolve => import(`views/${view}.vue`).then(resolve)
  }
}

Vue.use(Router)

export function createRouter() {
  const router = new Router({
    base: __dirname,
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      route('/', 'Home'),
      route('/sketch/:id/:title?/:commentId?', 'SketchDetails'),
      route('/create', 'Create'),
      // Global redirect for 404
      { path: '*', redirect: '/' }
    ]
  })

  return router
}
