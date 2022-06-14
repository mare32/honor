<template>
<div class="home">
  <p class="headline grey--text">Home</p>
    <v-container class="my-5">
      <v-layout row class="mb-3">
        <v-tooltip top small>
           <template v-slot:activator="{on, attrs}">
          <v-btn small text color="grey" @click="sortBy('title')" v-on="on" v-bind="attrs">
            <v-icon left small>mdi-folder</v-icon>
            <span class="caption text-lowercase">By Post Name</span>
          </v-btn>
          </template>
          <span>Sort by name</span>
        </v-tooltip>
        <v-tooltip top small>
           <template v-slot:activator="{on, attrs}">
        <v-btn small text color="grey" @click="sortBy('author')" v-on="on" v-bind="attrs">
          <v-icon left small>mdi-account</v-icon>
          <span class="caption text-lowercase">By Author</span>
        </v-btn>
        </template>
          <span>Sort by author</span>
        </v-tooltip>
      </v-layout>

      <v-card v-for="post in posts" :key="post.id">
        <v-row row wrap :class="`pr-12 pa-3 post ${post.status}`">
          <v-col cols="12" md="6">
            <div class="caption grey--text">Post title</div>
            <div>{{post.title}}</div>
          </v-col >
          <v-col xs="2">
            <div class="caption grey--text">Author</div>
            <div>{{post.author}}</div>
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
      </v-card>
    </v-container>

</div>
</template>

<script>

  export default {
    name: 'Home',
    data() {
      return{
        posts:[
          {id:1,title:"Prva objava",author:"Pera Peric",content:"Sadrzaj prve objave",createdAt: "14.06.2022",status:"alive"},
          {id:2,title:"Druga objava",author:"Mika Mikic",content:"Sadrzaj druge objave",createdAt: "13.06.2022",status:"dead"},
          {id:3,title:"Treca objava",author:"Zika Zikic",content:"Sadrzaj trece objave",createdAt: "15.06.2022",status:"alive"},
        ]
      }
    },
    methods: {
      sortBy(prop){
        this.posts.sort((a,b) => a[prop] < b[prop] ? -1 : 1)
      }
    }
  }
</script>

<style>
  .post.alive{
    border-left:4px solid rgb(12, 213, 116);
  }
  .post.dead{
    border-left:4px solid rgb(0, 0, 0);
  }
  .v-card{
    word-break: normal;
  }
  .v-chip.alive{
    background:rgb(12, 213, 116)!important;
  }
  .v-chip.dead{
    background:rgb(0, 0, 0)!important;
  }
</style>