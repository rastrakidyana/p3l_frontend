<template>
    <main class="login">
        <v-app-bar flat app fixed color="#003249">
            
        </v-app-bar>
        <v-container class="fullheight pa-5 letak">
            <v-layout flex align-center justify-center>
                <v-flex xs12 sm6 elevation-6>
                    <v-img
                        class="mx-auto" 
                        :src="logo"
                        max-height="150"
                        max-width="150"                            
                    ></v-img>
                    <v-card>
                        <v-card-title class="justify-center">                            
                            <span class="headline font-weight-bold">LOGIN</span>
                        </v-card-title>
                        <v-card-text class="pt-6">
                            <v-container>
                                <v-form ref="form">
                                    <v-text-field
                                        v-model="loginForm.email" 
                                        label="E-mail"                                                                                
                                        prepend-icon="mdi-email"
                                        :rules="emailRules"
                                        outlined
                                        required>
                                    </v-text-field>
                                    <v-text-field 
                                        v-model="loginForm.password"
                                        label="Password"                                         
                                        :type="show ? 'text' : 'password'"
                                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"                                                                                 
                                        :rules="passwordRules" 
                                        prepend-icon="mdi-lock"
                                        outlined
                                        @click:append="show = !show"
                                        required>
                                    </v-text-field>                                    
                                </v-form>
                            </v-container>
                        </v-card-text>
                        <v-card-actions class="justify-center">                                               
                            <v-btn color="#003249" dark @click="login">
                                Masuk
                            </v-btn>
                        </v-card-actions>    
                    </v-card>

                    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
                        {{error_message}}
                    </v-snackbar>
                                       
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<style>
    .letak {
        position: absolute;
        top: 140px;
        left: 0px;
        right: 0px;
    }
</style>

<script>
    export default {
        name: "Login",
        data() {
            return {
                logo: require('@/assets/akb_logo.png'),
                load: false,
                show: false,
                snackbar: false,
                error_message: '',
                color: '',                               
                loginForm: {
                    email: null,
                    password: null,
                },
                passwordRules: [
                    (v) => !!v || 'Password tidak boleh kosong',
                ],                
                emailRules: [
                    (v) => !!v || 'E-mail tidak boleh kosong',
                ],
            };
        },
        methods: {
            login() {        
                if (this.$refs.form.validate()) {
                    this.load=true
                    this.$http.post(this.$api+ '/login', {
                        email: this.loginForm.email,
                        password: this.loginForm.password,
                        }).then(response =>{
                            if (response.data.karyawan == null) {
                                this.error_message=response.data.message;
                                this.color="red"
                                this.snackbar=true;
                                this.resetForm();
                                this.load = false;                                
                            } else {
                                localStorage.setItem('id',response.data.karyawan.id);
                                localStorage.setItem('token',response.data.access_token);
                                localStorage.setItem('id_jabatan',response.data.karyawan.id_jabatan);
                                this.error_message=response.data.message;
                                this.color="green"
                                this.snackbar=true;                                
                                this.load = false;
                                this.clear()                            
                                this.$router.push({
                                    name: 'Dashboard'
                                })                                
                            }                            
                        }).catch(error => {
                            this.error_message=error.response.data.message; 
                            this.color="red" 
                            this.snackbar=true;
                            this.color="red" 
                            this.snackbar=true;                            
                            this.load = false                            
                            this.clear()                            
                        })
                }
            },            
            clear() {
                this.$refs.form.reset()
            }
        },
    };
</script>