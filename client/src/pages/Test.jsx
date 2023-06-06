import React, { useEffect } from 'react'
import io from 'socket.io-client'
export default function Test() {


     useEffect(() => {
        const sockets = io("https://triviadrome.herokuapp.com/");
        sockets.emit('suppp',"sup");
      return () => {
        sockets.off('suppp');
      }
    }, []);
    
  return (
    <div>Test</div>
    
  )
}
