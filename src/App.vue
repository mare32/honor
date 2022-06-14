<template>
  <v-app>
    <v-app-bar flat app class="grey lighten-3">
        <Navbar/>
    </v-app-bar>
    <v-content class="mx-4 mb-4">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
export default {
  name: 'App',
  components:{Navbar},
  data: () => ({
    //
  }),
};
</script>
