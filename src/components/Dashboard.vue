<template>
    <v-main class="dashboard" v-if="load">
        <h3 class="pt-5 grey--text text-right font-weight-bold mr-16">Dashboard</h3>

        <div class="fullheight px-16">
            <v-card>
                <v-card-title class="subheading font-weight-bold">
                        {{ userJabatan.nama_jabatan }}
                </v-card-title>               
                <v-data-iterator
                    class="p-3"
                    :hide-default-footer='true'
                    :items="permissionUser()"                                       
                    :items-per-page="15">                        
                        <template v-slot:default="props">
                            <v-row>
                            <v-col                                
                                v-for="item in props.items"
                                :key="item.title"
                                style="text-decoration: none;"
                                tag="router-link"
                                :to="item.to"
                                cols="12"
                                sm="6"
                                md="4"
                                lg="4">
                                <v-card @click="reveal = true" dark :color="item.color">
                                    <v-card-title class="justify-center subheading font-weight-bold">
                                        <v-icon medium>{{ item.icon }}</v-icon>                            
                                    </v-card-title>
                                    <v-card-subtitle >
                                        {{ item.title }}
                                    </v-card-subtitle>                                    
                                </v-card>
                            </v-col>
                            </v-row>
                        </template>
                </v-data-iterator>
            </v-card>

            <v-card class="mt-16">
                <v-card-title>
                    <v-card-title class="subheading font-weight-bold">
                        Menu
                    </v-card-title>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Cari"
                        single-line                        
                        hide-details>
                    </v-text-field>                                                                              
                </v-card-title>                                
                <v-data-iterator
                    class="p-3"
                    :items="menus"
                    :search="search"                                       
                    :items-per-page="8">                        
                        <template v-slot:default="props">
                            <v-row>
                            <v-col
                                v-for="item in props.items"
                                :key="item.nama_menu"
                                cols="12"
                                sm="6"
                                md="4"
                                lg="3">
                                <v-card color=white>
                                    <img class="mx-auto mt-5" :src="item.gambar_menu" style="width: 120px; height: 120px">
                                    <v-card-title class="subheading font-weight-bold justify-center">
                                        {{ item.nama_menu }}
                                    </v-card-title>
                                    <v-card-subtitle class="font-weight-bold">
                                        {{ item.tipe_menu }}
                                    </v-card-subtitle>
                                    <v-list dense >                                        
                                        <v-list-item>
                                        <v-list-item-content class="text-left">                                                                        
                                            <v-list-item-subtitle>Bahan : {{ item.nama_bahan }}</v-list-item-subtitle>                                            
                                            <v-list-item-subtitle>Jumlah : {{ item.stok_menu }} {{ item.unit_menu }}</v-list-item-subtitle>
                                            <v-list-item-subtitle>Harga : Rp {{ item.harga_menu }}</v-list-item-subtitle>
                                            <v-list-item-subtitle>Ukuran Penyajian : {{ item.serving_size }} {{ item.unit_bahan }}</v-list-item-subtitle>                            
                                            <v-list-item-subtitle>Deskripsi : {{ item.deskripsi_menu }}</v-list-item-subtitle>                                            
                                        </v-list-item-content>                                    
                                        </v-list-item>
                                    </v-list>
                                </v-card>
                            </v-col>
                            </v-row>
                        </template>
                </v-data-iterator>
            </v-card>
            
            <v-card class="mt-16">
                <v-card-title>
                    <v-card-title class="subheading font-weight-bold">
                        Meja
                    </v-card-title>
                    <v-spacer></v-spacer>
                    <v-menu
                        ref="menu"
                        v-model="menu"
                            :close-on-content-click="true"                                                                
                            min-width="50px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="form.tgl"
                                        label="Tanggal"                                        
                                        prepend-icon="mdi-calendar-text"                                            
                                        readonly
                                        single-line
                                        hide-details
                                        v-bind="attrs"
                                        v-on="on"                                    
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-on:change="readDataReservasi()"
                                    ref="picker"
                                    v-model="form.tgl"                                                                                
                                    :min="new Date().toISOString().substr(0, 10)"
                                    @change="setDate">
                                </v-date-picker>
                    </v-menu>
                    <span class="mr-6"></span>
                    <v-select                         
                        v-model="form.kunjungan"
                        v-on:change="readDataReservasi()"
                        :items="['Lunch', 'Dinner']"
                        label="Jam Kunjungan" 
                        single-line
                        hide-details                                                                                       
                        required
                        prepend-icon="mdi-clock">
                    </v-select> 
                    <span class="mr-6"></span>
                    <v-text-field
                        v-model="searchMeja"
                        append-icon="mdi-magnify"
                        label="Cari"
                        single-line                        
                        hide-details>
                    </v-text-field>                                                                                                  
                </v-card-title>                
                <v-data-iterator
                    class="p-3"
                    :items="mejas"
                    :search="searchMeja"                                       
                    :items-per-page="15">
                        <template v-slot:header>
                            <v-toolbar                            
                            height=40
                            class="mb-5 elevation-0">
                            <v-icon color="#289672" medium>mdi-checkbox-blank</v-icon>Tersedia
                            <span class="mr-6"></span>
                            <v-icon color="#d44000"  medium>mdi-checkbox-blank</v-icon>Tidak Tersedia
                            <span class="mr-6"></span>                             
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
                                <v-card dark :color="getColor(item.no_meja)">
                                    <v-card-title class="justify-center subheading font-weight-bold">
                                        {{ item.no_meja }}                                        
                                    </v-card-title>                                    
                                </v-card>
                            </v-col>
                            </v-row>
                        </template>
                </v-data-iterator>
            </v-card>
        </div>

            <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
                {{error_message}}
            </v-snackbar>
    </v-main>
