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
          <v-text-field dense label="Search" single-line solo v-model="search"></v-text-field>
        </span>
      </v-layout>

      <v-card v-for="post in FilteredDbPosts" :key="post.id" class="my-5">
        <v-row row wrap :class="`pr-12 pa-3 post ${post.status}`">
          <v-col cols="12" md="6">
            <div class="caption grey--text">Post title</div>
            <router-link :to="`/posts/${post.id}`"><h2>{{post.title}}</h2></router-link>
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
        <v-btn class="ma-5" fab color="red" dark @click="CastVote('attack')">
          <v-icon large>mdi-sword</v-icon>
        </v-btn>
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
          <v-btn class="ma-5" fab color="cyan" dark @click="CastVote('defend')">
            <v-icon large>mdi-shield-half-full</v-icon>
          </v-btn>
        </v-row>
      </v-card>
    </v-container>

</div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'Home',
    data() {
      return{
        posts:[
          {id:1,title:"Prva objava",author:"Pera Peric",
          content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet consequat leo, at venenatis libero. Quisque iaculis egestas iaculis. Nulla facilisi. Vivamus varius rutrum felis quis finibus. Nam imperdiet, sem nec viverra gravida, est elit posuere dui, ac ornare velit velit vel metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc cursus eros ex, at venenatis purus porttitor et. Aliquam erat volutpat. Pellentesque fringilla rhoncus dolor, ut accumsan massa consequat non. Nulla lacinia nunc in dolor faucibus, ac gravida quam auctor. Sed ultrices rhoncus dolor",
          createdAt: "14.06.2022",status:"alive",health:35},
          {id:2,title:"Druga objava",author:"Mika Mikic",
          content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet consequat leo, at venenatis libero. Quisque iaculis egestas iaculis. Nulla facilisi. Vivamus varius rutrum felis quis finibus. Nam imperdiet, sem nec viverra gravida, est elit posuere dui, ac ornare velit velit vel metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc cursus eros ex, at venenatis purus porttitor et. Aliquam erat volutpat. Pellentesque fringilla rhoncus dolor, ut accumsan massa consequat non. Nulla lacinia nunc in dolor faucibus, ac gravida quam auctor. Sed ultrices rhoncus dolor",
          createdAt: "13.06.2022",status:"dead",health:0},
          {id:3,title:"Treca objava",author:"Zika Zikic",
          content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet consequat leo, at venenatis libero. Quisque iaculis egestas iaculis. Nulla facilisi. Vivamus varius rutrum felis quis finibus. Nam imperdiet, sem nec viverra gravida, est elit posuere dui, ac ornare velit velit vel metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc cursus eros ex, at venenatis purus porttitor et. Aliquam erat volutpat. Pellentesque fringilla rhoncus dolor, ut accumsan massa consequat non. Nulla lacinia nunc in dolor faucibus, ac gravida quam auctor. Sed ultrices rhoncus dolor",
          createdAt: "15.06.2022",status:"alive",health:85},
          {id:4,title:"Cetvrta objava",author:"Tika Tikic",
          content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet consequat leo, at venenatis libero. Quisque iaculis egestas iaculis. Nulla facilisi. Vivamus varius rutrum felis quis finibus. Nam imperdiet, sem nec viverra gravida, est elit posuere dui, ac ornare velit velit vel metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc cursus eros ex, at venenatis purus porttitor et. Aliquam erat volutpat. Pellentesque fringilla rhoncus dolor, ut accumsan massa consequat non. Nulla lacinia nunc in dolor faucibus, ac gravida quam auctor. Sed ultrices rhoncus dolor",
          createdAt: "16.06.2022",status:"alive",health:15},
          {id:5,title:"Peta objava",author:"Mika Mikic",
          content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet consequat leo, at venenatis libero. Quisque iaculis egestas iaculis. Nulla facilisi. Vivamus varius rutrum felis quis finibus. Nam imperdiet, sem nec viverra gravida, est elit posuere dui, ac ornare velit velit vel metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc cursus eros ex, at venenatis purus porttitor et. Aliquam erat volutpat. Pellentesque fringilla rhoncus dolor, ut accumsan massa consequat non. Nulla lacinia nunc in dolor faucibus, ac gravida quam auctor. Sed ultrices rhoncus dolor",
          createdAt: "17.06.2022",status:"alive",health:50},
        ],
        sortedBy:'author',
        sortedHow:'asc',
        search:'',
        matchingPosts:[],
        dbBlogPosts: []
      }
    },
    methods: {
      sortBy(prop){
        console.log("sort")
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
              console.log("here");
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
      CastVote(type){
        if(!localStorage.getItem("token"))
        {
          console.log("Unauthorized")
        }
        else{
          if(type==="attack")
          {
            console.log("Attacked");
            //axios
          }
          else{
            console.log("Defended");
          }
        }
      }
    },
    computed:{
      FilteredPosts(){
       return this.posts.filter(post => { return post.title.toLowerCase().includes(this.search.toLowerCase()) })
      },
      FilteredDbPosts(){
       return this.dbBlogPosts.filter(post => { return post.title.toLowerCase().includes(this.search.toLowerCase()) })
      },
    },
    mounted(){
      var dis = this
      axios.get('http://localhost:5000/api/blogposts',{
            }).then(function(response){
                dis.dbBlogPosts = response.data.data
                for(let post of dis.dbBlogPosts)
                {
                  post.createdAt = post.createdAt.split("T")
                  post.createdAt = post.createdAt[0]
                }
            }).catch(err => {
              console.log(err);
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
</style>