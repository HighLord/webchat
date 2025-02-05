<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const username = localStorage.getItem( 'username' )
const recipient = ref( route.params.username )
const messages = ref( [] )
const messageInput = ref( '' )
let ws

onMounted( () =>
{
    ws = new WebSocket( "wss://github.webapps.com.ng/chat-server" )

    ws.onopen = () =>
    {
        console.log( "Connected to WebSocket" )
        ws.send( JSON.stringify( {
            type: "identify",
            username: username.value,
            username: username.value,
            status: localStorage.getItem( 'isOnline') ? 'online' : 'hidden'
        } ) )
    }

    ws.onmessage = ( event ) =>
    {
        const data = JSON.parse( event.data )
        messages.value.push( { sender: data.sender, message: data.message } )
    }
} )

const sendMessage = () =>
{
    if ( !messageInput.value.trim() ) return

    const data = {
        sender: username,
        recipient: recipient.value,
        message: messageInput.value
    }

    ws.send( JSON.stringify( data ) )
    messages.value.push( { sender: username, message: messageInput.value } )
    messageInput.value = ''
}
</script>

<template>
    <div class="chat-container">
        <div id="chat">
            <h3>Chat with {{ recipient }}</h3>
            <div class="chat-display">
                <div v-for=" msg in messages " :key="msg.sender + msg.message">
                    <strong>{{ msg.sender }}:</strong> {{ msg.message }}
                </div>
            </div>
            <div id="message">
                <input v-model="messageInput" type="text" placeholder="Type a message" />
                <button @click="sendMessage">Send</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.chat-container {
    height: 98vh;
}
h3{
    text-align: center;
    border: 1px solid;
    border-radius: 5px;
    padding: 10px;
}
#chat{
    background-color: antiquewhite;
    border-radius: 5px;
    padding: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0);
    width: 98%;
    height: 98%;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
}
.chat-display {
    border: 1px solid #1302aa;
    height: 85vh;
    overflow-y: auto;
    padding: 10px;
}
#message{
    height: 15vh;
}
input {
    border: 1px solid;
    border-radius: 5px;
    padding: 10px;
    width: 200px;
}
button {
    border-radius: 5px;
    padding: 10px 30px;
}
</style>
