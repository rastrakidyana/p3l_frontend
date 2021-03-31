<template>
    <v-main class="karyawan">
        <h3 class="text-h3 font-weight-bold mb-5 judul">Karyawan</h3>

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
                        Tambah Karyawan
                    </v-btn>                    
                </v-card-title>

                <v-data-table :headers="headers" :items="karyawans" :search="search" :items-per-page="5">
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn color="#ff9a76" small class="mr-2" @click="detailHandler(item)">
                            <v-icon color="white">mdi-account-details</v-icon> 
                        </v-btn>
                        <v-btn color="pink" small class="mr-2" @click="editHandler(item)">
                            <v-icon color="white">mdi-pencil</v-icon> 
                        </v-btn>                        
                        <v-btn v-if="item.status_karyawan == 'Nonaktif'" color="grey" dark small @click="statusHandler(item.id)">
                            {{ item.status_karyawan }}
                        </v-btn>
                        <v-btn v-else color="#679b9b" dark small @click="statusHandler(item.id)">
                            {{ item.status_karyawan }}
                        </v-btn>
                    </template>
                    <template v-slot:[`item.tes`]="{ item }">
                            {{ showJabatans(item.id) }}
                    </template>                 
                </v-data-table>            
            </v-card>
        </div>

            <v-dialog v-model="dialog" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline font-weight-bold">{{ formTitle }} Karyawan</span>
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
                        
                            <v-select 
                                v-model="form.jabatan"
                                :items="jabatanOptions"                                                                 
                                item-text="nama_jabatan"
                                item-value="id"
                                label="Jabatan" 
                                outlined                                                         
                                required
                                prepend-icon="mdi-wallet-giftcard">
                            </v-select>                            

                            <v-row class="ml-auto">
                                <v-icon class="mt-2">mdi-gender-male-female</v-icon>                            
                                <span class="ml-5">Jenis Kelamin</span>                                
                            </v-row>
                            <v-radio-group
                                class="ml-16 my-n1"
                                v-model="form.jk"                          
                                row>
                                <v-radio                                                                                                    
                                    label="Pria"
                                    value="Pria">
                                </v-radio>
                                <v-radio                           
                                    label="Perempuan"
                                    value="Perempuan">
                                </v-radio>
                            </v-radio-group>

                            <v-text-field
                                v-model="form.telp"                                
                                label="No. Telepon"
                                outlined                                                                
                                required
                                prepend-icon="mdi-phone">
                            </v-text-field>

                            <v-menu
                                ref="menu"
                                v-model="menu"
                                :close-on-content-click="false"                                                                
                                min-width="100px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="form.tglGabung"
                                            label="Tanggal Bergabung"
                                            prepend-icon="mdi-calendar-text"                                            
                                            readonly
                                            outlined
                                            v-bind="attrs"
                                            v-on="on"
                                            :rules="rules"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        ref="picker"
                                        v-model="form.tglGabung"
                                        v-on:change="setPassword(form.tglGabung)"
                                        :max="new Date().toISOString().substr(0, 10)"
                                        min="1950-01-01"
                                        @change="setDate">
                                    </v-date-picker>
                            </v-menu>

                            <v-text-field
                                v-model="form.email"                                
                                label="Email"
                                outlined                                                                
                                required
                                prepend-icon="mdi-email">
                            </v-text-field>

                            <v-text-field 
                                v-if="formTitle == 'Tambah'"
                                v-model="form.pass"                                
                                label="Password"
                                outlined
                                readonly                                                                
                                required
                                prepend-icon="mdi-lock">
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

            <v-dialog v-model="dialogConfirm" persistent max-width="400px">
                <v-card>
                    <v-card-title>                        
                        <v-spacer></v-spacer>
                            <v-btn color="#810000" text @click="dialogConfirm = false">
                                <v-icon x-large>mdi-close-circle</v-icon>
                            </v-btn>                        
                    </v-card-title>                   
                    <v-card-text>                        
                        <h5 class="font-weight-bold">Nonaktifkan Karyawan?</h5>                        
                    </v-card-text>
                    <v-card-actions class="justify-center">                                           
                        <v-btn color="red darken-1" dark @click="confirmData">
                            Nonaktif
                        </v-btn>                                       
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogDetail" persistent max-width="400px">
                <v-card
                    class="mx-auto"                                                       
                    max-width="400">
                    <v-card-title>                    
                    <span class="title font-weight-bold">Detail Karyawan</span>
                    <v-spacer></v-spacer>
                            <v-btn color="#810000" text @click="cancel">
                                <v-icon x-large>mdi-close-circle</v-icon>
                            </v-btn>   
                    </v-card-title>                     
                    <v-card-text class="font-weight-bold">
                        <v-list-item>
                        <v-list-item-content class="align-start">                            
                            <v-list-item-subtitle>Nama : {{ form.nama }}</v-list-item-subtitle>
                            <v-list-item-subtitle>Jabatan : {{ form.jabatan }}</v-list-item-subtitle>
                            <v-list-item-subtitle>Jenis Kelamin : {{ form.jk }}</v-list-item-subtitle>
                            <v-list-item-subtitle>Tanggal Bergabung : {{ form.tglGabung }}</v-list-item-subtitle>
                            <v-list-item-subtitle>No Telp. : {{ form.telp }}</v-list-item-subtitle>
                            <v-list-item-subtitle>Email : {{ form.email }}</v-list-item-subtitle>                            
                        </v-list-item-content>
                        </v-list-item>                                           
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
        name: "karyawan",
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
                dialogConfirm: false,
                dialogDetail: false,
                headers: [
                    {
                        text: "Nama",
                        align: "start",
                        sortable: true,
                        value: "nama_karyawan",
                    },
                    { text: "Jabatan", value: "tes" },                    
                    { text: "Actions", value: "actions" },
                ],
                karyawan: new FormData,
                karyawans: [],
                jabatanOptions: [],                                              
                form: {
                    nama: null,
                    jabatan: null,
                    jk: null,
                    telp: null,
                    tglGabung: null,
                    email: null,
                    pass:null,
                },                
                editId: '',
                confirmId: '',                
            };
        },

        methods: {
            readData() {
                var url = this.$api + '/karyawan'
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                        this.karyawans = response.data.data
                })
            },
            readDataOption() {
                var url = this.$api + '/jabatan'
                this.$http.get(url, {
                     headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {                    
                    this.jabatanOptions = response.data.data                    
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
                this.karyawan.append('nama_karyawan', this.form.nama);
                this.karyawan.append('id_jabatan', this.form.jabatan);
                this.karyawan.append('jk_karyawan', this.form.jk);
                this.karyawan.append('telp_karyawan', this.form.telp);
                this.karyawan.append('tgl_gabung_karyawan', this.form.tglGabung);
                this.karyawan.append('email', this.form.email);
                this.karyawan.append('password', this.form.pass);

                var url = this.$api + '/karyawan'
                this.load = true
                this.$http.post(url, this.karyawan, {
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
                    nama_karyawan: this.form.nama,
                    id_jabatan: this.form.jabatan,
                    jk_karyawan: this.form.jk,
                    telp_karyawan: this.form.telp,
                    tgl_gabung_karyawan: this.form.tglGabung,
                    email: this.form.email,                    
                }
                var url = this.$api + '/karyawan/' + this.editId;
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
            confirmData() {
                var url = this.$api + '/karyawan_status/' + this.confirmId;
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
            detailHandler(item) {                
                this.editId = item.id;                                
                this.form.nama = item.nama_karyawan,
                this.form.jabatan = this.showJabatans(item.id_jabatan),
                this.form.jk = item.jk_karyawan,
                this.form.telp = item.telp_karyawan,
                this.form.tglGabung = item.tgl_gabung_karyawan,
                this.form.email = item.email,  
                this.dialogDetail = true;
            },
            editHandler(item) {
                this.inputType = 'Ubah';
                this.editId = item.id;                                
                this.form.nama = item.nama_karyawan,
                this.form.jabatan = item.id_jabatan,
                this.form.jk = item.jk_karyawan,
                this.form.telp = item.telp_karyawan,
                this.form.tglGabung = item.tgl_gabung_karyawan,
                this.form.email = item.email,  
                this.dialog = true;
            },            
            statusHandler(id) {
                this.confirmId = id;                
                this.dialogConfirm = true;
            },
            close() {
                this.dialog = false;
                this.dialogConfirm = false;
                this.inputType = 'Tambah';
            },
            cancel() {
                this.resetForm();
                this.readData();
                this.dialog = false;
                this.dialogDetail = false;
                this.inputType = 'Tambah';
            },
            resetForm() {
                this.form = {
                    nama: null,
                    jabatan: null,
                    jk: null,
                    telp: null,
                    tglGabung: null,
                    email: null,
                    pass: null,
                };                                                                   
            },
            showJabatans(id){               
                 var object = this.jabatanOptions.filter(jabatanOption => jabatanOption.id === id)
                 console.log(object)
                 return object[0].nama_jabatan                 
            },
            setDate(date){
                this.$refs.menu.save(date)
            },
            setPassword(tgl){
                return this.form.pass = tgl
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
            this.readDataOption();            
        },
    };
</script>

