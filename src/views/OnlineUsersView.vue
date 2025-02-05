<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useWebSocketStore } from '@/stores/websocket';

const onlineUsers = ref<{ name: string; isOnline: boolean }[]>( [] );
const router = useRouter();
const searchUser = ref( '' );

const username = localStorage.getItem( 'username' ) || '';
const isOnline = localStorage.getItem( 'isOnline' ) === 'true';

const websocketStore = useWebSocketStore();

const fetchOnlineUsers = () =>
{
    if ( websocketStore.isConnected )
    {
        websocketStore.sendMessage( { type: 'list' } );
    } else
    {
        console.error( 'WebSocket is not connected.' );
    }
};

onMounted( () =>
{
    websocketStore.connect();
    fetchOnlineUsers();
} );

onUnmounted( () =>
{
    websocketStore.disconnect();
} );

websocketStore.addMessageListener( ( data ) =>
{
    if ( data.type === 'list' )
    {
        onlineUsers.value = data.users;
    }
} );

const startChat = ( user: string ) =>
{
    router.push( `/chat/${user}` );
};
</script>

<template>
    <div class="container">
        <div id="container">
            <h2>Online Users</h2>
            <ul>
                <li v-for=" user in onlineUsers " :key="user.name" @click="startChat( user.name )"
                    :class="{ online: user.isOnline }">
                    {{ user.name }}
                    <span v-if=" user.isOnline ">(Online)</span>
                </li>
            </ul>
            <div id="end">
                <h3>Search for Hidden Users</h3>
                <input v-model="searchUser" type="text" placeholder="Enter hidden username" />
                <button @click="startChat( searchUser )">Chat</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.online {
    color: green;
}

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
