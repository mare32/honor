<template>
<div class="home">
  <!-- <p class="headline grey--text text-center">Home</p> -->
  <v-alert
      :value="alert"
      color="error"
      dark
      class="fxd"
      icon="mdi-account"
      transition="scale-transition"
    >
      Please sign in to vote.
    </v-alert>
    <v-container class="my-5">
      <v-layout row class="mb-3">
        <v-row>
          <v-col cols="12" sm="12">
            <v-tooltip top small>
             <template v-slot:activator="{on, attrs}">
            <v-btn text color="black" v-on="on" v-bind="attrs">
              <v-icon left>mdi-sort-alphabetical-variant</v-icon>
              <span class="black--text">Sorting:</span>
            </v-btn>
            </template>
            <!-- <span>Sort by name</span> -->
          </v-tooltip>
          <v-tooltip top small>
             <template v-slot:activator="{on, attrs}">
            <v-btn text color="grey" @click="sortBy('title')" v-on="on" v-bind="attrs">
              <v-icon left small>mdi-post </v-icon>
              <span class="caption text-lowercase">By Post Name</span>
            </v-btn>
            </template>
            <span>Sort by name</span>
          </v-tooltip>
          <v-tooltip top small>
             <template v-slot:activator="{on, attrs}">
          <v-btn text color="grey" @click="sortBy('author')" v-on="on" v-bind="attrs">
            <v-icon left small>mdi-account</v-icon>
            <span class="caption text-lowercase">By Author</span>
          </v-btn>
          </template>
            <span>Sort by author</span>
          </v-tooltip>
          <v-tooltip top small>
             <template v-slot:activator="{on, attrs}">
          <v-btn text color="grey" @click="sortBy('health')" v-on="on" v-bind="attrs">
            <v-icon left small>mdi-hospital</v-icon>
            <span class="caption text-lowercase">By Health</span>
          </v-btn>
          </template>
            <span>Sort by health</span>
          </v-tooltip>
          <v-tooltip top small>
             <template v-slot:activator="{on, attrs}">
          <v-btn text color="grey" @click="sortBy('createdAt')" v-on="on" v-bind="attrs">
            <v-icon left small>mdi-calendar-range</v-icon>
            <span class="caption text-lowercase">By Date</span>
          </v-btn>
          </template>
            <span>Sort by date</span>
          </v-tooltip>
          </v-col>
          
        </v-row>
        <v-row>
          <span>
            <v-select
              :items="categories"
              label="Filter by category"
              dense
              v-model="selectedCategory"
              outlined
              @change="changeCategory"
            >
            </v-select>
            <!-- <v-menu
              rounded="rounded"
            >
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  color="teal darken-1"
                  class="white--text mx-3"
                  v-bind="attrs"
                  v-on="on"
                >
                  Filter by category
                </v-btn>
              </template>
  
              <v-list>
                <v-list-item
                  v-for="category in categories"
                  :key="category.id"
                  link
                  @change="changeCategory(category.name)"
                >
                  <v-list-item-title>{{category.name}}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu> -->
          </span>
          <span>
            <v-text-field dense label="Search" prepend-icon="mdi-magnify" single-line v-model="search" @keyup="SearchDbWithKeyword"></v-text-field>
          </span>
        <div class="mx-5">
          
          <v-select
            :items="perPageSelect"
            label="Per Page"
            dense
            prepend-icon="mdi-layers-search-outline"
            @change="ChangePerPage"
            v-model="perPage"
          ></v-select>
          <br>
          <span class="ml-5 caption text-lowercase">Pages:</span>
          <v-btn text color="grey" v-for="p in pages" :key="p" @click="PaginationLinkClick(p)"> <!-- PAGING -->
            <span :class="`caption text-lowercase ${activePage == p ? 'active' : ''}`">{{p}}</span>
          </v-btn>
        </div>
        </v-row>
      </v-layout>
      <div v-if="dbBlogPosts.length">
      <v-card v-for="post in dbBlogPosts" :key="post.id" class="my-5" :img="post.status == 'Amazing' ? '/img/amazing.jpg' : ''">
        <v-row row wrap :class="`pr-12 pa-3 post ${post.status}`" >
          <v-col cols="2" md="2">
            <v-icon v-if="post.status == 'Amazing'" class="white--text" large>mdi-pin</v-icon>
            <v-avatar size="100" class="mx-5">
              <img
                :src="post.image.src"
                :alt="post.image.alt"
              >
            </v-avatar>
          </v-col >
          <v-col cols="12" md="6">
            <div class="caption grey--text">Post title</div>
            <router-link :class="`${post.status == 'Amazing' ? 'white--text' : ''}`" :to="{name:'Post',path:'/post/'+post.id,params:{id:post.id}}"><h2>{{post.title}}</h2></router-link>
          </v-col >
          <v-col xs="2">
            <div class="caption grey--text">Author</div>
            <div :class="`caption ${post.status == 'Amazing' ? 'white--text' : 'grey--text'}`">{{post.author.username}}</div>
          </v-col >
          <v-col xs="2">
            <div class="caption grey--text">Created at</div>
            <div :class="`caption ${post.status == 'Amazing' ? 'white--text' : 'grey--text'}`">{{post.createdAt}}</div>
          </v-col >
          <v-col xs="2">
            <div class="caption grey--text">Categories</div>
            <v-chip small :class="`caption my-2`" v-for="category in post.categories" :key="category.id">{{category.name}}</v-chip>
          </v-col >
          <v-col xs="2">
            <div class="text-right">
              <div class="caption grey--text">Status</div>
              <v-chip small :class="`${post.status} white--text caption my-2`">{{post.status}}&nbsp;<span v-if="post.status == 'Amazing'">({{Math.round(post.daysRemainInAmazing)}})</span></v-chip>
            </div>
          </v-col >
        </v-row>
        <v-row row wrap :class="`pa-12 ${post.status == 'Amazing' ? 'white--text' : ''}` ">
          {{post.blogPostContent}}
        </v-row>
        <v-row row wrap :class="`pa-12 ${post.status == 'Amazing' ? 'white--text' : ''}` ">
          <v-menu>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="ma-2"
                v-bind="attrs"
                v-on="on"
                :dark="post.status != 'Amazing' ? true : false"
                v-if="showSimulations"
              >
                Simulations
              </v-btn>
            </template>
            <v-list>
              <v-list-item
              v-if="post.status != 'Amazing'"
                @click="simulate(post.id,'Set Amazing')"
              >
                <v-list-item-title>Set Amazing</v-list-item-title>
              </v-list-item>
              <v-list-item
              v-if="post.status != 'Amazing'"
                @click="simulate(post.id,'Set Popular')"
              >
                <v-list-item-title>Set Popular</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="simulate(post.id,'Set 1 Health')"
              >
                <v-list-item-title>Set 1 Health</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="simulate(post.id,'Set 50 Health & Shield')"
              >
                <v-list-item-title>Set 50 Health & Shield</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="simulate(post.id,'Set Max Health & Shield')"
              >
                <v-list-item-title>Set Max Health & Shield</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-row>
        <v-row row wrap justify="space-around" :class="`pa-12`">
        <v-btn class="ma-5" fab :color="userAttackedPosts.includes(post.id) ? 'red' : ''" dark @click="Vote(1,post.id)">
          <v-icon large>mdi-sword</v-icon>
        </v-btn>
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
            v-model="post.health"
            height="20"
            :color="getHealthBarColor(post.health)"
            rounded
          >
            <strong>{{ Math.ceil(post.health) }}<v-icon>mdi-hospital</v-icon></strong>
          </v-progress-linear>
          <v-btn class="ma-5" fab :color="userDefendedPosts.includes(post.id) ? 'cyan' : ''" dark @click="Vote(2,post.id)">
            <v-icon large v-if="post.status != 'Amazing'">mdi-shield-half-full</v-icon>
            <v-icon large v-else>mdi-shield-star</v-icon>
          </v-btn>
        </v-row>
      </v-card>
      <div class="mx-5">
          <span class="ml-5 caption text-lowercase">Pages:</span>
          <v-btn text color="grey" v-for="p in pages" :key="p" @click="PaginationLinkClick(p)"> <!-- PAGING -->
            <span :class="`caption text-lowercase ${activePage == p ? 'active' : ''}`">{{p}}</span>
          </v-btn>
        </div>
      </div>
      <div v-else-if="networkError" class="ma">
          <v-alert
            elevation="10"
            type="error"
          >
            Lost connection with the server
          </v-alert>
      </div>
      <div v-else-if="loadingPosts" class="ma">
          Loading posts...
          <v-progress-circular
            :size="70"
            :width="7"
            color="cyan"
            indeterminate
          ></v-progress-circular> 
      </div>
      <div v-else-if="!dbBlogPosts.length" class="ma">
          <v-alert
            elevation="10"
            type="warning"
            icon="mdi-ghost"
          >
            No results.
          </v-alert>
      </div>
    </v-container>

