<template>
    <nav>
        <v-app-bar flat app>
            <v-app-bar-nav-icon class="grey--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title flat class="grey--text">
                <!-- <span class="font-weight-light ">Odbrana</span> -->
                <span><v-icon>mdi-sword-cross</v-icon> Blograd</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text color="grey" v-if="logged"  @click="SignOut" :loading="loading">
                <span>Sign Out</span>
                <v-icon right>mdi-exit-to-app</v-icon>
            </v-btn>
        </v-app-bar>
        <v-navigation-drawer app absolute temporary v-model="drawer" class="teal">
            <v-list dark class="pb-5">
                
                <v-list-item
                v-for="([icon, text,route]) in items"
                :key="text"
                router :to="route"
                >
                <v-list-item-icon>
                    <v-icon>{{ icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ text }}</v-list-item-title>
                </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="logged"
                router to="/your-posts"
                >
                <v-list-item-icon>
                    <v-icon>mdi-book-open-page-variant</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>Your posts</v-list-item-title>
                </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="logged"
                router to="/profile"
                >
                <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>Profile</v-list-item-title>
                </v-list-item-content>
                </v-list-item>


                <v-list-item v-if="1"
                router to="/admin"
                >
                <v-list-item-icon>
                    <v-icon>mdi-shield-crown</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>Panel</v-list-item-title>
                </v-list-item-content>
                </v-list-item>

            </v-list>
            <Popup v-if="logged"/>
            <LoginPopup v-if="!logged" class="my-3"/>
            <RegisterPopup v-if="!logged"/>
        </v-navigation-drawer>
        <Alert absolute />
    </nav>
</template>

<script>
import Popup from '@/components/Popup.vue'
import LoginPopup from '@/components/LoginPopup.vue'
import RegisterPopup from '@/components/RegisterPopup.vue'
import Alert from '@/components/Alert.vue'
export default {
    name:'Navbar',
    components:{Popup,LoginPopup,RegisterPopup,Alert},
    data(){
        return {
            drawer: false,
            items: [
            ['mdi-home', 'Home','/']
            ],
            logged:false,
            loading:false,
            admin:false
        }
    },
    created(){
        if(localStorage.getItem("token"))
            this.logged = true

    },
    methods:{
        SignOut(){
            localStorage.removeItem("token")
            this.loading = true
            setTimeout(function()
            {
                this.loading = false
                this.logged = false
                window.location.href = "/"
            },3000)
        }
    },
    updated(){
    }
    
    
}
</script>

<style>

</style>