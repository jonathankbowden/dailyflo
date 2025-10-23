import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deploy() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    // Get password from environment variable
    const password = process.env.FTP_PASSWORD;
    if (!password) {
      console.error('❌ Error: FTP_PASSWORD environment variable is not set');
      console.log('\nUsage: FTP_PASSWORD=your_password npm run deploy');
      process.exit(1);
    }

    console.log('🚀 Starting deployment to kreathaus.com/dailyflo/...\n');

    // Connect to FTP server
    console.log('📡 Connecting to FTP server...');
    await client.access({
      host: 'kreathaus.com',
      user: 'jbowden@kreathaus.com',
      password: password,
      secure: false, // Set to true if using FTPS
    });

    console.log('✅ Connected successfully!\n');

    // Navigate to the remote directory
    console.log('📂 Navigating to /public_html/dailyflo/...');
    await client.ensureDir('/public_html/dailyflo');
    await client.cd('/public_html/dailyflo');

    // Clear the remote directory (remove old files)
    console.log('🧹 Clearing old files...');
    try {
      await client.clearWorkingDir();
    } catch (err) {
      console.log('⚠️  Warning: Could not clear directory:', err.message);
    }

    // Upload the dist folder contents
    console.log('📤 Uploading new files from dist/...\n');
    await client.uploadFromDir(path.join(__dirname, 'dist'));

    console.log('\n✅ Deployment complete!');
    console.log('🌐 Your app should now be live at: https://kreathaus.com/dailyflo/\n');

  } catch (err) {
    console.error('❌ Deployment failed:', err.message);
    process.exit(1);
  }

  client.close();
}

deploy();
