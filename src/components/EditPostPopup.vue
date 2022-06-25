<template>
   <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          <v-icon small>mdi-book-plus</v-icon>Edit post
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit post</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  solo
                  label="Title*"
                  v-model="titleLocal"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                solo
                name="input-7-4"
                v-model="contentLocal"
                label="Content*"
                ></v-textarea>
              </v-col>
              <v-col
                cols="12"
                sm="12"
              >
                <v-autocomplete
                disabled
                  v-model="categoryValues"
                  :items="categories"
                  label="Categories*"
                  multiple
                ></v-autocomplete>
                  <!-- :value="categoryValues" -->
              </v-col>
              <v-col
                cols="12"
                sm="12"
              >
              <v-file-input
                disabled
                label="Add image*"
                prepend-icon="mdi-camera"
                accept="image/*"
                v-model="image"
                @change="uploadImage($event)"
              ></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-text-field
                disabled
                  solo
                  label="Image alt"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <!-- <v-spacer></v-spacer> -->
          <v-btn
            color="red darken-1"
            text
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            :loading="loading"
            @click="UpdateBlogPost"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from 'axios'
import FormData from 'form-data'
// import fs from 'fs'
export default {
    name:'EditPostPopup',
    props:{
        title:String,
        blogPostContent:String,
        postId: Number,
        categoryValues: Array,
        update : Boolean
        },
    data:() =>({
        dialog: false,
        image:null,
        titleValue:'',
        content:'',
        imgAlt:'',
        categoryValueNames:[],
        categoryValueIds:[],
        categories:['Health', 'Travel', 'Soccer', 'Basketball'],
        loading: false
    }),
    // updated(){
    //     if(this.update)
    //     {
    //         console.log( this.categoryValues);
    //         for(let cat in this.categoryValues){
    //             this.categoryValueNames.push(cat.name)
    //             this.categoryValueIds.push(cat.id)
    //         }
    //         this.update = false
    //         this.$forceUpdate()
    //     }
    //     console.log(this.categoryValueNames);

    // },
    methods:{
      UpdateTitle(newTitle)
      {
        this.titleValue = newTitle
        // this.$emit('updateTitle', newTitle)
      },
      UpdateBlogPost()
      {
        this.loading = true
        let dis = this
        var data = JSON.stringify({
          "id":this.postId,
          "blogPostContent": this.content,
          "title": this.titleValue
        });
        var config = {
          method: 'patch',
          url: 'http://localhost:5000/api/blogposts',
          headers: { 
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios(config)
        .then(function (response) {
          dis.loading = false
          window.location.reload()
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    },
    watch: {
    // titleLocaly(newContent) {
    //   this.titleLocal = newContent // Update when the prop changes
    // }
  },
  computed:{
    titleLocal: {
            get: function() {
                return this.title
            },
            set: function(value) {
              this.titleValue =  value
            }
      },
    contentLocal: {
            get: function() {
                return this.blogPostContent
            },
            set: function(value) {
              this.content = value
            }
      }
  }
}
</script>

<style>

</style>