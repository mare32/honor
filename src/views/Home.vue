<template>
<div class="home">
  <p class="headline grey--text text-center">Home</p>
    <v-container class="my-5">
      <v-layout row class="mb-3">
        <v-tooltip top small>
           <template v-slot:activator="{on, attrs}">
          <v-btn text color="grey" @click="sortBy('title')" v-on="on" v-bind="attrs">
            <v-icon left small>mdi-folder</v-icon>
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
          <v-icon left small>mdi-water</v-icon>
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
      </v-layout>
      <div v-if="dbBlogPosts.length">
      <v-card v-for="post in dbBlogPosts" :key="post.id" class="my-5">
        <v-row row wrap :class="`pr-12 pa-3 post ${post.status}`">
          <v-col cols="12" md="6">
            <div class="caption grey--text">Post title</div>
            <router-link :to="{name:'Post',path:'/post/'+post.id,params:{id:post.id}}"><h2>{{post.title}}</h2></router-link>
          </v-col >
          <v-col xs="2">
            <div class="caption grey--text">Author</div>
            <div>{{post.author.username}}</div>
          </v-col >
          <v-col xs="2">
            <div class="caption grey--text">Created at</div>
            <div>{{post.createdAt}}</div>
          </v-col >
          <v-col xs="2">
            <div class="text-right">
              <v-chip small :class="`${post.status} white--text caption my-2`">{{post.status}}</v-chip>
            </div>
          </v-col >
        </v-row>
        <v-row row wrap :class="`pa-12`">
          {{post.content}}
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
            v-if="post.health < 50"
            v-model="post.health"
            height="20"
            color="red"
            rounded
          >
            <strong>{{ Math.ceil(post.health) }}<v-icon>mdi-water</v-icon></strong>
          </v-progress-linear>
          <v-progress-linear
            v-else
            v-model="post.health"
            height="20"
            color="green"
            rounded
          >
            <strong>{{ Math.ceil(post.health) }}<v-icon dark>mdi-water</v-icon></strong>
          </v-progress-linear>
          <v-btn class="ma-5" fab :color="userDefendedPosts.includes(post.id) ? 'cyan' : ''" dark @click="Vote(2,post.id)">
            <v-icon large>mdi-shield-half-full</v-icon>
          </v-btn>
        </v-row>
      </v-card>
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
        sortedBy:'author',
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
      sortBy(prop){
        if(prop === "title")
        {
          if(this.sortedHow === 'asc'){
            this.dbBlogPosts.sort((a,b) => a[prop] < b[prop] ? -1 : 1)
            this.sortedHow = 'desc'
            this.sortedBy = 'title'
          }
          else{
            this.dbBlogPosts.sort((a,b) => a[prop] > b[prop] ? -1 : 1)
            this.sortedHow = 'asc'
            this.sortedBy = 'title'
          }
        }
        if(prop === "author")
        {
          if(this.sortedHow === 'asc'){
            this.dbBlogPosts.sort((a,b) => a[prop].username < b[prop].username ? -1 : 1)
            this.sortedHow = 'desc'
            this.sortedBy = 'author'
          }
          else{
            this.dbBlogPosts.sort((a,b) => a[prop].username > b[prop].username ? -1 : 1)
            this.sortedHow = 'asc'
            this.sortedBy = 'author'
          }
        }
        if(prop === "health")
        {
          if(this.sortedHow === 'asc'){
            this.dbBlogPosts.sort((a,b) => a[prop] < b[prop] ? -1 : 1)
            this.sortedHow = 'desc'
            this.sortedBy = 'health'
          }
          else{
            this.dbBlogPosts.sort((a,b) => a[prop] > b[prop] ? -1 : 1)
            this.sortedHow = 'asc'
            this.sortedBy = 'health'
          }
        }
        if(prop === "createdAt")
        {
          if(this.sortedHow === 'asc'){

            this.dbBlogPosts.sort((a,b) => 
            {
              let arr = a.createdAt.split("-")
              let arr2 = b.createdAt.split("-")
              if(arr[0] < arr2[0])
              return -1
              else if( arr[1] < arr2[1] && arr[0] == arr2[0])
              return -1
              else if( arr[2] < arr2[2] && arr[0] == arr2[0] && arr[1] == arr2[1])
              return -1
              else
              return 1 
            })
            this.sortedHow = 'desc'
            this.sortedBy = 'createdAt'
          }
          else{
            this.dbBlogPosts.sort((a,b) => {
              let arr = a.createdAt.split("-")
              let arr2 = b.createdAt.split("-")
              if(arr[0] > arr2[0])
              return -1
              else if( arr[1] > arr2[1] && arr[0] == arr2[0])
              return -1
              else if( arr[2] > arr2[2] && arr[0] == arr2[0] && arr[1] == arr2[1])
              return -1
              else
              return 1
            })
            this.sortedHow = 'asc'
            this.sortedBy = 'createdAt'
          }
        }
      },
      PaginationLinkClick(page){
        this.activePage = page
        this.page = page
        let dis = this
        this.loadingPosts = true
        this.networkError = false
        axios.get('http://localhost:5000/api/blogposts?perPage='+dis.perPage+'&page='+page+"&keyword="+dis.search,{
            }).then(function(response){
                dis.dbBlogPosts = response.data.data
                for(let post of dis.dbBlogPosts)
                {
                  post.createdAt = post.createdAt.split("T")
                  post.createdAt = post.createdAt[0]
                }
                dis.loadingPosts = false
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
        axios.get('http://localhost:5000/api/blogposts?perPage='+dis.perPage+'&page=1&keyword='+dis.search,{
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
        axios.get('http://localhost:5000/api/blogposts?perPage='+dis.perPage+'&page='+dis.page+"&keyword="+dis.search,{
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
              axios.get('http://localhost:5000/api/blogposts?perPage='+dis.perPage+'&page='+dis.page+"&keyword="+dis.search,{
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
              alert("Unauthorized to vote")
            }
      }
    },
    computed:{
      FilteredDbPosts(){
       return this.dbBlogPosts.filter(post => { return post.title.toLowerCase().includes(this.search.toLowerCase()) })
      },
      
    },
    mounted(){
      this.userAttackedPosts=[]
      this.userDefendedPosts=[]
      var dis = this
      this.loadingPosts = true
      // prvo glasovi korisnika ako je ulogovan
      if(localStorage.getItem("token")){
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
      axios.get('http://localhost:5000/api/blogposts?perPage='+dis.perPage+'&page='+dis.page,{
            }).then(function(response){
              dis.totalCountOfPosts = response.data.totalCount // TOTAL COUNT
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
        
    }

  }
</script>

<style>
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