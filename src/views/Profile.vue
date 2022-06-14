<template>
<div class="profile">
    <h1 class="headline grey--text text-center">Profile</h1>
    <v-expansion-panels>
    <v-expansion-panel
      v-for="param in profileParameters"
      :key="param.paramName"
    >
      <v-expansion-panel-header>
        {{param.paramName}}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-form>
            <v-container>
                <v-row>
                    <v-col cols="6" sm="6">
                        <div v-if="param.value">
                            <v-text-field :label="`New ${param.paramName}`" v-model="param.value" single-line solo></v-text-field>
                        </div>
                        <div v-else>
                            <v-text-field :label="`New ${param.paramName}`" single-line solo></v-text-field>
                        </div>
                    </v-col>
                    <v-col cols="6" sm="6">
                        <v-btn>Save changes</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</div>
</template>

<script>
export default {
    name:'Profile',
    data(){
        return{
            profileParameters:[
                {paramName:'Username',value:'pera'},
                {paramName:'First name',value:'Petar'},
                {paramName:'Last name',value:'Peric'},
                {paramName:'Password',value:''}
            ]
        }
    }
}
</script>

<style>

</style>