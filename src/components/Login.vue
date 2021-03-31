<template>
    <main>
        <v-app-bar flat app fixed color="#003249">
            
        </v-app-bar>
        <v-container class="fullheight pa-5 posisinya">
            <v-layout flex align-center justify-center>
                <v-flex xs12 sm6 elevation-6>
                    <v-toolbar rounded class="mx-auto" width="150px" color="#810000">
                        <v-toolbar-title class="white--text mx-auto">
                            <h1>Login</h1>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card>
                        <v-card-text class="pt-6">
                            <v-container>
                                <v-form v-model="valid" ref="form">
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
                                        :type="show3 ? 'text' : 'password'"
                                        :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"                                        
                                        min="8" 
                                        :rules="passwordRules" 
                                        prepend-icon="mdi-lock"
                                        outlined
                                        @click:append="show3 = !show3"
                                        required>
                                    </v-text-field>                                    
                                </v-form>
                            </v-container>
                        </v-card-text>
                        <v-card-actions class="justify-center">                                               
                            <v-btn color="blue lighten-1" text @click="login">
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
    @import url("https://fonts.googleapis.com/css?family=Jolly%20Lodger");
    .white--text {
        font-family: "Jolly Lodger";
    }
    .posisinya {
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
                load: false,
                show3: false,
                snackbar: false,
                error_message: '',
                color: '',
                valid: false,                
                loginForm: {
                    email:this.email,
                    password:this.password,
                },
                passwordRules: [
                    (v) => !!v || 'Password tidak boleh kosong :(',
                ],                
                emailRules: [
                    (v) => !!v || 'E-mail tidak boleh kosong :(',
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
                            localStorage.setItem('id',response.data.karyawan.id);
                            localStorage.setItem('token',response.data.access_token);
                            this.error_message=response.data.message;

                            this.color="green"
                            this.snackbar=true;
                            this.load = false;                            
                            this.$router.push({
                                name: 'Dashboard'
                            })
                            this.resetForm();
                        }).catch(error => {
                            this.error_message=error.response.data.message; 
                            this.color="red" 
                            this.snackbar=true;
                            this.color="red" 
                            this.snackbar=true;
                            localStorage.removeItem('token')
                            this.load = false
                            this.resetForm();
                        })
                }
            },
            resetForm() {
                this.loginForm = {
                    email: null,
                    password: null,
                };
            },
            clear() {
                this.$refs.form.reset()
            }
        },
    };
</script>