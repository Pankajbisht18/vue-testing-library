<template>
    <div>
        <h1>Sign Up</h1>
        <form>
            <label for="username">Username</label>
            <input id="username" v-model="username">

            <label for="e-mail">E-mail</label>
            <input id="e-mail" v-model="email">

            <label for="password">Password</label>
            <input id="password" type="password" v-model="password">

            <label for="password-repeat">Password-Repeat</label>
            <input id="password-repeat" type="password" v-model="passwordRepeat">

            <button :disabled="isDisabled" @click.prevent="submit">Sign Up</button>
        </form>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name: "SignUpPage",
    data(){
        return{
            username: '',
            email: '',
            password: '',
            passwordRepeat: '',
        }
    },
    computed:{
        isDisabled(){
            return this.password && this.passwordRepeat ? this.password !== this.passwordRepeat : true
        }
    },
    methods:{
        submit(){
            const config = {
                headers: {'content-type': "application/json"}
            }
            axios.post('/api/1.0/users', {
                username: this.username,
                email: this.email,
                password: this.password
            },config)
        }
    }

}
</script>