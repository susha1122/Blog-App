import express from "express";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import connectDB from "./lib/connectDB.js";
import dotenv from "dotenv";
import webHookRouter from "./routes/webhook.route.js";
import { clerkMiddleware} from "@clerk/express";
import { requireAuth } from "@clerk/clerk-sdk-node";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({origin: process.env.CLIENT_URL}));
app.use(clerkMiddleware());
app.use("/webhooks", webHookRouter);
app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});


// app.get("/protect", (req, res)=>{
//     const {userId} = req.auth;
//     if(!userId){
//         return res.status(401).json("Unauthorized");
//     }
//     res.status(200).json("You are authorized");
// });

// app.get("/protect", requiredAuth(), (req, res)=>{
//     res.status(200).json("You are authorized");
// });



app.use("/users", userRouter);
app.use("/posts", postRouter); 
app.use("/comments", commentRouter);



app.use((error, req, res, next)=>{

    res.status(error.status || 500);

    res.json({message: error.message || "Sonething went wrong!",
    status: error.status,
    stack: error.stack,

    });
})

app.listen(3000, ()=>{
    connectDB();
    console.log("server is running!")
})