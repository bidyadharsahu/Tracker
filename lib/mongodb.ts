import { MongoClient } from "mongodb";

const uri = "mongodb+srv://bidyadharsahucse2022:Z5FghzZhaJ4bbFau@cluster0.gtwuw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;
