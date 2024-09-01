const AWS = require('aws-sdk');

const uploadToS3 = (data, filename) =>{
    return new Promise((resolve , reject) =>{
       
        const BUCKET_NAME = 'expensetracker42'; // process.env.BUCKET_NAME;
    const IAM_USER_KEY = 'AKIATCKAN5G7G66V5S6L'; // process.env.IAM_USER_ACCESS;
    const IAM_USER_SECRET = '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'; // process.env.IAM_USER_SECRET;

        let s3bucket = new AWS.S3({
            accessKeyId : IAM_USER_KEY,
            secretAccessKey : IAM_USER_SECRET
        });

        var params = {
            Bucket : BUCKET_NAME,
            Key : filename,
            Body : data,
            ACL : "public-read",
        };
    
            s3bucket.upload(params, (err, data)=>{
                if(err){
                    console.log('something went wrong', err);
                    reject(err);
                }else{
                    console.log('Success',data);
                    resolve(data.Location);
                }
            })
        
        })
        
}

module.exports = { uploadToS3};