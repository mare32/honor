import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify,{
    // overridovanje originalnih vuetify boja tema
    // theme:{
    //     primary:nekaBoja,
    //     success:drugaboja,
    //     warning:trecaboja,
    //     error:cetvrtaboja
    // }
});

export default new Vuetify({
});
