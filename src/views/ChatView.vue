<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useWebSocketStore } from '@/stores/websocket';
import { useUserStore } from '@/stores/userStore';

const route = useRoute();
const recipient = ref( route.params.username )
const messages = ref < { sender: string; message: string }[] > ( [] );
const messageInput = ref( '' );
const websocketStore = useWebSocketStore();
const userStore = useUserStore();
const username = ref( userStore.username ); // get the username from userStore
const sender = username.value; // use this sender reference

const loadStoredMessages = () =>
{
    const chatKey = `chat_${sender}_${recipient.value}`;
    const storedMessages = localStorage.getItem( chatKey );
    messages.value = storedMessages ? JSON.parse( storedMessages ) : [];
};
const saveMessages = () =>
{
    const chatKey = `chat_${sender}_${recipient.value}`;
    localStorage.setItem( chatKey, JSON.stringify( messages.value.slice( -10 ) ) ); // Keep only last 10 messages
};

onMounted( () =>
{
    websocketStore.connect();
    loadStoredMessages();
} );

// Store messages when chat changes
watch( recipient, loadStoredMessages );


onUnmounted( () =>
{
    websocketStore.disconnect();
} );

websocketStore.addMessageListener( ( data ) =>
{   
    if ( data.sender === recipient.value && data.recipient === sender )
    {
        messages.value.push( { sender: data.sender, message: data.message } );
        saveMessages();
    }
} );

const sendMessage = () =>
{
    if ( !messageInput.value.trim() ) return;

    const data = {
        sender: sender,
        recipient: recipient.value,
        message: messageInput.value,
    };

    websocketStore.sendMessage( data );
    messages.value.push( { sender: sender, message: messageInput.value } );
    saveMessages();
    messageInput.value = '';
};
</script>

<template>
    <div class="chat-container">
        <div id="chat">
            <h3>{{sender}} is chatting with {{ recipient }}</h3>
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
