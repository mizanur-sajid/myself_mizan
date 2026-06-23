const ftp = require("basic-ftp");
const path = require("path");

async function deploy() {
    const client = new ftp.Client();
    
    // Set to true to see detailed FTP logs
    client.ftp.verbose = false;
    
    try {
        console.log("🚀 Connecting to InfinityFree FTP Server...");
        await client.access({
            host: "ftpupload.net",
            user: "if0_42242407",
            password: "YXJeZPtdpfbyI7p",
            secure: false // InfinityFree FTP usually doesn't require secure for free tiers
        });
        
        console.log("✅ Connected successfully!");
        
        const sourceDir = path.join(process.cwd(), "out");
        const remoteDir = "/htdocs";
        
        console.log(`📤 Uploading files from local 'out' folder to '${remoteDir}'...`);
        console.log(`⏳ This might take a minute depending on the connection speed.`);
        
        await client.ensureDir(remoteDir);
        
        // We only upload, we DO NOT clear the directory.
        // This is critical to ensure we don't delete any images/resumes 
        // you uploaded directly on the live InfinityFree server later!
        await client.uploadFromDir(sourceDir);
        
        console.log("\n=============================================");
        console.log("🎉 DEPLOYMENT SUCCESSFUL! 🎉");
        console.log("=============================================");
        console.log("Your Next.js React SPA is now live on InfinityFree!");
    }
    catch(err) {
        console.error("\n❌ Deployment failed:");
        console.error(err);
    }
    
    client.close();
}

deploy();
