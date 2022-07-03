<template>
<div class="profile">
    <h1 class="headline grey--text text-center"><v-icon>mdi-account</v-icon>Profile</h1>
    <v-alert
      :value="alert"
      color="success"
      dark
      class="fxd"
      icon="mdi-account"
      transition="scale-transition"
    >
      Profile saved.
    </v-alert>
    <v-alert
      :value="usernameError"
      color="error"
      dark
      class="fxd"
      icon="mdi-account"
      transition="scale-transition"
    >
      Username is taken.
    </v-alert>
    <v-alert
      :value="emailError"
      color="error"
      dark
      class="fxd"
      icon="mdi-account"
      transition="scale-transition"
    >
      Email is taken.
    </v-alert>
    <v-expansion-panels>
    <ValidationObserver v-slot="{handleSubmit}">
    <v-expansion-panel>
      <v-expansion-panel-header>
        Username
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-form @submit.prevent="handleSubmit(changeUsername)">
            <v-container>
                <v-row>
                    <v-col cols="6" sm="6">
                        <div>
                            <ValidationProvider name="Username" rules="required|min:3|max:50" v-slot="{ errors }">
                            <v-text-field :label="`New username`" v-model="username" single-line solo></v-text-field>
                             <span>{{ errors[0] }}</span>
                            </ValidationProvider>
                        </div>
                    </v-col>
                    <v-col cols="6" sm="6">
                        <v-btn type="submit">Save changes</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header>
        First name
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-form @submit.prevent="handleSubmit(changeFirstname)">
            <v-container>
                <v-row>
                    <v-col cols="6" sm="6">
                        <div>
                            <ValidationProvider name="Firstname" rules="required|min:3|max:50|alpha" v-slot="{ errors }">
                            <v-text-field :label="`New firstname`" v-model="firstname" single-line solo></v-text-field>
                            <span>{{ errors[0] }}</span>
                            </ValidationProvider>
                        </div>
                    </v-col>
                    <v-col cols="6" sm="6">
                        <v-btn type="submit">Save changes</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
      </v-expansion-panel-content>
    </v-expansion-panel>


    <v-expansion-panel>
      <v-expansion-panel-header>
        Last name
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-form @submit.prevent="handleSubmit(changeLastname)">
            <v-container>
                <v-row>
                    <v-col cols="6" sm="6">
                        <div>
                            <ValidationProvider name="Lastname" rules="required|min:3|max:50|alpha" v-slot="{ errors }">
                            <v-text-field :label="`New lastname`" v-model="lastname" single-line solo></v-text-field>
                            <span>{{ errors[0] }}</span>
                            </ValidationProvider>
                        </div>
                    </v-col>
                    <v-col cols="6" sm="6">
                        <v-btn type="submit">Save changes</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
      </v-expansion-panel-content>
    </v-expansion-panel>


    <v-expansion-panel>
      <v-expansion-panel-header>
        Email
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-form @submit.prevent="handleSubmit(changeEmail)">
            <v-container>
                <v-row>
                    <v-col cols="6" sm="6">
                        <div>
                            <ValidationProvider name="Email" rules="required|min:6|max:50|email" v-slot="{ errors }">
                            <v-text-field :label="`New email`" v-model="email" single-line solo></v-text-field>
                            <span>{{ errors[0] }}</span>
                            </ValidationProvider>
                        </div>
                    </v-col>
                    <v-col cols="6" sm="6">
                        <v-btn type="submit">Save changes</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
      </v-expansion-panel-content>
    </v-expansion-panel>

    </ValidationObserver>
  </v-expansion-panels>
</div>
</template>

<script>
import axios from 'axios'
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { validate, extend} from 'vee-validate';
import { required, email, min, max, alpha } from 'vee-validate/dist/rules';

extend('required', required);
extend('email', email);
extend('min', min);
extend('max', max);
extend('alpha', alpha);
export default {
    name:'Profile',
    data(){
        return{
            alert:false,
            usernameError:false,
            emailError:false,
            firstname:'',
            username:'',
            lastname:'',
            email: ''
        }
    },
    methods:{
        changeUsername(){
            let dis = this
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            };

            const bodyParameters = {
                username:this.username
            };

            axios.patch('http://localhost:5000/api/users', bodyParameters,config)
                 .then(function(response){
                    // console.log(response);
                    dis.alert = true
                    setTimeout(function(){dis.alert = false},2000)
                }).catch(err => {
                // console.log(err);
                dis.usernameError = true
                setTimeout(function(){dis.usernameError = false},2000)
            })
            },
        changeFirstname(){
            let dis = this
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            };

            const bodyParameters = {
                firstName:this.firstname
            };

            axios.patch('http://localhost:5000/api/users', bodyParameters,config)
                 .then(function(response){
                    dis.alert = true
                    setTimeout(function(){dis.alert = false},2000)
                }).catch(err => {
                console.log(err);
            })
            },
            changeLastname(){
                let dis = this
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            };

            const bodyParameters = {
                lastName:this.lastname
            };

            axios.patch('http://localhost:5000/api/users', bodyParameters,config)
                 .then(function(response){
                    dis.alert = true
                    setTimeout(function(){dis.alert = false},2000)
                }).catch(err => {
                console.log(err);
            })
            },
            changeEmail(){
                let dis = this
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            };

            const bodyParameters = {
                email:this.email
            };

            axios.patch('http://localhost:5000/api/users', bodyParameters,config)
                 .then(function(response){
                    dis.alert = true
                    setTimeout(function(){dis.alert = false},2000)
                }).catch(err => {
                console.log(err);
                dis.emailError = true
                setTimeout(function(){dis.emailError = false},2000)
            })
            }
    },
    created(){
        if(!localStorage.getItem("token"))
             window.location.href = "/"
        document.title = "Blograd | Profile"
    },
    mounted(){
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            };
        const vm = this;
        axios.get('http://localhost:5000/api/profile',config)
             .then(function(response)
            {
                vm.username = response.data.username
                vm.firstname = response.data.firstName
                vm.email = response.data.email
                vm.lastname = response.data.lastName
            }).catch(err => {
                console.log(err);
            })
    }
}
</script>

<style>

</style>






