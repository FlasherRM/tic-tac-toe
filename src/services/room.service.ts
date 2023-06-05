import {IRoom} from "../interfaces/room.interface";
import {getRandomStr} from "../utils/string.utils";
import fs from 'fs'
import {log} from "util";
import path from "path";

export default class RoomService {
    private jsonPath = path.join(__dirname, '../..', 'rooms.json');

    showRooms() {
        const data = fs.readFileSync(this.jsonPath, 'utf8');
        const jsonData = JSON.parse(data);

        console.log(jsonData);
        return jsonData;
    }
    async showRoom(id: number | string) {
        const data = fs.readFileSync(this.jsonPath, 'utf8');
        const rooms: IRoom[] = JSON.parse(data);

        const foundRoom = await rooms.find(room => room.id == id);
        if (foundRoom) {
            return foundRoom;
        }
        return false;
    }
    createRoom(cookies: any) {
        const data = fs.readFileSync(this.jsonPath, 'utf8');
        const rooms = JSON.parse(data);

        const newRoomId = getRandomStr();
        const newRoom = {
            id: newRoomId,
            firstToken: cookies?.guest_token || '',
            secondToken: '',
            gameStats: {}
        }

        rooms.push(newRoom)
        fs.writeFileSync(this.jsonPath, JSON.stringify(rooms))

        console.log(this.showRooms())

        return newRoomId;
    }

    getSecondPlayerToRoom (roomId: string, playerToken: string) {
        const data = fs.readFileSync(this.jsonPath, 'utf8');
        const rooms: IRoom[] = JSON.parse(data);

        const index = rooms.findIndex(room => room.id === roomId);

        rooms[index].secondToken = playerToken;

        fs.writeFileSync(this.jsonPath, JSON.stringify(rooms));
        return rooms[index];
    }
}