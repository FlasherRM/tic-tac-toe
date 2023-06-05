import RoomService from "./room.service";

export default class SocketService {
    public service = new RoomService();


    async move(data: any) {
        if (data.gameTurn == 'X') {
            data.gameTurn = 'O'
        } else {
            data.gameTurn = 'X'
        }
        return {
            room: await this.service.showRoom(data.roomId),
            cellId: data.cellId,
            gameTurn: data.gameTurn
        }
    }
}