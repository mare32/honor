<template>
   <v-row justify="center">
    <ValidationObserver v-slot="{handleSubmit}">
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
          <v-icon small>mdi-book-plus</v-icon>New post
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">New Post</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <ValidationProvider name="Title" rules="required|min:3|max:50" v-slot="{ errors }">
                <v-text-field
                  solo
                  label="Title*"
                  required
                  v-model="title"
                ></v-text-field>
                <span>{{ errors[0] }}</span>
                </ValidationProvider>
              </v-col>
              <v-col cols="12">
                <ValidationProvider name="Blog post content" rules="required|min:3" v-slot="{ errors }">
                <v-textarea
                solo
                name="input-7-4"
                label="Content*"
                v-model="content"
                ></v-textarea>
                <span>{{ errors[0] }}</span>
                </ValidationProvider>
              </v-col>
              <v-col
                cols="12"
                sm="12"
              >
              <ValidationProvider name="Categories" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  :items="categories"
                  label="Categories*"
                  multiple
                  v-model='categoryValues'
                ></v-autocomplete>
                <span>{{ errors[0] }}</span>
                </ValidationProvider>
              </v-col>
              <v-col
                cols="12"
                sm="12"
              >
              <ValidationProvider name="Image" rules="required|image" v-slot="{ errors }">
              <v-file-input
                label="Add image*"
                prepend-icon="mdi-camera"
                accept="*"
                v-model="image"
              ></v-file-input>
              <span>{{ errors[0] }}</span>
              </ValidationProvider>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  solo
                  label="Image alt"
                  v-model="imgAlt"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="red darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-spacer></v-spacer>
        <v-alert type="success" v-if="alert">
         Post successfuly added!
        </v-alert>
        <v-alert type="error" v-if="alertError">
         <span v-for="error in errors" :key="error">
          {{error}}<br/>
         </span>
        </v-alert>
        <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="handleSubmit(addPost)"
            :loading="loading"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </ValidationObserver>
  </v-row>
</template>

<script>
import axios from 'axios'
import FormData from 'form-data'
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { validate, extend} from 'vee-validate';
import { required, email, min, max, alpha, image } from 'vee-validate/dist/rules';

extend('required', required);
extend('email', email);
extend('min', min);
extend('max', max);
extend('alpha', alpha);
extend('image', image);
export default {
    name:'Popup',
    data:() =>({
        dialog: false,
        image:null,
        title:'',
        content:'',
        imgAlt:'',
        categories:[],
        categoryValues: [],
        loading:false,
        alert:false,
        alertError:false,
        errors:[]
    }),
    mounted(){
      // get categories
      let dis = this
      const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            };
      axios.get('http://localhost:5000/api/categories?perPage=100',config)
             .then(function(response)
            {
                for(let category of response.data.data)
                dis.categories.push(category.id+"-"+category.name)
                
            }).catch(err => {
                console.log(err);
            })
    },
    methods:{
      addPost(event){
        let tmp;
        let dis = this
        var data = new FormData();
        data.append('Title', this.title);
        data.append('image',this.image); 
        data.append('BlogPostContent', this.content);
        for(let catId of this.categoryValues)
        {
          tmp = catId.split("-")
          data.append('categoryIds', tmp[0]);
        }
        // endforeach
        data.append('imageAlt', this.imgAlt);

        var config = {
          method: 'post',
          url: 'http://localhost:5000/api/blogposts',
          headers: { 
            'Authorization': 'Bearer '+localStorage.getItem('token')
          },
          data : data
        };

        axios(config)
        .then(function (response) {
          dis.alert = true;
          dis.loading = false
        })
        .catch(function (error) {
          console.log("not nice")
          console.log(error);
        });
      }
    }
}
</script>

<style>

</style>