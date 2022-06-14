<template>
<div class="your-posts">
    <p class="headline grey--text text-center">Your posts</p>
    <v-containter>
        <v-row >
            <v-col cols="12" sm="6" md="4" lg="4" v-for="person in team" :key="person.name">
                <v-card class="text-center ma-3" >
                <v-responsive class="pt-4">
                    <v-avatar size="100">
                        <img :src="person.avatar" alt="" />
                    </v-avatar>
                </v-responsive>
                <v-card-text>
                    <div class=" text-subtitle-1 ">{{person.name}}</div>
                    <div class="grey--text">{{person.role}}</div>
                </v-card-text>
                <v-card-action>
                    <v-btn depressed class="grey--text" >
                    <v-icon small left> mdi-hand-pointing-up </v-icon>
                    <span>View</span>
                    </v-btn>
                </v-card-action>
                </v-card>
            </v-col>
        </v-row>
    </v-containter>
</div>
</template>

<script>
export default {
    name:'YourPosts',
    data(){
        return {
            team: [
                { name: 'Post 1', role: 'Post content 1', avatar:'/img/avatar.jpg'},
                { name: 'Post 2', role: 'Post content 2', avatar:'/img/avatar.jpg' },
                { name: 'Post 3', role: 'Post content 3', avatar:'/img/avatar.jpg' },
                { name: 'Post 4', role: 'Post content 4', avatar:'/img/avatar.jpg' },
                { name: 'Post 5', role: 'Post content 5', avatar:'/img/avatar.jpg'}
            ]
        }
    }
}
</script>

<style>

</style>