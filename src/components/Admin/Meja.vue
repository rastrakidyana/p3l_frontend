<template>
    <v-main class="meja">
        <h3 class="text-h3 font-weight-bold mb-5 judul">Meja</h3>

        <div class="fullheight pa-6 px-15">
            <v-card>
                <v-card-title>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line                        
                        hide-details>
                    </v-text-field>

                    <v-spacer></v-spacer>

                    <v-btn color="#003249" dark @click="dialog = true">
                        Tambah Meja
                    </v-btn>                    
                </v-card-title>

                <v-data-table :headers="headers" :items="filteredTable()" :search="search" :items-per-page="5">
                    <template v-slot:[`item.actions`]="{ item }">                        
                        <v-btn color="pink" small class="mr-2" @click="editHandler(item)">
                            <v-icon color="white">mdi-pencil</v-icon> 
                        </v-btn>                                                
                        <v-btn color="#679b9b" dark small @click="deleteHandler(item.id)">
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
                            <v-text-field
                                v-model="form.no_meja"
                                label="No. Meja"
                                outlined
                                type="number"                                
                                required
                                prepend-icon="mdi-account">
                            </v-text-field>
                        
                            <v-select
                                v-if="formTitle == 'Ubah'" 
                                v-model="form.status"
                                :items="['Tersedia', 'Tidak Tersedia']"                                                                                                 
                                label="Status" 
                                outlined                                                         
                                required
                                prepend-icon="mdi-wallet-giftcard">
                            </v-select>                                                                               
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
                form: {
                    no_meja: null,
                    status: null,                    
                },                
                editId: '',
                deleteId: '',                
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
                this.meja.append('no_meja', this.form.no_meja);               

                var url = this.$api + '/meja'
                this.load = true
                this.$http.post(url, this.meja, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color="green"
                    this.snackbar=true;
                    this.load=false;
                    this.close();
                    this.readData();
                    this.resetForm();
                }).catch(error => {
                    this.error_message=error.response.data.message;
                    this.color="red"
                    this.snackbar=true;
                    this.load=false;
                })
            },
            update() {
                let newData = {
                    no_meja: this.form.no_meja,
                    status_meja: this.form.status,                    
                }
                var url = this.$api + '/meja/' + this.editId;
                this.load = true
                this.$http.put(url, newData, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color="green"
                    this.snackbar=true;
                    this.load=false;
                    this.close();
                    this.readData();
                    this.resetForm();
                    this.inputType = 'Tambah';
                }).catch(error => {
                    this.error_message=error.response.data.message;
                    this.color="red"
                    this.snackbar=true;
                    this.load=false;
                })
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
                    this.load=false;                    
                    this.close();
                    this.readData();
                    this.resetForm();
                    this.inputType = 'Tambah';
                }).catch(error => {
                    this.error_message=error.response.data.message;
                    this.color="red"
                    this.snackbar=true;                    
                    this.load=false;
                })
            },            
            editHandler(item) {
                this.inputType = 'Ubah';
                this.editId = item.id;                                
                this.form.no_meja = item.no_meja,
                this.form.status = item.status_meja,                  
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
                this.resetForm();                
                this.dialog = false;                
                this.inputType = 'Tambah';
            },
            resetForm() {
                this.form = {
                    no_meja: null,
                    status: null,                    
                };                                
            },
            filteredTable(){
                return this.mejas.filter(
                    meja => meja.status_hapus === 0)
            },
            getColor(status) {
                if (status == 'Tersedia') return '#9ddfd3'                
                else return '#e2bcb7'
            },                                                                                          
        },      
        computed: {
            formTitle() {
                return this.inputType
            },            
        },
        mounted() {            
            this.readData();                      
        },
    };
</script>

