import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\n We are connected to Database Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Connection Failed ", error);
        process.exit(1);
    }
}

export default connectDB