<template>
    <v-main class="laporan" v-if="load">
        <h3 class="pt-5 grey--text text-right font-weight-bold mr-15">Laporan</h3>

        <div class="fullheight px-15">
            <v-card>
                <v-card-title class="subheading font-weight-bold">                      
                    Pengeluaran                                                      
                </v-card-title>
                <v-card-text>
                        <v-container>
                            <v-row>
                               <v-col
                                    class="d-flex"
                                    cols="12"
                                    sm="3"
                                >
                                    <v-select
                                        v-model="form.pengeluaran"
                                        :items="tipePengeluaran"
                                        label="Format Laporan"
                                        v-on:change="yearOnly()" 
                                        outlined                                
                                        required                                        
                                        prepend-icon="mdi-file">
                                    </v-select>   
                                </v-col>
                                <v-col
                                    class="d-flex"
                                    cols="12"
                                    sm="3"
                                    v-if="form.pengeluaran != null"
                                >                                   
                                    <v-text-field
                                        class="centered-input"
                                        v-model="form.thn1"
                                        label="Tahun"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        outlined
                                        append-icon="mdi-plus"
                                        prepend-inner-icon="mdi-minus"
                                        @click:append="form.thn1 = increment(form.thn1)"
                                        @click:prepend-inner="form.thn1 = decrement(form.thn1)"                                                                              
                                    ></v-text-field>
                                </v-col>
                                
                                <v-col
                                    class="d-flex"
                                    cols="12"
                                    sm="3"
                                    v-if="form.pengeluaran == 'Tahunan'"
                                >
                                <h1 class="mr-6">-</h1>                                  
                                    <v-text-field
                                        class="centered-input"
                                        v-model="form.thn2"
                                        label="Tahun"                                            
                                        readonly
                                        outlined                                       
                                        append-icon="mdi-plus"
                                        prepend-inner-icon="mdi-minus"
                                        @click:append="form.thn2 = increment(form.thn2)"
                                        @click:prepend-inner="form.thn2 = decrement(form.thn2)"
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                    class="d-flex"
                                    cols="12"
                                    sm="3"
                                    v-if="form.pengeluaran != null"
                                >
                                    <v-btn  class="mt-2" color="#003249" dark @click="pengeluaran">
                                        Tampil
                                    </v-btn>        
                                </v-col>
                            </v-row>                                                                                                                                                                                                                                                                                                                                                                                       
                        </v-container>
                    </v-card-text>                     
            </v-card>

            <v-card class="mt-7">
                <v-card-title class="subheading font-weight-bold">                      
                    Pendapatan                                                      
                </v-card-title>
                <v-card-text>
                        <v-container>
                            <v-row>
                               <v-col
                                    class="d-flex"
                                    cols="12"
                                    sm="3"
                                >
                                    <v-select
                                        v-model="form.pendapatan"
                                        :items="tipePengeluaran"
                                        label="Format Laporan"
                                        v-on:change="yearOnlyPendapatan()" 
                                        outlined                                
                                        required                                        
                                        prepend-icon="mdi-file">
                                    </v-select>   
                                </v-col>
                                <v-col
                                    class="d-flex"
                                    cols="12"
                                    sm="3"
                                    v-if="form.pendapatan != null"
                                >                                   
                                    <v-text-field
                                        class="centered-input"
                                        v-model="form.thn1p"
                                        label="Tahun"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        outlined
                                        append-icon="mdi-plus"
                                        prepend-inner-icon="mdi-minus"
                                        @click:append="form.thn1p = increment(form.thn1p)"
                                        @click:prepend-inner="form.thn1p = decrement(form.thn1p)"                                                                              
                                    ></v-text-field>
                                </v-col>
                                
                                <v-col
                                    class="d-flex"
                                    cols="12"
                                    sm="3"
                                    v-if="form.pendapatan == 'Tahunan'"
                                >
                                <h1 class="mr-6">-</h1>                                   
                                    <v-text-field
                                        class="centered-input"
                                        v-model="form.thn2p"
                                        label="Tahun"                                            
                                        readonly
                                        outlined                                       
                                        append-icon="mdi-plus"
                                        prepend-inner-icon="mdi-minus"
                                        @click:append="form.thn2p = increment(form.thn2p)"
                                        @click:prepend-inner="form.thn2p = decrement(form.thn2p)"
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                    class="d-flex"
                                    cols="12"
                                    sm="3"
                                    v-if="form.pendapatan != null"
                                >
                                    <v-btn  class="mt-2" color="#003249" dark @click="pendapatan">
                                        Tampil
                                    </v-btn>        
                                </v-col>
                            </v-row>                                                                                                                                                                                                                                                                                                                                                                                       
                        </v-container>
                    </v-card-text>                     
            </v-card>

            <v-card class="mt-7">
                <v-card-title class="subheading font-weight-bold">                      
                    Stok Bahan                                                      
                </v-card-title>
                <v-card-text>
                        <v-container>
                            <v-row>
                               <v-col
                                    class="d-flex"
                                    cols="12"
                                    sm="3"
                                >
                                    <v-select
                                        v-model="form.stok"
                                        :items="tipeStok"
                                        label="Format Laporan"
                                        v-on:change="dateStok()" 
                                        outlined                                
                                        required                                        
                                        prepend-icon="mdi-file">
                                    </v-select>   
                                </v-col>
                                <v-col
                                    class="d-flex"
                                    cols="12"
                                    sm="3"
                                    v-if="form.stok != null"
                                >                                                                       
                                    <v-menu                                        
                                        v-model="menu"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="auto"
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="form.thn1s"
                                            label="Tanggal"                                            
                                            readonly
                                            outlined
                                            prepend-icon="mdi-calendar"
                                            v-bind="attrs"
                                            v-on="on"
                                        ></v-text-field>
                                        </template>
                                        <v-date-picker
                                            v-if="form.stok == 'Custom'"                                           
                                            v-model="form.thn1s"
                                            @input="menu = false"
                                            min='2021-01-01'                                                                                        
                                        ></v-date-picker>
                                        <v-date-picker
                                            v-else                                            
                                            v-model="form.thn1s"
                                            @input="menu = false"
                                            type="month"
                                            min='2021-01'
                                        ></v-date-picker>
                                    </v-menu>   
                                </v-col>
                                
                                <v-col
                                    class="d-flex"
                                    cols="12"
                                    sm="3"
                                    
                                >
                                <h1 class="mr-6"  v-if="form.stok == 'Custom'">-</h1>                                   
                                    <v-menu
                                        v-if="form.stok == 'Custom'"                                        
                                        v-model="menu2"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="auto"
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="form.thn2s"
                                            label="Tanggal"                                            
                                            readonly
                                            outlined
                                            v-bind="attrs"
                                            v-on="on"
                                        ></v-text-field>
                                        </template>
                                        <v-date-picker                                            
                                            v-model="form.thn2s"
                                            @input="menu2 = false"
                                            min='2021-01-01'                                                                                        
                                        ></v-date-picker>
                                    </v-menu>
                                    <v-select
                                        v-else-if="form.stok == 'Month Year'"
                                        v-model="form.pilMenu"
                                        :items="menuOptions"
                                        item-text="nama_menu"
                                        item-value="nama_menu"
                                        label="Menu" 
                                        outlined                                        
                                        required
                                        prepend-icon="mdi-food">
                                    </v-select>
                                </v-col>
                                <v-col
                                    class="d-flex"
                                    cols="12"
                                    sm="3"
                                    v-if="form.stok != null"
                                >
                                    <v-btn  class="mt-2" color="#003249" dark @click="stok">
                                        Tampil
                                    </v-btn>        
                                </v-col>
                            </v-row>                                                                                                                                                                                                                                                                                                                                                                                       
                        </v-container>
                    </v-card-text>                     
            </v-card>

            <v-card class="mt-7">
                <v-card-title class="subheading font-weight-bold">                      
                    Penjualan Item Menu                                                      
                </v-card-title>
                <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col
                                    class="d-flex"
                                    cols="12"
                                    sm="3"                                    
                                >                                   
                                    <v-text-field
                                        class="centered-input"
                                        v-model="form.thnjual"
                                        label="Tahun"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        outlined
                                        append-icon="mdi-plus"
                                        prepend-inner-icon="mdi-minus"
                                        @click:append="form.thnjual = increment(form.thnjual)"
                                        @click:prepend-inner="form.thnjual = decrement(form.thnjual)"                                                                              
                                    ></v-text-field>
                                </v-col>
                               <v-col
                                    class="d-flex"
                                    cols="12"
                                    sm="3"
                                >
                                <h1 class="mr-6">/</h1> 
                                    <v-select
                                        v-model="form.blnjual"
                                        :items="bulan"
                                        label="Bulan"
                                        v-on:change="bulanPil(form.blnjual)"                                        
                                        outlined                                
                                        required>
                                    </v-select>   
                                </v-col>                                                                                            
                                <v-col
                                    class="d-flex"
                                    cols="12"
                                    sm="3"                                    
                                >
                                    <v-btn  class="mt-2" color="#003249" dark @click="penjualan">
                                        Tampil
                                    </v-btn>        
                                </v-col>
                            </v-row>                                                                                                                                                                                                                                                                                                                                                                                       
                        </v-container>
                    </v-card-text>                     
            </v-card>
        </div>

        <v-dialog v-model="dialogPbln" persistent max-width="700px">
            <v-card 
                class="mx-auto"                                                       
                max-width="700">
                <v-card-title>  
                    <v-btn color="#003249" text @click="print()">
                        <v-icon x-large>mdi-printer</v-icon>
                    </v-btn>                                                          
                <v-spacer></v-spacer>
                    <v-btn color="#810000" text @click="cancel">
                        <v-icon x-large>mdi-close-circle</v-icon>
                    </v-btn>   
                </v-card-title>                
                <div id="print">
                    <v-img
                        class="mx-auto"
                        max-height="400"
                        max-width="500" 
                        :src="header"                                                    
                    ></v-img>
                    <span class="font-weight-bold">--------------------------------------------------------------------------------------------------------</span>
                    <h6 class="mt-2 font-weight-bold">LAPORAN {{ formTitle }}</h6>
                    <v-row class="ml-2 mt-2">
                        <v-col sm="1"></v-col>
                        <v-col sm="3">
                            <h6 v-if="formTitle === 'PENGELUARAN BULANAN'" class="text-left">
                                TAHUN: {{ form.thn1 }}
                            </h6>
                            <h6 v-else class="text-left">
                                TAHUN: {{ form.thn1p }}
                            </h6>                            
                        </v-col>                    
                        <v-col ></v-col>
                    </v-row>
                    <span class="font-weight-bold">_______________________________________________________________</span> 
                    <v-simple-table class="mx-16">
                        <template v-slot:default>
                        <thead>
                            <tr>
                            <th class="text-left">
                                No
                            </th>
                            <th class="text-left">
                                Bulan
                            </th>
                            <th class="text-left">
                                Makanan
                            </th>
                            <th class="text-left">
                                Sidedish
                            </th>
                            <th class="text-left">
                                Minuman
                            </th>
                            <th v-if="formTitle === 'PENGELUARAN BULANAN'" class="text-left">
                                Total Pengeluaran
                            </th>
                            <th v-else class="text-left">
                                Total Pendapatan
                            </th>
                            </tr>
                        </thead>
                        <tbody v-if="formTitle === 'PENGELUARAN BULANAN'">
                            <tr
                            v-for="item in laporanPengeluaranBln"
                            :key="item.no"                            
                            >
                            <td class="text-left">{{ item.no }}</td>
                            <td class="text-left">{{ item.bulan }}</td>
                            <td class="text-left">{{ item.makanan }}</td>
                            <td class="text-left">{{ item.sidedish }}</td>
                            <td class="text-left">{{ item.minuman }}</td>
                            <td class="text-left">{{ item.total_pengeluaran }}</td>                            
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr
                            v-for="item in laporanPendapatanBln"
                            :key="item.no"                            
                            >
                            <td class="text-left">{{ item.no }}</td>
                            <td class="text-left">{{ item.bulan }}</td>
                            <td class="text-left">{{ item.makanan }}</td>
                            <td class="text-left">{{ item.sidedish }}</td>
                            <td class="text-left">{{ item.minuman }}</td>
                            <td class="text-left">{{ item.total_pendapatan }}</td>                            
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                    <span class="font-weight-bold">_______________________________________________________________</span> 
                    <v-card-text>
                        Printed {{ dtNow }}
                        <br>
                        Printed by {{ userNow.nama_karyawan }}
                    </v-card-text>                    
                </div> 
                
            </v-card>        
        </v-dialog>  

        <v-dialog v-model="dialogPthn" persistent max-width="700px">
            <v-card 
                class="mx-auto"                                                       
                max-width="700">
                <v-card-title>  
                    <v-btn color="#003249" text @click="printthn()">
                        <v-icon x-large>mdi-printer</v-icon>
                    </v-btn>                                                          
                <v-spacer></v-spacer>
                    <v-btn color="#810000" text @click="cancel">
                        <v-icon x-large>mdi-close-circle</v-icon>
                    </v-btn>   
                </v-card-title>                
                <div id="printthn">
                    <v-img
                        class="mx-auto"
                        max-height="400"
                        max-width="500" 
                        :src="header"                                                    
                    ></v-img>
                    <span class="font-weight-bold">--------------------------------------------------------------------------------------------------------</span>
                    <h6 class="mt-2 font-weight-bold">LAPORAN {{ formTitle }}</h6>
                    <v-row class="ml-2 mt-2">
                        <v-col sm="1"></v-col>
                        <v-col sm="4">
                            <h6 v-if="formTitle === 'PENGELUARAN TAHUNAN'" class="text-left">
                                TAHUN: {{ form.thn1 }} s/d {{ form.thn2 }}
                            </h6>
                            <h6 v-else class="text-left">
                                TAHUN: {{ form.thn1p }} s/d {{ form.thn2p }}
                            </h6>                            
                        </v-col>                    
                        <v-col ></v-col>
                    </v-row>
                    <span class="font-weight-bold">_______________________________________________________________</span> 
                    <v-simple-table class="mx-16">
                        <template v-slot:default>
                        <thead>
                            <tr>
                            <th class="text-left">
                                No
                            </th>
                            <th class="text-left">
                                Tahun
                            </th>
                            <th class="text-left">
                                Makanan
                            </th>
                            <th class="text-left">
                                Sidedish
                            </th>
                            <th class="text-left">
                                Minuman
                            </th>
                            <th v-if="formTitle === 'PENGELUARAN TAHUNAN'" class="text-left">
                                Total Pengeluaran
                            </th>
                            <th v-else class="text-left">
                                Total Pendapatan
                            </th>
                            </tr>
                        </thead>
                        <tbody v-if="formTitle === 'PENGELUARAN TAHUNAN'">
                            <tr
                            v-for="item in laporanPengeluaranThn"
                            :key="item.no"                            
                            >
                            <td class="text-left">{{ item.no }}</td>
                            <td class="text-left">{{ item.tahun }}</td>
                            <td class="text-left">{{ item.makanan }}</td>
                            <td class="text-left">{{ item.sidedish }}</td>
                            <td class="text-left">{{ item.minuman }}</td>
                            <td class="text-left">{{ item.total_pengeluaran }}</td>                            
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr
                            v-for="item in laporanPendapatanThn"
                            :key="item.no"                            
                            >
                            <td class="text-left">{{ item.no }}</td>
                            <td class="text-left">{{ item.tahun }}</td>
                            <td class="text-left">{{ item.makanan }}</td>
                            <td class="text-left">{{ item.sidedish }}</td>
                            <td class="text-left">{{ item.minuman }}</td>
                            <td class="text-left">{{ item.total_pendapatan }}</td>                            
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                    <span class="font-weight-bold">_______________________________________________________________</span> 
                    <v-card-text>
                        Printed {{ dtNow }}
                        <br>
                        Printed by {{ userNow.nama_karyawan }}
                    </v-card-text>                   
                </div> 
                
            </v-card>            
        </v-dialog>

        <v-dialog v-model="dialogPenjualan" persistent max-width="700px">
            <v-card 
                class="mx-auto"                                                       
                max-width="700">
                <v-card-title>  
                    <v-btn color="#003249" text @click="printx()">
                        <v-icon x-large>mdi-printer</v-icon>
                    </v-btn>                                                          
                <v-spacer></v-spacer>
                    <v-btn color="#810000" text @click="cancel">
                        <v-icon x-large>mdi-close-circle</v-icon>
                    </v-btn>   
                </v-card-title>                
                <div id="printx">
                    <v-img
                        class="mx-auto"
                        max-height="400"
                        max-width="500" 
                        :src="header"                                                    
                    ></v-img>
                    <span class="font-weight-bold">--------------------------------------------------------------------------------------------------------</span>
                    <h6 class="mt-2 font-weight-bold">LAPORAN {{ formTitle }}</h6>
                    <v-row class="ml-2 mt-2">
                        <v-col sm="1"></v-col>
                        <v-col sm="4">
                            <h6 class="text-left">
                                TAHUN: {{ form.thnjual }} 
                            </h6>
                            <h6 class="text-left text-uppercase">
                                BULAN: {{ form.blnjual }}
                            </h6>                            
                        </v-col>                    
                        <v-col ></v-col>
                    </v-row>                    
                    <div 
                        v-for="menu in menuTipe"
                        :key="menu.nama">
                        <span class="font-weight-bold">_______________________________________________________________</span>
                        <v-row class="ml-2">
                            <v-col sm="1"></v-col>
                            <v-col sm="4">
                                <h6 class="text-left font-weight-bold text-uppercase">
                                    {{menu.nama}}                                    
                                </h6>                                                        
                            </v-col>                    
                            <v-col ></v-col>
                        </v-row>
                        <v-simple-table class="mx-16">
                            <template v-slot:default>
                            <thead>
                                <tr>
                                <th class="text-left">
                                    No
                                </th>
                                <th class="text-left">
                                    Item Menu
                                </th>
                                <th class="text-left">
                                    Unit
                                </th>
                                <th class="text-left">
                                    Penjualan Harian Tertinggi
                                </th>
                                <th class="text-left">
                                    Total Penjualan
                                </th>                                
                                </tr>
                            </thead>
                            <tbody v-if="form.blnjual != 'All'">
                                <tr
                                v-for="item in laporanPenjualanOne"
                                :key="item.item_menu"                                                            
                                >
                                <td class="text-left" v-if="item.tipe === menu.nama">{{ item.no }}</td>
                                <td class="text-left" v-if="item.tipe === menu.nama">{{ item.item_menu }}</td>
                                <td class="text-left" v-if="item.tipe === menu.nama">{{ item.unit }}</td>
                                <td class="text-left" v-if="item.tipe === menu.nama">{{ item.penjualan_harian_tertinggi }}</td>
                                <td class="text-left" v-if="item.tipe === menu.nama">{{ item.total_penjualan }}</td>                                      
                                </tr> 
                            </tbody>
                            <tbody v-else>
                                <tr
                                v-for="item in laporanPenjualanAll"
                                :key="item.item_menu"                                                            
                                >
                                <td class="text-left" v-if="item.tipe === menu.nama">{{ item.no }}</td>
                                <td class="text-left" v-if="item.tipe === menu.nama">{{ item.item_menu }}</td>
                                <td class="text-left" v-if="item.tipe === menu.nama">{{ item.unit }}</td>
                                <td class="text-left" v-if="item.tipe === menu.nama">{{ item.penjualan_harian_tertinggi }}</td>
                                <td class="text-left" v-if="item.tipe === menu.nama">{{ item.total_penjualan }}</td>                                      
                                </tr> 
                            </tbody>                        
                            </template>
                        </v-simple-table>
                    </div>
                    <span class="font-weight-bold">_______________________________________________________________</span>                    
                    <v-card-text>
                        Printed {{ dtNow }}
                        <br>
                        Printed by {{ userNow.nama_karyawan }}
                    </v-card-text>                                       
                </div> 
                
            </v-card>            
        </v-dialog>

        <v-dialog v-model="dialogStok" persistent max-width="700px">
            <v-card
                v-if="form.stok == 'Custom'"
                class="mx-auto"                                                       
                max-width="700">
                <v-card-title>  
                    <v-btn color="#003249" text @click="prints()">
                        <v-icon x-large>mdi-printer</v-icon>
                    </v-btn>                                                          
                <v-spacer></v-spacer>
                    <v-btn color="#810000" text @click="cancel">
                        <v-icon x-large>mdi-close-circle</v-icon>
                    </v-btn>   
                </v-card-title>                
                <div id="prints">
                    <v-img
                        class="mx-auto"
                        max-height="400"
                        max-width="500" 
                        :src="header"                                                    
                    ></v-img>
                    <span class="font-weight-bold">--------------------------------------------------------------------------------------------------------</span>
                    <h6 class="mt-2 font-weight-bold">LAPORAN {{ formTitle }}</h6>
                    <v-row class="ml-2 mt-2">
                        <v-col sm="1"></v-col>
                        <v-col sm="8">
                            <h6 class="text-left">
                                ITEM MENU: ALL
                            </h6>
                            <h6 class="text-left text-uppercase">
                                PERIODE: CUSTOM ({{ form.thn1s }} s/d {{ form.thn2s }})
                            </h6>                            
                        </v-col>                    
                        <v-col ></v-col>
                    </v-row>                    
                    <div 
                        v-for="menu in menuTipe"
                        :key="menu.nama">
                        <span class="font-weight-bold">_______________________________________________________________</span>
                        <v-row class="ml-2">
                            <v-col sm="1"></v-col>
                            <v-col sm="4">
                                <h6 class="text-left font-weight-bold text-uppercase">
                                    {{menu.nama}}                                    
                                </h6>                                                        
                            </v-col>                    
                            <v-col ></v-col>
                        </v-row>
                        <v-simple-table class="mx-16">
                            <template v-slot:default>
                            <thead>
                                <tr>
                                <th class="text-left">
                                    No
                                </th>
                                <th class="text-left">
                                    Item Menu
                                </th>
                                <th class="text-left">
                                    Unit
                                </th>
                                <th class="text-left">
                                    Incoming Stock
                                </th>
                                <th class="text-left">
                                    Remaining Stock
                                </th>
                                <th class="text-left">
                                    Waste Stock
                                </th>                                
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                v-for="item in laporanStokCustom"
                                :key="item.item_menu"                                                            
                                >
                                <td class="text-left" v-if="item.tipe === menu.nama">{{ item.no }}</td>
                                <td class="text-left" v-if="item.tipe === menu.nama">{{ item.item_menu }}</td>
                                <td class="text-left" v-if="item.tipe === menu.nama">{{ item.unit }}</td>
                                <td class="text-left" v-if="item.tipe === menu.nama">{{ item.incoming_stock }}</td>
                                <td class="text-left" v-if="item.tipe === menu.nama">{{ item.remaining_stock }}</td>                                      
                                <td class="text-left" v-if="item.tipe === menu.nama">{{ item.waste_stock }}</td>                                      
                                </tr> 
                            </tbody>                        
                            </template>
                        </v-simple-table>
                    </div>
                    <span class="font-weight-bold">_______________________________________________________________</span>                    
                    <v-card-text>
                        Printed {{ dtNow }}
                        <br>
                        Printed by {{ userNow.nama_karyawan }}
                    </v-card-text>                                       
                </div>                 
            </v-card>

            <v-card
                v-else
                class="mx-auto"                                                       
                max-width="700">
                <v-card-title>  
                    <v-btn color="#003249" text @click="prints()">
                        <v-icon x-large>mdi-printer</v-icon>
                    </v-btn>                                                          
                <v-spacer></v-spacer>
                    <v-btn color="#810000" text @click="cancel">
                        <v-icon x-large>mdi-close-circle</v-icon>
                    </v-btn>   
                </v-card-title>                
                <div id="prints">
                    <v-img
                        class="mx-auto"
                        max-height="400"
                        max-width="500" 
                        :src="header"                                                    
                    ></v-img>
                    <span class="font-weight-bold">--------------------------------------------------------------------------------------------------------</span>
                    <h6 class="mt-2 font-weight-bold">LAPORAN {{ formTitle }}</h6>
                    <v-row class="ml-2 mt-2">
                        <v-col sm="1"></v-col>
                        <v-col sm="8">
                            <h6 class="text-left">
                                ITEM MENU: {{ form.pilMenu }}
                            </h6>
                            <h6 class="text-left text-uppercase">
                                PERIODE: {{ convertMonth() }}
                            </h6>                            
                        </v-col>                    
                        <v-col ></v-col>
                    </v-row>                    
                    <span class="font-weight-bold">_______________________________________________________________</span> 
                    <v-simple-table class="mx-16">
                        <template v-slot:default>
                        <thead>
                            <tr>
                            <th class="text-left">
                                No
                            </th>
                            <th class="text-left">
                                Tanggal
                            </th>
                            <th class="text-left">
                                Unit
                            </th>
                            <th class="text-left">
                                Incoming Stock
                            </th>
                            <th class="text-left">
                                Remaining Stock
                            </th>
                            <th class="text-left">
                                Waste Stock
                            </th>                           
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="item in laporanStokMY"
                            :key="item.no"                            
                            >
                            <td class="text-left">{{ item.no }}</td>
                            <td class="text-left">{{ item.tanggal }}</td>
                            <td class="text-left">{{ item.unit }}</td>
                            <td class="text-left">{{ item.incoming_stock }}</td>
                            <td class="text-left">{{ item.remaining_stock }}</td>
                            <td class="text-left">{{ item.waste_stock }}</td>                            
                            </tr>
                        </tbody>                        
                        </template>
                    </v-simple-table>
                    <span class="font-weight-bold">_______________________________________________________________</span>                    
                    <v-card-text>
                        Printed {{ dtNow }}
                        <br>
                        Printed by {{ userNow.nama_karyawan }}
                    </v-card-text>                                       
                </div> 
                
            </v-card>            
        </v-dialog>                    

            <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
                {{error_message}}
            </v-snackbar>
    </v-main>
