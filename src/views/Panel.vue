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
            :items="desserts"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            item-key="name"
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
            <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
                More info about {{ item.name }}
            </td>
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
            value: 'name',
          },
        //   { text: 'First name', value: 'calories' },
          { text: 'Last name', value: 'fat' },
          { text: 'Username', value: 'carbs' },
          { text: 'Email', value: 'protein' },
          { text: 'Role', value: 'iron' },
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
                console.log(vm.loggedUser);
            if(vm.loggedUser.role != "Admin")
                setTimeout(function(){window.location.href = "/"},3000)
            else
                vm.checkIfAdmin = false
            }).catch(err => {
                console.log(err);
            })
    },
    mounted(){
            
    }
  }
</script>
<style>

</style>