</template>

<script>
    export default {
        name: "dashboard",
        data() {
            return {
                inputType: 'Tambah',                
                load: false,                
                snackbar: false,                
                error_message: '',
                color: '',
                userNow: [],                                             
                userJabatan: [],
                search: null,                
                searchMeja: null,
                componentsOwner: [                    
                    { title: "Karyawan", icon: "mdi-account-key", color:"primary", to: "/karyawan" },                    
                ],
                componentsManager: [                    
                    { title: "Karyawan", icon: "mdi-account-key", color:"primary", to: "/karyawan" },                    
                    { title: "Meja", icon: "mdi-table", color:"red", to: "/meja" },
                    { title: "Customer", icon: "mdi-account-multiple", color:"green", to: "/customer" },                                        
                    { title: "Reservasi", icon: "mdi-calendar-multiple", color:"yellow", to: "/reservasi" },
                    { title: "Menu", icon: "mdi-food", color:"primary", to: "/menu" },
                    { title: "Bahan", icon: "mdi-food-variant", color:"red", to: "/bahan" },                    
                    { title: "Histori Bahan", icon: "mdi-calendar-multiple-check", color:"green", to: "/histori_bahan_masuk" },
                    { title: "Pesanan", icon: "mdi-cart", color:"yellow", to: "/pesanan" },
                    { title: "Transaksi", icon: "mdi-receipt", color:"primary", to: "/transaksi" },
                    { title: "Kartu Customer", icon: "mdi-credit-card", color:"red", to: "/kartu" },
                ],
                componentsKasir: [                                        
                    { title: "Customer", icon: "mdi-account-multiple", color:"primary", to: "/customer" },                                        
                    { title: "Reservasi", icon: "mdi-calendar-multiple", color:"red", to: "/reservasi" },                    
                    { title: "Transaksi", icon: "mdi-receipt", color:"green", to: "/transaksi" },
                    { title: "Kartu Customer", icon: "mdi-credit-card", color:"yellow", to: "/kartu" },
                ],
                componentsWaiter: [                                       
                    { title: "Customer", icon: "mdi-account-multiple", color:"primary", to: "/customer" },                                        
                    { title: "Reservasi", icon: "mdi-calendar-multiple", color:"red", to: "/reservasi" },                    
                    { title: "Pesanan", icon: "mdi-cart", color:"green", to: "/pesanan" },                    
                ],
                componentsChef: [                                       
                    { title: "Bahan", icon: "mdi-food-variant", color:"primary", to: "/bahan" },                    
                    { title: "Histori Bahan", icon: "mdi-calendar-multiple-check", color:"red", to: "/histori_bahan_masuk" },
                    { title: "Pesanan", icon: "mdi-cart", color:"green", to: "/pesanan" },                    
                ],       
                menu: false,                                                         
                mejas: [],
                reservasis: [],
                hasils: [],
                menus: [],
                keysMenu: [
                    'nama_menu',
                    'nama_bahan',
                    'deskripsi_menu',
                    'unit_menu',
                    'harga_menu',
                    'tipe_menu',
                    'stok_menu',
                    'gambar_menu',
                    'serving_size',                    
                ],
                form: {
                    tgl: new Date().toISOString().substr(0, 10),                    
                    kunjungan: null,                    
                },                                              
            };
        },

        methods: {
            readDataMeja() {
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
            readDataReservasi() {
                var url = this.$api + '/reservasi'
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                        this.reservasis = response.data.data                        
                        this.cekReservasi();                        
                })
            },            
            readDataMenu() {
                var url = this.$api + '/menu'
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                        this.menus = response.data.data
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
                    this.readDataUserJabatan(this.userNow.id_jabatan)                                   
                })
            },
            readDataUserJabatan(id) {
                console.log(id)
                var url = this.$api + '/jabatan/' + id;                
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)
                    this.userJabatan = response.data.data
                    this.load = true
                })
            },                                                        
            // getColor(status) {
            //     if (status == 'Tersedia') return '#289672'                
            //     else return '#d44000'
            // },
            permissionUser() {
                if ( this.userNow.id_jabatan == 1) {
                    return this.componentsOwner
                } else if ( this.userNow.id_jabatan == 2) {
                    return this.componentsManager
                } else if ( this.userNow.id_jabatan == 3) {
                    return this.componentsKasir
                } else if ( this.userNow.id_jabatan == 4) {
                    return this.componentsWaiter
                } else if ( this.userNow.id_jabatan == 5) {
                    return this.componentsChef
                } else 
                    return this.null
            },
            cekReservasi(){
                var object = 0;
                this.hasils = [];
                for (let index = 0; index < this.reservasis.length; index++) {
                    if (this.reservasis[index].tgl_reservasi === this.form.tgl && this.reservasis[index].jadwal_kunjungan === this.form.kunjungan 
                        && (this.reservasis[index].id_transaksi === null || this.reservasis[index].status_transaksi === 'Belum Bayar')){
                          this.hasils[object] = this.reservasis[index];
                          object++;
                    }                    
                }
                console.log(this.hasils);
                return this.hasils; 
            },
            getColor(no) {
                for (let index = 0; index < this.hasils.length; index++) {
                    if (this.hasils[index].no_meja === no){
                          return '#d44000'
                    }                    
                }
                return '#289672' 
            },
            awalKunjungan() {
                var today = new Date();
                // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                var time = today.getHours()-1 + ":" + today.getMinutes() + ":" + today.getSeconds();
                console.log(time);
                // if (time >= '11:00:00' && time <= '16:00:00') {
                //     return this.form.kunjungan = 'Lunch'
                // } else if (time >= '16:00:01' && time <= '21:00:00') {
                //     return this.form.kunjungan = 'Dinner'
                // }
                if (time >= '10:00:00' && time <= '16:00:00') {
                    return this.form.kunjungan = 'Lunch'
                } else if (time >= '16:00:01' && time <= '23:59:59') {
                    return this.form.kunjungan = 'Dinner'
                } else if (time >= '0:00:00' && time <= '9:59:59') {
                    return this.form.kunjungan = 'Lunch'
                }
            },
            setDate(date){
                this.$refs.menu.save(date)
            },
        },      
        computed: {
            filteredKeys () {
                return this.keysMenu.filter(key => key !== 'nama_menu' && key !== 'gambar_menu')
            },            
        },
        watch: {
            menu(val){
                val && setTimeout(() => (this.$refs.picker.activePicker = 'DATE'))
            },
        },
        mounted() {            
            this.readDataMeja();
            this.readDataReservasi();
            this.awalKunjungan();
            this.readDataUser();
            this.readDataMenu();            
        },
    };
</script>