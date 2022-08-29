<template>
  <div class="container">
    <sign-up />
  </div>
</template>

<script>
import SignUp from './pages/SignUp.vue'
export default {
  name: 'App',
  components: {
    SignUp
  }
}
</script>

<style scoped>
h1{
  color: red;
}
</style>
