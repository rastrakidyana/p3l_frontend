<template>
    <v-main class="karyawan" v-if="load">
        <h3 class="pt-5 grey--text text-right font-weight-bold mr-15">Karyawan</h3>

        <div class="fullheight px-15">
            <v-card>
                <v-card-title>
                    <v-btn color="#003249" dark @click="dialog = true">
                        Tambah Karyawan
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

                <v-data-table :headers="headers" :items="karyawans" :search="search" :items-per-page="10">
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn color="#ff9a76" small class="mr-2" @click="detailHandler(item)">
                            <v-icon color="white">mdi-account-details</v-icon> 
                        </v-btn>
                        <v-btn color="#679b9b" small class="mr-2" @click="editHandler(item)">
                            <v-icon color="white">mdi-pencil</v-icon> 
                        </v-btn>                        
                        <v-btn v-if="item.status_karyawan == 'Nonaktif'" color="white" small @click="statusHandler(item)">
                            Aktifkan
                        </v-btn>
                        <v-btn v-else-if="item.status_karyawan == 'Aktif' && item.id != idNow && item.id_jabatan != 1" color="pink" dark small @click="statusHandler(item)">
                            Nonaktifkan
                        </v-btn>
                        <v-btn v-else-if="item.id == idNow || item.id_jabatan == 1" disabled color="pink" small @click="statusHandler(item)">
                            Nonaktifkan
                        </v-btn>
                    </template>                   
                    <template v-slot:[`item.status_karyawan`]="{ item }">
                        <v-chip
                            dark
                            :color="getColor(item.status_karyawan)">
                            {{ item.status_karyawan }}
                        </v-chip>
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
                            <v-form ref="form">                            
                                <v-text-field
                                    v-model="form.nama"
                                    label="Nama"
                                    outlined
                                    :rules="namaRules"
                                    required
                                    prepend-icon="mdi-account">
                                </v-text-field>

                                <v-select                                
                                    v-model="form.jabatan"
                                    v-if="form.jabatan == '1' || editId == idNow"
                                    :items="jabatanOptions"       
                                    item-text="nama_jabatan"
                                    item-value="id"
                                    label="Jabatan"
                                    disabled 
                                    outlined
                                    :rules="jabatanRules"                                                         
                                    required
                                    prepend-icon="mdi-key">
                                </v-select>
                            
                                <v-select                                
                                    v-model="form.jabatan"
                                    v-else 
                                    :items="jabatanOptionsWithoutOwner()"                                                                 
                                    item-text="nama_jabatan"
                                    item-value="id"
                                    label="Jabatan" 
                                    outlined
                                    :rules="jabatanRules"                                                         
                                    required
                                    prepend-icon="mdi-key">
                                </v-select>                                                     

                                <v-row class="ml-auto">
                                    <v-icon class="mt-2">mdi-gender-male-female</v-icon>                            
                                    <span class="ml-5">Jenis Kelamin</span>                                
                                </v-row>
                                <v-radio-group
                                    class="ml-16 my-n1"
                                    v-model="form.jk"
                                    :rules="jkRules"                          
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
                                    label="No. Telp"
                                    outlined
                                    :rules="telpRules"                                                                
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
                                                :rules="tglRules"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker
                                            ref="picker"
                                            v-model="form.tglGabung"
                                            v-on:change="setPassword(form.tglGabung)"                                            
                                            min="2020-01-01"
                                            @change="setDate">
                                        </v-date-picker>
                                </v-menu>

                                <v-text-field
                                    v-if="formTitle == 'Tambah'"
                                    v-model="form.email"                                
                                    label="E-mail"
                                    outlined
                                    :rules="emailRules"                                                                
                                    required
                                    prepend-icon="mdi-email">
                                </v-text-field>

                                <v-text-field
                                    v-else
                                    v-model="form.email"                                
                                    label="E-mail"
                                    outlined
                                    :rules="emailRules"                                                                
                                    required
                                    disabled
                                    prepend-icon="mdi-email">
                                </v-text-field>

                                <v-text-field 
                                    v-if="formTitle == 'Tambah'"
                                    v-model="form.pass"                                
                                    label="Password"
                                    outlined
                                    readonly
                                    :rules="passRules"                                                                 
                                    required
                                    prepend-icon="mdi-lock">
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

            <v-dialog v-model="dialogConfirm" persistent max-width="400px">
                <v-card>
                    <v-card-title>                        
                        <v-spacer></v-spacer>
                            <v-btn color="#810000" text @click="dialogConfirm = false">
                                <v-icon x-large>mdi-close-circle</v-icon>
                            </v-btn>                        
                    </v-card-title>                   
                    <v-card-text v-if="confirmStatus == 'Aktif' ">                        
                        <h4 class="font-weight-medium">Nonaktifkan Karyawan ?</h4>
                    </v-card-text>
                    <v-card-text v-else>                        
                        <h4 class="font-weight-medium">Aktifkan Karyawan ?</h4>                        
                    </v-card-text>
                    <v-card-actions class="justify-center">                                           
                        <v-btn color="#003249" dark @click="confirmData">
                            Ya
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
                                <v-icon large>mdi-close-circle</v-icon>
                            </v-btn>   
                    </v-card-title>                     
                    <v-card-text class="font-weight-medium">
                        <v-form ref="form">                            
                            <v-list-item>
                            <v-list-item-content class="text-left">                            
                                <v-list-item-subtitle>Nama              : {{ form.nama }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Jabatan           : {{ form.jabatan }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Jenis Kelamin     : {{ form.jk }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Tanggal Bergabung : {{ form.tglGabung }}</v-list-item-subtitle>
                                <v-list-item-subtitle>No. Telp.         : {{ form.telp }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Email             : {{ form.email }}</v-list-item-subtitle>                                
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
                idNow: localStorage.getItem('id'),
                headers: [
                    {
                        text: "Nama",
                        align: "start",
                        sortable: true,
                        value: "nama_karyawan",
                    },
                    { text: "Jabatan", value: "nama_jabatan" },
                    { text: "Status", value: "status_karyawan" },
                    { text: "Actions", value: "actions" },
                ],
                karyawan: new FormData,
                karyawans: [],
                jabatanOptions: [],
                hasils: [],                                                              
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
                confirmStatus: '',
                namaRules: [
                    (v) => !!v || 'Nama tidak boleh kosong',
                    // (v) => v.length <= 60 || 'Nama melebihi batas maksimal 60 karakter',
                ],                
                emailRules: [
                    (v) => !!v || 'E-mail tidak boleh kosong',
                    // (v) => /.+@.+/.test(v) || 'E-mail tidak valid',
                ],
                telpRules: [
                    (v) => !!v || 'No. telp tidak boleh kosong',
                    // (v) => (v.length <= 12 && v.length >= 10) || 'No. telp antara 10-12 digit',
                ],                
                tglRules: [
                    (v) => !!v || 'Tanggal bergabung tidak boleh kosong',
                ],
                jkRules: [
                    (v) => !!v || 'Jenis kelamin tidak boleh kosong',
                ],                
                jabatanRules: [
                    (v) => !!v || 'Jabatan tidak boleh kosong',
                ],
                passRules: [
                    (v) => !!v || 'Password tidak boleh kosong',
                ],                
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
            save() {
                if (this.$refs.form.validate()) {
                    this.karyawan.append('nama_karyawan', this.form.nama);
                    this.karyawan.append('id_jabatan', this.form.jabatan);
                    this.karyawan.append('jk_karyawan', this.form.jk);
                    this.karyawan.append('telp_karyawan', this.form.telp);
                    this.karyawan.append('tgl_gabung_karyawan', this.form.tglGabung);
                    this.karyawan.append('email', this.form.email);
                    this.karyawan.append('password', this.form.pass);

                    var url = this.$api + '/karyawan'
                    // this.load = true
                    this.$http.post(url, this.karyawan, {
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
                }
            },
            update() {
                if (this.$refs.form.validate()) {
                    let newData = {
                        nama_karyawan: this.form.nama,
                        id_jabatan: this.form.jabatan,
                        jk_karyawan: this.form.jk,
                        telp_karyawan: this.form.telp,
                        tgl_gabung_karyawan: this.form.tglGabung,
                        email: this.form.email,                    
                    }
                    var url = this.$api + '/karyawan/' + this.editId;
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
                        this.$refs.form.reset()
                        this.inputType = 'Tambah';
                    }).catch(error => {
                        this.error_message=error.response.data.message;
                        this.color="red"
                        this.snackbar=true;
                        // this.load=false;
                    })
                }
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
                this.form.nama = item.nama_karyawan,
                this.form.jabatan = item.nama_jabatan,
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
            statusHandler(item) {
                this.confirmId = item.id;
                this.confirmStatus = item.status_karyawan;
                this.dialogConfirm = true;
            },
            close() {
                this.dialog = false;
                this.dialogConfirm = false;                
                this.inputType = 'Tambah';
            },
            cancel() {
                this.resetForm();
                this.$refs.form.reset();
                this.readData();
                this.dialog = false;
                this.dialogDetail = false;
                this.dialogConfirm = false;                
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
            jabatanOptionsWithoutOwner(){
                var object = 0;                           
                for (let index = 0; index < this.jabatanOptions.length; index++) {
                    if (this.jabatanOptions[index].nama_jabatan != 'Owner'){
                          this.hasils[object] = this.jabatanOptions[index];
                          object++;
                    }                    
                }
                return this.hasils;                  
            },
            setDate(date){
                this.$refs.menu.save(date)
            },
            setPassword(tgl){
                return this.form.pass = tgl
            },
            getColor(status) {
                if (status == 'Aktif') return 'primary'                
                else return 'pink'
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

