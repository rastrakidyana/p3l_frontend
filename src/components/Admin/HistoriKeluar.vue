<template>
    <v-main class="masuk" v-if="load">
        <h3 class="pt-5 grey--text text-right font-weight-bold mr-15">Histori Bahan Masuk</h3>

        <div class="fullheight px-15">
            <v-card>
                <v-card-title>
                    <v-btn color="#003249" dark @click="dialog = true">
                        Tambah Bahan Masuk
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

                <v-data-table :headers="headers" :items="masuks" :search="search" :items-per-page="10">
                    <template v-slot:[`item.actions`]="{ item }">                       
                        <v-btn color="#679b9b" v-if="cekHistori(item)" small class="mr-2" @click="editHandler(item)">
                            <v-icon color="white">mdi-pencil</v-icon> 
                        </v-btn>                        
                        <v-btn color="#679b9b" v-else disabled small class="mr-2" @click="editHandler(item)">
                            <v-icon color="white">mdi-pencil</v-icon> 
                        </v-btn>                        
                        <v-btn color="pink" v-if="cekHistori(item)" small @click="deleteHandler(item.id)">
                            <v-icon color="white">mdi-delete</v-icon> 
                        </v-btn>
                        <v-btn color="pink" v-else disabled small @click="deleteHandler(item.id)">
                            <v-icon color="white">mdi-delete</v-icon> 
                        </v-btn>
                    </template>
                    <template v-slot:[`item.jml_masuk`]="{ item }">
                            {{ item.jml_masuk }} {{ item.unit_bahan }}
                    </template>  
                    <template v-slot:[`item.harga_bahan`]="{ item }">
                            Rp {{ item.harga_bahan }}
                    </template>      
                </v-data-table>            
            </v-card>
        </div>

        <h3 class="pt-16 grey--text text-right font-weight-bold mr-15">Histori Bahan Keluar</h3>

        <div class="fullheight px-15">
            <v-card>
                <v-card-title>                                       
                    <v-btn color="#003249" dark @click="dialog = true, keluar = true">
                        Tambah Bahan Keluar
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search2"
                        append-icon="mdi-magnify"
                        label="Cari"
                        single-line                        
                        hide-details>
                    </v-text-field>
                                        
                </v-card-title>

                <v-data-table :headers="headers2" :items="keluars" :search="search2" :items-per-page="10">
                    <template v-slot:[`item.jml_keluar`]="{ item }">
                            {{ item.jml_keluar }} {{ item.unit_bahan }}
                    </template>
                    <template v-slot:[`item.status_keluar`]="{ item }">
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
                        <span class="headline font-weight-bold" v-if="keluar != true">{{ formTitle }} Bahan Masuk</span>
                        <span class="headline font-weight-bold" v-else>{{ formTitle }} Bahan Keluar</span>
                        <v-spacer></v-spacer>
                        <v-btn color="#810000" text @click="cancel">
                            <v-icon x-large>mdi-close-circle</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form ref="form">                                                                               

                                <v-autocomplete
                                    v-model="form.bahan"
                                    :items="bahanOptions"                                                                 
                                    item-text="nama_bahan"
                                    item-value="id"
                                    label="Bahan"
                                    v-on:change="suffixChange(form.bahan)"  
                                    outlined
                                    :rules="bahanRules"
                                    required
                                    prepend-icon="mdi-food-variant"
                                ></v-autocomplete>  
                            
                                <v-text-field
                                    v-model="form.jml"
                                    label="Jumlah"
                                    outlined
                                    type="number"                                
                                    required                                
                                    :rules="jmlRules"
                                    :suffix="form.satuan"
                                    prepend-icon="mdi-cart-plus">
                                </v-text-field>

                                <v-text-field
                                    v-if="keluar != true"
                                    v-model="form.harga"
                                    label="Harga"
                                    outlined
                                    type="number"                                
                                    required
                                    :rules="hargaRules"
                                    prefix="Rp"
                                    prepend-icon="mdi-cash">
                                </v-text-field>                                                                                                           

                                <v-menu
                                    v-if="formTitle == 'Tambah'"
                                    ref="menu"
                                    v-model="menu"
                                    :close-on-content-click="false"                                                                
                                    min-width="100px">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                                v-model="form.tgl"
                                                label="Tanggal"
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
                                            :min="new Date().toISOString().substr(0, 10)"
                                            :max="new Date().toISOString().substr(0, 10)"
                                            @change="setDate">
                                        </v-date-picker>
                                </v-menu>

                                <v-menu
                                    v-else
                                    ref="menu"
                                    v-model="menu"
                                    :close-on-content-click="false"                                                                
                                    min-width="100px">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                                v-model="form.tgl"
                                                label="Tanggal"
                                                prepend-icon="mdi-calendar-text"                                            
                                                disabled
                                                outlined
                                                v-bind="attrs"
                                                v-on="on"
                                                :rules="tglRules"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker
                                            ref="picker"
                                            v-model="form.tgl"                                                                                
                                            :min="new Date().toISOString().substr(0, 10)"
                                            :max="new Date().toISOString().substr(0, 10)"                                    
                                            disabled
                                            @change="setDate">
                                        </v-date-picker>
                                </v-menu>                                                                                  
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
                        <h5 class="font-weight-bold">Hapus Bahan Masuk?</h5>                        
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
        name: "masuk",
        data() {
            return {
                inputType: 'Tambah',
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                menu: false,
                keluar: false,                               
                search: null,
                search2: null,
                dialog: false,
                dialogDelete: false,                
                headers: [
                    {
                        text: "Bahan",
                        align: "start",
                        sortable: true,
                        value: "nama_bahan",
                    },
                    { text: "Jumlah", value: "jml_masuk" },
                    { text: "Harga", value: "harga_bahan" },
                    { text: "Tanggal Masuk", value: "tgl_masuk" },
                    { text: "Actions", value: "actions" },
                ],
                headers2: [
                    {
                        text: "Bahan",
                        align: "start",
                        sortable: true,
                        value: "nama_bahan",
                    },
                    { text: "Jumlah", value: "jml_keluar" },
                    { text: "Tanggal Keluar", value: "tgl_keluar" },                    
                    { text: "Status", value: "status_keluar" },
                ],
                masuk: new FormData,
                masuks: [],
                keluars: [],
                bahanOptions: [],                
                form: {
                    bahan: null,
                    jml: null,
                    harga: null,
                    tgl: null,
                    satuan: null,
                    stok: null,                    
                },
                bahanPilih: [],                
                editId: '',
                deleteId: '',
                bahanRules: [
                    (v) => !!v || 'Bahan tidak boleh kosong',
                ],                
                jmlRules: [
                    (v) => !!v || 'Jumlah tidak boleh kosong',
                ],
                hargaRules: [
                    (v) => !!v || 'Harga tidak boleh kosong',
                ],                
                tglRules: [
                    (v) => !!v || 'Tanggal masuk tidak boleh kosong',
                ],                
            };
        },

        methods: {
            readData() {
                var url = this.$api + '/histori_masuk'
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                        this.masuks = response.data.data
                })
            },
            readDataKeluars() {
                var url = this.$api + '/histori_keluar'
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                        this.keluars = response.data.data
                })
            },
            readOneBahan(id) {
                var url = this.$api + '/bahan/' + id;
                this.$http.get(url, {
                     headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {                    
                    this.bahanPilih = response.data.data                    
                    this.form.bahan = this.bahanPilih
                })
            },
            readDataOptionBahans() {
                var url = this.$api + '/bahan'
                this.$http.get(url, {
                     headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {                    
                    this.bahanOptions = response.data.data
                    this.load = true                    
                })
            },             
            setForm() {
                if (this.inputType === 'Tambah') {
                    if (this.keluar != true) {
                        this.save()   
                    } else {
                        this.saveKeluar()
                    }                    
                } else {
                    this.update()
                }
            },
            save() {
                if (this.$refs.form.validate()) {
                    this.masuk.append('id_bahan', this.form.bahan);
                    this.masuk.append('jml_masuk', this.form.jml);                
                    this.masuk.append('harga_bahan', this.form.harga);                                
                    this.masuk.append('tgl_masuk', this.form.tgl);
                    var url = this.$api + '/histori_masuk'
                    // this.load = true
                    this.$http.post(url, this.masuk, {
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
                        this.readDataKeluars();
                        this.resetForm();
                        this.$refs.form.reset();
                    }).catch(error => {
                        this.error_message=error.response.data.message;
                        this.color="red"
                        this.snackbar=true;
                        // this.load=false;
                    })
                }
            },
            saveKeluar() {
                if (this.$refs.form.validate()) {
                    this.masuk.append('id_bahan', this.form.bahan);
                    this.masuk.append('jml_keluar', this.form.jml);                                    
                    this.masuk.append('tgl_keluar', this.form.tgl);
                    var url = this.$api + '/histori_keluar'
                    // this.load = true
                    this.$http.post(url, this.masuk, {
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
                        this.readDataKeluars();
                        this.resetForm();
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
                        id_bahan: this.form.bahan,
                        jml_masuk: this.form.jml,                    
                        harga_bahan: this.form.harga,                                        
                        tgl_masuk: this.form.tgl,
                    }
                    var url = this.$api + '/histori_masuk/' + this.editId;
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
                        this.readDataKeluars();
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
            deleteData() {
                var url = this.$api + '/histori_masuk_hapus/' + this.deleteId;
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
                    this.readDataKeluars();
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
                this.readOneBahan(item.id_bahan),                
                this.form.satuan = item.unit_bahan,
                this.form.jml = item.jml_masuk,
                this.form.harga = item.harga_bahan,                
                this.form.tgl = item.tgl_masuk,                
                this.dialog = true;
            },            
            deleteHandler(id) {
                this.deleteId = id;                
                this.dialogDelete = true;
            },
            close() {
                this.dialog = false;
                this.dialogDelete = false;
                this.keluar = false;
                this.inputType = 'Tambah';
            },
            cancel() {
                this.resetForm();
                this.$refs.form.reset();                
                this.dialog = false;
                this.keluar = false;                
                this.inputType = 'Tambah';
            },
            resetForm() {
                this.form = {
                    bahan: null,
                    jml: null,
                    harga: null,                    
                    tgl: null,
                    satuan: null,
                    stok: null,                    
                };                                                                   
            },            
            suffixChange(id){               
                 var object = this.bahanOptions.filter(bahanOption => bahanOption.id === id)
                 console.log(object)
                 return this.form.satuan = object[0].unit_bahan                 
            },                        
            setDate(date){
                this.$refs.menu.save(date)
            },
            cekHistori(item) {    
                var now = new Date().toISOString().substr(0, 10)             
                if (item.status_hapus == 0 && item.tgl_masuk == now) {
                    return true;
                } else {
                    return false;
                }
            },
            getColorStatus(status) {                
                if (status.status_keluar == null) {
                    return 'error'                                
                } else return 'warning'                                    
            },
            getStatus(status){                
                if (status.status_keluar == null){                    
                    return 'Bahan dipesan'                                
                }else return  'Bahan dibuang'
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
            this.readDataKeluars();
            this.readDataOptionBahans();         
        },
    };
</script>

