<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useWebSocketStore } from '@/stores/websocket';
import { useUserStore } from '@/stores/userStore';

const onlineUsers = ref<{ name: string; isOnline: boolean }[]>( [] );
const offlineUsers = ref<{ name: string; isOnline: boolean }[]>( [] );
const router = useRouter();
const searchUser = ref( '' );
const websocketStore = useWebSocketStore();
const userStore = useUserStore();
const sender = userStore.username;

const fetchOnlineUsers = () =>
{
    if ( websocketStore.isConnected )
    {
        websocketStore.sendMessage( { type: 'list' } );
    }
    else
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
    //websocketStore.disconnect();
} );

websocketStore.addMessageListener( ( data ) =>
{
    if ( data.type === 'list' )
    {
        onlineUsers.value = data.users
            .filter( ( user ) => user.name !== sender && user.isOnline ) // Filter out the sender and include online users
            .map( ( user ) => ( {
                name: user.name,
                isOnline: user.isOnline
            } ) );

        offlineUsers.value = data.users
            .filter( ( user ) => user.name === sender || !user.isOnline ) // Offline users
            .map( ( user ) => ( {
                name: user.name,
                isOnline: user.isOnline
            } ) );

        setTimeout( () =>
        {
            websocketStore.sendMessage( { type: 'list' } );
        }, 1000 );
    }
} );

const startChat = ( user: string ) =>
{
    const userExists = [
        ...offlineUsers.value,
        ...onlineUsers.value
    ].some( ( u ) => u.name === user );
    
    if ( userExists )
    {
        // If the user exists, navigate to the chat page
        router.push( `/chat/${user}` );
    }
    else
    {
        // Show an alert if the user does not exist in either list
        alert( 'User not found.' );
    }
};
</script>

<template>
    <div class="container">
        <div id="container">
            <h2>Online Users</h2>
            <ul>
                <li v-for="   user in onlineUsers   " :key="user.name" @click="startChat( user.name )">
                    {{ user.name }}
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
.container {
    height: 98vh;
}

#container {
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0);
    margin: 20px;
    display: flex;
    flex-direction: column;
    height: 96%;
    background-color: rgb(4, 157, 124);
}

h2 {
    text-align: center;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    cursor: pointer;
    padding: 10px;
    border-bottom: 5px;
    border: 1px solid;
    margin: 5px;
    width: auto;
    font-size: 12px;
    background-color: aliceblue;
    width: 250px;
}

input {
    padding: 10px;
    border-radius: 5px;
    outline: none;
    border: none;
    width: 260px;
}

button {
    padding: 10px 30px;
    border-radius: 5px;
    outline: none;
    border: none;
}
</style>
