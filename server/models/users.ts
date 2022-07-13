import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
        
    },
    password: {
        type: String,
        required: true,
    },
    friends: {
        type: [{
            username: {
                type: String,
                required: true
            }
        }],
        required: false,
    },
    chessStats: {
        type: {
            wins: {
                type: Number,
                required: true,
            },
		    losses: {
                type: Number,
                required: true,
            },
            draws: {
                type: Number,
                required: true,
            },
        required: false,
        },
        required: false,
    }


});

export const UserModel = mongoose.model("user", UsersSchema);