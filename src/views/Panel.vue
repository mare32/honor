<template>
<div class="profile" v-if="!checkIfAdmin">
    <h1 class="headline grey--text text-center my-5">Admin Panel</h1>
    <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header>
        Users
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-data-table
            disable-pagination
            hide-default-footer
            disable-sort
            :headers="dessertHeaders"
            :items="users"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            item-key="username"
            show-expand
            class="elevation-1"
        >
            <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>Table</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-switch
                v-model="singleExpand"
                label="Single expand"
                class="mt-2"
                ></v-switch>
            </v-toolbar>
            </template>
            <template v-slot:expanded-item="{ item }">
            <div v-if="item.blogPosts.length" class="pa-5">
            <table class="bordered">
              <thead>
                <tr>
                    <td class="userPostsTd">
                      Id
                    </td>
                    <td class="userPostsTd">
                      Title
                    </td>
                    <td class="userPostsTd">
                      Health & Shield
                    </td>
                    <td class="userPostsTd">
                      Status
                    </td>
                    <td class="userPostsTd">
                      Hide
                    </td>
                    <td class="userPostsTd">
                      Delete
                    </td>
                </tr>
              </thead>
              <tbody>
              <tr v-for="post in item.blogPosts" :key="post.id">
                <td class="userPostsTd">
                  {{post.id}}
                </td>
                <td class="userPostsTd">
                  <router-link :to="{name:'Post',path:'/post/'+post.id,params:{id:post.id}}">{{post.title}}</router-link> 
                </td>
                <td class="userPostsTd">
                  <v-progress-linear
                        v-if="post.shield > 0"
                        :value="post.shield"
                        height="20"
                        color="blue"
                        rounded
                        class="my-2"
                    >
                        <strong>{{ Math.ceil(post.shield) }}<v-icon small>mdi-shield</v-icon></strong>
                    </v-progress-linear>
                    <v-progress-linear
                        v-if="post.health < 50"
                        :value="post.health"
                        height="20"
                        color="red"
                        rounded
                    >
                        <strong>{{ Math.ceil(post.health) }}<v-icon>mdi-hospital</v-icon></strong>
                    </v-progress-linear>
                    <v-progress-linear
                        v-else
                        :value="post.health"
                        height="20"
                        color="green"
                        rounded
                    >
                        <strong>{{ Math.ceil(post.health) }}<v-icon dark>mdi-hospital</v-icon></strong>
                    </v-progress-linear>
                </td>
                <td class="userPostsTd">
                  <v-chip small :class="`${post.status} white--text caption my-2`">{{post.status}}</v-chip> 
                </td>
                <td class="userPostsTd">
                  <v-btn color="black" dark>
                    <v-icon>mdi-eye-off</v-icon>
                  </v-btn>
                </td>
                <td class="userPostsTd">
                  <v-btn color="error" dark>
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
              </tbody>
            </table>
            </div>
            <div v-else class="pa-5">
                User has no posts.
            </div>
            </template>
        </v-data-table>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header>
        Blog Posts
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-simple-table>
            <template v-slot:default>
            <thead>
                <tr>
                <th class="text-left">
                    Name
                </th>
                <th class="text-left">
                    Calories
                </th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="item in desserts"
                :key="item.name"
                >
                <td>{{ item.name }}</td>
                <td>{{ item.calories }}</td>
                </tr>
            </tbody>
            </template>
        </v-simple-table>
      </v-expansion-panel-content>
    </v-expansion-panel>


    <v-expansion-panel>
      <v-expansion-panel-header>
        Categories
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-simple-table>
            <template v-slot:default>
            <thead>
                <tr>
                <th class="text-left">
                    Name
                </th>
                <th class="text-left">
                    Calories
                </th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="item in desserts"
                :key="item.name"
                >
                <td>{{ item.name }}</td>
                <td>{{ item.calories }}</td>
                </tr>
            </tbody>
            </template>
        </v-simple-table>
      </v-expansion-panel-content>
    </v-expansion-panel>


    <v-expansion-panel>
      <v-expansion-panel-header>
        Logs
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-simple-table>
            <template v-slot:default>
            <thead>
                <tr>
                <th class="text-left">
                    Name
                </th>
                <th class="text-left">
                    Calories
                </th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="item in desserts"
                :key="item.name"
                >
                <td>{{ item.name }}</td>
                <td>{{ item.calories }}</td>
                </tr>
            </tbody>
            </template>
        </v-simple-table>
      </v-expansion-panel-content>
    </v-expansion-panel>


  </v-expansion-panels>
