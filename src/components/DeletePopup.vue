<template>
   <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="error"
          dark
          v-bind="attrs"
          v-on="on"
        >
          <v-icon small>mdi-delete</v-icon>Delete
        </v-btn>
      </template>
      <v-card class="text-center">
        <v-card-title>
          <span class="text-h5">Are you sure you want to delete this post?</span>
        </v-card-title>
        <v-card-text>
            <h3>{{title}}</h3>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color=""
            text
            @click="dialog = false"
          >
            No
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            @click="handleDelete"
            :loading="loading"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from 'axios'
export default {
    name:'DeletePopup',
    props:['postId','title'],
    data:() =>({
        dialog: false,
        loading:false
    }),
    mounted(){
    },
    methods:{
      handleDelete(){
        let vm = this
        this.loading = true
        const config = {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          };
            axios.delete('http://localhost:5000/api/blogposts/'+vm.postId,config)
                 .then(function(response){
                 vm.loading = false
                 window.location.reload()
                 // pokusati da se ne reloaduje strana nekako?
            }).catch(function(err){
               vm.loading = false
               console.log(err);
            })
      }
    },
    
}
</script>

<style>

</style>