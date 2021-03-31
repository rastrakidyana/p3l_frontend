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
            component : importComponent ('DashboardLayout'),
            beforeEnter:(to, from, next)=>{
                if(!localStorage.getItem('token')){
                    next('/login');
                }else
                    next()
            },
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
                } ,
                {
                    path : "/meja",
                    name : "Meja",
                    meta: {title:'Atma Korean BBQ | Meja'},
                    component : importComponent ( 'Admin/Meja' ) ,
                } ,
                {
                    path : "/customer",
                    name : "Customer",
                    meta: {title:'Atma Korean BBQ | Customer'},
                    component : importComponent ( 'Admin/Customer' ) ,
                } ,
                {
                    path : "/reservasi",
                    name : "Reservasi",
                    meta: {title:'Atma Korean BBQ | Reservasi'},
                    component : importComponent ( 'Admin/Reservasi' ) ,
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
    next()
});

export default router ;