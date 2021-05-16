<template>
    <v-main class="pesanan" v-if="load">
        <h3 class="pt-5 grey--text text-right font-weight-bold mr-15">Pesanan</h3>

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

                <v-data-table :headers="headers" :items="pesanans" :search="search" :items-per-page="15">
                    <template v-slot:[`item.actions`]="{ item }">                        
                        <v-btn color="#679b9b" small v-if="cekEdit(item)" class="mr-2" @click="editHandler(item)">
                            <v-icon color="white">mdi-pencil</v-icon> 
                        </v-btn>
                        <v-btn color="#679b9b" small v-else disabled class="mr-2" @click="editHandler(item)">
                            <v-icon color="white">mdi-pencil</v-icon> 
                        </v-btn>                                                                      
                    </template>
                    <template v-slot:[`item.status_pesanan`]="{ item }">
                        <v-chip
                            dark
                            :color="getColor(item.status_pesanan)">
                            {{ item.status_pesanan }} 
                        </v-chip>
                    </template>
                    <template v-slot:[`item.total_pesanan`]="{ item }">                                                    
                            <span v-if="item.total_pesanan != 0">Rp {{ item.total_pesanan }}</span>
                            <span v-else>Gratis</span>
                    </template>
                    <template v-slot:[`item.jml_pesanan`]="{ item }">                        
                            {{ item.jml_pesanan }} {{ item.unit_menu }}
                    </template>  
                </v-data-table>            
            </v-card>
        </div>

            <v-dialog v-model="dialog" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline font-weight-bold">{{ formTitle }} Pesanan</span>
                        <v-spacer></v-spacer>
                        <v-btn color="#810000" text @click="cancel">
                            <v-icon x-large>mdi-close-circle</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form ref="form">                                                                                                                                                                                                                                        
                                <v-select
                                    v-model="form.status"
                                    :items="status"
                                    label="Status Pesanan" 
                                    outlined
                                    :rules="statusRules"                                                         
                                    required
                                    prepend-icon="mdi-check-circle">
                                </v-select>                                                                

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

            <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
                {{error_message}}
            </v-snackbar>
    </v-main>
</template>


<script>
    export default {
        name: "pesanan",
        data() {
            return {
                inputType: 'Tambah',
                load: false,
                snackbar: false,
                error_message: '',
                color: '',                                            
                search: null,
                dialog: false,                                      
                headers: [
                    {
                        text: "No. Transaksi",
                        align: "start",
                        sortable: true,
                        value: "no_transaksi",
                    },
                    { text: "Menu", value: "nama_menu" },
                    { text: "Jumlah", value: "jml_pesanan"},
                    { text: "Total Harga", value: "total_pesanan" },
                    { text: "Status", value: "status_pesanan" },
                    { text: "Actions", value: "actions" },
                ],                
                pesanans: [],                
                userNow: [],                
                form: {
                    status: null,
                },                   
                status: ['Sedang dibuatkan', 'Siap dihidangkan', 'Selesai'],                           
                editId: '',                
                statusRules: [
                    (v) => !!v || 'Status pesanan tidak boleh kosong',                    
                ],                              
            };
        },

        methods: {
            readData() {
                var url = this.$api + '/pesanan'
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                        this.pesanans = response.data.data
                })
            },
            cekTransaksi(id) {
                var url = this.$api + '/transaksi/' + id;
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    
                    if (response.data.data.status_transaksi == 'Belum Bayar') {
                        return true;
                    } else
                        return false;
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
            setForm() {
                if (this.inputType === 'Ubah') {
                    this.update()                                       
                }
            },                        
            update() {
                let newData = {
                    status_pesanan: this.form.status,                    
                }
                var url = this.$api + '/pesanan/' + this.editId;
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
                    if (this.form.status === 'Siap dihidangkan') {
                        this.saveKeluar();
                    } 
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
            saveKeluar() {
                var url = this.$api + '/histori_keluar_store/' + this.editId;
                // this.load = true
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
            },                                   
            editHandler(item) {
                this.inputType = 'Ubah';
                this.editId = item.id;                                
                this.form.status = item.status_pesanan,                                
                this.dialog = true;                
            },                    
            close() {
                this.dialog = false;                
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
                    status: null,                                  
                };                                               
            },                                                                                 
            cekEdit(item) {
                if (item.status_pesanan != 'Selesai') {
                    return true;
                } else {
                    return false;
                }
            },
            getColor(status) {
                if (status == 'Sedang dibuatkan') return '#d44000'                
                else if (status == 'Siap dihidangkan')
                    return 'primary'
                else return  '#289672'
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

