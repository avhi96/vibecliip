import Convertation from "../models/convertation.model.js";
import { Message } from "../models/message.model.js";

//for chatting
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;

        let convertation = await Convertation.findOne({
            participants : { $all: [senderId, receiverId] }
        });
        //establishing a new convertation if not found
        if (!convertation) {
            convertation = await Convertation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = await Message.create({
            senderId: senderId,
            receiverId: receiverId,
            message: message,
            convertationId: convertation._id
        });
        if(newMessage){
            convertation.messages.push(newMessage._id);
            await Promise.all([convertation.save(), newMessage.save()]);

            //impliment socket io for real time data transfer
            

            return res.status(201).json({
                success: true,
                newMessage,
            });
        }
    } catch (error) {
        console.log(error);
    }
}

export const getMessages = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const convertation = await Convertation.findOne({
            participants: { $all: [senderId, receiverId] }
        })
        if (!convertation) {
            return res.status(200).json({
                message: [],
                success: true
            });
        }

        return res.status(200).json({
            messages:convertation?.messages,
            success: true
        });
        
    } catch (error) {
        console.log(error);
        
    }
}