</div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'Home',
    data() {
      return{
        alert:false,
        categories:['All'],
        selectedCategory:'All',
        showSimulations: false,
        sortedBy:'title',
        sortedHow:'asc',
        search:'',
        dbBlogPosts: [],
        perPage: 3,
        page:1,
        userAttackedPosts:[],
        userDefendedPosts:[],
        totalCountOfPosts: 0,
        pages:[],
        perPageSelect:[1,2,3,5,10],
        activePage: 1,
        networkError: false,
        loadingPosts: false
      }
    },
    methods: {
      changeCategory() //or name
      {
        console.log(this.selectedCategory)
        let dis = this
        this.loadingPosts = true
        this.networkError = false
        axios.get('http://localhost:5000/api/blogposts?notInvisOrDead=true&perPage='+dis.perPage+'&page=1&keyword='+dis.search+"&sort="+dis.sortedBy+"-"+dis.sortedHow+'&categoryName='+dis.selectedCategory,{
            }).then(function(response){
                dis.loadingPosts = false
                dis.dbBlogPosts = response.data.data
                for(let post of dis.dbBlogPosts)
                {
                  post.createdAt = post.createdAt.split("T")
                  post.createdAt = post.createdAt[0]
                }
                dis.pages = []
                for(let i = 1; i <= response.data.pagesCount; i++)
                dis.pages.push(i)
            }).catch(err => {
              console.log(err);
              if(err.code == "ERR_NETWORK")
              dis.networkError = true
            })
      },
      simulate(postId,method)
      {
        // console.log(method+" on post id: "+postId)
        var data = JSON.stringify({
              "postId": postId,
              "simAmazing": method === "Set Amazing" ? true : false,
              "simPopular":  method === "Set Popular" ? true : false,
              "sim1Hp":  method === "Set 1 Health" ? true : false,
              "sim50HpShield":  method === "Set 50 Health & Shield" ? true : false,
              "simMaxHpShield": method === "Set Max Health & Shield" ? true : false,
            });
            var config = {
            method: 'put',
            url: 'http://localhost:5000/api/simulations',
            
            headers: { 
              'Authorization': 'Bearer '+localStorage.getItem("token"), 
              'Content-Type': 'application/json'
            },
            data : data
          };
          axios(config)
          .then(function(response){
            // alert("Simulation done")
            window.location.reload()
          }).catch(function(error){
            console.log(error);
          })
      },
      getHealthBarColor(health){
        // depending on health condition of the post display different color
        if(health > 66)
          return 'green'
        else if(health <= 66 && health > 33)
          return '#fcb103'
        else
          return 'red'
      },
      sortBy(prop){
        let dis = this
        if(prop === "title")
        {
          if(this.sortedHow === 'asc'){
            this.sortedHow = 'desc'
            this.sortedBy = 'title'

        axios.get('http://localhost:5000/api/blogposts?notInvisOrDead=true&perPage='+dis.perPage+'&page='+dis.page+'&keyword='+dis.search+"&sort="+dis.sortedBy+"-"+dis.sortedHow+'&categoryName='+dis.selectedCategory,{
            }).then(function(response){
                dis.loadingPosts = false
                dis.dbBlogPosts = response.data.data
                for(let post of dis.dbBlogPosts)
                {
                  post.createdAt = post.createdAt.split("T")
                  post.createdAt = post.createdAt[0]
                }
            }).catch(err => {
              console.log(err);
              if(err.code == "ERR_NETWORK")
              dis.networkError = true
            })


          }
          else{
            this.sortedHow = 'asc'
            this.sortedBy = 'title'

        axios.get('http://localhost:5000/api/blogposts?notInvisOrDead=true&perPage='+dis.perPage+'&page='+dis.page+'&keyword='+dis.search+"&sort="+dis.sortedBy+"-"+dis.sortedHow+'&categoryName='+dis.selectedCategory,{
            }).then(function(response){
                dis.loadingPosts = false
                dis.dbBlogPosts = response.data.data
                for(let post of dis.dbBlogPosts)
                {
                  post.createdAt = post.createdAt.split("T")
                  post.createdAt = post.createdAt[0]
                }
            }).catch(err => {
              console.log(err);
              if(err.code == "ERR_NETWORK")
              dis.networkError = true
            })
          }
        }
        if(prop === "author")
        {
          if(this.sortedHow === 'asc'){
            this.sortedHow = 'desc'
            this.sortedBy = 'author'
        axios.get('http://localhost:5000/api/blogposts?notInvisOrDead=true&perPage='+dis.perPage+'&page='+dis.page+'&keyword='+dis.search+"&sort="+dis.sortedBy+"-"+dis.sortedHow+'&categoryName='+dis.selectedCategory,{
            }).then(function(response){
                dis.loadingPosts = false
                dis.dbBlogPosts = response.data.data
                for(let post of dis.dbBlogPosts)
                {
                  post.createdAt = post.createdAt.split("T")
                  post.createdAt = post.createdAt[0]
                }
            }).catch(err => {
              console.log(err);
              if(err.code == "ERR_NETWORK")
              dis.networkError = true
            })
          }
          else{
            this.sortedHow = 'asc'
            this.sortedBy = 'author'

        axios.get('http://localhost:5000/api/blogposts?notInvisOrDead=true&perPage='+dis.perPage+'&page='+dis.page+'&keyword='+dis.search+"&sort="+dis.sortedBy+"-"+dis.sortedHow+'&categoryName='+dis.selectedCategory,{
            }).then(function(response){
                dis.loadingPosts = false
                dis.dbBlogPosts = response.data.data
                for(let post of dis.dbBlogPosts)
                {
                  post.createdAt = post.createdAt.split("T")
                  post.createdAt = post.createdAt[0]
                }
            }).catch(err => {
              console.log(err);
              if(err.code == "ERR_NETWORK")
              dis.networkError = true
            })
          }
        }
        if(prop === "health")
        {
          if(this.sortedHow === 'asc'){
            this.sortedHow = 'desc'
            this.sortedBy = 'health'

        axios.get('http://localhost:5000/api/blogposts?notInvisOrDead=true&perPage='+dis.perPage+'&page='+dis.page+'&keyword='+dis.search+"&sort="+dis.sortedBy+"-"+dis.sortedHow+'&categoryName='+dis.selectedCategory,{
            }).then(function(response){
                dis.loadingPosts = false
                dis.dbBlogPosts = response.data.data
                for(let post of dis.dbBlogPosts)
                {
                  post.createdAt = post.createdAt.split("T")
                  post.createdAt = post.createdAt[0]
                }
            }).catch(err => {
              console.log(err);
              if(err.code == "ERR_NETWORK")
              dis.networkError = true
            })
          }
          else{
            this.sortedHow = 'asc'
            this.sortedBy = 'health'

        axios.get('http://localhost:5000/api/blogposts?notInvisOrDead=true&perPage='+dis.perPage+'&page='+dis.page+'&keyword='+dis.search+"&sort="+dis.sortedBy+"-"+dis.sortedHow+'&categoryName='+dis.selectedCategory,{
            }).then(function(response){
                dis.loadingPosts = false
                dis.dbBlogPosts = response.data.data
                for(let post of dis.dbBlogPosts)
                {
                  post.createdAt = post.createdAt.split("T")
                  post.createdAt = post.createdAt[0]
                }
            }).catch(err => {
              console.log(err);
              if(err.code == "ERR_NETWORK")
              dis.networkError = true
            })
          }
        }
        if(prop === "createdAt")
        {
          if(this.sortedHow === 'asc'){
            this.sortedHow = 'desc'
            this.sortedBy = 'createdAt'
        axios.get('http://localhost:5000/api/blogposts?notInvisOrDead=true&perPage='+dis.perPage+'&page='+dis.page+'&keyword='+dis.search+"&sort="+dis.sortedBy+"-"+dis.sortedHow+'&categoryName='+dis.selectedCategory,{
            }).then(function(response){
                dis.loadingPosts = false
                dis.dbBlogPosts = response.data.data
                for(let post of dis.dbBlogPosts)
                {
                  post.createdAt = post.createdAt.split("T")
                  post.createdAt = post.createdAt[0]
                }
            }).catch(err => {
              console.log(err);
              if(err.code == "ERR_NETWORK")
              dis.networkError = true
            })
          }
          else{
            this.sortedHow = 'asc'
            this.sortedBy = 'createdAt'

        axios.get('http://localhost:5000/api/blogposts?notInvisOrDead=true&perPage='+dis.perPage+'&page='+dis.page+'&keyword='+dis.search+"&sort="+dis.sortedBy+"-"+dis.sortedHow+'&categoryName='+dis.selectedCategory,{
            }).then(function(response){
                dis.loadingPosts = false
                dis.dbBlogPosts = response.data.data
                for(let post of dis.dbBlogPosts)
                {
                  post.createdAt = post.createdAt.split("T")
                  post.createdAt = post.createdAt[0]
                }
            }).catch(err => {
              console.log(err);
              if(err.code == "ERR_NETWORK")
              dis.networkError = true
            })
          }
        }
      },
      PaginationLinkClick(page){
        this.activePage = page
        this.page = page
        let dis = this
        this.loadingPosts = true
        this.networkError = false
        axios.get('http://localhost:5000/api/blogposts?notInvisOrDead=true&perPage='+dis.perPage+'&page='+dis.page+'&keyword='+dis.search+"&sort="+dis.sortedBy+"-"+dis.sortedHow+'&categoryName='+dis.selectedCategory,{
            }).then(function(response){
                dis.loadingPosts = false
                dis.dbBlogPosts = response.data.data
                for(let post of dis.dbBlogPosts)
                {
                  post.createdAt = post.createdAt.split("T")
                  post.createdAt = post.createdAt[0]
                }
            }).catch(err => {
              console.log(err);
              if(err.code == "ERR_NETWORK")
              dis.networkError = true
            })
      },
      SearchDbWithKeyword(){
        let dis = this
        this.loadingPosts = true
        this.networkError = false
        axios.get('http://localhost:5000/api/blogposts?notInvisOrDead=true&perPage='+dis.perPage+'&page=1&keyword='+dis.search+"&sort="+dis.sortedBy+"-"+dis.sortedHow+'&categoryName='+dis.selectedCategory,{
            }).then(function(response){
                dis.loadingPosts = false
                dis.dbBlogPosts = response.data.data
                for(let post of dis.dbBlogPosts)
                {
                  post.createdAt = post.createdAt.split("T")
                  post.createdAt = post.createdAt[0]
                }
                dis.pages = []
                for(let i = 1; i <= response.data.pagesCount; i++)
                dis.pages.push(i)
            }).catch(err => {
              console.log(err);
              if(err.code == "ERR_NETWORK")
              dis.networkError = true
            })
      },
      ChangePerPage()
      {
        this.networkError = false
        this.loadingPosts = true
        let dis = this
        if(this.perPage+1 >= this.totalCountOfPosts){
          this.page = 1
        this.activePage = 1
        }
        axios.get('http://localhost:5000/api/blogposts?notInvisOrDead=true&perPage='+dis.perPage+'&page=1&keyword='+dis.search+"&sort="+dis.sortedBy+"-"+dis.sortedHow+'&categoryName='+dis.selectedCategory,{
            }).then(function(response){
                dis.dbBlogPosts = response.data.data
                dis.loadingPosts = false
                for(let post of dis.dbBlogPosts)
                {
                  post.createdAt = post.createdAt.split("T")
                  post.createdAt = post.createdAt[0]
                }
                dis.pages = []
                for(let i = 1; i <= response.data.pagesCount; i++)
                dis.pages.push(i)
            }).catch(err => {
              console.log(err);
              if(err.code == "ERR_NETWORK")
              dis.networkError = true
            })
      },
      Vote(type,postId){
        let dis = this
        if(localStorage.getItem("token")){
          if(type == 1 && this.userAttackedPosts.includes(postId))
          {
            let index = this.userAttackedPosts.indexOf(postId);
            this.userAttackedPosts.splice(index,1)
          }
          else if(type == 1 && !this.userAttackedPosts.includes(postId))
          {
            if(this.userDefendedPosts.includes(postId))
            {
              let index = this.userDefendedPosts.indexOf(postId);
              this.userDefendedPosts.splice(index,1)
            }
            this.userAttackedPosts.push(postId)
          }
          if(type == 2 && this.userDefendedPosts.includes(postId))
          {
            let index = this.userDefendedPosts.indexOf(postId);
            this.userDefendedPosts.splice(index,1)
          }
          else if(type == 2 && !this.userDefendedPosts.includes(postId))
          {
            if(this.userAttackedPosts.includes(postId))
            {
              let index = this.userAttackedPosts.indexOf(postId);
              this.userAttackedPosts.splice(index,1)
            }
            this.userDefendedPosts.push(postId)
          }
          var data = JSON.stringify({
            "voteType": type,
            "blogPostId": postId
          });
          var config = {
          method: 'put',
          url: 'http://localhost:5000/api/votes',
          
          headers: { 
            'Authorization': 'Bearer '+localStorage.getItem("token"), 
            'Content-Type': 'application/json'
          },
          data : data
        };
        this.loadingPosts = true
        this.networkError = false
        axios(config).then(function(response){
              // promeni stanje dugmeta 
        axios.get('http://localhost:5000/api/blogposts?notInvisOrDead=true&perPage='+dis.perPage+'&page='+dis.page+'&keyword='+dis.search+"&sort="+dis.sortedBy+"-"+dis.sortedHow+'&categoryName='+dis.selectedCategory,{
            }).then(function(response){
                dis.loadingPosts = false
                dis.dbBlogPosts = response.data.data
                for(let post of dis.dbBlogPosts)
                {
                  post.createdAt = post.createdAt.split("T")
                  post.createdAt = post.createdAt[0]
                }
                
            }).catch(err => {
              console.log(err);
              if(err.code == "ERR_NETWORK")
                dis.networkError = true
            })
          }).catch(err => {
            console.log(err);
            if(err.code == "ERR_NETWORK")
            dis.networkError = true
          })
            }
            else{
              // alert("Unauthorized to vote")
              dis.alert = true
              setTimeout(function(){dis.alert = false},2000)
            }
      }
    },
    created(){
    document.title = "Blograd | Home"
    },
    mounted(){
      this.userAttackedPosts=[]
      this.userDefendedPosts=[]
      var dis = this
      this.loadingPosts = true
      // prvo glasovi korisnika ako je ulogovan
      if(localStorage.getItem("token")){
        this.showSimulations = true;
          const config = {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          };
        axios.get('http://localhost:5000/api/votes?perPage=99999',config) // brojanje glasova
             .then(function(response){
              dis.loadingPosts = false
              for(let vote of response.data.data)
              {
                if(vote.voteType == 1 && vote.blogPostId != null)
                dis.userAttackedPosts.push(vote.blogPostId)
                else if(vote.blogPostId != null)
                dis.userDefendedPosts.push(vote.blogPostId)
              }
              })
            }
        axios.get('http://localhost:5000/api/blogposts?notInvisOrDead=true&perPage='+dis.perPage+'&page=1&keyword='+dis.search+"&sort="+dis.sortedBy+"-"+dis.sortedHow+'&categoryName='+dis.selectedCategory,{
            }).then(function(response){
              dis.totalCountOfPosts = response.data.totalCount // TOTAL COUNT
              // console.log(response.data.data)
              for(let i = 1; i <= response.data.pagesCount; i++)
                dis.pages.push(i)  // broj stranica

                dis.dbBlogPosts = response.data.data
                for(let post of dis.dbBlogPosts)
                {
                  post.createdAt = post.createdAt.split("T")
                  post.createdAt = post.createdAt[0]
                }
            }).catch(err => {
              console.log(err);
              if(err.code == "ERR_NETWORK")
              {
                dis.networkError = true
                // potencijalno pokrenuti ovaj zahtev u rekurziji u intervalima dok se ne izadje iz catch bloka
              }
            })
        axios.get('http://localhost:5000/api/categories',{
            }).then(function(response){
              for(let cat of response.data.data)
                dis.categories.push(cat.name)
            }).catch(err => {
              console.log(err);
              if(err.code == "ERR_NETWORK")
              {
                dis.networkError = true
              }
            })
    }

  }
</script>

<style>
  .fxd{
   position: fixed;
  left: 50%;
  top: 40%;
   z-index: 999999;
  transform: translate(-50%, -50%);
  }
  .post.Alive{
    border-left:4px solid rgb(12, 213, 116);
  }
  .post.Dead{
    border-left:4px solid rgb(0, 0, 0);
  }
  .v-card{
    word-break: normal;
  }
  .v-chip.Alive{
    background:rgb(12, 213, 116)!important;
  }
  .v-chip.Dead{
    background:rgb(0, 0, 0)!important;
  }
  .v-chip.Popular{
    background:rgb(226, 255, 6)!important;
    color: #000!important;
  }
  .v-chip.Invisible{
    background:rgb(86, 86, 86)!important;
  }
  .v-chip.Amazing{
    background:rgb(255, 0, 0)!important;
  }
  .ma{
    position:absolute;
    top:40%;
    left:45%;
  }
  .active{
    font-size: 2em !important;
    font-weight: bold !important;;
  }
</style>