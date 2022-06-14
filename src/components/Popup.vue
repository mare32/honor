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
                <v-text-field
                  solo
                  label="Title*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                solo
                name="input-7-4"
                label="Content*"
                ></v-textarea>
              </v-col>
              <v-col
                cols="12"
                sm="12"
              >
                <v-autocomplete
                  :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                  label="Categories*"
                  multiple
                ></v-autocomplete>
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
            Close
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
    name:'Popup',
    data:() =>({
        dialog: false
    })
}
</script>

<style>

</style>