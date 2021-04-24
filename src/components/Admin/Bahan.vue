<template>
    <v-main class="bahan" v-if="load">
        <h3 class="pt-5 grey--text text-right font-weight-bold mr-15">Bahan</h3>

        <div class="fullheight px-15">
            <v-card>
                <v-card-title>
                    <v-btn color="#003249" dark @click="dialog = true">
                        Tambah Bahan
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

                <v-data-table :headers="headers" :items="bahans" :search="search" :items-per-page="10">
                    <template v-slot:[`item.actions`]="{ item }">                        
                        <v-btn color="#679b9b" small class="mr-2" @click="editHandler(item)">
                            <v-icon color="white">mdi-pencil</v-icon> 
                        </v-btn>                        
                        <v-btn color="pink" small @click="deleteHandler(item.id)">
                            <v-icon color="white">mdi-delete</v-icon> 
                        </v-btn>
                    </template>
                    <template v-slot:[`item.stok_bahan`]="{ item }">
                            {{ item.stok_bahan }} {{ item.unit_bahan }}
                    </template>                    
                </v-data-table>            
            </v-card>
        </div>

            <v-dialog v-model="dialog" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline font-weight-bold">{{ formTitle }} Bahan</span>
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
                                    label="Bahan"
                                    outlined
                                    :rules="namaRules"                                                                 
                                    required
                                    prepend-icon="mdi-food-variant">
                                </v-text-field>                                                                      

                                <v-select 
                                    v-model="form.unit"
                                    :items="['gram', 'ml']"
                                    label="Satuan" 
                                    outlined
                                    :rules="unitRules"                                                          
                                    required
                                    prepend-icon="mdi-weight">
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

            <v-dialog v-model="dialogDelete" persistent max-width="400px">
                <v-card>
                    <v-card-title>                        
                        <v-spacer></v-spacer>
                            <v-btn color="#810000" text @click="dialogDelete = false">
                                <v-icon x-large>mdi-close-circle</v-icon>
                            </v-btn>                        
                    </v-card-title>                   
                    <v-card-text>                        
                        <h5 class="font-weight-bold">Hapus Bahan Makanan?</h5>                        
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
        name: "bahan",
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
                        text: "Bahan",
                        align: "start",
                        sortable: true,
                        value: "nama_bahan",
                    },
                    { text: "Stok", value: "stok_bahan" },                    
                    { text: "Actions", value: "actions" },
                ],
                bahan: new FormData,
                bahans: [],                
                form: {
                    nama: null,                    
                    unit: null,                    
                },                
                editId: '',
                deleteId: '',
                namaRules: [
                    (v) => !!v || 'Bahan tidak boleh kosong',
                ],                
                unitRules: [
                    (v) => !!v || 'Satuan tidak boleh kosong',
                ],                
            };
        },

        methods: {
            readData() {
                var url = this.$api + '/bahan'
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                    this.bahans = response.data.data
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
                    this.bahan.append('nama_bahan', this.form.nama);                
                    this.bahan.append('unit_bahan', this.form.unit);                                
                    var url = this.$api + '/bahan'
                    // this.load = true
                    this.$http.post(url, this.bahan, {
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
                        nama_bahan: this.form.nama,                    
                        unit_bahan: this.form.unit,
                    }
                    var url = this.$api + '/bahan/' + this.editId;
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
            deleteData() {
                var url = this.$api + '/bahan_hapus/' + this.deleteId;
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
                this.form.nama = item.nama_bahan,
                this.form.unit = item.unit_bahan,                
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
                    unit: null,
                };                                                                   
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

