<template>
    <v-main class="reservasi" v-if="load">
        <h3 class="pt-5 grey--text text-right font-weight-bold mr-15">Reservasi</h3>

        <div class="fullheight px-15">
            <v-card>
                <v-card-title>  
                    <v-btn color="#003249" dark @click="dialog = true">
                        Tambah Reservasi
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

                <v-data-table :headers="headers" :items="reservasis" :search="search" :items-per-page="10">
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn color="#ff9a76" small class="mr-2" @click="detailHandler(item)">
                            <v-icon color="white">mdi-account-details</v-icon> 
                        </v-btn>
                        <v-btn color="#679b9b" small v-if="cekEdit(item)" class="mr-2" @click="editHandler(item)">
                            <v-icon color="white">mdi-pencil</v-icon> 
                        </v-btn>
                        <v-btn color="#679b9b" small v-else disabled class="mr-2" @click="editHandler(item)">
                            <v-icon color="white">mdi-pencil</v-icon> 
                        </v-btn>
                        <v-btn color="primary" small v-if="cekQr(item)" class="mr-2" @click="qrHandler(item.id)">
                            <v-icon color="white">mdi-qrcode</v-icon> 
                        </v-btn>
                        <v-btn color="primary" small v-else disabled class="mr-2" @click="qrHandler(item.id)">
                            <v-icon color="white">mdi-qrcode</v-icon> 
                        </v-btn>                        
                        <v-btn color="pink" v-if="cekDel(item)" small @click="deleteHandler(item.id)">
                            <v-icon color="white">mdi-delete</v-icon> 
                        </v-btn>
                        <v-btn color="pink" v-else disabled small @click="deleteHandler(item.id)">
                            <v-icon color="white">mdi-delete</v-icon> 
                        </v-btn>
                    </template>
                    <template v-slot:[`item.id_transaksi`]="{ item }">
                        <v-chip
                            dark
                            :color="getColorStatus(item)">
                            {{ getStatus(item) }}                         
                        </v-chip>
                    </template>                    
                </v-data-table>            
            </v-card>
        </div>

            <v-dialog v-model="dialog" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline font-weight-bold">{{ formTitle }} Reservasi</span>
                        <v-spacer></v-spacer>
                        <v-btn color="#810000" text @click="cancel">
                            <v-icon x-large>mdi-close-circle</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form ref="form">                                                                                                               
                                <v-autocomplete
                                    v-model="form.customer"
                                    :items="customerOptions"                                                                 
                                    item-text="nama_customer"
                                    item-value="id"
                                    label="Customer" 
                                    outlined
                                    :rules="namaRules"
                                    required
                                    prepend-icon="mdi-account"
                                ></v-autocomplete>                                                                                                                                         

                                <v-menu
                                    ref="menu"
                                    v-model="menu"
                                    :close-on-content-click="false"                                                                
                                    min-width="100px">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                                v-model="form.tgl"
                                                label="Tanggal Reservasi"
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
                                            v-on:change="pilihanKunjungan(form.tgl)"
                                            :min="new Date().toISOString().substr(0, 10)"
                                            @change="setDate">
                                        </v-date-picker>
                                </v-menu>

                                <v-select
                                    v-if="formTitle == 'Tambah'" 
                                    v-model="form.kunjungan"
                                    :items="kunjungan"
                                    label="Jam Kunjungan" 
                                    outlined
                                    :rules="jamRules"                                                         
                                    required
                                    prepend-icon="mdi-clock">
                                </v-select>
                                <v-select 
                                    v-else
                                    v-model="form.kunjungan"
                                    :items="['Lunch', 'Dinner']"
                                    label="Jam Kunjungan" 
                                    outlined
                                    :rules="jamRules"                                                         
                                    required
                                    prepend-icon="mdi-clock">
                                </v-select>                                                                                         
                            </v-form>
                        </v-container>
                    </v-card-text>
                    <v-card-actions class="justify-center">                                            
                        <v-btn color="#003249" dark @click="pilihMeja">
                            Pilih Meja
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogMeja" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline font-weight-bold">{{ formTitle }} Reservasi</span>
                        <v-spacer></v-spacer>
                        <v-btn color="#810000" text @click="cancel">
                            <v-icon x-large>mdi-close-circle</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-data-iterator
                        class="p-3"
                        :items="mejaOptions"                                       
                        :items-per-page="15">
                            <template v-slot:header>
                                <v-toolbar                            
                                height=40
                                class="mb-5 elevation-0">
                                <v-icon color="#289672" medium>mdi-checkbox-blank</v-icon>Tersedia
                                <span class="mr-6"></span>
                                <v-icon color="#d44000"  medium>mdi-checkbox-blank</v-icon>Tidak Tersedia
                                <span class="mr-6"></span>
                                Pilihan No. Meja : {{ form.mejaSelected }}
                                </v-toolbar>
                            </template>
                            <template v-slot:default="props">
                                <v-row>
                                <v-col
                                    v-for="item in props.items"
                                    :key="item.no_meja"
                                    cols="12"
                                    sm="6"
                                    md="4"
                                    lg="3">
                                    <v-card dark :color="getColor(item.no_meja)" v-if="getColor(item.no_meja) == '#289672'" @click="selesaiTambah(item)">
                                        <v-card-title class="justify-center subheading font-weight-bold">
                                            {{ item.no_meja }}                                     
                                        </v-card-title>                                    
                                    </v-card>
                                    <v-card dark :color="getColor(item.no_meja)" v-else>
                                        <v-card-title class="justify-center subheading font-weight-bold">
                                            {{ item.no_meja }}                                     
                                        </v-card-title>                                    
                                    </v-card>                                    
                                </v-col>
                                </v-row>
                            </template>
                    </v-data-iterator>
                    <v-card-actions class="justify-center">                                            
                        <v-btn color="#003249" dark @click="pilihMejaKembali">
                            Kembali
                        </v-btn>
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
                        <h5 class="font-weight-bold">Hapus Reservasi?</h5>                        
                    </v-card-text>
                    <v-card-actions class="justify-center">                                           
                        <v-btn color="red darken-1" dark @click="deleteData">
                            Hapus
                        </v-btn>                                       
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogDetail" persistent max-width="400px">
                <v-card
                    class="mx-auto"                                                       
                    max-width="400">
                    <v-card-title>                    
                    <span class="title font-weight-bold">Detail Reservasi</span>
                    <v-spacer></v-spacer>
                            <v-btn color="#810000" text @click="cancel">
                                <v-icon x-large>mdi-close-circle</v-icon>
                            </v-btn>   
                    </v-card-title>                     
                    <v-card-text class="font-weight-medium">
                        <v-form ref="form"> 
                            <v-list-item>
                            <v-list-item-content class="text-left">                            
                                <v-list-item-subtitle>Customer : {{ form.customer }}</v-list-item-subtitle>
                                <v-list-item-subtitle>No. Meja : {{ form.meja }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Tanggal Reservasi : {{ form.tgl }}</v-list-item-subtitle>                            
                                <v-list-item-subtitle>Jam Kunjungan : {{ form.kunjungan }}</v-list-item-subtitle>
                                <v-list-item-subtitle v-if="form.nota != null">No. Transaksi : {{ form.nota }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Karyawan : {{ form.karyawan }}</v-list-item-subtitle>                                                                
                            </v-list-item-content>
                            </v-list-item>
                        </v-form>                                           
                    </v-card-text>                    
                </v-card>
            </v-dialog>            

            <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
                {{error_message}}
            </v-snackbar>
    </v-main>
</template>


<script>
    export default {
        name: "reservasi",
        data() {
            return {
                inputType: 'Tambah',
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                menu: false,                               
                search: null,
                dialog: false,
                dialogDelete: false,
                dialogDetail: false,
                dialogMeja: false,                
                headers: [
                    {
                        text: "Customer",
                        align: "start",
                        sortable: true,
                        value: "nama_customer",
                    },
                    { text: "No. Meja", value: "no_meja" },
                    { text: "Tanggal Reservasi", value: "tgl_reservasi" },
                    { text: "Jam Kunjungan", value: "jadwal_kunjungan" },
                    { text: "Status", value: "id_transaksi"},
                    { text: "Actions", value: "actions" },
                ],
                reservasi: new FormData,
                reservasis: [],
                customerOptions: [],
                mejaOptions: [],                
                userNow: [],
                kustomer: [],
                hasils: [],
                form: {
                    customer: null,
                    meja: null,
                    karyawan: null,
                    nota: null,
                    tgl: null,
                    kunjungan: null,
                    mejaSelected: null,                    
                },
                qrCode: null,   
                kunjungan: [],                           
                editId: '',
                deleteId: '',
                namaRules: [
                    (v) => !!v || 'Customer tidak boleh kosong',                    
                ],
                tglRules: [
                    (v) => !!v || 'Tanggal reservasi tidak boleh kosong',
                ],
                jamRules: [
                    (v) => !!v || 'Jam kunjungan tidak boleh kosong',
                ],                
            };
        },

        methods: {
            readData() {
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
            readDataQR() {
                var url = this.$api + '/reservasi_pdf/' + this.deleteId;
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                this.saveTransaksi();
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
                })
            }, 
            readDataOptionCustomers() {
                var url = this.$api + '/customer'
                this.$http.get(url, {
                     headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {                    
                    this.customerOptions = response.data.data                    
                })
            },
            readOneCustomer(id) {
                var url = this.$api + '/customer/' + id;
                this.$http.get(url, {
                     headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {                    
                    this.kustomer = response.data.data                    
                    this.form.customer = this.kustomer
                })
            },
            readDataOptionMejas() {
                var url = this.$api + '/meja'
                this.$http.get(url, {
                     headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {                                        
                    this.mejaOptions = response.data.data                    
                    this.load = true
                })
            },                        
            setForm() {
                if (this.inputType === 'Tambah') {
                    this.save()
                } else {
                    this.update()
                }
            },
            selesaiTambah(no) {
                this.form.meja = no.id;
                this.form.mejaSelected = no.no_meja;
                // this.setForm();
            },
            saveTransaksi() {
                var url = this.$api + '/transaksi_store/' + this.deleteId;
                this.$http.get(url,  {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color="green"
                    this.snackbar=true;
                    this.readData();
                    // this.load=false;                    
                }).catch(error => {
                    this.error_message=error.response.data.message;
                    this.color="red"
                    this.snackbar=true;
                    // this.load=false;                
                })
            },
            save() {
                this.reservasi.append('id_customer', this.form.customer);
                this.reservasi.append('id_meja', this.form.meja);
                this.reservasi.append('id_karyawan', this.userNow.id);                
                this.reservasi.append('tgl_reservasi', this.form.tgl);
                this.reservasi.append('jadwal_kunjungan', this.form.kunjungan);                                
                var url = this.$api + '/reservasi'
                // this.load = true
                this.$http.post(url, this.reservasi, {
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
                }).catch(error => {
                    this.error_message=error.response.data.message;
                    this.color="red"
                    this.snackbar=true;
                    // this.load=false;
                })
            },
            update() {
                let newData = {
                    id_customer: this.form.customer,
                    id_meja: this.form.meja,
                    id_karyawan: this.userNow.id,
                    tgl_reservasi: this.form.tgl,
                    jadwal_kunjungan: this.form.kunjungan,                    
                }
                var url = this.$api + '/reservasi/' + this.editId;
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
            },            
            deleteData() {
                var url = this.$api + '/reservasi_hapus/' + this.deleteId;
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
            detailHandler(item) {                
                this.editId = item.id;                                
                this.form.customer = item.nama_customer,
                this.form.meja = item.no_meja,
                this.form.karyawan = item.nama_karyawan,
                this.form.nota = item.no_transaksi,
                this.form.tgl = item.tgl_reservasi,
                this.form.kunjungan = item.jadwal_kunjungan,  
                this.dialogDetail = true;
            },
            editHandler(item) {
                this.inputType = 'Ubah';
                this.readOneCustomer(item.id_customer),
                this.editId = item.id;                                
                // this.form.customer = this.kustomer,
                this.form.meja = item.id_meja,                
                this.form.tgl = item.tgl_reservasi,
                this.form.kunjungan = item.jadwal_kunjungan,
                this.form.mejaSelected = item.no_meja,
                this.dialog = true;
                console.log(this.hasils);
            },            
            deleteHandler(id) {
                this.deleteId = id;                
                this.dialogDelete = true;
            },
            qrHandler(id) {
                this.deleteId = id;                
                this.readDataQR();
            },
            close() {
                this.dialog = false;
                this.dialogMeja = false;
                this.dialogDelete = false;                
                this.inputType = 'Tambah';                
            },
            cancel() {
                this.resetForm();
                this.$refs.form.reset();             
                this.dialog = false;
                this.dialogMeja = false;
                this.dialogDetail = false;                
                this.inputType = 'Tambah';
            },
            pilihMeja() {
                if (this.$refs.form.validate()) {
                    this.dialog = false;
                    this.dialogMeja = true;
                    if (this.inputType === 'Tambah') {
                        this.cekReservasiTambah();    
                    } else {
                        this.cekReservasiEdit(); 
                    }
                }
            },
            pilihMejaKembali() {
                this.dialog = true;
                this.dialogMeja = false;
            },
            resetForm() {
                this.form = {
                    customer: null,
                    meja: null,
                    karyawan: null,
                    nota: null,
                    tgl: null,
                    kunjungan: null,
                    mejaSelected: null,                    
                };
                this.kunjungan = [];                                
            },            
            cekReservasiTambah(){
                var object = 0;
                this.hasils = [];
                for (let index = 0; index < this.reservasis.length; index++) {
                    if (this.reservasis[index].tgl_reservasi === this.form.tgl && this.reservasis[index].jadwal_kunjungan === this.form.kunjungan
                        && this.reservasis[index].status_transaksi == 'Belum Bayar'){
                          this.hasils[object] = this.reservasis[index];
                          object++;
                    }                    
                }
                // console.log("aaaa");
                console.log(this.hasils);
                return this.hasils; 
            },
            cekReservasiEdit(){
                var object = 0;
                this.hasils = [];
                for (let index = 0; index < this.reservasis.length; index++) {
                    if (this.reservasis[index].tgl_reservasi === this.form.tgl && this.reservasis[index].jadwal_kunjungan === this.form.kunjungan
                        && this.reservasis[index].id_meja != this.form.meja 
                        && (this.reservasis[index].id_transaksi === null || this.reservasis[index].status_transaksi === 'Belum Bayar')){
                          this.hasils[object] = this.reservasis[index];
                          object++;
                    }                    
                }
                // console.log("aaaa");
                console.log(this.hasils);
                return this.hasils; 
            },            
            setDate(date){
                this.$refs.menu.save(date)
            },
            getColor(no) {
                for (let index = 0; index < this.hasils.length; index++) {
                    if (this.hasils[index].no_meja === no){
                          return '#d44000'
                    }                    
                }
                return '#289672' 
            },
            // getColorReservasi(tgl) {
            //     var dtNow = new Date().toISOString().substr(0, 10);
            //     if (dtNow === tgl) {
            //         return '#289672'
            //     } else
            //         return ''
            // },
            cekEdit(item) {
                var dtNow = new Date().toISOString().substr(0, 10);
                if (dtNow >= item.tgl_reservasi) {
                    return false;
                } else {
                    return true;
                }
            },
            cekQr(item) {
                var dtNow = new Date().toISOString().substr(0, 10);
                if (dtNow == item.tgl_reservasi && item.status_transaksi != 'Sudah Bayar') {
                    return true;
                } else {
                    return false;
                }
            },
            cekDel(item) {                
                if (item.id_transaksi == null) {
                    return true;
                } else {
                    return false;
                }
            },
            pilihanKunjungan(tgl){                  
                var dtNow = new Date().toISOString().substr(0, 10);              
                var today = new Date();
                var time = today.getHours()-1 + ":" + today.getMinutes() + ":" + today.getSeconds();
                console.log(time);
                if (tgl == dtNow) {
                    if (time >= '10:00:00' && time <= '16:00:00') {
                        return this.kunjungan = ['Lunch', 'Dinner'];
                    } else if (time >= '16:00:01' && time <= '21:00:00') {
                        return this.kunjungan = ['Dinner'];
                    // } else if (time >= '0:00:00' && time <= '9:59:59') {
                    //     return this.kunjungan = ['Lunch', 'Dinner'];       //UBAHHHH             
                    // } else
                    //     return this.kunjungan = []; 
                    } else if (time >= '21:00:01' && time <= '23:59:59') {//UBAHHHH             
                        return this.kunjungan = []; 
                    } else
                        return this.kunjungan = ['Lunch', 'Dinner'];
                } else {
                    return this.kunjungan = ['Lunch', 'Dinner'];
                }                                   
            },
            getColorStatus(status) {
                var dtNow = new Date().toISOString().substr(0, 10);  
                if (status.id_transaksi == null) {
                    if (dtNow <= status.tgl_reservasi) {
                        return 'warning'                                    
                    }
                    return 'error'                                
                } else {
                    if (status.status_transaksi === 'Belum Bayar') {
                        return 'purple'
                    } else return  'success'
                } 
            },
            getStatus(status){
                var dtNow = new Date().toISOString().substr(0, 10);  
                if (status.id_transaksi == null){
                    if (dtNow <= status.tgl_reservasi) {
                        return 'Menunggu'
                    }
                    return 'Tidak hadir'                                
                }else { 
                    if (status.status_transaksi === 'Belum Bayar') {
                        return 'Sedang memesan'
                    } else return  'Selesai'
                }
            }                                                                                                                   
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
            this.readDataUser();
            this.readDataOptionCustomers();
            this.readDataOptionMejas();            
        },
    };
</script>

