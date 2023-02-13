import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config()

export async function connectToDatabase() {
    const url = process.env.DB_URL;

    return MongoClient.connect(url)
        .then(client => {
            console.log('Verbonden met de database');
            return client.db();
        })
        .catch(error => {
            console.error('Fout bij het verbinden met de database:', error);
            process.exit(1);
        });
}