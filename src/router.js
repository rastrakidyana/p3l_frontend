import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent(path) {
    return () =>
        import (`./components/${path}.vue`)
}

Vue.use(VueRouter);

const router = new VueRouter ({
    mode : "history",
    routes : [{
            path : "/",
            name : "DashboardLayout",            
            meta : { requiresAuth: true },
            component : importComponent ('DashboardLayout'),
            // beforeEnter:(to, from, next)=>{
            //     if(!localStorage.getItem('token')){
            //         next('/dashboard');
            //     }else{                            
            //         next();
            //     }
            // },                       
            children : [                
                {   
                    path : "/dashboard",
                    name : "Dashboard",
                    meta: {title: 'Atma Korean BBQ | Dashboard'},
                    component : importComponent ('Dashboard') ,
                } ,                
                {
                    path : "/karyawan",
                    name : "Karyawan",
                    meta: {title:'Atma Korean BBQ | Karyawan'},
                    component : importComponent ( 'Admin/Karyawan' ) ,
                    beforeEnter:(to, from, next)=>{
                        if(localStorage.getItem('id_jabatan') == 1 || localStorage.getItem('id_jabatan') == 2 ){
                            next();
                        }else{                            
                            next({ name: 'Dashboard'});
                        }
                    },
                } ,
                {
                    path : "/meja",
                    name : "Meja",
                    meta: {title:'Atma Korean BBQ | Meja'},
                    component : importComponent ( 'Admin/Meja' ) ,
                    beforeEnter:(to, from, next)=>{
                        if(localStorage.getItem('id_jabatan') == 2 ){
                            next();
                        }else{                            
                            next({ name: 'Dashboard'});
                        }
                    },
                } ,
                {
                    path : "/customer",
                    name : "Customer",
                    meta: {title:'Atma Korean BBQ | Customer'},
                    component : importComponent ( 'Admin/Customer' ) ,
                    beforeEnter:(to, from, next)=>{
                        if(localStorage.getItem('id_jabatan') == 2 || localStorage.getItem('id_jabatan') == 3 || localStorage.getItem('id_jabatan') == 4){
                            next();
                        }else{                            
                            next({ name: 'Dashboard'});
                        }
                    },
                } ,
                {
                    path : "/reservasi",
                    name : "Reservasi",
                    meta: {title:'Atma Korean BBQ | Reservasi'},
                    component : importComponent ( 'Admin/Reservasi' ) ,
                    beforeEnter:(to, from, next)=>{
                        if(localStorage.getItem('id_jabatan') == 2 || localStorage.getItem('id_jabatan') == 3 || localStorage.getItem('id_jabatan') == 4){
                            next();
                        }else{                            
                            next({ name: 'Dashboard'});
                        }
                    },
                } ,
                {
                    path : "/bahan",
                    name : "Bahan",
                    meta: {title:'Atma Korean BBQ | Bahan'},
                    component : importComponent ( 'Admin/Bahan' ) ,
                    beforeEnter:(to, from, next)=>{
                        if(localStorage.getItem('id_jabatan') == 2 || localStorage.getItem('id_jabatan') == 5){
                            next();
                        }else{                            
                            next({ name: 'Dashboard'});
                        }
                    },
                } ,
                {
                    path : "/histori_bahan_masuk",
                    name : "Histori Bahan Masuk",
                    meta: {title:'Atma Korean BBQ | Histori Bahan Masuk'},
                    component : importComponent ( 'Admin/HistoriMasuk' ) ,
                    beforeEnter:(to, from, next)=>{
                        if(localStorage.getItem('id_jabatan') == 2 || localStorage.getItem('id_jabatan') == 5){
                            next();
                        }else{                            
                            next({ name: 'Dashboard'});
                        }
                    },
                } ,
                {
                    path : "/menu",
                    name : "Menu",
                    meta: {title:'Atma Korean BBQ | Menu'},
                    component : importComponent ( 'Admin/Menu' ) ,
                    beforeEnter:(to, from, next)=>{
                        if(localStorage.getItem('id_jabatan') == 2){
                            next();
                        }else{                            
                            next({ name: 'Dashboard'});
                        }
                    },
                } ,
                {
                    path : "/transaksi",
                    name : "Transaksi",
                    meta: {title:'Atma Korean BBQ | Transaksi'},
                    component : importComponent ( 'Admin/Transaksi' ) ,
                    beforeEnter:(to, from, next)=>{
                        if(localStorage.getItem('id_jabatan') == 2 || localStorage.getItem('id_jabatan') == 3){
                            next();
                        }else{                            
                            next({ name: 'Dashboard'});
                        }
                    },
                } ,
                {
                    path : "/pesanan",
                    name : "Pesanan",
                    meta: {title:'Atma Korean BBQ | Pesanan'},
                    component : importComponent ( 'Admin/Pesanan' ) ,
                    beforeEnter:(to, from, next)=>{
                        if(localStorage.getItem('id_jabatan') == 2 || localStorage.getItem('id_jabatan') == 4  || localStorage.getItem('id_jabatan') == 5){
                            next();
                        }else{                            
                            next({ name: 'Dashboard'});
                        }
                    },
                } ,
                {
                    path : "/kartu",
                    name : "Kartu",
                    meta: {title:'Atma Korean BBQ | Kartu Customer'},
                    component : importComponent ( 'Admin/Kartu' ) ,
                    beforeEnter:(to, from, next)=>{
                        if(localStorage.getItem('id_jabatan') == 2 || localStorage.getItem('id_jabatan') == 3){
                            next();
                        }else{                            
                            next({ name: 'Dashboard'});
                        }
                    },
                } ,
                {
                    path : "/laporan",
                    name : "Laporan",
                    meta: {title:'Atma Korean BBQ | Laporan'},
                    component : importComponent ( 'Admin/Laporan' ) ,
                    beforeEnter:(to, from, next)=>{
                        if(localStorage.getItem('id_jabatan') == 2 || localStorage.getItem('id_jabatan') == 1){
                            next();
                        }else{                            
                            next({ name: 'Dashboard'});
                        }
                    },
                } ,
                ]
            },        
            {
            path: "/login",
            name: "login",
            meta: {title: 'Atma Korean BBQ | Login'},
            component: importComponent('Login'),
            },
            {
                path: '*',
                redirect: '/'
            },
    ],
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('token') === null) {
            next({ name: 'login'})
        } else
            next()
    } else
        next()
});

export default router ;