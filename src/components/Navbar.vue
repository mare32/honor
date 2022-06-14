<template>
    <nav>
        <v-app-bar flat app>
            <v-app-bar-nav-icon class="grey--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title flat class="grey--text">
                <span class="font-weight-light ">Defense of</span>
                <span> Blograd</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text color="grey">
                <span>Sign Out</span>
                <v-icon right>mdi-exit-to-app</v-icon>
            </v-btn>
        </v-app-bar>
        <v-navigation-drawer app absolute temporary v-model="drawer" class="teal">
            <v-list dark>
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
            </v-list>
        </v-navigation-drawer>
    </nav>
</template>

<script>
export default {
    name:'Navbar',
    data(){
        return {
            drawer: false,
            items: [
            ['mdi-home', 'Home','/'],
            ['mdi-book-plus', 'New post','/new'],
            ['mdi-book-open-page-variant','Your posts', '/your-posts'],
            ['mdi-account', 'Profile','/profile'],
            ['mdi-cog', 'Examples','/examples'],
            ],
        }
    },
    
}
</script>

<style>

</style>