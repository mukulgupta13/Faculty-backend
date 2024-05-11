const fs = require('fs');
const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');
const { Readable } = require('stream'); // Importing Readable from the 'stream' module

async function uploadBasic(req, res) {

    const keys = require('./faculty-drive1-a48e6cd3fed0.json');  
    // Get credentials and build service
    // TODO (developer) - Use appropriate auth mechanism for your app
    const auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/drive',
      //...keys
    });
    const service = google.drive({version: 'v3', auth});
    const requestBody = {
      name: 'user_file-1714832897424.jpg',
      fields: 'id',
    };
    const media = {
      mimeType: 'image/jpeg',
      body: fs.createReadStream('uploads/user_file-1714832897424.jpg'),
    };
    try {
      const file = await service.files.create({
        requestBody,
        media: media,
      });
      console.log('File Id:', file.data.id);
      //return file.data.id;
      return res.status(200).json({
        message: "Success",
        data: file.data.id
      });
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

  async function uploadAndGetFileId(file) {
    // Get credentials and build service
    // TODO (developer) - Use appropriate auth mechanism for your app
    const auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/drive',
      //...keys
    });
    const service = google.drive({version: 'v3', auth});
    const requestBody = {
      name: file.originalname,
      //fields: 'id',
    };
    const fileStream = new Readable();
    fileStream.push(file.buffer);
    fileStream.push(null); // Indicates end of stream

    const media = {
      mimeType: file.mimeType,
     // body: file.buffer 
     body: fileStream
    };
    try {
      const file = await service.files.create({
        requestBody,
        media: media,
        fields: 'id',
      });
      console.log('File Id:', file.data.id);
      return file.data.id;
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

  async function getGoogleDriveFiles(req, res){
    const auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/drive',
      });
    const drive = google.drive({ version: 'v3', auth });

    try{
      const list2 = await drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)'
      });
      const files = list2.data.files;
      const list = [];
      if (files.length) {
        console.log('Files:');
        files.forEach((file) => {
          console.log(`${file.name} (${file.id})`);
          list.push({name: file.name, id: file.id})
        });
        return res.status(200).json({
            message: "Success",
            data:list
          });
      } else {
        console.log('No files found.');
      }
    } catch (err) {
        // TODO(developer) - Handle error
        console.error('Error listing files:', err);
        throw err;
      }
  }
  async function downloadFile(req, res) {
    const { fileId:realFileId } = req.params;
    const auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/drive',
    });
    const service = google.drive({version: 'v3', auth});
  
    fileId = realFileId;
    try {
      const file = await service.files.get({
        fileId: fileId,
        alt: 'media',
      }, { responseType: 'stream' });
      // console.log(file);
      // console.log(file.status);
      const chunks = [];

      file.data
    .on('end', () => {
       // Concatenate all the chunks to create a single buffer
       const fileBuffer = Buffer.concat(chunks);

       // Create a readable stream from the buffer
       const fileStream = new Readable();
       fileStream.push(fileBuffer);
       fileStream.push(null); // Indicates end of stream
 
       // Set the appropriate response headers
       res.set({
         'Content-Type': 'application/octet-stream', // or the appropriate MIME type
         'Content-Disposition': `attachment; filename="downloaded-file.ext"`, // Specify the filename
       });
 
       // Send the stream as the response
       fileStream.pipe(res);
      console.log('File download completed');
    })
    .on('error', (err) => {
      console.error('Error downloading file:', err);
      res.status(500).send('Error downloading file');

    })
    .on('data', (chunk) => {
      // Handle each chunk of data here
      // You can process the chunk or store it in memory as needed
      chunks.push(chunk);

      console.log('Received chunk of data');
    });
   //   res.sendFile(file);
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }
  module.exports = {
    uploadBasic, getGoogleDriveFiles, downloadFile,uploadAndGetFileId
  }