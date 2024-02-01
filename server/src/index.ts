import { createServer } from "http";
import { Server, Socket } from "socket.io";

import { lists } from "./assets/mockData";
import { Database } from "./data/database";
import { CardHandler } from "./handlers/card.handler";
import { ListHandler } from "./handlers/list.handler";
import { ReorderProxy, ReorderService } from "./services/reorder.service";

const PORT = 3003;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const db = Database.Instance;
const reorderService = new ReorderService();
const reorderProxy = new ReorderProxy(reorderService);

if (process.env.NODE_ENV !== "production") {
  db.setData(lists);
}

const onConnection = (socket: Socket): void => {
  new ListHandler(io, db, reorderService, reorderProxy).handleConnection(
    socket
  );

  new CardHandler(io, db, reorderService, reorderProxy).handleConnection(
    socket
  );
};

io.on("connection", onConnection);

httpServer.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

export { httpServer };
