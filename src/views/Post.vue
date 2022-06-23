<template>
  <div>
    <div v-if="post">
        <v-card class="my-5">
        <v-row row wrap :class="`pr-12 pa-3 post ${post.status}`">
          <v-col cols="12" md="6">
            <div class="caption grey--text">Post title</div>
            <h2>{{post.title}}</h2>
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
        <v-btn class="ma-5" fab color="red" dark @click="Vote(1,post.id)">
          <v-icon large>mdi-sword</v-icon>
        </v-btn>
        <v-progress-linear
            v-if="shield > 0"
            :value="shield"
            height="20"
            color="blue"
            rounded
            class="my-2"
          >
            <strong>{{ Math.ceil(shield) }}<v-icon small>mdi-shield</v-icon></strong>
          </v-progress-linear>
        <v-progress-linear
            v-if="post.health < post.health/2"
            :value="post.health"
            height="20"
            color="blue"
            rounded
            class="my-2"
          >
            <strong>{{ Math.ceil(post.health) }}<v-icon small>mdi-water</v-icon></strong>
          </v-progress-linear>
          <v-progress-linear
            v-else
            :value="post.health"
            height="20"
            color="green"
            rounded
          >
            <strong>{{ Math.ceil(post.health) }}<v-icon dark small>mdi-water</v-icon></strong>
          </v-progress-linear>
          <v-btn class="ma-5" fab color="cyan" dark @click="Vote(2,post.id)">
            <v-icon large>mdi-shield-half-full</v-icon>
          </v-btn>
        </v-row>
      </v-card>
      <v-card class="comment">
        <v-row row wrap>
          <v-col cols="12" md="12" style="padding:10px 700px">
              <v-text-field
                solo
                label="Enter your comment..."

              ></v-text-field>
           <v-btn
            color="green darken-1"
            dark
            style="margin-left:40%;"
          >
            Comment
          </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </div>
    <div v-else class="ma">
        Loading post...
          <v-progress-circular
            :size="70"
            :width="7"
            color="cyan"
            indeterminate
          ></v-progress-circular> 
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    props:['id'],
    name:'Post',
    data(){
        return {
            post:null,
            shield:1,
            comments:[]
        }
    },
    mounted()
    {
        var config = null
        var dis = this
        if(localStorage.getItem('token')){
                config = {
                    method: 'get',
                    url: 'http://localhost:5000/api/blogposts/'+this.id,
                    headers: { 
                        'Authorization': 'Bearer '+localStorage.getItem('token')
                    }
            }
        }
            else{
                config = {
                     method: 'get',
                     url: 'http://localhost:5000/api/blogposts/'+this.id,
                 };
            }

        axios(config)
        .then(function (response) {
            dis.post = response.data
        })
        .catch(function (error) {
        console.log(error);
        });

        config.url = 'http://localhost:5000/api/comments/'+this.id
        if(!localStorage.getItem('token'))
        {
          config.headers = ''
        }
        axios(config)
        .then(function (response) {
          console.log(response.data)
          dis.comments = response.data
        })
        .catch(function (error) {
        console.log(error);
        });
        
    },
    methods:{
    }
}
</script>

<style>

</style>