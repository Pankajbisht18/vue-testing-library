<template>
    <div>
        <h1>Sign Up</h1>
        <label for="username">Username</label>
        <input id="username" />

        <label for="e-mail">E-mail</label>
        <input id="e-mail">

        <label for="password">Password</label>
        <input id="password" type="password" v-on:input="onChangePassword">

        <label for="password-repeat">Password-Repeat</label>
        <input id="password-repeat" type="password" v-on:input="onChangePasswordRepeat">

        <button v-bind:disabled="disabled">Sign Up</button>
    </div>
</template>
<script>
export default {
    name: "SignUpPage",
    data(){
        return{
            disabled: false,
            password: '',
            passwordRepeat: ''
        }
    },
    methods: {
        onChangePassword(event){
            this.password = event.target.value
            this.disabled = this.password !== this.passwordRepeat
        },
        onChangePasswordRepeat(event){
            this.passwordRepeat = event.target.value
            this.disabled = this.password !== this.passwordRepeat
        }
    }
}
</script>