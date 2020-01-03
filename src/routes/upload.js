const express = require("express");
const multer = require("multer");
const mssql = require("mssql");
const config = require("config");
const auth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  'application/zip': 'zip',
  'application/x-zip-compressed': 'zip'
};


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isValid) {
        error = null
      }
      cb(error, "src/upload");
    },
    filename: (req, file, cb) => {
      const name = file.originalname.toLowerCase().split(' ').join('_');
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + '-' + Date.now() + '.' + ext);
    }
  });

  
router.post("", auth.checkAuth, multer({storage: storage}).single("data"), async(req, res, next) => {
    const url = req.protocol + '://' + req.get("host");

    const post = {
      refno: req.body.refno,
      url: url + "/upload/" + req.file.filename
    };

    try {
    
        var result = await addTransaction(post);

        res.status(200).json({
            message: post
        });

    } catch (err){
        res.status(500).json({
            error_message: err.message
        })
    }
    

  });

  const addTransaction = async(msg) => {
      return new Promise(async(resolve, reject) => {
          try {
            
            let pool = new mssql.ConnectionPool(config.CONNECTION);
            await pool.connect()
                    .then(() => {
                        let req = new mssql.Request(pool);
                        req.input('refno', msg.refno)
                        .input('uri', msg.url)
                        .query('insert into transaction_mst (refno, uri, msgstate, createddate) select @refno, @uri, 1, getdate()')
                        .then(result => {resolve(result)})
                        .catch(reqErr => {reject(reqErr)})
                    })
                    .catch(error => {reject(error)});

          }catch(err){
              reject(err);
          }
      })
  }


  module.exports = router;
