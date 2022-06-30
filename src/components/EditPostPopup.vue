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
                <ValidationProvider name="Title" rules="required|min:3|max:50" v-slot="{ errors }">
                <v-text-field
                  solo
                  label="Title*"
                  v-model="title"
                  required
                ></v-text-field>
                <span>{{ errors[0] }}</span>
                </ValidationProvider>
              </v-col>
              <v-col cols="12">
                <ValidationProvider name="Blog post content" rules="required|min:3" v-slot="{ errors }">
                <v-textarea
                solo
                name="input-7-4"
                v-model="content"
                label="Content*"
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
                  v-model="categoryValues"
                  :items="categories"
                  label="Categories*"
                  multiple
                ></v-autocomplete>
                <span>{{ errors[0] }}</span>
                </ValidationProvider>
              </v-col>
              <v-col cols="3" sm="3" v-for="img in blogPostImages" :key="img.id">
                <v-responsive class="pt-4">
                    <v-avatar size="100" :class="(img.id == coverImgId ? 'cover' : '') || (imagesToDelete.includes(img.id) ? 'toDelete' : '')">
                        <img :src="img.imageSrc" :alt="img.imageAlt" />
                    </v-avatar>
                    <v-btn color="primary" :disabled="(img.id == coverImgId ? true : false) || (imagesToDelete.includes(img.id) ? true : false)"  small @click="changeCoverImage(img.id)"><v-icon>mdi-image-sync</v-icon></v-btn>
                    <v-btn color="error" :disabled="img.id == coverImgId ? true : false"  small @click="deleteImage(img.id)"><v-icon>mdi-image-remove</v-icon></v-btn>
                </v-responsive>
              </v-col>
              <v-col
                cols="12"
                sm="12"
                v-if="showNewImageFields"
              >
              <ValidationProvider name="New image" :rules="showNewImageFields ? 'required|image' : ''" v-slot="{ errors }">
              <v-file-input
                label="Add image*"
                prepend-icon="mdi-camera"
                accept="image/*"
                v-model="image"
              ></v-file-input>
              <span>{{ errors[0] }}</span>
              </ValidationProvider>
              </v-col>
              <v-col cols="12" v-if="showNewImageFields">
                <!-- <ValidationProvider name="Image alt" rules="required" v-slot="{ errors }"> -->
                <v-text-field
                  solo
                  label="Image alt"
                ></v-text-field>
                <!-- <span>{{ errors[0] }}</span>
                </ValidationProvider> -->
              </v-col>
              <v-col cols="12" sm="12">
                <v-btn v-if="!showNewImageFields" @click="showNewImageFields = true">Add new image<v-icon>mdi-image-plus</v-icon></v-btn>
                <v-btn v-if="showNewImageFields" @click="showNewImageFields = false" color="error">Cancel new image<v-icon>mdi-image-minus</v-icon></v-btn>
              </v-col>
              <!-- <v-col cols="12" sm="12">
              </v-col> -->
              
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
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            :loading="loading"
            @click="handleSubmit(UpdateBlogPost)"
          >
            Update
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
import { required, email, integer, between, min, max, alpha, image } from 'vee-validate/dist/rules';

extend('required', required);
extend('email', email);
extend('integer', integer);
extend('between', between);
extend('min', min);
extend('max', max);
extend('alpha', alpha);
extend('image', image);
export default {
    name:'EditPostPopup',
    props:{
        postId: Number
        },
    data:() =>({
        dialog: false,
        image:null,
        title:'',
        content:'',
        imgAlt:'',
        categories:[],
        categoryValues: [],
        loading: false,
        blogPostImages:[],
        coverImgId:0,
        imagesToDelete:[],
        showNewImageFields:false,
        categoryIds:[]
    }),
    mounted(){
      let dis = this
      const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            };
            axios.get('http://localhost:5000/api/blogposts/'+dis.postId)
             .then(function(response)
            {
                for(let category of response.data.categories)
                dis.categoryValues.push(category.id+"-"+category.name)

                dis.content = response.data.blogPostContent
                dis.title = response.data.title
                dis.coverImgId = response.data.coverImageId
            }).catch(err => {
                console.log(err);
            })

            axios.get('http://localhost:5000/api/categories?perPage=100',config)
             .then(function(response)
            {
                for(let category of response.data.data)
                dis.categories.push(category.id+"-"+category.name)
            }).catch(err => {
                console.log(err);
            })
            config.data = 
             axios.get('http://localhost:5000/api/blogpostimages?postId='+dis.postId,config)
             .then(function(response)
            {
                for(let image of response.data.data)
                dis.blogPostImages.push(image)
            }).catch(err => {
                console.log(err);
            })
    },
    methods:{
      deleteImage(imageId){
        if(!this.imagesToDelete.includes(imageId))
          this.imagesToDelete.push(imageId)
        else
          {
            let index = this.imagesToDelete.indexOf(imageId);
            this.imagesToDelete.splice(index,1)
          }
        console.log(this.imagesToDelete)
            // const config = {
            // headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            // };
            // axios.delete('http://localhost:5000/api/images/'+imageId,config)
            //  .then(function(response)
            // {
            //   alert("Slika je obrisana")
            //   window.location.reload()
            // }).catch(err => {
            //     console.log(err);
            // })
      },
      changeCoverImage(imageId){
        this.coverImgId = imageId
      },
      UpdateBlogPost()
      {
        this.loading = true
        let dis = this
        var data = JSON.stringify({
          "id":this.postId,
          "blogPostContent": this.content,
          "title": this.title,
          "coverImgId":this.coverImgId
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
          // update kategorija 
          config.url = 'http://localhost:5000/api/blogpostcategories'
          config.method = 'put'
          let tmp;
          for(let cat of dis.categoryValues)
          {
            tmp = cat.split("-")
            dis.categoryIds.push(tmp[0])
          }
          config.data = 
          { 
            "blogPostId":dis.postId,
            "categoryIds":dis.categoryIds
          }
          axios(config)
        .then(function (response) {


        }).catch(function (error) {
          console.log(error);
        });
        // Dodavanje nove slike ukoliko je prikazano polje
        if(dis.imagesToDelete.length)
        {
          console.log(dis.imagesToDelete);
        }
        if(dis.showNewImageFields)
        {
          var imageData = new FormData();
          
        }

          window.location.reload()
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    }
}
</script>

<style>
  .cover{
    border:5px solid green;
  }
  .toDelete{
    border:5px solid red;
  }
</style>