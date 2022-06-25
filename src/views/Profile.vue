<template>
<div class="profile">
    <h1 class="headline grey--text text-center">Profile</h1>
    <v-expansion-panels>
    <!-- <v-expansion-panel
      v-for="param in profileParameters"
      :key="param.paramName"
    >
      <v-expansion-panel-header>
        {{param.paramName}}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-form @submit="handleFormData">
            <v-container>
                <v-row>
                    <v-col cols="6" sm="6">
                        <div v-if="param.value">
                            
                            <v-text-field :label="`New ${param.paramName}`" v-model="param.value" single-line solo></v-text-field>
                        </div>
                        <div v-else>
                            <v-text-field :label="`New ${param.paramName}`" type="password" v-model="param.value" single-line solo></v-text-field>
                        </div>
                    </v-col>
                    <v-col cols="6" sm="6">
                        <v-btn type="submit">Save changes</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
      </v-expansion-panel-content>
    </v-expansion-panel> -->
    <v-expansion-panel>
      <v-expansion-panel-header>
        Username
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-form @submit="changeUsername">
            <v-container>
                <v-row>
                    <v-col cols="6" sm="6">
                        <div>
                            <v-text-field :label="`New username`" v-model="username" single-line solo></v-text-field>
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
        <v-form @submit="changeFirstname">
            <v-container>
                <v-row>
                    <v-col cols="6" sm="6">
                        <div>
                            <v-text-field :label="`New firstname`" v-model="firstname" single-line solo></v-text-field>
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
        <v-form @submit="changeLastname">
            <v-container>
                <v-row>
                    <v-col cols="6" sm="6">
                        <div>
                            <v-text-field :label="`New lastname`" v-model="lastname" single-line solo></v-text-field>
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
        <v-form @submit="changeEmail">
            <v-container>
                <v-row>
                    <v-col cols="6" sm="6">
                        <div>
                            <v-text-field :label="`New email`" v-model="email" single-line solo></v-text-field>
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


  </v-expansion-panels>
</div>
</template>

<script>
import axios from 'axios'
export default {
    name:'Profile',
    data(){
        return{
            firstname:'',
            username:'',
            lastname:'',
            email: ''
        }
    },
    methods:{
        changeUsername(){
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            };

            const bodyParameters = {
                username:this.username
            };

            axios.patch('http://localhost:5000/api/users', bodyParameters,config)
                 .then(function(response){
                    console.log(response);
                }).catch(err => {
                console.log(err);
            })
            },
        changeFirstname(){
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            };

            const bodyParameters = {
                firstName:this.firstname
            };

            axios.patch('http://localhost:5000/api/users', bodyParameters,config)
                 .then(function(response){
                    console.log(response);
                }).catch(err => {
                console.log(err);
            })
            },
            changeLastname(){
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            };

            const bodyParameters = {
                lastName:this.lastname
            };

            axios.patch('http://localhost:5000/api/users', bodyParameters,config)
                 .then(function(response){
                    console.log(response);
                }).catch(err => {
                console.log(err);
            })
            },
            changeEmail(){
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            };

            const bodyParameters = {
                email:this.email
            };

            axios.patch('http://localhost:5000/api/users', bodyParameters,config)
                 .then(function(response){
                    console.log(response);
                }).catch(err => {
                console.log(err);
            })
            }
    },
    created(){
        if(!localStorage.getItem("token"))
             window.location.href = "/"
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






