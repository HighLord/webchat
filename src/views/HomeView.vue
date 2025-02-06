<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore';
import { useWebSocketStore } from '@/stores/websocket';

const router = useRouter()
const username = ref( '' )
const showOnline = ref( true )
const websocketStore = useWebSocketStore();

const submitUser = () =>
{
	if ( username.value.trim() )
	{
		const userStore = useUserStore();
		userStore.setUsername( username.value );

		websocketStore.sendMessage( {
			type: 'identify',
			username: username.value,
			status: showOnline.value ? 'online' : 'hidden',
		} );

		router.push( `/online-users` )
	}
};
onMounted( () =>
{
	websocketStore.connect();
	if ( !websocketStore.isConnected )
	{
		fetch( 'https://github.webapps.com.ng/websocket/chat/start-chat-server.php' )
			.then( response => response.text() )
			.then( data => console.log( data ) )  // Log the server response
			.catch( error => console.error( 'Failed to start WebSocket server:', error ) );
	}
} );

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