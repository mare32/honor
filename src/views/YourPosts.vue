<template>
<div class="your-posts">
    <p class="headline grey--text text-center">Your posts</p>
    <v-col>
        <v-row v-if="usersPosts.length">
            <v-col cols="12" sm="6" md="4" lg="4" v-for="post in usersPosts" :key="post.id">
                <v-card class="text-center ma-3 pa-5" >
                    <v-responsive class="pt-4">
                        <v-avatar size="100">
                            <img :src="post.image.src" :alt="post.image.alt" />
                        </v-avatar>
                    </v-responsive>
                    <v-card-text>
                        <div class=" text-subtitle-1 ">{{post.title}}</div>
                        <div class="grey--text">{{post.blogPostContent}}</div>
                    </v-card-text>
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
                        <strong>{{ Math.ceil(post.health) }}<v-icon>mdi-hospital</v-icon></strong>
                    </v-progress-linear>
                    <v-progress-linear
                        v-else
                        v-model="post.health"
                        height="20"
                        color="green"
                        rounded
                    >
                        <strong>{{ Math.ceil(post.health) }}<v-icon dark>mdi-hospital</v-icon></strong>
                    </v-progress-linear>
                    <v-card class="my-5 pa-2" flat>
                        <!-- <router-link :to="{name:'Edit',path:'/edit/'+post.id,params:{id:post.id}}" style="text-decoration:none;color:grey">
                        <v-btn color="primary" >
                        <v-icon large left> mdi-note-edit </v-icon>
                        Edit
                        </v-btn>
                        </router-link> -->
                        <EditPostPopup absolute :postId="post.id" :title="post.title" :blogPostContent="post.blogPostContent" :categoryValues="post.categories" @updateTitle="post.title"/>
                    </v-card>
                    <v-card class="my-5 pa-2" flat>
                        <DeletePopup absolute :postId="post.id" :title="post.title" />
                    </v-card>
                    <v-card class="my-5 pa-2" flat>
                        <v-btn :dark="post.status == 'Invisible' ? false : true" :color="post.status == 'Invisible' ? 'white' : 'black'" @click="hideOrUnhidePost(post.id,post.status)">
                            <v-icon v-if="post.status != 'Invisible'">mdi-eye-off</v-icon>
                            <v-icon v-else>mdi-eye</v-icon>
                        </v-btn>
                    </v-card>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col cols="12" sm="12" md="12" lg="12">
                <v-card class="text-center ma-3 pa-5" >
                    <v-responsive class="pt-4">
                        <v-avatar size="100">
                            <img src="/img/coffee.png" alt="avatar" />
                        </v-avatar>
                    </v-responsive>
                    <v-card-text>
                        <div class=" text-subtitle-1 ">You didn post anyting</div>
                        <div class=" text-subtitle-2 ">You can add a new post by opening the <v-icon small>mdi-menu</v-icon>sidebar and clicking the "<v-icon small>mdi-book-plus</v-icon>New post" button :)</div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-col>
    
</div>
</template>

<script>
import Vuetify from 'vuetify'
import axios from 'axios'
import DeletePopup from '@/components/DeletePopup.vue'
import EditPostPopup from '@/components/EditPostPopup.vue'
export default {
    components:{Vuetify, DeletePopup, EditPostPopup},
    name:'YourPosts',
    data(){
        return {
            usersPosts:[],
            deletePopupShow:false,
            editPostPopupShow:false
        }
    },
    created(){
        if(!localStorage.getItem("token"))
             window.location.href = "/"
    },
    mounted(){
        let dis = this
        const config = {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          };
        axios.get('http://localhost:5000/api/blogposts?loggedUsersPosts=true',config).then(function(response){
              dis.totalCountOfPosts = response.data.totalCount // TOTAL COUNT
            //   for(let i = 1; i <= response.data.pagesCount; i++)
            //     dis.pages.push(i)  // broj stranica
                dis.usersPosts = response.data.data
                console.log(dis.usersPosts);
                for(let post of dis.usersPosts)
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
    },
    methods:{
        hideOrUnhidePost(postId,status)
      {
        let unhideStatusId = 0
        let hideStatusId = 2
        if(status == "Invisible")
        {
            var data = JSON.stringify({
              "id":postId,
              "statusId":unhideStatusId
            });
        }
        else
        {
            var data = JSON.stringify({
              "id":postId,
              "statusId":hideStatusId
            });
        }
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
                if(status != "Invisible")
                  alert('Objava je sakrivena')
                else
                  alert('Objava je ponovo vidljiva')

                  window.location.reload()
              }).catch(err => {
                  alert(err.response.data.message)
                  console.log(err);
              })
      },
    }
}
</script>

<style>

</style>