<template>
    <v-main class="meja" v-if="load">
        <h3 class="pt-5 grey--text text-right font-weight-bold mr-15">Meja</h3>

        <div class="fullheight px-15">
            <v-card>
                <v-card-title>
                    <v-btn color="#003249" dark @click="dialog = true">
                        Tambah Meja
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Cari"
                        single-line                        
                        hide-details>
                    </v-text-field>                                        
                </v-card-title>

                <v-data-table :headers="headers" :items="mejas" :search="search" :items-per-page="10">
                    <template v-slot:[`item.actions`]="{ item }">                        
                        <v-btn color="#679b9b" v-if="cekReservasi(item)" disabled small class="mr-2" @click="editHandler(item)">
                            <v-icon color="white">mdi-pencil</v-icon> 
                        </v-btn>
                        <v-btn color="#679b9b" v-else small class="mr-2" @click="editHandler(item)">
                            <v-icon color="white">mdi-pencil</v-icon> 
                        </v-btn>                                                
                        <v-btn color="pink" v-if="cekReservasi(item)" disabled small @click="deleteHandler(item.id)">
                            <v-icon color="white">mdi-delete</v-icon> 
                        </v-btn>
                        <v-btn color="pink" v-else dark small @click="deleteHandler(item.id)">
                            <v-icon color="white">mdi-delete</v-icon> 
                        </v-btn>
                    </template>                    
                    <template v-slot:[`item.status_meja`]="{ item }">
                        <v-chip
                            dark
                            :color="getColor(item.status_meja)">
                            {{ item.status_meja }}
                        </v-chip>
                    </template>                                
                </v-data-table>                            
            </v-card>
        </div>

            <v-dialog v-model="dialog" persistent max-width="400px">
                <v-card>
                    <v-card-title>
                        <span class="headline font-weight-bold">{{ formTitle }} Meja</span>
                        <v-spacer></v-spacer>
                        <v-btn color="#810000" text @click="cancel">
                            <v-icon x-large>mdi-close-circle</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form ref="form">                                                                               
                            <v-text-field
                                v-model="form.no_meja"
                                label="No. Meja"
                                outlined
                                min=1
                                type="number"                                
                                required
                                :rules="noMejaRules" 
                                prepend-icon="mdi-table">
                            </v-text-field>
                            </v-form>                                                                                                  
                        </v-container>
                    </v-card-text>
                    <v-card-actions class="justify-center">                                            
                        <v-btn color="#003249" dark @click="setForm">
                            Simpan
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogDelete" persistent max-width="400px">
                <v-card>
                    <v-card-title>                        
                        <v-spacer></v-spacer>
                            <v-btn color="#810000" text @click="dialogDelete = false">
                                <v-icon x-large>mdi-close-circle</v-icon>
                            </v-btn>                        
                    </v-card-title>                   
                    <v-card-text>                        
                        <h5 class="font-weight-bold">Hapus Meja?</h5>                        
                    </v-card-text>
                    <v-card-actions class="justify-center">                                           
                        <v-btn color="red darken-1" dark @click="deleteData">
                            Hapus
                        </v-btn>                                       
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
                {{error_message}}
            </v-snackbar>
    </v-main>
</template>


<script>
    export default {
        name: "meja",
        data() {
            return {
                inputType: 'Tambah',
                reveal: false,
                load: false,
                snackbar: false,
                error_message: '',
                color: '',                                             
                search: null,
                dialog: false,
                dialogDelete: false,                
                headers: [
                    {
                        text: "No. Meja",
                        align: "start",
                        sortable: true,
                        value: "no_meja",
                    },
                    { text: "Status", value: "status_meja" },                    
                    { text: "Actions", value: "actions" },
                ],
                meja: new FormData,
                mejas: [],
                reservasis: [],      
                form: {
                    no_meja: null,                                    
                },                
                editId: '',
                deleteId: '',
                noMejaRules: [
                    (v) => !!v || 'No. meja tidak boleh kosong',
                ],                
            };
        },

        methods: {
            readData() {
                var url = this.$api + '/meja'
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                    this.mejas = response.data.data
                    this.load = true
                })
            },
            readDataReservasi() {
                var url = this.$api + '/reservasi'
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                    this.reservasis = response.data.data
                })
            },                    
            setForm() {
                if (this.inputType === 'Tambah') {
                    this.save()
                } else {
                    this.update()
                }
            },
            save() {
                if (this.$refs.form.validate()) {
                    this.meja.append('no_meja', this.form.no_meja);               
                    var url = this.$api + '/meja'
                    // this.load = true
                    this.$http.post(url, this.meja, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    }).then(response => {
                        this.error_message = response.data.message;
                        this.color="green"
                        this.snackbar=true;
                        // this.load=false;
                        this.close();
                        this.readData();
                        // this.resetForm();
                        this.$refs.form.reset();
                    }).catch(error => {
                        this.error_message=error.response.data.message;
                        this.color="red"
                        this.snackbar=true;
                        // this.load=false;
                    })
                }
            },
            update() {
                if (this.$refs.form.validate()) {
                    let newData = {
                        no_meja: this.form.no_meja,                    
                    }
                    var url = this.$api + '/meja/' + this.editId;
                    // this.load = true
                    this.$http.put(url, newData, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    }).then(response => {
                        this.error_message = response.data.message;
                        this.color="green"
                        this.snackbar=true;
                        // this.load=false;
                        this.$refs.form.reset()
                        this.close();
                        this.readData();
                        // this.resetForm();                    
                        this.inputType = 'Tambah';
                    }).catch(error => {
                        this.error_message=error.response.data.message;
                        this.color="red"
                        this.snackbar=true;
                        // this.load=false;
                    })
                }
            },            
            deleteData() {
                var url = this.$api + '/meja_hapus/' + this.deleteId;
                console.log(url);
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color="green"
                    this.snackbar=true;
                    // this.load=false;                    
                    this.close();
                    this.readData();
                    // this.resetForm();
                    this.$refs.form.reset()
                    this.inputType = 'Tambah';
                }).catch(error => {
                    this.error_message=error.response.data.message;
                    this.color="red"
                    this.snackbar=true;                    
                    // this.load=false;
                })
            },            
            editHandler(item) {
                this.inputType = 'Ubah';
                this.editId = item.id;                                
                this.form.no_meja = item.no_meja,                                  
                this.dialog = true;
            },            
            deleteHandler(id) {
                this.deleteId = id;                
                this.dialogDelete = true;
            },
            close() {
                this.dialog = false;
                this.dialogDelete = false;
                this.inputType = 'Tambah';
            },
            cancel() {
                // this.resetForm();
                this.$refs.form.reset()
                this.dialog = false;                
                this.inputType = 'Tambah';
            },
            // resetForm() {
            //     this.form = {
            //         no_meja: null,                                       
            //     };                                
            // },            
            getColor(status) {
                if (status == 'Tersedia') return '#289672'                
                else return '#d44000'
            },
            cekReservasi(item) {
                // var today = new Date();
                var dtNow = new Date().toISOString().substr(0, 10);
                // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                for (let index = 0; index < this.reservasis.length; index++) {
                    if (this.reservasis[index].id_meja == item.id && this.reservasis[index].tgl_reservasi >= dtNow && this.reservasis[index].status_transaksi == 'Belum Bayar'){
                        return true
                    }                    
                }
                return false
            }                                                                                          
        },      
        computed: {
            formTitle() {
                return this.inputType
            },            
        },
        mounted() { 
            this.readDataReservasi()           
            this.readData();                      
        },
    };
</script>

