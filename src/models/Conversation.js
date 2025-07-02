import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
    participants: {
        type: [String],
        required: true,
    },
    isGroup: {
        type: Boolean,
        default: false,
    },
    name: String,
    orgId: String,
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
}, { timestamps: true });

const Conversation= mongoose.model('Conversation', ConversationSchema);

export default Conversation;

