import { Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { ChatService } from '../services/chat.service';

@injectable()
export class ChatController {
    constructor(private chatService: ChatService) { }
    getMyChatRooms = async (req: any, res: Response, next: NextFunction) => {
        try {
            const chatRooms = await this.chatService.getMyChatRooms(req.user.id);
            res.status(200).json({
                success: true,
                message: 'Chat rooms fetched',
                data: chatRooms,
            });
        } catch (error) {
            next(error);
        }
    }

    getMessages = async (req: any, res: Response, next: NextFunction) => {
        try {
            const result = await this.chatService.getMessages(req.params.roomId, req.user.id, req.query);
            res.status(200).json({
                success: true,
                message: 'Messages fetched',
                data: result.messages,
                meta: result.meta,
            });
        } catch (error) {
            next(error);
        }
    }
}
