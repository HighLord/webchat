<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const onlineUsers = ref( [] )
const selectedUser = ref( '' )
const ws = new WebSocket( 'wss://github.webapps.com.ng/chat-server' )

ws.onmessage = ( event ) =>
{
    const data = JSON.parse( event.data )

    if ( Array.isArray( data ) )
    {
        // If received data is a list, update onlineUsers
        onlineUsers.value = data
    }
}

onMounted( () =>
{
    ws.onopen = () =>
    {
        ws.send( JSON.stringify( { type: 'list' } ) )  // Request the list
    }
} )

const startChat = ( user ) =>
{
    router.push( `/chat/${user}` )
}
</script>

<template>
    <div class="container">
        <div id="container">
            <h2>Online Users</h2>

            <ul>
                <li v-for=" user in onlineUsers " :key="user.name" @click="startChat( user.name )">
                    {{ user.name }} <span v-if=" !user.isOnline ">(Hidden)</span>
                </li>
            </ul>

            <div id="end">
            <input v-model="selectedUser" type="text" placeholder="Enter hidden user" />
            <button @click="startChat( selectedUser )">Chat</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    height: 98vh;
}
#container{
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0);
    margin: 20px;
    display: flex;
    flex-direction: column;
    height: 96%;
    background-color: rgb(4, 157, 124);
}
h2{
    text-align: center;
}
ul {
    list-style: none;
    padding: 0;
}

li {
    cursor: pointer;
    padding: 10px;
    border-bottom: 10px;
    border: 1px solid;
    margin: 5px;
    width: auto;
    background-color: aliceblue;
    width: 250px;
}
input{
    padding: 10px;
    border-radius: 5px;
    outline: none;
    border: none;
    width: 260px;
}
button{
    padding: 10px 30px;
    border-radius: 5px;
    outline: none;
    border: none;
}
</style>
