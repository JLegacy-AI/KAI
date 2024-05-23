import { MONGODB_URI } from '@/lib/constants';
import * as mongoose from 'mongoose';

const dbConnect = async () => {
    if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined');
    await mongoose.connect(MONGODB_URI);
}

dbConnect().catch((error) => console.error(error));

export { dbConnect };