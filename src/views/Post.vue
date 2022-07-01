<template>
  <div>
    <div v-if="post">
        <v-card class="my-5">
        <v-row row wrap :class="`pr-12 pa-3 post ${post.status}`">
          <v-col cols="2" md="2">
            <v-avatar size="100">
              <img
                :src="post.image.src"
                :alt="post.image.alt"
              >
            </v-avatar>
          </v-col >
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
            <div class="caption grey--text">Categories</div>
            <v-chip small :class="`caption my-2`" v-for="category in post.categories" :key="category.id">{{category.name}}</v-chip>
          </v-col >
          <v-col xs="2">
            <div class="text-right">
              <div class="caption grey--text">Status</div>
              <v-chip small :class="`${post.status} white--text caption my-2`">{{post.status}}</v-chip>
            </div>
          </v-col >
        </v-row>
        <v-row row wrap :class="`pa-12`">
          {{post.blogPostContent}}
        </v-row>
        <v-row row wrap justify="space-around" :class="`pa-12`">
        <v-btn class="ma-5" fab :color="userAttackedPost ? 'red' : ''" dark @click="VotePost(1)">
          <v-icon large>mdi-sword</v-icon>
        </v-btn>
        <v-progress-linear
            v-if="post.shield > 0"
            :value="post.shield"
            height="20"
            color="blue"
            rounded
            class="my-2"
          >
            <strong>{{ Math.ceil(post.shield) }} <v-icon small dark>mdi-shield</v-icon></strong>
          </v-progress-linear>
          <v-progress-linear
            :value="post.health"
            height="20"
            :color="getHealthBarColor()"
            rounded
          >
            <strong>{{ Math.ceil(post.health) }}<v-icon>mdi-hospital</v-icon></strong>
          </v-progress-linear>
          <v-btn class="ma-5" fab :color="userDefendedPost ? 'cyan' : ''" dark @click="VotePost(2)">
            <v-icon large>mdi-shield-half-full</v-icon>
          </v-btn>
          <v-col cols="12" md="12">
            <v-divider></v-divider>
            <div class="text-center grey--text pa-5 display-1">Gallery</div><br/>
            <div class="text-center">
              <v-btn class="ma-5 text-center" color="primary" dark v-if="!showGallery" @click="showGallery = true">
                <v-icon>mdi-view-gallery</v-icon>Show Gallery
              </v-btn>
              <v-btn class="ma-5" color="error" dark @click="showGallery = false" v-else>
                <v-icon>mdi-view-gallery</v-icon>Hide Gallery
              </v-btn>
            </div>

          </v-col>
          <v-col cols="12" md="12">
            <v-fab-transition>
             <v-row v-show="showGallery">
              <v-col
                v-for="image in post.images"
                :key="image.id"
                class="d-flex child-flex"
                cols="3"
              >
                <v-img
                  :src="image.src"
                  :lazy-src="image.src"
                  aspect-ratio="1"
                  class="grey lighten-2"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-col>
            </v-row>
            </v-fab-transition>
          </v-col >
         
        </v-row>
      </v-card>
      <v-card class="addComment">
        
        <v-row row wrap>
           <v-col cols="12" md="12">
            <div class="text-center grey--text pa-5 display-1">Comment section</div>
          </v-col>
          <v-col cols="6" md="4" sm="3" class="pa-5">
            <span v-if="replyingTo">
              <v-btn @click="CancelReply">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              Replying to <b>{{replyingTo}}</b>'s comment:{{replyingToText}}
            </span>
              <v-text-field
                solo
                label="Enter your comment..."
                v-model="newCommentText"
              ></v-text-field>
           <v-btn
            color="green darken-1"
            dark
            style="margin-left:0;"
            @click="postComment"
            :loading="addCommentLoading"
          >
            Comment
          </v-btn>
          </v-col>
        </v-row>
      </v-card>
       <v-card class="commentSection" v-if="comments">
        <v-row row wrap v-for="comment in comments" :key="comment.id" class="oneComment">
        <v-icon>mdi-comment</v-icon>
          <v-btn  class="ma-5" fab color="blue" dark @click="SetReplier(comment.user.username,comment.commentText,comment.id)">
            <v-icon large>mdi-reply</v-icon>
          </v-btn>
        <div v-if="userId == comment.authorId">
          <v-btn class="ma-5" fab color="red" dark @click="DeleteComment(comment.id)">
            <v-icon large>mdi-delete</v-icon>
          </v-btn>
        </div>
            
            <div v-if="userId != comment.authorId">
              <v-btn class="ma-5" fab :color="userDefendedComments.includes(comment.id) ? 'cyan' : ''" dark @click="Vote(2,comment.id)">
                <v-icon large>mdi-shield-half-full</v-icon>
              </v-btn>
              <span class="font-weight-bold">{{comment.downVotes}}</span>
              <v-btn  class="ma-5" fab :color="userAttackedComments.includes(comment.id) ? 'red' : ''" dark @click="Vote(1,comment.id)">
                <v-icon large>mdi-sword</v-icon>
              </v-btn>
              <span class="font-weight-bold">{{comment.upVotes}}</span>
            </div>
            <div v-else>
              <v-btn class="ma-5" fab color="cyan" disabled>
                <v-icon large>mdi-shield-half-full</v-icon>
              </v-btn>
              <span class="font-weight-bold">{{comment.downVotes}}</span>
              <v-btn  class="ma-5" fab color="red" disabled>
                <v-icon large>mdi-sword</v-icon>
              </v-btn>
              <span class="font-weight-bold">{{comment.upVotes}}</span>
            </div>
            <v-col cols="6" md="6" class="mx-2">
                <h2>{{comment.user.username}}</h2>
                <h4>{{comment.commentText}}</h4>
                <h4>{{comment.commentedAt}}</h4>
            </v-col>
            <br>

            <div style="width:100%; margin-left: 10em;" v-for="subcomment in subcomments" :key="subcomment.id">
                <div v-if="subcomment.parentId == comment.id">
                  Sub comment <v-icon>mdi-arrow-right-bottom-bold</v-icon>
                  <span v-if="userId == subcomment.authorId">
                    <v-btn class="ma-5" fab color="red" dark @click="DeleteComment(subcomment.id)">
                      <v-icon large>mdi-delete</v-icon>
                    </v-btn>
                  </span>
                  
                  <div v-if="userId != subcomment.authorId" style="display:inline">
                    <v-btn class="ma-5" fab :color="userDefendedComments.includes(subcomment.id) ? 'cyan' : ''" dark @click="Vote(2,subcomment.id)">
                      <v-icon large>mdi-shield-half-full</v-icon>
                    </v-btn>
                    <span class="font-weight-bold">{{subcomment.downVotes}}</span>
                    <v-btn  class="ma-5" fab :color="userAttackedComments.includes(subcomment.id) ? 'red' : ''" dark @click="Vote(1,subcomment.id)">
                      <v-icon large>mdi-sword</v-icon>
                    </v-btn>
                    <span class="font-weight-bold">{{subcomment.upVotes}}</span>
                  </div>
                  <div v-else style="display:inline">
                    <v-btn class="ma-5" fab color="cyan" disabled>
                      <v-icon large>mdi-shield-half-full</v-icon>
                    </v-btn>
                      <span class="font-weight-bold">{{subcomment.downVotes}}</span>
                    <v-btn  class="ma-5" fab color="red" disabled>
                      <v-icon large>mdi-sword</v-icon>
                    </v-btn>
                      <span class="font-weight-bold">{{subcomment.upVotes}}</span>
                  </div>
                  <span>
                    <h4 style="display:inline"><h2 style="display:inline"> | </h2>{{subcomment.commentedAt}}</h4>
                      <h2 style="display:inline"> | {{subcomment.user.username}} </h2>
                      <h4 style="display:inline">{{subcomment.commentText}}</h4>
                  </span>
                      <!-- <h4 style="display:inline">{{subcomment.commentedAt}}</h4> -->
                </div>
            </div>
        </v-row>
      </v-card>
      <v-card v-else>
        <v-row row wrap>
          <v-col cols="12" md="12" style="padding:10px 700px">
           <h5>No comments.</h5>
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
            comments:[],
            subcomments:[],
            newCommentText: '',
            parentId:null,
            addCommentLoading:false,
            userId:null,
            replyingTo:null,
            replyingToText:null,
            replyingToCommentId: null,
            userAttackedComments: [],
            userDefendedComments: [],
            userAttackedPost:false,
            userDefendedPost:false,
            waitForDataToLoad:true,
            postId:0,
            showGallery:false
        }
    },
    created(){
      document.title = "Blograd | Post"
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
          dis.postId = response.data.id
          config.url = 'http://localhost:5000/api/votes?perPage=99999'
          axios(config) // BROJANJE KORISNIKOVIH GLASOVA
             .then(function(response){
              // console.log(response.data.data);
              for(let vote of response.data.data)
              {
                if(vote.voteType == 1 && vote.blogPostId == dis.postId)
                  dis.userAttackedPost = true;
                else if(vote.voteType == 2 && vote.blogPostId == dis.postId)
                  dis.userDefendedPost = true;
                if(vote.voteType == 1 && vote.commentId != null)
                dis.userAttackedComments.push(vote.commentId)
                else if(vote.commentId != null)
                dis.userDefendedComments.push(vote.commentId)
              }
              }).catch(function(error){ })
          let tmp
          tmp = response.data.createdAt.split("T")
          dis.post = response.data
          dis.post.createdAt = tmp[0]
          // console.log(dis.post);
        })
        .catch(function (error) {
        // console.log(error);
        });


      


        if(localStorage.getItem('token')){
          // fetch userId
          config.url = 'http://localhost:5000/api/profile'
          axios(config)
          .then(function (response) {
              // console.log(response.data.id)
              dis.userId = response.data.id
          })
          .catch(function (error) {
          console.log(error);
          });
          

          
            }
        


        config.url = 'http://localhost:5000/api/comments/'+this.id
        if(!localStorage.getItem('token'))
        {
          config.headers = {}
        }
        axios(config)
        .then(function (response) {
          for(let comment of response.data)
              {
                comment.commentedAt = comment.commentedAt.split("T")
                comment.commentedAt = comment.commentedAt[0]
                if(comment.parentId == null)
                dis.comments.push(comment)
                else
                dis.subcomments.push(comment)
              }
        })
        .catch(function (error) {
        console.log(error);
        });
        
    },
    methods:{
      getHealthBarColor(){
        // depending on health condition of the post display different color
        if(this.post.health > 66)
          return 'green'
        else if(this.post.health <= 66 && this.post.health > 33)
          return '#fcb103'
        else
          return 'red'
      },
      postComment()
      {
        if(!localStorage.getItem('token'))
        {
          alert("You are not logged in, thus you cannot comment.")
        }
        else{
          let commentText = this.newCommentText;
          let postId = this.post.id;
          let parentId = this.replyingToCommentId
          this.replyingTo = null;
          this.replyingToText = null;
          this.replyingToCommentId = null;
          let dis = this
          var data = JSON.stringify({
            "commentText": commentText,
            "blogPostId": postId,
            "parentId": parentId
          });

          var config = {
            method: 'post',
            url: 'http://localhost:5000/api/comments',
            headers: { 
              'Authorization': 'Bearer '+localStorage.getItem('token'), 
              'Content-Type': 'application/json'
            },
            data : data
          };
          this.addCommentLoading = true
          axios(config)
          .then(function (response) {
            dis.newCommentText = ''
            dis.addCommentLoading = false
            // dis.comments = []

            // axiosom poslati komentar, nakon toga zavrteti spinner i ponovo dohvatiti komentare axiosom i ispisati ih
            config.method = 'get'
            config.url+='/'+postId
            config.headers = {'Authorization': 'Bearer '+localStorage.getItem('token')}
            axios(config)
            .then(function (response) {
                dis.subcomments = []
                dis.comments = []
              for(let comment of response.data)
              {
                comment.commentedAt = comment.commentedAt.split("T")
                comment.commentedAt = comment.commentedAt[0]
                // if (comment.parentId == null && !dis.comments.some(e => e.id === comment.id)) 
                if (comment.parentId == null) 
                  dis.comments.push(comment)
                // else if(comment.parentId != null && !dis.comments.some(e => e.id === comment.id))
                else if(comment.parentId != null)
                  dis.subcomments.push(comment)
              }
              // console.log(dis.subcomments);
              dis.$forceUpdate()
            })
            .catch(function (error) {
            console.log(error);
            });
          })
          .catch(function (error) {
            dis.addCommentLoading = false
            alert("Comment cannot be empty")
            console.log(error);
          });
          

        }
      },
      DeleteComment(commentId){
        let dis = this
        var config = {
            method: 'delete',
            url: 'http://localhost:5000/api/comments/'+commentId,
            headers: { 
              'Authorization': 'Bearer '+localStorage.getItem('token')
            }
          };
          axios(config)
          .then(function (response) {
            config.method = 'get'
            config.url = 'http://localhost:5000/api/comments/'+dis.post.id
            axios(config)
            .then(function (response) {
              dis.subcomments = []
                dis.comments = []
              for(let comment of response.data)
              {
                comment.commentedAt = comment.commentedAt.split("T")
                comment.commentedAt = comment.commentedAt[0]
                if (comment.parentId == null) 
                  dis.comments.push(comment)
                else if(comment.parentId != null)
                  dis.subcomments.push(comment)
              }
              // console.log(dis.comments);
              // console.log(dis.subcomments);
              dis.$forceUpdate()
            })
          })
      },
      SetReplier(username,text,commentId)
      {
        // console.log(username,text,commentId);
        if(commentId == this.replyingToCommentId)
        this.CancelReply()
        else{
          this.replyingTo = username;
          this.replyingToText = text;
          this.replyingToCommentId = commentId;
        }
      },
      CancelReply()
      {
        this.replyingTo = null;
        this.replyingToText = null;
        this.replyingToCommentId = null;
      },
      VotePost(type){
        let dis = this
        let postId = this.post.id
        if(localStorage.getItem("token"))
        {
          if(type == 1 && this.userAttackedPost)
            this.userAttackedPost = false
          else if(type == 1 && !this.userAttackedPost)
          {
            this.userAttackedPost = true
            if(this.userDefendedPost)
              this.userDefendedPost = false
          }
          if(type == 2 && this.userDefendedPost)
            this.userDefendedPost = false
          else if(type == 2 && !this.userDefendedPost)
            {
              this.userDefendedPost = true
              if(this.userAttackedPost)
                this.userAttackedPost = false
            }
          var data = JSON.stringify({
            "voteType": type,
            "blogPostId": postId
          });
          var config = {
          method: 'put',
          url: 'http://localhost:5000/api/votes',
          
          headers: { 
            'Authorization': 'Bearer '+localStorage.getItem("token"), 
            'Content-Type': 'application/json'
          },
          data : data
        };
          axios(config).then(function(response){
              axios.get('http://localhost:5000/api/blogposts/'+postId,{
            }).then(function(response){
                dis.post = response.data
                  dis.post.createdAt = dis.post.createdAt.split("T")
                  dis.post.createdAt = dis.post.createdAt[0]
                dis.$forceUpdate()
            }).catch(err => {
              console.log(err);
            })
          }).catch(err => {
            console.log(err);
          })
        }
        else{
          alert("Unauthorized - please log in to interact with posts")
        }
      },
      Vote(type,commId){
        let dis = this
        if(localStorage.getItem("token")){
          if(type == 1 && this.userAttackedComments.includes(commId))
          {
            let index = this.userAttackedComments.indexOf(commId);
            this.userAttackedComments.splice(index,1)
          }
          else if(type == 1 && !this.userAttackedComments.includes(commId))
          {
            if(this.userDefendedComments.includes(commId))
            {
              let index = this.userDefendedComments.indexOf(commId);
              this.userDefendedComments.splice(index,1)
            }
            this.userAttackedComments.push(commId)
          }
          if(type == 2 && this.userDefendedComments.includes(commId))
          {
            let index = this.userDefendedComments.indexOf(commId);
            this.userDefendedComments.splice(index,1)
          }
          else if(type == 2 && !this.userDefendedComments.includes(commId))
          {
            if(this.userAttackedComments.includes(commId))
            {
              let index = this.userAttackedComments.indexOf(commId);
              this.userAttackedComments.splice(index,1)
            }
            this.userDefendedComments.push(commId)
          }
          var data = JSON.stringify({
            "voteType": type,
            "commentId": commId
          });
          var config = {
          method: 'put',
          url: 'http://localhost:5000/api/votes',
          
          headers: { 
            'Authorization': 'Bearer '+localStorage.getItem("token"), 
            'Content-Type': 'application/json'
          },
          data : data
        };
        axios(config).then(function(response){
              axios.get('http://localhost:5000/api/comments/'+dis.post.id,{
            }).then(function(response){
              dis.subcomments = []
                dis.comments = []
                for(let comment of response.data)
                {
                  comment.commentedAt = comment.commentedAt.split("T")
                  comment.commentedAt = comment.commentedAt[0]
                  if (comment.parentId == null) 
                    dis.comments.push(comment)
                  else if(comment.parentId != null)
                    dis.subcomments.push(comment)
                }
                dis.$forceUpdate()
            }).catch(err => {
              console.log(err);
            })
          }).catch(err => {
            console.log(err);
          })
            }
            else{
              alert("Unauthorized to vote")
            }
      },
    }
}
</script>

<style>
.oneComment{
  margin:10px auto 10px 200px;
  padding: 0 0 0 30px;
}
</style>