import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true }, //unique:true
    password: { type: String, required: true },
    firstName: String, // firstName is no longer required
    lastName: String,
    emailAddress: { type: String, required: true, unique: true },
    albums: [
        {
            type: mongoose.Types.ObjectId, required: true
        }

    ]
}, { timestamps: true });

userSchema.pre("save", function (next) {
    if (!this.firstName) {
        this.firstName = "John";

    }
    if (!this.lastName) {
        this.lastName = "Doe";
    }
    next();
});


const User = mongoose.model("User", userSchema);

export default User;