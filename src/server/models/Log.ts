import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({}, { timestamps: true });

export default mongoose.models.Log || mongoose.model('Log', LogSchema);
