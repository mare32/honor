<template>
<div class="your-posts">
    <p class="headline grey--text text-center">Your posts</p>
    <v-col>
        <v-row >
            <v-col cols="12" sm="6" md="4" lg="4" v-for="post in myPosts" :key="post.id">
                <v-card class="text-center ma-3 pa-5" >
                <v-responsive class="pt-4">
                    <v-avatar size="100">
                        <img :src="post.avatar" alt="" />
                    </v-avatar>
                </v-responsive>
                <v-card-text>
                    <div class=" text-subtitle-1 ">{{post.name}}</div>
                    <div class="grey--text">{{post.role}}</div>
                </v-card-text>
                <v-card>
                    <v-btn depressed class="grey--text" >
                    <v-icon small left> mdi-open-in-new </v-icon>
                    <span>View</span>
                    </v-btn>
                </v-card>
                </v-card>
            </v-col>
        </v-row>
    </v-col>
</div>
</template>

<script>
import Vuetify from 'vuetify'
export default {
    components:{Vuetify},
    name:'YourPosts',
    data(){
        return {
            posts: [
                { id:1,name: 'Post 1', role: 'Post content 1',authorId:1, avatar:'/img/avatar.jpg'},
                { id:2, name: 'Post 2', role: 'Post content 2',authorId:3, avatar:'/img/avatar.jpg' },
                { id:3, name: 'Post 3', role: 'Post content 3',authorId:4, avatar:'/img/avatar3.jpg' },
                { id:4,name: 'Post 4', role: 'Post content 4',authorId:1, avatar:'/img/avatar1.jpg' },
                { id:5,name: 'Post 5', role: 'Post content 5',authorId:1, avatar:'/img/avatar2.jpg'}
            ]
        }
    },
    computed:{
        myPosts(){
            return this.posts.filter(post => {
                return post.authorId == 1 // ovde treba da pise '== id' kada se id dinamicki ucita
            })
        }
    }
}
</script>

<style>

</style>