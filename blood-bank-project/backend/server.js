import app from "./app.js";

app.listen(process.env.PORT, ()=>{
    console.log(`Server listning on port ${process.env.PORT}`);
});