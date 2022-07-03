<template>
  <v-app>
    
    <v-app-bar flat app class="grey lighten-3">
        <Navbar/>
    </v-app-bar>
    <v-main class="mx-4 mb-4">
      <router-view></router-view>
    </v-main>
    <v-footer
      padless
    >
    <v-col
        class="text-center"
        cols="12"
      >
    <v-card
      flat
      tile
      class="teal lighten-1 white--text text-center"
    >
      <v-card-text>
        <v-btn
          v-for="icon in icons"
          :key="icon"
          class="mx-4 white--text"
          icon
        >
          <v-icon size="24px">
            {{ icon }}
          </v-icon>
        </v-btn>
      </v-card-text>

      <v-card-text class="white--text pt-0">
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} — <strong>Blograd</strong>
      </v-card-text>
    </v-card>
    </v-col>
  </v-footer>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
export default {
  name: 'App',
  components:{Navbar},
  data: () => ({
      icons: [
        'mdi-facebook',
        'mdi-twitter',
        'mdi-linkedin',
        'mdi-instagram',
      ],
    }),
  created(){
    var hours = 8;
    var now = new Date().getTime();
    var setupTime = localStorage.getItem('setupTime');
    if (setupTime == null) {
        localStorage.setItem('setupTime', now)
    } else {
        if(now-setupTime > hours*60*60*1000) {
            localStorage.clear()
            localStorage.setItem('setupTime', now);
        }
    }
  }
};
</script>