// import React, { createContext } from "react";
// import io from 'socket.io-client';


// export const ServerContext = React.createContext({
//     socket: io('http://localhost:3000'),
//     state: {
//         test: "test"
//     }
// })


// export const ServerProvider = (props) => {
//     return (
//         <ServerContext.Provider value={props}>
//             {props.children}
//         </ServerContext.Provider>
//     );
// }


// export const ServerConsumer = ServerContext.Consumer

import { createContext } from "react";
import io from 'socket.io-client';

export const SocketContext = createContext({
    socket: io('http://localhost:3000')
});