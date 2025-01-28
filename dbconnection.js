import { MongoClient } from './node_modules/mongodb';
        const uri = "mongodb+srv://lrjsales:5CC3pLqE80E3JZWq@cluster0.ackb3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        const client = new MongoClient(uri);


        let tempCreate = document.getElementById("login-form");

        tempCreate.addEventListener("submit", (e) => {
            e.preventDefault();

            // Main function to run database operations 
            async function connectToDB() {
            
            try {
                // Connect to the MongoDB Atlas Cluster
            await client.connect();
            console.log("Connected to BookVibe DB!");
    
            // Intialize the DATABASE IN MONGODB ATLAS and its COLLECTION
            // Access the database and collection
            const database = client.db("BVDB");
            const userCollection = database.collection("Users");
    
            // Define the user profile document to insert
    
            let email = document.getElementById("email");
            let password = document.getElementById("password");
            
    
            const userProfile = {
                user_id: email, 
                password: password,
                date_joined: new Date().toISOString() // The current date and time
            };
    
            // Insert the document into the "Users" collection
            const result = await userCollection.insertOne(userProfile);
            console.log("User profile inserted with ID: ", result.insertedId);
    
            } catch (err) {
                // Log errors if any occur
                console.error("Error inserting user profile:", err);
            } finally {
                // Close the database connection
                await client.close();
            }
            }
    
            // Execute the main function and handle any uncaught errors
            connectToDB().catch(console.dir);

            });