<template>
   <v-row justify="center">
     <ValidationObserver v-slot="{handleSubmit}">
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
          <v-icon small>mdi-account-plus</v-icon>Register
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Register</span>
        </v-card-title>
        <v-card-text>
          <v-container>
           
            <v-row>
              <v-col cols="12">
                <ValidationProvider name="Firstname" rules="required|alpha" v-slot="{ errors }">
                <v-text-field
                  solo
                  label="Firstname*"
                  required
                  v-model="firstname"
                ></v-text-field>
                <span>{{ errors[0] }}</span>
                </ValidationProvider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <ValidationProvider name="Lastname" rules="required|alpha" v-slot="{ errors }">
                <v-text-field
                  solo
                  label="Lastname*"
                  required
                  v-model="lastname"
                ></v-text-field>
                 <span>{{ errors[0] }}</span>
                </ValidationProvider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <ValidationProvider name="Username" rules="required|min:4|max:20" v-slot="{ errors }">
                <v-text-field
                  solo
                  label="Username*"
                  required
                  v-model="username"
                ></v-text-field>
                <span>{{ errors[0] }}</span>
                </ValidationProvider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <ValidationProvider name="Email" rules="required|email" v-slot="{ errors }">
                <v-text-field
                  solo
                  label="Email*"
                  required
                  v-model="email"
                ></v-text-field>
                <span>{{ errors[0] }}</span>
                </ValidationProvider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <ValidationProvider name="Password" rules="required|min:4|max:10" v-slot="{ errors }">
                <v-text-field
                  solo
                  label="Password*"
                  required
                  type="password"
                  v-model="password"
                ></v-text-field>
                <span>{{ errors[0] }}</span>
                </ValidationProvider>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
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
        <v-alert type="success" v-if="alert">
         Registered succesfully! Please Log in.
        </v-alert>
        <v-alert type="error" v-if="alertError">
         <span v-for="error in errors" :key="error">
          {{error}}<br/>
         </span>
        </v-alert>
        <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            :loading="loading"
            @click="handleSubmit(handleRegistration)"
          >
            Register
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </ValidationObserver>
  </v-row>
</template>

<script>
import axios from 'axios'
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { validate, extend} from 'vee-validate';
import { required, email, integer, between, min, max, alpha } from 'vee-validate/dist/rules';

extend('required', required);
extend('email', email);
extend('integer', integer);
extend('between', between);
extend('min', min);
extend('max', max);
extend('alpha', alpha);
export default {
    name:'RegisterPopup',
    data:() =>({
        dialog: false,
        errors: [],
        show:true,
        alert:false,
        alertError:false,
        firstname:'',
        lastname:'',
        email:'',
        password:'',
        username:'',
        loading:false
    }),
    components:{
      ValidationObserver, ValidationProvider,validate,required,email
    },
    methods:{
      
      handleRegistration(){
            var vm = this
            this.loading = true
            this.errors = []
            axios.post('http://localhost:5000/api/register',{
                email:this.email,
                password:this.password,
                firstname:this.firstname,
                lastname:this.lastname,
                username:this.username,
            }).then(function(response){
                vm.alert = true;
                vm.loading = false
                vm.alertError = false
                // window.location.reload()
                // setTimeout(function(){window.location.reload()},1000)
            }).catch(errors => {
              console.log(errors);
              vm.loading = false
              vm.alert = false
              for(let error of errors.response.data.errors)
              {
                vm.errors.push(error.error)
              }
              vm.alertError = true

            })
      }
    }
}
</script>

<style>

</style>