<template>
    <div class="dashboard">
        <v-navigation-drawer color="white" v-model="drawer" class="fullheight" app>
            <v-list-item>
                <v-list-item-content>
                    <v-img
                        class="mx-auto" 
                        :src="logo"
                        max-height="150"
                        max-width="150"                            
                    ></v-img>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list nav class="text-left">
                <v-list-item
                    dense                    
                    color="#810000"                                   
                    v-for="item in permissionUser()"
                    :key="item.title"
                    link
                    style="text-decoration: none;"
                    tag="router-link"
                    :to="item.to">
                    <v-icon>{{ item.icon }}</v-icon>
                    <v-list-item-content class="ml-4">                        
                        <v-list-item-title>                            
                            {{ item.title }}
                        </v-list-item-title>                        
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar dark flat app fixed color="#003249">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="font-weight-bold">Atma Korean BBQ</v-toolbar-title>
            <v-spacer></v-spacer>            
            <v-toolbar-title class="text-subtitle-1 font-weight-bold">{{ userNow.nama_karyawan }}</v-toolbar-title>
            <v-menu
                open-on-hover                
                bottom
                offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            icon                            
                            v-bind="attrs"
                            v-on="on">
                            <v-icon>mdi-account</v-icon>
                        </v-btn>
                    </template>
                <v-list>
                    <v-list-item
                        v-for="(menu, index) in menus"
                        :key="index">
                        <v-list-item-title>
                            <v-btn v-if="menu.title==='Logout'" text router @click.prevent="logout">
                                {{ menu.title }}
                            </v-btn>
                            <v-btn v-else @click="dialog = true">
                                {{ menu.title }}
                            </v-btn>                          
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>        
        </v-app-bar>

        <v-dialog v-model="dialog" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline font-weight-bold">Ubah Password</span>
                        <v-spacer></v-spacer>
                        <v-btn color="#810000" text @click="cancel">
                            <v-icon x-large>mdi-close-circle</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form ref="form">                                                            
                                <v-text-field                                     
                                    v-model="form.pass"                                
                                    label="Password Lama"
                                    outlined
                                    :type="show ? 'text' : 'password'"
                                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"                                    
                                    :rules="passRules"
                                    @click:append="show = !show"                                                                 
                                    required
                                    prepend-icon="mdi-lock">
                                </v-text-field>

                                <v-text-field                                     
                                    v-model="form.passBaru"                                
                                    label="Password Baru"
                                    outlined
                                    :type="show2 ? 'text' : 'password'"
                                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"                                    
                                    :rules="passRules"
                                    @click:append="show2 = !show2"                                                                 
                                    required
                                    prepend-icon="mdi-lock">
                                </v-text-field>
                            </v-form>                             
                        </v-container>
                    </v-card-text>
                    <v-card-actions class="justify-center">                                            
                        <v-btn color="#003249" dark @click="changePass">
                            Simpan
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        
        <div class="fullheight pa-5">
            <router-view></router-view>
            <!-- <v-footer bottom color="#003249" dark flat fixed app>
                <v-col                
                class="text-center"
                cols="12"
                >
                {{ new Date().getFullYear() }} — <strong>Atma Korean BBQ</strong>
                </v-col>
            </v-footer> -->
        </div>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
                {{error_message}}
        </v-snackbar>        
    </div>
</template>


