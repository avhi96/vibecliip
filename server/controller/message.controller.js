import Convertation from "../models/convertation.model.js";
import { Message } from "../models/message.model.js";
import { io } from "../server.js";

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
            await convertation.save();
            console.log('Convertation messages after push:', convertation.messages);

            //impliment socket io for real time data transfer
            io.to(receiverId).emit('message', newMessage);
            io.to(senderId).emit('message', newMessage);

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
        }).populate('messages');
        if (!convertation) {
            return res.status(200).json({
                messages: [],
                success: true
            });
        }

        return res.status(200).json({
            messages: convertation?.messages,
            success: true
        });
        
    } catch (error) {
        console.log(error);
        
    }
}

export const deleteConversation = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        const convertation = await Convertation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!convertation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        // Delete all messages in the conversation
        await Message.deleteMany({ convertationId: convertation._id });

        // Delete the conversation itself
        await Convertation.deleteOne({ _id: convertation._id });

        return res.status(200).json({ success: true, message: 'Conversation deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}

export const getConversations = async (req, res) => {
    try {
        const userId = req.id;

        // Find all conversations where user is a participant
        const conversations = await Convertation.find({
            participants: userId
        }).populate({
            path: 'messages',
            options: { sort: { createdAt: -1 }, limit: 1 }
        }).populate('participants', '-password');

        // Map conversations to include last message and chat partner info
        const result = conversations.map(conv => {
            const lastMessage = conv.messages[0];
            const chatPartner = conv.participants.find(p => p._id.toString() !== userId.toString());
            return {
                conversationId: conv._id,
                lastMessage,
                chatPartner
            };
        });

        // Sort by last message createdAt descending
        result.sort((a, b) => {
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
        });

        return res.status(200).json({
            success: true,
            conversations: result
        });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error fetching conversations'
        });
    }
};

export const createConversation = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        let convertation = await Convertation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!convertation) {
            convertation = await Convertation.create({
                participants: [senderId, receiverId],
            });
            return res.status(201).json({
                success: true,
                conversation: convertation,
            });
        } else {
            return res.status(200).json({
                success: true,
                conversation: convertation,
            });
        }
    } catch (error) {
        console.error('Error creating conversation:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error creating conversation',
        });
    }
};

