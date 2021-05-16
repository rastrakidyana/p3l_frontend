<template>
    <v-main class="transaksi" v-if="load">
        <h3 class="pt-5 grey--text text-right font-weight-bold mr-15">Transaksi</h3>

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

                <v-data-table :headers="headers" :items="transaksis" :search="search" :items-per-page="15">
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn color="#ff9a76" small class="mr-2" @click="detailHandler(item)">
                            <v-icon color="white">mdi-account-details</v-icon> 
                        </v-btn>
                        <v-btn color="#679b9b" small v-if="cekEdit(item)" class="mr-2" @click="editHandler(item)">
                            <v-icon color="white">mdi-wallet</v-icon> 
                        </v-btn>
                        <v-btn color="#679b9b" small v-else disabled class="mr-2" @click="editHandler(item)">
                            <v-icon color="white">mdi-wallet</v-icon> 
                        </v-btn>                                                                      
                    </template>
                    <template v-slot:[`item.metode_pembayaran`]="{ item }">                        
                        <span v-if="item.metode_pembayaran != null">{{ item.metode_pembayaran}}</span>
                        <span v-else>-</span>
                    </template>
                    <template v-slot:[`item.total_transaksi`]="{ item }">                        
                        Rp {{item.total_transaksi}}
                    </template>
                    <template v-slot:[`item.status_transaksi`]="{ item }">                        
                        <v-chip
                            dark
                            :color="getColor(item.status_transaksi)">
                            {{ item.status_transaksi }} 
                        </v-chip>
                    </template>
                </v-data-table>            
            </v-card>
        </div>

            <v-dialog v-model="dialog" persistent max-width="700px">
                <v-card>
                    <v-card-title>                    
                        <span class="title font-weight-bold">Detail Transaksi {{ form.nomor }}</span> 
                        <v-spacer></v-spacer>
                        <v-btn color="#810000" text @click="cancel">
                            <v-icon x-large>mdi-close-circle</v-icon>
                        </v-btn>                     
                    </v-card-title>                     
                    <v-card-text class="font-weight-medium">
                        <v-form ref="formDetail"> 
                            <v-list-item>
                            <v-list-item-content class="text-left">                                                                
                                <v-list-item-subtitle>Customer : {{ form.customer }}</v-list-item-subtitle>
                                <v-list-item-subtitle>No. Meja : {{ form.meja }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Tanggal Reservasi : {{ form.tgl_reservasi }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Subtotal Transaksi : Rp {{ form.subtotal }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Service 5% : Rp {{ form.service }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Tax 10% : Rp {{ form.tax }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Total Transaksi : Rp {{ form.total }}</v-list-item-subtitle>
                            </v-list-item-content>
                            </v-list-item>
                        </v-form>                                           
                    </v-card-text>
                    <v-card-title>                    
                        <span class="title font-weight-bold">List Pesanan</span>                      
                    </v-card-title>                     
                        <v-data-table :headers="headersPesanan" :items="pesanans" :items-per-page="5">
                            <template v-slot:[`item.total_pesanan`]="{ item }">                                                        
                                <span v-if="item.total_pesanan != 0">Rp {{ item.total_pesanan }}</span>
                                <span v-else>Gratis</span>
                            </template>
                            <template v-slot:[`item.jml_pesanan`]="{ item }">                        
                                {{item.jml_pesanan}} {{item.unit_menu}}
                            </template>
                        </v-data-table>  
                    <v-card-title>
                        <span class="title font-weight-bold">Selesaikan Transaksi</span>                        
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form ref="form">
                                <v-select
                                    v-model="form.metode"
                                    :items="metode"
                                    label="Metode Pembayaran"
                                    v-on:change="readDataOptionKartus(form.metode)"
                                    outlined
                                    :rules="metodeRules"                                                         
                                    required
                                    prepend-icon="mdi-wallet">
                                </v-select>

                                <v-text-field
                                    v-if="form.metode == 'Cash'"
                                    v-model="form.uang"                                
                                    label="Jumlah Uang"
                                    :rules="uangRules"
                                    type=number
                                    outlined                                                                                                                                         
                                    required
                                    prepend-icon="mdi-cash">
                                </v-text-field>

                                <v-autocomplete
                                    v-if="form.metode == 'Credit Card' || form.metode == 'Debit Card'"
                                    v-model="form.no_kartu"
                                    label="No. Kartu" 
                                    outlined
                                    :items='kartuOptions'
                                    item-text="no_kartu"
                                    item-value="id"
                                    :rules="noKartuRules"
                                    required
                                    prepend-icon="mdi-credit-card"
                                    append-outer-icon="mdi-plus-circle"
                                    @click:append-outer="tambahKartu"                                      
                                ></v-autocomplete>                                                            
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

            <v-dialog v-model="dialogKartu" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline font-weight-bold">Tambah Kartu</span>
                        <v-spacer></v-spacer>
                        <v-btn color="#810000" text @click="cancel">
                            <v-icon x-large>mdi-close-circle</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form ref="formKartu">
                                <v-text-field                                    
                                    v-model="form.no_kartu"
                                    label="No. Kartu" 
                                    outlined
                                    :rules="noKartuRules"
                                    required
                                    prepend-icon="mdi-credit-card"                                    
                                ></v-text-field>                                

                                <v-text-field
                                    v-if="form.metode == 'Credit Card'"
                                    v-model="form.nama_kartu"                                
                                    label="Nama Kartu"
                                    outlined                                                                     
                                    required
                                    prepend-icon="mdi-account">
                                </v-text-field>

                                <v-menu                                    
                                    ref="menu"
                                    v-model="menu"
                                    :close-on-content-click="false"                                                                
                                    min-width="100px">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                                v-model="form.tgl"
                                                label="Tanggal Kadaluarsa Kartu"
                                                prepend-icon="mdi-calendar-text"                                            
                                                readonly
                                                outlined
                                                v-bind="attrs"
                                                v-on="on"
                                                :rules="tglRules"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker
                                            ref="picker"
                                            v-model="form.tgl"                                                                            
                                            @change="setDate">
                                        </v-date-picker>
                                </v-menu>
                            </v-form>
                        </v-container>
                    </v-card-text>
                    <v-card-actions class="justify-center">
                        <v-btn color="#003249" dark @click="tambahKartuKembali">
                            Kembali
                        </v-btn>                                            
                        <v-btn color="#003249" dark @click="simpanKartu">
                            Simpan
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>            

            <v-dialog v-model="dialogDetail" persistent max-width="700px">
                <v-card
                    class="mx-auto"                                                       
                    max-width="700">
                    <v-card-title>                    
                    <span class="title font-weight-bold">Detail Transaksi</span>
                    <v-spacer></v-spacer>
                            <v-btn color="#810000" text @click="cancel">
                                <v-icon x-large>mdi-close-circle</v-icon>
                            </v-btn>   
                    </v-card-title>                     
                    <v-card-text class="font-weight-medium">
                        <v-form ref="form"> 
                            <v-list-item>
                            <v-list-item-content class="text-left">
                                <v-list-item-subtitle>No. Transaksi : {{ form.nomor }}</v-list-item-subtitle>                            
                                <v-list-item-subtitle>Customer : {{ form.customer }}</v-list-item-subtitle>
                                <v-list-item-subtitle>No. Meja : {{ form.meja }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Tanggal Reservasi : {{ form.tgl_reservasi }}</v-list-item-subtitle>                                                                                          
                                <v-list-item-subtitle>Karyawan : {{ form.karyawan }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Subtotal Transaksi : Rp {{ form.subtotal }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Service 5% : Rp {{ form.service }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Tax 10% : Rp {{ form.tax }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Total Transaksi : Rp {{ form.total }}</v-list-item-subtitle>
                                <v-list-item-subtitle v-if="form.status != 'Belum Bayar'">Metode Pembayaran : {{ form.metode }}</v-list-item-subtitle>                                
                                <v-list-item-subtitle>Status Transaksi : {{ form.status }}</v-list-item-subtitle>
                                <v-list-item-subtitle v-if="form.metode != 'Cash' && form.metode != null">Kode EDC : {{ form.edc }}</v-list-item-subtitle>
                                <v-list-item-subtitle v-if="form.metode != 'Cash' && form.metode != null">No. Kartu : {{ form.no_kartu }}</v-list-item-subtitle>
                                <v-list-item-subtitle v-if="form.metode == 'Credit Card' && form.metode != null">Nama Kartu : {{ form.nama_kartu }}</v-list-item-subtitle>
                                <v-list-item-subtitle v-if="form.metode != 'Cash' && form.metode != null">Tanggal Kadaluarsa Kartu : {{ form.tgl }}</v-list-item-subtitle>
                            </v-list-item-content>
                            </v-list-item>
                        </v-form>                                           
                    </v-card-text>
                    <v-card-title>                    
                        <span class="title font-weight-bold">List Pesanan</span>                      
                    </v-card-title>                     
                    <v-data-table :headers="headersPesanan" :items="pesanans" :items-per-page="5">
                        <template v-slot:[`item.total_pesanan`]="{ item }">                                                    
                            <span v-if="item.total_pesanan != 0">Rp {{ item.total_pesanan }}</span>
                            <span v-else>Gratis</span>
                        </template>
                        <template v-slot:[`item.jml_pesanan`]="{ item }">                        
                            {{item.jml_pesanan}} {{item.unit_menu}}
                        </template>                            
                    </v-data-table>                       
                </v-card>
            </v-dialog>            

            <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
                {{error_message}}
            </v-snackbar>
    </v-main>
</template>


<script>
    export default {
        name: "transaksi",
        data() {
            return {
                inputType: 'Tambah',
                load: false,
                // tambahkan: false,
                snackbar: false,
                error_message: '',
                color: '',
                menu: false,                               
                search: null,
                dialog: false,                
                dialogDetail: false,
                dialogKartu: false,                
                headers: [
                    {
                        text: "No. Transaksi",
                        align: "start",
                        sortable: true,
                        value: "no_transaksi",
                    },
                    { text: "Customer", value: "nama_customer" },
                    { text: "Meja", value: "no_meja" },
                    { text: "Total Transaksi", value: "total_transaksi" },
                    { text: "Metode Pembayaran", value: "metode_pembayaran" },
                    { text: "Status", value: "status_transaksi" },
                    { text: "Actions", value: "actions" },
                ],
                headersPesanan: [
                    {
                        text: "Menu",
                        align: "start",
                        sortable: true,
                        value: "nama_menu",
                    },                    
                    { text: "Jumlah", value: "jml_pesanan"},
                    { text: "Total Harga", value: "total_pesanan" },                    
                ],
                kartu: new FormData,
                transaksis: [],
                kartuOptions: [],
                pesanans: [],                
                userNow: [],                                         
                form: {
                    customer: null,
                    meja: null,
                    karyawan: null,
                    nomor: null,
                    tgl: null,
                    tgl_reservasi: null,
                    total: null,
                    metode: null,
                    uang: null,                    
                    edc: null,
                    status: null,
                    no_kartu: null,
                    nama_kartu: null,
                    subtotal: null,
                    service: null,
                    tax: null,
                },
                jumlah: 0,                          
                metode: ['Cash', 'Credit Card', 'Debit Card'],                           
                editId: '',                
                metodeRules: [
                    (v) => !!v || 'Metode pembayaran tidak boleh kosong',                    
                ],
                uangRules: [
                    // (v) => !!v || 'Jumlah uang tidak boleh kosong',
                    (v) => Number(v) >= this.form.total || 'Jumlah uang pembayaran kurang',                    
                ],
                noKartuRules: [
                    (v) => !!v || 'No kartu tidak boleh kosong',                    
                ],
                tglRules: [
                    (v) => !!v || 'Tanggal kadaluarsa tidak boleh kosong',                    
                ],
                // namaKartuRules: [
                //     (v) => !!v || 'Nama kartu tidak boleh kosong',                    
                // ],                               
            };
        },

        methods: {
            readData() {
                var url = this.$api + '/transaksi'
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                        this.transaksis = response.data.data
                })
            },       
            readDataOptionKartus(tipe) {
                var url = this.$api + '/kartu_tipe/' + tipe 
                this.$http.get(url, {
                     headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {                    
                    this.kartuOptions = response.data.data                                       
                })
            },
            readDataPesanans(no) {
                var url = this.$api + '/pesanan_transaksi/' + no
                this.$http.get(url, {
                     headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {                    
                    this.pesanans = response.data.data                                                             
                })
            },
            readDataSubTotalPesanan(id) {
                var url = this.$api + '/pesanan_subtotal/' + id
                this.$http.get(url, {
                     headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {                    
                    this.jumlah = response.data.data
                    this.form.subtotal = this.jumlah
                    this.form.service = this.form.subtotal * 0.05
                    this.form.tax = this.form.subtotal * 0.1                                                                         
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
            simpanKartu() {
                if (this.$refs.formKartu.validate()) {
                    this.saveKartu()
                    this.tambahKartuKembali()
                } else {
                    this.error_message='Simpan gagal';
                    this.color="red"
                    this.snackbar=true;
                }
            },             
            saveKartu() {
                    this.kartu.append('no_kartu', this.form.no_kartu);
                    if (this.form_nama_kartu != null) {
                        this.kartu.append('nama_kartu', this.form.nama_kartu);   
                    }                
                    this.kartu.append('tgl_kadaluarsa', this.form.tgl);                
                    this.kartu.append('tipe_kartu', this.form.metode);                
                    var url = this.$api + '/kartu'
                    console.log(url);
                    // this.load = true
                    this.$http.post(url, this.kartu, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    }).then(response => {
                        this.error_message = response.data.message;
                        this.color="green"
                        this.snackbar=true;
                        // this.form.no_kartu=null;
                        // this.form.nama_kartu=null;
                        // this.form.tgl=null;
                        this.readDataOptionKartus();
                    }).catch(error => {
                        this.error_message=error.response.data.message;
                        this.color="red"
                        this.snackbar=true;
                        // this.load=false;
                    })                
            },
            update() {
                if (this.$refs.form.validate()) {
                let newData = {
                    id_karyawan: this.userNow.id,
                    id_kartu: this.form.no_kartu,
                    metode_pembayaran: this.form.metode,                    
                }
                var url = this.$api + '/transaksi_update/' + this.editId;
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
                }
            },                        
            detailHandler(item) {                
                this.editId = item.id;                                
                this.form.customer = item.nama_customer,
                this.form.meja = item.no_meja,
                this.form.karyawan = item.nama_karyawan,
                this.form.nomor = item.no_transaksi,
                this.form.tgl_reservasi = item.tgl_reservasi,
                this.form.total = item.total_transaksi, 
                this.form.metode = item.metode_pembayaran,
                this.form.edc = item.kode_edc,
                this.form.status = item.status_transaksi,
                this.form.no_kartu = item.no_kartu,
                this.form.nama_kartu = item.nama_kartu,
                this.form.tgl = item.tgl_kadaluarsa,
                this.pesanans = [],
                this.readDataPesanans(item.id),
                this.readDataSubTotalPesanan(item.id),
                this.dialogDetail = true;
            },
            editHandler(item) {
                this.inputType = 'Ubah';
                this.editId = item.id;                        
                this.form.nomor = item.no_transaksi;
                this.form.total = item.total_transaksi;               
                this.form.customer = item.nama_customer;
                this.form.tgl_reservasi = item.tgl_reservasi;
                this.form.meja = item.no_meja;
                this.pesanans = [];
                this.readDataPesanans(item.id);                
                this.readDataSubTotalPesanan(item.id);                                              
                this.dialog = true;            
            },           
            close() {
                this.dialog = false;
                this.dialogMeja = false;                
                this.inputType = 'Tambah';                
            },
            cancel() {                
                this.$refs.form.reset();
                if (this.dialog == true) {
                    this.$refs.formDetail.reset();                                
                }                                                 
                this.resetForm();
                this.readData();
                this.dialog = false;    
                this.dialogKartu = false;            
                this.dialogDetail = false;                
                this.inputType = 'Tambah';
            },            
            resetForm() {
                this.form = {
                    customer: null,
                    meja: null,
                    karyawan: null,
                    nomor: null,
                    tgl: null,
                    tgl_reservasi: null,
                    total: null,
                    metode: null,
                    uang: null,                    
                    edc: null,
                    status: null,
                    no_kartu: null,
                    nama_kartu: null,
                    subtotal: null,
                    service: null,
                    tax: null,                  
                };
                this.cekKartu = null;                                               
            },                                               
            setDate(date){
                this.$refs.menu.save(date)
            },                        
            cekEdit(item) {
                if (item.status_transaksi == 'Belum Bayar') {
                    return true;
                } else {
                    return false;
                }
            },
            tambahKartu() {
                this.dialog = false;
                this.dialogKartu = true;
            },
            tambahKartuKembali() {
                this.dialog = true;
                this.dialogKartu = false;
                this.form.no_kartu=null;
                this.form.nama_kartu=null;
                this.form.tgl=null;
                this.$refs.formKartu.reset();
            },
            getColor(status) {
                if (status == 'Belum Bayar') return '#d44000'                                
                else return  '#289672'
            },                                                                                                                                      
        },
        watch: {
            menu(val){
                val && setTimeout(() => (this.$refs.picker.activePicker = 'DATE'))
            },
        },
        computed: {
            formTitle() {
                return this.inputType
            },            
        },
        mounted() {            
            this.readData();
            this.readDataOptionKartus();
            this.readDataUser();                      
        },
    };
</script>

<style>

    /* .v-dialog:not(.v-dialog--dialogForm) {
        bottom: 0 !important;
        right: 0 !important;
        position: absolute !important;
    } */
</style>

