import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import YourPosts from '../views/YourPosts.vue'
import Profile from '../views/Profile.vue'
import Post from '../views/Post.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/your-posts',
    name: 'yourposts',
    component: YourPosts
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile
  },
  {
    path:'/post/:id',
    name:'Post',
    component: Post,
    props: true
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