</div>
<div v-else class="text-center">
    Checking for admin rights...
    <v-progress-linear
    color="lime"
    indeterminate
    reverse
    height="10"
    rounded
    ></v-progress-linear>
</div>
</template>
<script>
    import axios from 'axios'
    export default {
    name:'Panel',
    data () {
      return {
        loggedUser:null,
        expanded: [],
        singleExpand: false,
        dessertHeaders: [
          {
            text: 'First name',
            align: 'start',
            value: 'firstName',
          },
          { text: 'Last name', value: 'lastName' },
          { text: 'Username', value: 'username' },
          { text: 'Email', value: 'email' },
          { text: 'Role', value: 'role' },
          { text: '', value: 'data-table-expand' },
        ],
        desserts: [
          {
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            iron: '1%',
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
            iron: '1%',
          },
          {
            name: 'Eclair',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: '7%',
          },
          {
            name: 'Cupcake',
            calories: 305,
            fat: 3.7,
            carbs: 67,
            protein: 4.3,
            iron: '8%',
          },
          {
            name: 'Gingerbread',
            calories: 356,
            fat: 16.0,
            carbs: 49,
            protein: 3.9,
            iron: '16%',
          },
          {
            name: 'Jelly bean',
            calories: 375,
            fat: 0.0,
            carbs: 94,
            protein: 0.0,
            iron: '0%',
          },
          {
            name: 'Lollipop',
            calories: 392,
            fat: 0.2,
            carbs: 98,
            protein: 0,
            iron: '2%',
          },
          {
            name: 'Honeycomb',
            calories: 408,
            fat: 3.2,
            carbs: 87,
            protein: 6.5,
            iron: '45%',
          },
          {
            name: 'Donut',
            calories: 452,
            fat: 25.0,
            carbs: 51,
            protein: 4.9,
            iron: '22%',
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
          },
        ],
        users:[],
        posts:[],
        categories:[],
        logs:[],
        checkIfAdmin:true
      }
    },
    methods:{
        
    },
    created(){
        if(!localStorage.getItem("token"))
             setTimeout(function(){window.location.href = "/"},3000)
             // naci nacin kako proveriti korisnika za ulogu
             // eventualno pingovati endpoint za profil i proveriti ulogu
        const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            };
        const vm = this;
        axios.get('http://localhost:5000/api/profile',config)
             .then(function(response)
            {
                vm.loggedUser = response.data
                // console.log(vm.loggedUser);
            if(vm.loggedUser.role != "Admin")
                setTimeout(function(){window.location.href = "/"},3000)
            else
                vm.checkIfAdmin = false
            }).catch(err => {
                console.log(err);
            })
    },
    mounted(){
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            };
        const vm = this;
        axios.get('http://localhost:5000/api/users',config)
             .then(function(response)
            {
                vm.users = response.data.data
                console.log(vm.users);
            }).catch(err => {
                console.log(err);
            })


        axios.get('http://localhost:5000/api/blogposts',config)
             .then(function(response)
            {
                vm.posts = response.data.data
                console.log(vm.posts)
            }).catch(err => {
                console.log(err);
            })
            
            axios.get('http://localhost:5000/api/categories',config)
             .then(function(response)
            {
                vm.categories = response.data.data
                console.log(vm.categories)
            }).catch(err => {
                console.log(err);
            })

        axios.get('http://localhost:5000/api/useCaseLogs?dateFrom=2022-06-26&dateTo=2022-06-27',config)
             .then(function(response)
            {
                vm.logs = response
                console.log(vm.logs)
            }).catch(err => {
                console.log(err);
            })
    }
  }
</script>
<style>
 .userPostsTd{
  border-right:2px solid #000;
  border-bottom:2px solid #000;
 }
</style>






