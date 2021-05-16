<template>
    <v-main class="menu" v-if="load">
        <h3 class="pt-5 grey--text text-right font-weight-bold mr-15">Menu</h3>

        <div class="fullheight px-15">
            <v-card>
                <v-card-title>                    
                    <v-btn color="#003249" dark @click="dialog = true">
                        Tambah Menu
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

                <v-data-table :headers="headers" :items="menus" :search="search" :items-per-page="10">
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn color="#ff9a76" small class="mr-2" @click="detailHandler(item)">
                            <v-icon color="white">mdi-view-list</v-icon> 
                        </v-btn>
                        <v-btn color="#679b9b" small class="mr-2" @click="editHandler(item)">
                            <v-icon color="white">mdi-pencil</v-icon> 
                        </v-btn>                        
                        <v-btn color="pink" small @click="deleteHandler(item.id)">
                            <v-icon color="white">mdi-delete</v-icon> 
                        </v-btn>
                    </template>
                    <template v-slot:[`item.stok_menu`]="{ item }">
                            {{ item.stok_menu }} {{ item.unit_menu }}
                    </template>
                    <template v-slot:[`item.harga_menu`]="{ item }">
                            <span v-if="item.harga_menu != 0">Rp {{ item.harga_menu }}</span>
                            <span v-else>Gratis</span>
                    </template>
                    <template v-slot:[`item.tipe_menu`]="{ item }">
                        <v-chip
                            dark
                            :color="getColor(item.tipe_menu)">
                            {{ item.tipe_menu }}
                        </v-chip>
                    </template>                                    
                </v-data-table>            
            </v-card>
        </div>

            <v-dialog v-model="dialog" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline font-weight-bold">{{ formTitle }} Menu</span>
                        <v-spacer></v-spacer>
                        <v-btn color="#810000" text @click="cancel">
                            <v-icon x-large>mdi-close-circle</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form ref="form">
                                <v-text-field
                                    v-model="form.menu"
                                    label="Menu"
                                    outlined
                                    :rules="menuRules"
                                    required
                                    prepend-icon="mdi-food">
                                </v-text-field>                                                                                  

                                <v-select
                                    v-if="formTitle == 'Tambah'" 
                                    v-model="form.bahan"
                                    v-on:change="suffixChange(form.bahan)"
                                    :items="oneBahanOneMenu(form.bahan)"                                                                 
                                    item-text="nama_bahan"
                                    item-value="id"
                                    label="Bahan" 
                                    outlined
                                    :rules="bahanRules"                                                         
                                    required
                                    prepend-icon="mdi-food-variant">
                                </v-select>

                                <v-select 
                                    v-else
                                    v-model="form.bahan"
                                    v-on:change="suffixChange(form.bahan)"
                                    :items="oneBahanOneMenu(form.bahan)"                                                                 
                                    item-text="nama_bahan"
                                    item-value="id"
                                    label="Bahan" 
                                    outlined
                                    :rules="bahanRules"                                                         
                                    required
                                    prepend-icon="mdi-food-variant">
                                </v-select>

                                <v-select 
                                    v-model="form.tipe"
                                    :items="['Makanan Utama', 'Sidedish', 'Minuman']"                                                                 
                                    label="Tipe" 
                                    outlined
                                    :rules="tipeRules"                                                         
                                    required
                                    prepend-icon="mdi-format-list-bulleted-type">
                                </v-select>

                                <v-select 
                                    v-model="form.unit"
                                    :items="['Plate', 'Bowl', 'Mini Bowl', 'Glass', 'Bottle']"
                                    label="Unit" 
                                    outlined
                                    :rules="unitRules"                                                         
                                    required
                                    prepend-icon="mdi-glass-mug">
                                </v-select>

                                <v-text-field
                                    v-model="form.harga"
                                    label="Harga"
                                    outlined
                                    :rules="hargaRules"
                                    type="number"                                
                                    required
                                    prefix="Rp"
                                    prepend-icon="mdi-cash">
                                </v-text-field>   

                                <v-text-field
                                    v-model="form.size"
                                    label="Ukuran Penjayian"
                                    outlined
                                    :rules="sizeRules"
                                    type="number"                                
                                    required
                                    :suffix="form.satuan"
                                    prepend-icon="mdi-weight">
                                </v-text-field>
                                
                                <v-textarea
                                    v-model="form.deskripsi"
                                    outlined
                                    :rules="descRules"                                
                                    required
                                    label="Deskripsi"
                                    prepend-icon="mdi-note-text">
                                </v-textarea>

                                <v-file-input
                                    v-if="formTitle == 'Tambah'"                                
                                    v-model="gambar"
                                    outlined
                                    :rules="gambarRules" 
                                    prepend-icon="mdi-image"
                                    accept="image/*" 
                                    label="Gambar"
                                    v-on:change="convertGambar(gambar)">
                                </v-file-input>

                                <v-file-input
                                    v-else                                
                                    v-model="gambar"
                                    outlined                                    
                                    prepend-icon="mdi-image"
                                    accept="image/*" 
                                    label="Gambar"
                                    v-on:change="convertGambar(gambar)">
                                </v-file-input>

                                <img class="mx-auto" v-if="cancelGambar(form.img)" :src="gambarShow" style="width: 120px; height: 120px">
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
                        <h5 class="font-weight-bold">Hapus Menu?</h5>                        
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
                    <span class="title font-weight-bold">Detail Menu</span>
                    <v-spacer></v-spacer>
                            <v-btn color="#810000" text @click="cancel">
                                <v-icon x-large>mdi-close-circle</v-icon>
                            </v-btn>   
                    </v-card-title>
                    <img class="mx-auto rounded-card" :src="form.img" style="width: 150px; height: 150px">                     
                    <v-card-text class="font-weight-medium">
                        <v-form ref="form">
                            <v-list-item>
                            <v-list-item-content class="text-left">                            
                                <v-list-item-subtitle>Menu : {{ form.menu }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Bahan : {{ form.bahan }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Tipe : {{ form.tipe }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Jumlah : {{ form.stok }} {{ form.unit }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Harga : Rp {{ form.harga }}</v-list-item-subtitle>
                                <v-list-item-subtitle>Ukuran Penyajian : {{ form.size }} {{ form.satuan }}</v-list-item-subtitle>                            
                                <v-list-item-subtitle>Deskripsi : {{ form.deskripsi }}</v-list-item-subtitle>                            
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
        name: "menu",
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
                dialogDetail: false,
                headers: [
                    {
                        text: "Menu",
                        align: "start",
                        sortable: true,
                        value: "nama_menu",
                    },
                    { text: "Tipe", value: "tipe_menu" },
                    { text: "Stok", value: "stok_menu" },
                    { text: "Harga", value: "harga_menu" },
                    { text: "Actions", value: "actions" },
                ],                
                menu: new FormData,
                menus: [],
                bahanOptions: [],
                // hasilBahans: [],                            
                form: {
                    menu: null,
                    bahan: null,
                    tipe: null,
                    unit: null,
                    harga: null,
                    stok: null,
                    size: null,
                    deskripsi: null,
                    img: null,
                    satuan: null,
                },
                gambar: null,
                gambarShow: null,                                
                editId: '',
                deleteId: '',
                menuRules: [
                    (v) => !!v || 'Menu tidak boleh kosong',
                ],                
                bahanRules: [
                    (v) => !!v || 'Bahan tidak boleh kosong',
                ],
                tipeRules: [
                    (v) => !!v || 'Tipe tidak boleh kosong',
                ],                
                unitRules: [
                    (v) => !!v || 'Unit tidak boleh kosong',
                ],
                hargaRules: [
                    (v) => !!v || 'Harga tidak boleh kosong',
                ],                
                sizeRules: [
                    (v) => !!v || 'Ukuran penyajian tidak boleh kosong',
                ],
                descRules: [
                    (v) => !!v || 'Deskripsi tidak boleh kosong',
                ],                
                gambarRules: [
                    (v) => !!v || 'Gambar tidak boleh kosong',
                ],                
            };
        },

        methods: {
            readData() {
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
                    this.save()
                } else {
                    this.update()
                }
            },
            save() {
                if (this.$refs.form.validate()) {
                    this.menu.append('nama_menu', this.form.menu);
                    this.menu.append('id_bahan', this.form.bahan);
                    this.menu.append('tipe_menu', this.form.tipe);                
                    this.menu.append('unit_menu', this.form.unit);
                    this.menu.append('harga_menu', this.form.harga);
                    this.menu.append('serving_size', this.form.size);
                    this.menu.append('deskripsi_menu', this.form.deskripsi);
                    this.menu.append('gambar_menu', this.gambarShow);
                    var url = this.$api + '/menu'
                    // this.load = true
                    this.$http.post(url, this.menu, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    }).then(response => {
                        this.error_message = response.data.message;
                        this.color="green"
                        this.snackbar=true;                        
                        this.close();
                        this.readData();
                        this.resetForm();
                        this.$refs.form.reset();
                    }).catch(error => {
                        this.error_message=error.response.data.message;
                        this.color="red"
                        this.snackbar=true;                        
                    })
                }
            },
            update() {
                if (this.$refs.form.validate()) {
                    this.form.img = this.gambarShow;
                    let newData = {
                        nama_menu: this.form.menu,
                        id_bahan: this.form.bahan,
                        tipe_menu: this.form.tipe,
                        unit_menu: this.form.unit,
                        harga_menu: this.form.harga,
                        serving_size: this.form.size,
                        deskripsi_menu: this.form.deskripsi,
                        gambar_menu: this.form.img,
                    }
                    var url = this.$api + '/menu/' + this.editId;
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
                var url = this.$api + '/menu_hapus/' + this.deleteId;
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
                this.form.menu = item.nama_menu,
                this.form.bahan = item.nama_bahan,
                this.form.tipe = item.tipe_menu, 
                this.form.stok = item.stok_menu,               
                this.form.unit = item.unit_menu,
                this.form.harga = item.harga_menu,
                this.form.size = item.serving_size,
                this.form.satuan = item.unit_bahan,
                this.form.deskripsi = item.deskripsi_menu,
                this.form.img = item.gambar_menu,                
                this.dialogDetail = true;
            },
            editHandler(item) {
                this.inputType = 'Ubah';
                this.editId = item.id;
                this.form.menu = item.nama_menu,
                this.form.bahan = item.id_bahan,
                this.form.tipe = item.tipe_menu,                                
                this.form.unit = item.unit_menu,
                this.form.harga = item.harga_menu,
                this.form.size = item.serving_size,
                this.form.img = item.gambar_menu,
                this.gambarShow = item.gambar_menu,
                this.form.deskripsi = item.deskripsi_menu,
                this.form.satuan = item.unit_bahan,
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
                this.dialogDetail = false;
                this.inputType = 'Tambah';
            },
            resetForm() {
                this.form = {
                    menu: null,
                    bahan: null,
                    tipe: null,
                    stok: null,
                    unit: null,
                    harga: null,
                    size: null,
                    deskripsi: null,
                    img: null,
                    satuan: null,
                };
                this.gambar = null;
                this.gambarShow = null;
            },            
            convertGambar(e){               
                var fileReader = new FileReader()
                fileReader.readAsDataURL(e)
                fileReader.onload = (e) => {
                    this.gambarShow = e.target.result
                }                                                              
            },
            cancelGambar(img){
                if (this.formTitle == 'Tambah') {
                    if (this.gambar != null) {
                        return true
                    } else {
                        this.gambarShow == null
                        return false
                    }                    
                } else {
                    if (this.gambar != null) {
                        return true
                    } else {
                        this.gambarShow = img
                        return true
                    }
                }
            },
            suffixChange(id){               
                 var object = this.bahanOptions.filter(bahanOption => bahanOption.id === id)
                 console.log(object)
                 return this.form.satuan = object[0].unit_bahan                 
            },
            getColor(tipe) {
                if (tipe == 'Makanan Utama') return 'primary'
                else if (tipe == 'Sidedish') return 'green lighten-1'
                else return 'brown'
            },
            oneBahanOneMenu(id){
                var object = 0;
                var hasilBahans = [];
                if (this.formTitle == 'Tambah') {
                    for (let index = 0; index < this.bahanOptions.length; index++) {
                        if (this.bahanOptions[index].id_menu == null){
                            hasilBahans[object] = this.bahanOptions[index];
                            object++;
                        }                    
                    }
                } else {
                    for (let index = 0; index < this.bahanOptions.length; index++) {
                        if (this.bahanOptions[index].id_menu == null || this.bahanOptions[index].id == id){
                            hasilBahans[object] = this.bahanOptions[index];
                            object++;
                        } 
                    }
                }                                           
                return hasilBahans;
            },                                                                                                                                    
        },        
        computed: {
            formTitle() {
                return this.inputType
            },            
        },
        mounted() {            
            this.readData();
            this.readDataOptionBahans();          
        },
    };
</script>

