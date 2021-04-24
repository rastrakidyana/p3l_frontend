<template>
    <v-main class="customer" v-if="load">
        <h3 class="pt-5 grey--text text-right font-weight-bold mr-15">Customer</h3>

        <div class="fullheight px-15">
            <v-card>
                <v-card-title>                    
                    <v-btn color="#003249" dark @click="dialog = true">
                        Tambah Customer
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

                <v-data-table :headers="headers" :items="customers" :search="search" :items-per-page="15">
                    <template v-slot:[`item.actions`]="{ item }">                        
                        <v-btn color="#679b9b" small class="mr-2" @click="editHandler(item)">
                            <v-icon color="white">mdi-pencil</v-icon>
                        </v-btn>                        
                        <v-btn color="pink" v-if="cekReservasi(item)" disabled small @click="deleteHandler(item.id)">
                            <v-icon color="white">mdi-delete</v-icon> 
                        </v-btn>
                        <v-btn color="pink" v-else dark small @click="deleteHandler(item.id)">
                            <v-icon color="white">mdi-delete</v-icon> 
                        </v-btn>
                    </template>
                    <template v-slot:[`item.telp_customer`]="{ item }">
                            {{ nullShow(item.telp_customer) }}
                    </template>
                    <template v-slot:[`item.email_customer`]="{ item }">
                            {{ nullShow(item.email_customer) }}
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
                            <v-form ref="form">                                                                               
                                <v-text-field
                                    v-model="form.nama"
                                    label="Nama"
                                    outlined
                                    :rules="namaRules"
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
                reservasis: [],              
                form: {
                    nama: null,
                    telp: null,                    
                    email: null,                    
                },                
                editId: '',
                deleteId: '',
                namaRules: [
                    (v) => !!v || 'Nama tidak boleh kosong',
                    (v) => v.length <= 50 || 'Nama melebihi batas maksimal 50 karakter',
                ],                 
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
                    this.customer.append('nama_customer', this.form.nama);                
                    this.customer.append('telp_customer', this.form.telp);                
                    this.customer.append('email_customer', this.form.email);

                    var url = this.$api + '/customer'
                    // this.load = true
                    this.$http.post(url, this.customer, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    }).then(response => {
                        this.error_message = response.data.message;
                        this.color="green"
                        this.snackbar=true;
                        // this.load=false;
                        this.resetForm();
                        this.$refs.form.reset();
                        this.close();
                        this.readData();                                                
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
                        nama_customer: this.form.nama,                    
                        telp_customer: this.form.telp,                    
                        email_customer: this.form.email,                    
                    }
                    var url = this.$api + '/customer/' + this.editId;
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
                        this.$refs.form.reset();
                        this.resetForm();
                        this.close();
                        this.readData();                    
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
                    // this.load=false;                    
                    this.close();
                    this.readData();
                    this.resetForm();
                    this.$refs.form.reset();
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
                this.$refs.form.reset();                
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
            nullShow(temp) {
                if (temp === null) {
                    return "-"
                } else {
                    return temp
                }
            },
            cekReservasi(item) {
                // var today = new Date();
                var dtNow = new Date().toISOString().substr(0, 10);
                // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                for (let index = 0; index < this.reservasis.length; index++) {
                    if (this.reservasis[index].id_customer == item.id && this.reservasis[index].tgl_reservasi >= dtNow){
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
            this.readDataReservasi();            
            this.readData();            
        },
    };
</script>

