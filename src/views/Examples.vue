<template>
<div class="examples">
  <h1>Examples</h1>

  <v-btn class="hidden-md-and-down">click me</v-btn>
  <v-btn class="hidden-md-and-up" color="black" dark>click me</v-btn>
  <v-btn class="hidden-sm-only">click me</v-btn>
  <v-spacer></v-spacer>
  <v-btn class="pink white--text">click me</v-btn>
  <v-btn depressed color="pink" dark>click me</v-btn>
  <v-btn text color="pink">click me</v-btn> <!-- text umesto flat -->

  <v-btn depressed class="pink white--text">
    <v-icon>mdi-pencil</v-icon> <!-- mdi stoji za material design icon -->
  </v-btn>
  <v-btn depressed class="pink white--text">
    <v-icon left>mdi-email</v-icon>
    <span>email me</span>
  </v-btn>
  <v-btn depressed small class="pink white--text">
    <v-icon left small>mdi-email</v-icon>
    <span>email me</span>
  </v-btn>
  <v-btn depressed large class="pink white--text">
    <span>email me</span>
    <v-icon right large>mdi-email</v-icon>
  </v-btn>
  <v-btn fab depressed small dark color="purple">
    <v-icon>mdi-heart</v-icon>
  </v-btn>







  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <p class="red white--text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, tenetur? Alias porro ad nostrum deserunt, tenetur omnis debitis officia nulla eligendi facilis dolorum. Sequi quod fugit similique dolore, cumque laborum.</p>
  <p class="pink lighten-4 red--text text--darken-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, rerum temporibus quos similique ut voluptate ullam officiis laboriosam rem asperiores possimus quam exercitationem magnam, architecto, laudantium omnis dolores eligendi commodi!</p>
  <h1 class="display-4">Massive Display</h1>
  <h4 class="display-1">Smol Display</h4>
  <p class="headline">This is a headline</p>
  <p class="subheading font-weight-bold">This is a subheading</p>
  <p class="caption">This is a caption</p>
</div>
</template>

<script>

  export default {
    name: 'Examples',

    components: {},
  }
</script>