<script>
    export default {
        name: "Dashboard",
        data() {
            return {
                logo: require('@/assets/akb_logo.png'),
                drawer: true,
                show: false,
                show2: false,
                userNow: [],
                itemsManager: [
                    { title: "Dashboard", icon: "mdi-view-dashboard", to: "/dashboard" },                                     
                    { title: "Karyawan", icon: "mdi-account-key", to: "/karyawan" },                    
                    { title: "Meja", icon: "mdi-table", to: "/meja" },
                    { title: "Customer", icon: "mdi-account-multiple", to: "/customer" },                                        
                    { title: "Reservasi", icon: "mdi-calendar-multiple", to: "/reservasi" },
                    { title: "Menu", icon: "mdi-food", to: "/menu" },
                    { title: "Bahan", icon: "mdi-food-variant", to: "/bahan" },                    
                    { title: "Histori Bahan", icon: "mdi-calendar-multiple-check", to: "/histori_bahan_masuk" },
                    { title: "Pesanan", icon: "mdi-cart", to: "/pesanan" },
                    { title: "Transaksi", icon: "mdi-receipt", to: "/transaksi" },
                    { title: "Kartu Customer", icon: "mdi-credit-card", to: "/kartu" },
                    { title: "Laporan", icon: "mdi-file-document", to: "/laporan" },
                ],
                itemsOwner: [
                    { title: "Dashboard", icon: "mdi-view-dashboard", to: "/dashboard" },                                     
                    { title: "Karyawan", icon: "mdi-account-key", to: "/karyawan" },
                    { title: "Laporan", icon: "mdi-file-document", to: "/laporan" },                                        
                ],
                itemsKasir: [
                    { title: "Dashboard", icon: "mdi-view-dashboard", to: "/dashboard" },                                                                             
                    { title: "Customer", icon: "mdi-account-multiple", to: "/customer" },                                        
                    { title: "Reservasi", icon: "mdi-calendar-multiple", to: "/reservasi" },                                        
                    { title: "Transaksi", icon: "mdi-receipt", to: "/transaksi" },
                    { title: "Kartu Customer", icon: "mdi-credit-card", to: "/kartu" },
                ],
                itemsWaiter: [
                    { title: "Dashboard", icon: "mdi-view-dashboard", to: "/dashboard" },                                                         
                    { title: "Customer", icon: "mdi-account-multiple", to: "/customer" },                                        
                    { title: "Reservasi", icon: "mdi-calendar-multiple", to: "/reservasi" },                                                            
                    { title: "Pesanan", icon: "mdi-cart", to: "/pesanan" },                    
                ],
                itemsChef: [
                    { title: "Dashboard", icon: "mdi-view-dashboard", to: "/dashboard" },                                                         
                    { title: "Bahan", icon: "mdi-food-variant", to: "/bahan" },                    
                    { title: "Histori Bahan", icon: "mdi-calendar-multiple-check", to: "/histori_bahan_masuk" },
                    { title: "Pesanan", icon: "mdi-cart", to: "/pesanan" },                                        
                ],               
                menus: [
                    { title: 'Ubah Password' },
                    { title: 'Logout' },                    
                ],
                snackbar: false,
                error_message: '',
                color: '',
                dialog: false,
                form: {                
                    pass:null,
                    passBaru:null,
                },
                passRules: [
                    (v) => !!v || 'Password tidak boleh kosong',
                ], 
            };
        },
        methods: {
            logout() {
                localStorage.removeItem('token')
                localStorage.removeItem('id')
                localStorage.removeItem('id_jabatan')
                this.$router.push('/login')
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
            changePass() {
                if (this.$refs.form.validate()) {
                    let newData = {
                        old_pass: this.form.pass,
                        new_pass: this.form.passBaru,
                    }
                    var url = this.$api + '/karyawan_change_pass'
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
            close() {
                this.dialog = false;                
            },
            cancel() {
                this.resetForm();
                this.$refs.form.reset();                
                this.dialog = false;                
            },
            resetForm() {
                this.form = {                    
                    pass: null,
                    passBaru: null,
                };                                                                   
            },
            permissionUser() {
                if ( this.userNow.id_jabatan == 1) {
                    return this.itemsOwner
                } else if ( this.userNow.id_jabatan == 2) {
                    return this.itemsManager
                } else if ( this.userNow.id_jabatan == 3) {
                    return this.itemsKasir
                } else if ( this.userNow.id_jabatan == 4) {
                    return this.itemsWaiter
                } else if ( this.userNow.id_jabatan == 5) {
                    return this.itemsChef
                } else
                    return this.null
            },  
        },
        mounted() {
            this.readDataUser();            
        },
    };
</script>

<style scoped>
    .fullheight {
        min-height: 100vh !important;
    }    
</style>