</template>


<script>
    import html2PDF from 'jspdf-html2canvas'
    export default {
        name: "laporan",
        data() {
            return {  
                header: require('@/assets/header_laporannew.png'),              
                load: false,
                inputType: '',                                
                dtNow: null,                
                snackbar: false,
                error_message: '',
                color: '',
                dialogPbln: false,
                dialogPthn: false,
                dialogPenjualan: false,                                                                             
                dialogStok: false, 
                userNow: [],
                laporanPengeluaranBln: [],
                laporanPendapatanBln: [],
                laporanPengeluaranThn: [],
                laporanPendapatanThn: [],
                laporanPenjualanOne: [],
                laporanPenjualanAll: [],
                laporanStokCustom: [],
                laporanStokMY: [],
                menu: false,
                menu2: false,
                menuTipe: [
                    { nama: 'Makanan Utama' },
                    { nama: 'Sidedish' },
                    { nama: 'Minuman' }
                ],
                form: {
                    pengeluaran: 'Bulanan',
                    pendapatan: 'Bulanan',
                    stok: 'Month Year',
                    thn1: null,
                    thn2: null,
                    thn1p: null,
                    thn2p: null,
                    thnjual: null,
                    blnjual: null,
                    noBln: null,
                    thn1s: null,
                    thn2s: null,
                    pilMenu: null,
                },
                tipePengeluaran: ['Bulanan', 'Tahunan'],
                tipeStok: ['Custom', 'Month Year'],
                menuOptions: [],
                bulan: ['All', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September',
                    'Oktober', 'November', 'Desember'],                                                                                                             
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
                    this.menuOptions = response.data.data
                })
            },
            readPengeluaranBln() {
                var url = this.$api + '/laporan_pengeluaran_bulanan/' + this.form.thn1
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                    this.laporanPengeluaranBln = response.data.data
                })
            },
            readPendapatanBln() {
                var url = this.$api + '/laporan_pendapatan_bulanan/' + this.form.thn1p
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                    this.laporanPendapatanBln = response.data.data
                })
            },
            readPengeluaranThn() {
                var url = this.$api + '/laporan_pengeluaran_tahunan/' + this.form.thn1 + '_' + this.form.thn2
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                    this.laporanPengeluaranThn = response.data.data
                })
            },
            readPendapatanThn() {
                var url = this.$api + '/laporan_pendapatan_tahunan/' + this.form.thn1p + '_' + this.form.thn2p
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                    this.laporanPendapatanThn = response.data.data
                })
            },
            readPenjualanOne() {
                var date;
                if (this.form.noBln >= 10) {
                    date = this.form.thnjual + '-' + this.form.noBln
                } else {
                    date = this.form.thnjual + '-0' + this.form.noBln
                }
                var url = this.$api + '/laporan_penjualan_one/' + date
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                    this.laporanPenjualanOne = response.data.data
                })
            },
            readPenjualanAll() {                
                var url = this.$api + '/laporan_penjualan_all/' + this.form.thnjual
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                    this.laporanPenjualanAll = response.data.data                    
                })
            },
            readStokCustom() {                
                var url = this.$api + '/laporan_bahan_custom/' + this.form.thn1s + '_' + this.form.thn2s
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                    this.laporanStokCustom = response.data.data
                })
            },
            readStokMY() {                
                var url = this.$api + '/laporan_bahan_my/' + this.form.pilMenu + '_' + this.form.thn1s
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    console.log(response)                    
                    this.laporanStokMY = response.data.data
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
            pengeluaran(){  
                this.now();               
                if (this.form.pengeluaran === 'Bulanan') {                    
                    this.inputType = 'PENGELUARAN BULANAN';   
                    this.dialogPbln = true;
                    this.readPengeluaranBln();
                } else {
                    if (this.form.thn1 <= this.form.thn2) {
                        this.inputType = 'PENGELUARAN TAHUNAN';
                        this.dialogPthn = true;
                        this.readPengeluaranThn();
                    } else {
                        this.error_message = "Jarak Tahun Salah";
                        this.color="red"
                        this.snackbar=true;
                    }                    
                }                
            },
            pendapatan(){ 
                this.now();                                               
                if (this.form.pendapatan === 'Bulanan') {
                    this.inputType = 'PENDAPATAN BULANAN';    
                    this.dialogPbln = true;
                    this.readPendapatanBln();
                } else {
                    if (this.form.thn1p <= this.form.thn2p) {
                        this.inputType = 'PENDAPATAN TAHUNAN';    
                        this.dialogPthn = true;
                        this.readPendapatanThn();
                    } else { 
                        this.error_message = "Jarak Tahun Salah";
                        this.color="red"
                        this.snackbar=true;
                    }                    
                }
            },
            penjualan(){                                                                
                this.inputType = 'PENJUALAN ITEM MENU';    
                this.dialogPenjualan = true;
                this.now();
                if (this.form.blnjual === 'All') {
                    this.readPenjualanAll();                                                                
                } else {
                    this.readPenjualanOne();                                            
                }                
            },
            stok(){                                                                                
                this.now();
                if (this.form.stok === 'Custom') {
                    if (this.form.thn1s <= this.form.thn2s) {
                        this.inputType = 'STOK BAHAN';    
                        this.dialogStok = true;
                        this.readStokCustom();                                            
                    } else { 
                        this.error_message = "Jarak Tanggal Salah";
                        this.color="red"
                        this.snackbar=true;
                    }                    
                } else {
                    if (this.form.pilMenu != null) {
                        this.inputType = 'STOK BAHAN';    
                        this.dialogStok = true;
                        this.readStokMY();
                    } else { 
                        this.error_message = "Menu Belum Dipilih";
                        this.color="red"
                        this.snackbar=true;
                    }                    
                }                
            },            
            cancel() {                                                                                                    
                this.dialogPbln = false;
                this.dialogPthn = false;
                this.dialogPenjualan = false;
                this.dialogStok = false;
                this.inputType = '';                                    
            },
            penjualanYM() {
                var today = new Date();                
                this.form.thnjual = today.getFullYear();
                this.form.noBln = (today.getMonth()+1);                
            },
            bulanNow() {
               for (let i = 1; i <= this.bulan.length; i++) {                   
                   if (i === this.form.noBln ) {                        
                        return this.form.blnjual = this.bulan[i];
                   }
               } 
            },
            bulanPil(bln) {
               for (let i = 1; i <= this.bulan.length; i++) {                   
                    if (bln === this.bulan[i] ) {                                             
                        return this.form.noBln = i;
                   }
               } 
            },
            yearOnly() {
                var today = new Date();                                                                                
                this.form.thn1 = today.getFullYear();
                this.form.thn2 = (today.getFullYear()+1);
            },
            yearOnlyPendapatan() {
                var today = new Date();
                this.form.thn1p = today.getFullYear();
                this.form.thn2p = (today.getFullYear()+1);
            },
            dateStok() {
                var today = new Date();
                var date;                
                var date2;
                var x = today.getMonth()+1;                
                if (x >= 10) {
                    date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    date2 = today.getFullYear()+'-'+(today.getMonth()+1);
                } else {
                    date = today.getFullYear()+'-0'+(today.getMonth()+1)+'-'+today.getDate();
                    date2 = today.getFullYear()+'-0'+(today.getMonth()+1);
                }
                if (this.form.stok == 'Custom') {
                    this.form.thn1s = date;                
                } else {
                    this.form.thn1s = date2;                
                }                              
                this.form.thn2s = date;
            },
            now() {                
                var today = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta", hour12: false}) 
                this.dtNow = today;
            },            
            increment(x) {
                return x = x + 1;
            },
            decrement(x) {
                x = x - 1;
                if (x >= 2021) {
                    return x
                } else
                    return 2021
            },
            print(){
                let print = document.getElementById("print");
                html2PDF(print, {
                    jsPDF: { 
                        format: "a4", },
                    html2canvas: { 
                        scrollX : 0, 
                        scrollY : 0 },
                    margin: {
                        top: 20,
                        right: 0,
                        bottom: 20,
                        left: 0,
                    },
                    output : 'AKB LAPORAN '+ this.formTitle + '.pdf'
                });
            },
            printthn(){
                let print = document.getElementById("printthn");
                html2PDF(print, {
                    jsPDF: { 
                        format: "a4", },
                    html2canvas: { 
                        scrollX : 0, 
                        scrollY : 0 },
                    margin: {
                        top: 20,
                        right: 0,
                        bottom: 20,
                        left: 0,
                    },
                    output : 'AKB LAPORAN '+ this.formTitle + '.pdf'
                });
            },
            printx(){
                let print = document.getElementById("printx");
                html2PDF(print, {
                    jsPDF: { format: "a4", },
                    html2canvas: { 
                    scrollX : 0, 
                    scrollY : 0 },
                    output : 'AKB LAPORAN '+ this.formTitle + '.pdf'
                });
            },
            prints(){
                let print = document.getElementById("prints");
                html2PDF(print, {
                    jsPDF: { format: "a4", },
                    html2canvas: { 
                    scrollX : 0, 
                    scrollY : 0 },
                    margin: {
                        top: 20,
                        right: 0,
                        bottom: 20,
                        left: 0,
                    },
                    output : 'AKB LAPORAN '+ this.formTitle + '.pdf'
                });
            },
            convertMonth(){                
                var d = new Date(this.form.thn1s);
                
                var dt = this.bulan[d.getMonth()+1] +' '+ d.getFullYear();
                return dt
            }
        },        
        computed: {
            formTitle() {
                return this.inputType
            },            
        },
        mounted() { 
            this.readData();           
            this.penjualanYM();
            this.bulanNow();
            this.yearOnly();
            this.yearOnlyPendapatan();
            this.dateStok();
            this.readDataUser();            
        },
    };
</script>

<style>
    .centered-input input {
        text-align: center
    }
</style>

