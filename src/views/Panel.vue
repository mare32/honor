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
            <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                    <td>
                      Id
                    </td>
                    <td>
                      Title
                    </td>
                    <td>
                      Health & Shield
                    </td>
                    <td>
                      Status
                    </td>
                    <td>
                      Hide
                    </td>
                    <td>
                      Delete
                    </td>
                </tr>
              </thead>
              <tbody>
              <tr v-for="post in item.blogPosts" :key="post.id">
                <td>
                  {{post.id}}
                </td>
                <td>
                  <router-link :to="{name:'Post',path:'/post/'+post.id,params:{id:post.id}}">{{post.title}}</router-link> 
                </td>
                <td>
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
                    <!-- <v-progress-linear
                        v-if="post.health < 50"
                        :value="post.health"
                        height="20"
                        color="red"
                        rounded
                    >
                        <strong>{{ Math.ceil(post.health) }}<v-icon>mdi-hospital</v-icon></strong>
                    </v-progress-linear> -->
                    <v-progress-linear
                        :value="post.health"
                        height="20"
                        :color="getHealthBarColor(post.health)"
                        rounded
                    >
                        <strong>{{ Math.ceil(post.health) }}<v-icon dark>mdi-hospital</v-icon></strong>
                    </v-progress-linear>
                </td>
                <td>
                  <v-chip small :class="`${post.status} white--text caption my-2`">{{post.status}}</v-chip> 
                </td>
                <td>
                  <v-btn color="black" :dark="post.status == 'Invisible' ? false : true" :disabled="post.status == 'Invisible' ? true : false" @click="hidePost(post.id)">
                    <v-icon>mdi-eye-off</v-icon>
                  </v-btn>
                </td>
                <td>
                  <v-btn color="error" dark @click="deletePost(post.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
              </tbody>
            </template>
        </v-simple-table>
            </div>
            <div v-else class="pa-5">
                User has no posts.
            </div>
            </template>
        </v-data-table>
        <v-simple-table>
            <template v-slot:default>
            <thead>
                <tr>
                <th class="text-left">
                    User
                </th>
                <th class="text-left">
                    Action
                </th>
                <th class="text-left" v-if="actionChangeRole">
                    Role
                </th>
                <th class="text-left">
                    Proccess
                </th>
                </tr>
            </thead>
            <tbody>
              <tr>
                <td class="tdNewCat">
                  <v-select
                    :items="userNames"
                    label="Users"
                    outlined
                    v-model="selectedUser"
                    class="selectInputs"
                  ></v-select>
                </td>
                <td class="tdNewCat">
                  <v-select
                    :items="['Change role','Delete']"
                    label="Actions"
                    outlined
                    v-model="selectedAction"
                    class="selectInputs"
                    @change="actionChange"
                  ></v-select>
                </td>
                <td v-if="actionChangeRole" class="tdNewCat">
                  <v-select
                    :items="['1-Admin','2-Normal']"
                    label="Roles"
                    outlined
                    v-model="selectedRole"
                    class="selectInputs"
                  ></v-select>
                </td>
                <td class="tdNewCat" v-show="actionChangeRole">
                  <v-btn large color="primary" @click="changeUserRole">
                    <v-icon>mdi-account-cog</v-icon>
                  </v-btn>
                </td>
                <td class="tdNewCat" v-show="!actionChangeRole">
                  <v-btn large color="error" dark @click="deleteUser" >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>

              </tr>
            </tbody>
            </template>
        </v-simple-table>
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
                      Id
                  </th>
                  <th class="text-left">
                      Title
                  </th>
                  <th class="text-left">
                      Author Username
                  </th>
                  <th class="text-left">
                      Author Email
                  </th>
                  <th class="text-left">
                      Health & Shield
                  </th>
                  <th class="text-left">
                      Status
                  </th>
                  <th class="text-left">
                      Hide
                  </th>
                  <th class="text-left">
                      Delete
                  </th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="post in posts"
                :key="post.id"
                >
                <td>{{ post.id }}</td>
                <td><router-link :to="{name:'Post',path:'/post/'+post.id,params:{id:post.id}}">{{post.title}}</router-link> </td>
                <td>{{ post.author.username }}</td>
                <td>{{ post.author.email }}</td>
                <td>
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
                        :value="post.health"
                        height="20"
                        :color="getHealthBarColor(post.health)"
                        rounded
                    >
                        <strong>{{ Math.ceil(post.health) }}<v-icon dark>mdi-hospital</v-icon></strong>
                    </v-progress-linear>
                </td>
                <td><v-chip small :class="`${post.status} white--text caption my-2`">{{post.status}}</v-chip> </td>
                <td>
                  <v-btn color="black" :dark="post.status == 'Invisible' ? false : true" :disabled="post.status == 'Invisible' ? true : false" @click="hidePost(post.id)">
                    <v-icon>mdi-eye-off</v-icon>
                  </v-btn>
                </td>
                <td>
                  <v-btn color="error" dark  @click="deletePost(post.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
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
                    Id
                </th>
                <th class="text-left">
                    Name
                </th>
                <th class="text-left">
                    Remove
                </th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="item in categories"
                :key="item.id"
                >
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>
                    <v-btn color="error" @click="deleteCategory(item.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
                <ValidationObserver v-slot="{handleSubmit}">
                <tr>
                <td class="tdNewCat">
                  <ValidationProvider name="Category" rules="required|alpha|min:3|max:30" v-slot="{ errors }">
                    <v-text-field
                    solo
                    label="New category"
                    dense
                    class="mt-5"
                    v-model="newCategoryName"
                    ></v-text-field>
                    <span>{{ errors[0] }}</span>
                  </ValidationProvider>
                </td>
                <td colspan="2">
                  <v-btn color="primary" @click="handleSubmit(addCategory)">Add</v-btn>
                </td>
              </tr>
                </ValidationObserver>
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
            <!-- <v-col
                cols="4"
                lg="4"
                style="display:inline-block"
              >
                <v-menu
                  ref="menu1"
                  v-model="menu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="auto"
                  style="display:inline-block"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateFromFormatted"
                      label="Date From"
                      hint="MM/DD/YYYY format"
                      persistent-hint
                      prepend-icon="mdi-calendar"
                      v-bind="attrs"
                      @blur="dateFrom = parseDate(dateFromFormatted)"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dateFrom"
                    no-title
                    @input="menu1 = false"
                  ></v-date-picker>
                </v-menu>
                </v-col>
                <v-col
                cols="4"
                lg="4"
                style="display:inline-block"
              >
                <v-menu
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="auto"
                  style="display:inline-block"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateToFormatted"
                      label="Date To"
                      hint="MM/DD/YYYY format"
                      persistent-hint
                      prepend-icon="mdi-calendar"
                      v-bind="attrs"
                      @blur="dateTo = parseDate(dateToFormatted)"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dateTo"
                    no-title
                    @input="menu2 = false"
                  ></v-date-picker>
                </v-menu>
                </v-col>
                <v-select label="Filter by Use Case Name">

                </v-select> -->


                <!-- OLD SIMPLE TABLE OF LOGS -->
        <!-- <v-simple-table
          fixed-header
          height="300px"
        >
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  UseCase Name
                </th>
                <th class="text-left">
                  Username
                </th>
                <th class="text-left">
                  User id
                </th>
                <th class="text-left">
                  Executed at
                </th>
                <th class="text-left">
                  Data
                </th>
                <th class="text-left">
                  Is authorized
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="log in logs"
                :key="log.id"
              >
                <td>{{ log.useCaseName }}</td>
                <td>{{ log.username }}</td>
                <td>{{ log.userId }}</td>
                <td>{{ log.executedAt }}</td>
                <td>{{ log.data }}</td>
                <td>{{ log.isAuthorized }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table> -->
        <!-- OLD SIMPLE TABLE OF LOGS END -->
        <v-card>
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="logHeaders"
            :items="logs"
            :search="search"
          ></v-data-table>
        </v-card>
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
    import { ValidationProvider, ValidationObserver } from 'vee-validate';
    import {  extend } from 'vee-validate';
    import { required, min, max, alpha } from 'vee-validate/dist/rules';

    extend('required', required);
    extend('min', min);
    extend('max', max);
    extend('alpha', alpha);
    export default {
    name:'Panel',
    data () {
      return {
        // dateFrom: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString(),
        // dateFrom: new Date().toISOString().slice(0, 10),
        // dateTo: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString(),
        // today: new Date(),
        // dateTo: (new Date().setDate(today.getDate()+1)).toISOString().slice(0, 10),
        // dateFromFormatted: this.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),
        // dateToFormatted: this.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),
        loggedUser:null,
        // menu1:false,
        // menu2:false,
         search: '',
          logHeaders: [
            {
              text: 'Use Case Name',
              align: 'start',
              value: 'useCaseName',
            },
            { text: 'Username', value: 'username' },
            { text: 'User Id', value: 'userId' },
            { text: 'Executed at', value: 'executedAt' },
            { text: 'Data', value: 'data' },
            { text: 'Is Authorized', value: 'isAuthorized' },
          ],
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
        users:[],
        posts:[],
        categories:[],
        logs:[],
        checkIfAdmin:true,
        actionChangeRole:false,
        selectedAction:'Delete',
        selectedRole:'',
        selectedUser:'',
        userNames:[],
        newCategoryName:''
      }
    },
    // computed: {
    //   computedDateFromFormatted () {
    //     return this.formatDate(this.dateFrom)
    //   },
    //   computedDateToFormatted () {
    //     return this.formatDate(this.dateTo)
    //   },
    // },
    // watch: {
    //   dateFrom (val) {
    //     this.dateFromFormatted = this.formatDate(this.dateFrom)
    //   },
    //   dateTo (val) {
    //     this.dateToFormatted = this.formatDate(this.dateTo)
    //   },
    // },
    created(){
        if(!localStorage.getItem("token"))
             setTimeout(function(){window.location.href = "/"},3000)
        document.title = "Blograd | Admin Panel"
        const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            };
        const vm = this;
        axios.get('http://localhost:5000/api/profile',config)
             .then(function(response)
            {
                vm.loggedUser = response.data
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
        axios.get('http://localhost:5000/api/users?perPage=100',config)
             .then(function(response)
            {
              vm.users = response.data.data
                for(let un of vm.users)
                  vm.userNames.push(un.id+"-"+un.username)
            }).catch(err => {
                console.log(err);
            })


        axios.get('http://localhost:5000/api/blogposts?perPage=100',config)
             .then(function(response)
            {
                vm.posts = response.data.data
            }).catch(err => {
                console.log(err);
            })
            
            axios.get('http://localhost:5000/api/categories?perPage=100',config)
             .then(function(response)
            {
                vm.categories = response.data.data
            }).catch(err => {
                console.log(err);
            })
            let td = new Date().toISOString().slice(0, 10)
            let today = new Date()
            let tmrw = new Date(today)
            tmrw.setDate(tmrw.getDate()+1)
            tmrw = tmrw.toISOString().slice(0, 10)
            console.log(tmrw);
          // dateFrom should be dynamic and customizable
        axios.get('http://localhost:5000/api/useCaseLogs?dateFrom='+td+'&dateTo='+tmrw,config)
             .then(function(response)
            {
              let tmpVal;
              let tmpVal2;
              for(let log of response.data)
              {
                  tmpVal = log.executedAt.split("T")
                  tmpVal2 = tmpVal[1].split(".")
                  log.executedAt = tmpVal[0]+ " | " +tmpVal2[0]
                vm.logs.push(log)
              }
                
            }).catch(err => {
                console.log(err);
            })
    },
    methods:{
      // formatDate (date) {
      //   if (!date) return null

      //   const [year, month, day] = date.split('-')
      //   return `${month}/${day}/${year}`
      // },
      // parseDate (date) {
      //   if (!date) return null

      //   const [month, day, year] = date.split('/')
      //   return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      // },
      getHealthBarColor(health){
        // depending on health condition of the post display different color
        if(health > 66)
          return 'green'
        else if(health <= 66 && health > 33)
          return '#fcb103'
        else
          return 'red'
      },
      actionChange()
      {
        if(this.selectedAction == "Delete")
          this.actionChangeRole = false
        else
          this.actionChangeRole = true
      },
      changeUserRole()
      {
        if(this.selectedUser == '')
        alert("Please select a user")
        else{
          let userTmp = this.selectedUser.split("-")
          let userId = userTmp[0]
          let roleTmp = this.selectedRole.split("-")
          let roleId = roleTmp[0]
          var data = JSON.stringify({
            "roleId":roleId,
                "userId":userId
          });
          const config = {
                  method: 'patch',
                  url: 'http://localhost:5000/api/admin',
                  headers:{ 
                    'Authorization': 'Bearer '+localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                    },
                  data:data
              };
          axios(config)
               .then(function(response)
              {
                  alert('Uloga promenjena')
                  window.location.reload()
              }).catch(err => {
                  alert(err.response.data.message)
                  console.log(err);
              })
        }
      },
      deleteUser()
      {
        if(this.selectedUser == '')
        alert("Please select a user")
        else{
        let userTmp = this.selectedUser.split("-")
        let userId = userTmp[0]
        let dis = this
        const config = {
                method: 'delete',
                url: 'http://localhost:5000/api/users/'+userId,
                headers:{ 
                  'Authorization': 'Bearer '+localStorage.getItem('token')
                  }
            };
            this.loading = true
        axios(config)
            .then(function(response)
            {
                alert('Korisnik je obrisan')
                dis.loading = false
                window.location.reload()
            }).catch(err => {
                alert('Something went wrong')
                console.log(err);
            })
        }
      },
      deletePost(postId)
      {
        let dis = this
        const config = {
                method: 'delete',
                url: 'http://localhost:5000/api/blogposts/'+postId,
                headers:{ 
                  'Authorization': 'Bearer '+localStorage.getItem('token')
                  }
            };
            this.loading = true
        axios(config)
            .then(function(response)
            {
                alert('Objava obrisana')
                dis.loading = false
                window.location.reload()
            }).catch(err => {
                alert('Nesto je krenulo po zlu')
                console.log(err);
            })
      },
      hidePost(postId)
      {
          var data = JSON.stringify({
            "id":postId,
            "statusId":2
          });
          const config = {
                  method: 'patch',
                  url: 'http://localhost:5000/api/blogposts',
                  headers:{ 
                    'Authorization': 'Bearer '+localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                    },
                  data:data
              };
          axios(config)
               .then(function(response)
              {
                  alert('Objava je sakrivena')
                  window.location.reload()
              }).catch(err => {
                  alert(err.response.data.message)
                  console.log(err);
              })
      },
      addCategory()
      {
        if(this.newCategoryName == '')
        {
          //klijentska validacija
          alert("Niste uneli ime kategorije")
        }else{
          let newName = this.newCategoryName
           var data = JSON.stringify({
              "name":newName
            });
            const config = {
                    method: 'post',
                    url: 'http://localhost:5000/api/categories',
                    headers:{ 
                      'Authorization': 'Bearer '+localStorage.getItem('token'),
                      'Content-Type': 'application/json'
                      },
                    data:data
                };
            axios(config)
                 .then(function(response)
                {
                    alert('Kategorija je dodata')
                    window.location.reload()
                }).catch(err => {
                    alert(err.response.data.message)
                    console.log(err);
                })
        }
      },
      deleteCategory(catId)
      {
        let dis = this
        const config = {
                method: 'delete',
                url: 'http://localhost:5000/api/categories/'+catId,
                headers:{ 
                  'Authorization': 'Bearer '+localStorage.getItem('token')
                  }
            };
            this.loading = true
        axios(config)
            .then(function(response)
            {
                alert('Kategorija obrisana')
                dis.loading = false
                window.location.reload()
            }).catch(err => {
                alert('Kategorija je vec vezana za neke objave, brisanje je otkazano.')
                console.log(err);
            })
      }
    }
  }
</script>
<style>
 .tdNewCat{
  margin-top:2em !important;
 }
 .selectInputs{
  margin-bottom:none !important;
  margin-top:2em !important;
 }
</style>






