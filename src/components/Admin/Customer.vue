<template>
    <v-main class="customer">
        <h3 class="text-h3 font-weight-bold mb-5 judul">Customer</h3>

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
                        Tambah Customer
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
                </v-data-table>            
            </v-card>
        </div>

            <v-dialog v-model="dialog" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline font-weight-bold">{{ formTitle }} Customer</span>
                        <v-spacer></v-spacer>
                        <v-btn color="#810000" text @click="cancel">
                            <v-icon x-large>mdi-close-circle</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-container>                                                                               
                            <v-text-field
                                v-model="form.nama"
                                label="Nama"
                                outlined
                                required
                                prepend-icon="mdi-account">
                            </v-text-field>                                            

                            <v-text-field
                                v-model="form.telp"                                
                                label="No. Telepon"
                                outlined                                                                                                
                                prepend-icon="mdi-phone">
                            </v-text-field>

                            <v-text-field
                                v-model="form.email"                                
                                label="Email"
                                outlined                                                                                                
                                prepend-icon="mdi-email">
                            </v-text-field>                          
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
                        
                        <h5 class="font-weight-bold">Hapus Customer?</h5>                        
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
        name: "customer",
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
                        text: "Nama",
                        align: "start",
                        sortable: true,
                        value: "nama_customer",
                    },
                    { text: "No. Telp", value: "telp_customer" },
                    { text: "Email", value: "email_customer" },
                    { text: "Actions", value: "actions" },
                ],
                customer: new FormData,
                customers: [],                
                form: {
                    nama: null,
                    telp: null,                    
                    email: null,                    
                },                
                editId: '',
                deleteId: '',                
            };
        },

        methods: {
            readData() {
                var url = this.$api + '/customer'
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                        this.customers = response.data.data
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
                this.customer.append('nama_customer', this.form.nama);                
                this.customer.append('telp_customer', this.form.telp);                
                this.customer.append('email_customer', this.form.email);

                var url = this.$api + '/customer'
                this.load = true
                this.$http.post(url, this.customer, {
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
                    nama_customer: this.form.nama,                    
                    telp_customer: this.form.telp,                    
                    email_customer: this.form.email,                    
                }
                var url = this.$api + '/customer/' + this.editId;
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
                var url = this.$api + '/customer_hapus/' + this.deleteId;
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
                this.form.nama = item.nama_customer,                
                this.form.telp = item.telp_customer,                
                this.form.email = item.email_customer,  
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
                    nama: null,                 
                    telp: null,                    
                    email: null,                    
                };                                                                   
            },
            filteredTable(){
                return this.customers.filter(
                    customer => customer.status_hapus === 0)
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

