// src/stores/websocket.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWebSocketStore = defineStore( 'websocket', () =>
{
	const ws = ref( null );
	const isConnected = ref( false );

	const connect = () =>
	{
		if ( ws.value )
		{
			console.warn( 'WebSocket is already connected.' );
			return;
		}

		ws.value = new WebSocket('wss://github.webapps.com.ng/chat-server'); //( 'ws://localhost:3128' );

		ws.value.onopen = () =>
		{
			console.log( 'Connected to WebSocket' );
			isConnected.value = true;
		};

		ws.value.onclose = () =>
		{
			console.log( 'Disconnected from WebSocket' );
			isConnected.value = false;
			ws.value = null;
		};

		ws.value.onerror = ( error ) =>
		{
			console.error( 'WebSocket error:', error );
		};
	};

	const disconnect = () =>
	{
		if ( ws.value )
		{
			ws.value.close();
		}
	};

	const sendMessage = ( message ) =>
	{
		if ( isConnected.value )
		{
			ws.value.send( JSON.stringify( message ) );
		} else
		{
			console.error( 'WebSocket is not connected.' );
			setTimeout( () => sendMessage( message ), 1000 );
		}
	};

	const addMessageListener = ( callback ) =>
	{
		if ( !ws.value )
		{
			console.error( 'WebSocket is not initialized.' );
			return;
		}

		ws.value.onmessage = ( event ) =>
		{
			const data = JSON.parse( event.data );
			callback( data );
		};
	};

	return {
		connect,
		disconnect,
		sendMessage,
		addMessageListener,
		isConnected,
	};
} );
