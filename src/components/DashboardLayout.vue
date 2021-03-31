<template>
    <div class="dashboard">
        <v-navigation-drawer color= "#f4f9f4" v-model="drawer" class="fullheight" app>
            <v-list-item>
                <v-list-item-content>
                    <v-img
                        class="mx-auto" 
                        src="https://www.pngarts.com/files/3/Logo-PNG-Image.png"
                        max-height="90"
                        max-width="90"    
                    ></v-img>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list nav>
                <v-list-item
                    dense
                    color="#810000"                                    
                    v-for="item in items"
                    :key="item.title"
                    link
                    tag="router-link"
                    :to="item.to">
 
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar dark flat app fixed color="#003249">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>Atma Korean BBQ</v-toolbar-title>
            <v-spacer></v-spacer>            
            <v-toolbar-title>{{ userNow.nama_karyawan }}</v-toolbar-title>
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
                            <v-btn v-if="menu.title==='Keluar'" text router @click.prevent="logout">
                                {{ menu.title }}
                            </v-btn>
                            <v-btn v-else>
                                {{ menu.title }}
                            </v-btn>                          
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>        
        </v-app-bar>
        
        <div class="fullheight pa-5">
            <router-view></router-view>
        </div>
    </div>
</template>


<script>
    export default {
        name: "Dashboard",
        data() {
            return {
                drawer: true,
                userNow: [],
                items: [
                    { title: "Dashboard", to: "/dashboard" },
                    { title: "Bahan", to: "/bahan" },
                    { title: "Customer", to: "/customer" },
                    { title: "Karyawan", to: "/karyawan" },
                    { title: "Meja", to: "/meja" },
                    { title: "Menu", to: "/menu" },
                    { title: "Pesanan", to: "/pesanan" },
                    { title: "Reservasi", to: "/reservasi" },
                    { title: "Transaksi", to: "/transaksi" },
                ],
                menus: [
                    { title: 'Ubah Kata Sandi' },
                    { title: 'Keluar' },                    
      ],
               
            };
        },
        methods: {
            logout() {
                localStorage.removeItem('token')
                localStorage.removeItem('id')
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
        },
        mounted() {
            this.readDataUser();            
        },
    };
</script>

<style scoped>
    
</style>