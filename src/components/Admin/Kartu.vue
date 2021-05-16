<template>
    <v-main class="kartu" v-if="load">
        <h3 class="pt-5 grey--text text-right font-weight-bold mr-15">Kartu</h3>

        <div class="fullheight px-15">
            <v-card>
                <v-card-title>                      

                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Cari"
                        single-line                        
                        hide-details>
                    </v-text-field>                                        
                </v-card-title>

                <v-data-table :headers="headers" :items="kartus" :search="search" :items-per-page="15">                    
                    <template v-slot:[`item.tipe_kartu`]="{ item }">
                        <v-chip
                            dark
                            :color="getColor(item.tipe_kartu)">
                            {{ item.tipe_kartu }} 
                        </v-chip>
                    </template>
                    <template v-slot:[`item.nama_kartu`]="{ item }">                        
                            <span v-if="item.nama_kartu != null">{{ item.nama_kartu }}</span>
                            <span v-else>-</span>
                    </template>                    
                </v-data-table>            
            </v-card>
        </div>                      

            <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
                {{error_message}}
            </v-snackbar>
    </v-main>
</template>


<script>
    export default {
        name: "kartu",
        data() {
            return {
                inputType: 'Tambah',
                load: false,
                snackbar: false,
                error_message: '',
                color: '',                                            
                search: null,                
                headers: [
                    {
                        text: "No. Kartu",
                        align: "start",
                        sortable: true,
                        value: "no_kartu",
                    },
                    { text: "Nama", value: "nama_kartu" },
                    { text: "Tanggal Kadaluarsa", value: "tgl_kadaluarsa"},
                    { text: "Tipe", value: "tipe_kartu" },                    
                ],                
                kartus: [],                
                userNow: [],                                                                                                             
            };
        },

        methods: {
            readData() {
                var url = this.$api + '/kartu'
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                        this.kartus = response.data.data
                })
            },            
            readDataUser() {
                var url = this.$api + '/karyawan/' + localStorage.getItem('id');
                console.log(url);
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)
                    this.userNow = response.data.data
                    this.load = true                   
                })
            },                                                                                                                                                                               
            getColor(status) {
                if (status == 'Credit Card') return 'primary'                                
                else return  'warning'
            },                                                                                                                         
        },        
        computed: {
            formTitle() {
                return this.inputType
            },            
        },
        mounted() {            
            this.readData();
            this.readDataUser();            
        },
    };
</script>

