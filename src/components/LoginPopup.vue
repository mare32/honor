<template>
   <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          <v-icon small>mdi-account-plus</v-icon>Login
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Login</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  solo
                  label="Email"
                  required
                  v-model="email"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  solo
                  label="Password*"
                  required
                  type="password"
                  v-model="password"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="red darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="handleLogin"
            :loading="loading"
          >
            Log-in
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from 'axios'
export default {
    name:'LoginPopup',
    data:() =>({
        dialog: false,
        email:'',
        password:'',
        loading:false
    }),
    mounted(){
    },
    methods:{
      handleLogin(){
        let vm = this
        this.loading = true
        console.log(this.password);
            axios.post('http://localhost:5000/api/token',{
                email:this.email,
                password:this.password
            }).then(function(response){
                vm.loading = false
                localStorage.setItem("token", response.data.token)
                window.location.reload()
                // setTimeout(function(){window.location.reload()},1000)
            }).catch(function(){
               vm.loading = false
            })
      }
    },
    
}
</script>

<style>

</style>