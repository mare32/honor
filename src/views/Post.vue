<template>
  <div>
    <div v-if="post">
        <v-card class="my-5">
        <v-row row wrap :class="`pr-12 pa-3 post ${post.status}`">
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
            <div class="text-right">
              <v-chip small :class="`${post.status} white--text caption my-2`">{{post.status}}</v-chip>
            </div>
          </v-col >
        </v-row>
        <v-row row wrap :class="`pa-12`">
          {{post.blogPostContent}}
        </v-row>
        <v-row row wrap justify="space-around" :class="`pa-12`">
        <v-btn class="ma-5" fab color="red" dark @click="Vote(1,post.id)">
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
            <strong>{{ Math.ceil(shield) }}<v-icon small>mdi-shield</v-icon></strong>
          </v-progress-linear>
        <v-progress-linear
            v-if="post.health < post.health/2"
            :value="post.health"
            height="20"
            color="blue"
            rounded
            class="my-2"
          >
            <strong>{{ Math.ceil(post.health) }}<v-icon small>mdi-water</v-icon></strong>
          </v-progress-linear>
          <v-progress-linear
            v-else
            :value="post.health"
            height="20"
            color="green"
            rounded
          >
            <strong>{{ Math.ceil(post.health) }}<v-icon dark small>mdi-water</v-icon></strong>
          </v-progress-linear>
          <v-btn class="ma-5" fab color="cyan" dark @click="Vote(2,post.id)">
            <v-icon large>mdi-shield-half-full</v-icon>
          </v-btn>
        </v-row>
      </v-card>
      <v-card class="addComment">
        <v-row row wrap>
          <v-col cols="12" md="12">
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
            style="margin-left:40%;"
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
              <v-btn class="ma-5" fab color="cyan" dark @click="Vote(2,post.id)">
                <v-icon large>mdi-shield-half-full</v-icon>
              </v-btn>
              <span class="font-weight-bold">{{comment.upVotes}}</span>
              <v-btn  class="ma-5" fab color="red" dark @click="Vote(1,post.id)">
                <v-icon large>mdi-sword</v-icon>
              </v-btn>
              <span class="font-weight-bold">{{comment.downVotes}}</span>
            </div>
            <div v-else>
              <v-btn class="ma-5" fab color="cyan" disabled>
                <v-icon large>mdi-shield-half-full</v-icon>
              </v-btn>
              <span class="font-weight-bold">{{comment.upVotes}}</span>
              <v-btn  class="ma-5" fab color="red" disabled>
                <v-icon large>mdi-sword</v-icon>
              </v-btn>
              <span class="font-weight-bold">{{comment.downVotes}}</span>
            </div>
            <v-col cols="6" md="6">
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
                    <v-btn class="ma-5" fab color="cyan" dark @click="Vote(2,post.id)">
                      <v-icon large>mdi-shield-half-full</v-icon>
                    </v-btn>
                    <span class="font-weight-bold">{{subcomment.upVotes}}</span>
                    <v-btn  class="ma-5" fab color="red" dark @click="Vote(1,post.id)">
                      <v-icon large>mdi-sword</v-icon>
                    </v-btn>
                    <span class="font-weight-bold">{{subcomment.downVotes}}</span>
                  </div>
                  <div v-else style="display:inline">
                    <v-btn class="ma-5" fab color="cyan" disabled>
                      <v-icon large>mdi-shield-half-full</v-icon>
                    </v-btn>
                    <span class="font-weight-bold">{{subcomment.upVotes}}</span>
                    <v-btn  class="ma-5" fab color="red" disabled>
                      <v-icon large>mdi-sword</v-icon>
                    </v-btn>
                    <span class="font-weight-bold">{{subcomment.downVotes}}</span>
                  </div>
                  <span>
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
            replyingToCommentId: null
        }
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
            dis.post = response.data
        })
        .catch(function (error) {
        console.log(error);
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
                  
              // console.log(dis.subcomments);
        })
        .catch(function (error) {
        console.log(error);
        });
        
    },
    methods:{
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
                if (comment.parentId == null && !dis.comments.some(e => e.id === comment.id)) 
                  dis.comments.push(comment)
                else if(comment.parentId != null && !dis.comments.some(e => e.id === comment.id))
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
      }
    }
}
</script>

<style>
.oneComment{
  margin:10px auto 10px 200px;
  padding: 0 0 0 30px;
}
</style>