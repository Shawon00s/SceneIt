import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profileImage: {
            type: String,
            default: ""
        },
    }
)

// Hashing the password before saving
userSchema.pre("save", async function(next){ // Using a pre hook
    if (!this.isModified("password")) {
        return next(); // If the password is not modified, skip hashing
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Calling next to continue the save operation
})

const User = mongoose.model("User", userSchema);
export default User;