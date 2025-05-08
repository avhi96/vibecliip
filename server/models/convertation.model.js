import mongoose from "mongoose";

const convertationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],

})

const Convertation = mongoose.model('Convertation', convertationSchema);
export default Convertation;
