<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref( '' )
const showOnline = ref( true )

const submitUser = () =>
{
  if ( username.value.trim() )
  {
    localStorage.setItem( 'username', username.value )
    localStorage.setItem( 'isOnline', showOnline.value )
    router.push( '/online-users' )
  }
}
</script>

<template>
  <div class="container">
    <div id="container">
      <h2>Enter Your Chat Name</h2>
      <input v-model="username" type="text" placeholder="Your Name" />

      <label>
        <input type="checkbox" v-model="showOnline" />
        <p>Show Online Status</p>
      </label>

      <button @click="submitUser">Continue</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 98vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
#container {
  text-align: center;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0);
  width: 300px;
  display: inline-flex;
  flex-direction: column;
}

label {
  display: inline-flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  margin: 0 3px;
}

input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  padding: 10px;
  cursor: pointer;
  background-color: #4CAF50;
  border-radius: 5px;
  border: 1px solid;
}
</style>