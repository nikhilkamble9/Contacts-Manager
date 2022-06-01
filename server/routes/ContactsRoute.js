<<<<<<< HEAD
const router = require("express").Router();
const Contacts = require("../models/Contacts");
const JWT = require("../middleware/JWT");
const csvtojson = require("csvtojson");
const multer = require("multer");

//multer
const FileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    const fileArr = file.originalname.split(".");
    cb(null, file.fieldname + Date.now() + "." + fileArr[fileArr.length - 1]);
  },
});

const upload = multer({ storage: FileStorage });

//post the contacts through csv
router.post("/contactpost",JWT, upload.single("file"), async (req, res) => {

  console.log(req.file);
  const file = req.file;
  await csvtojson()
    .fromFile(`./public/uploads/${file.filename}`)
    .then( (csvdata) => {
      console.log(csvdata);
      // Contacts.user = req.user._id;
      lengthCsv = csvdata.length;
      console.log(lengthCsv);
     
      try{
         for(i = 0; i < lengthCsv; i++){
           const { name, destination, company, industry, email, phonenumber, country } = csvdata[i];
        const newContact = new Contacts({
          name,
          destination,
          company,
          industry,
          email,
          phonenumber,
          country,
          user: req.user._id,
        });
        const result =  newContact.save();}
        res.status(200).json({
          message: "Contacts added successfully",
          ...result._doc,
        });
      }catch(err){
        res.status(500).json({
          error: err,
        });
      }
      
    
      // Contacts.insertMany(csvdata)
      //   .then(function () {
      //     console.log("Data inserted");
      //     res.json({ success: "success" });
      //   })
      //   .catch(function (err) {
      //     console.log(err);
      //   });
    });
});
// get the contacts
router.get("/getuser", async function (req, res) {
  try {
    const user = await Contacts.find();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(404).send("contacts not found");
  }
});

//update the contacts
router.put("/contactupdate/:id", JWT, async function (req, res) {
  const { name, designation, company, industry, email, phonenumber, country } =
    req.body;
  try {
    const newpost = {};
    if (name) {
      newpost.name = name;
    }
    if (designation) {
      newpost.designation = designation;
    }
    if (company) {
      newpost.company = company;
    }
    if (industry) {
      newpost.industry = industry;
    }
    if (email) {
      newpost.email = email;
    }
    if (phonenumber) {
      newpost.phonenumber = phonenumber;
    }
    if (country) {
      newpost.country = country;
    }
    //----------------------
    let contact = await Contacts.findById(req.params.id);
    if (!contact) {
      return res.status(404).send("Not Found");
    }
    // if (contact.user.toString() !== req.user.id) {
    //   return res.status(401).send("Not Allowed");
    // }
    contact = await Contacts.findByIdAndUpdate(
      req.params.id,
      { $set: newpost },
      { new: true }
    );
    res.json({ contact });
  } catch (error) {
    console.error(error);
    res.status(404).send("Internal error occurred");
  }
});

// delete the contact
router.delete("/contactdelete/:id", JWT, async function (req, res) {
  try {
    let contact = await Contacts.findById(req.params.id);
    if (!contact) {
      return res.status(404).send("Not Found");
    }
    // if (contact.user.toString() !== req.user.id) {
    //   return res.status(401).send("Not Allowed");
    // }
    contact = await Contacts.findByIdAndDelete(req.params.id);
    res.json({ Success: "Deleted the post", contact });
  } catch (error) {
    // checking for errors
    console.error(error.message);
    res.status(500).send("Internal Error Occurred");
  }
});
module.exports = router;



=======
const router = require("express").Router();
const Contacts = require("../models/Contacts");
const fetchuser = require('../middleware/JWT')
const csvtojson = require("csvtojson");
const multer = require("multer");

//multer
const FileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    const fileArr = file.originalname.split(".");
    cb(null, file.fieldname + Date.now() + "." + fileArr[fileArr.length - 1]);
  },
});

const upload = multer({ storage: FileStorage });

//post the contacts through csv
router.post("/contactpost", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const file = req.file;
  await csvtojson()
    .fromFile(`./public/uploads/${file.filename}`)
    .then((csvdata) => {
      console.log(csvdata);
      Contacts.insertMany(csvdata)
        .then(function () {
          console.log("Data inserted");
          res.json({ success: "success" });
        })
        .catch(function (err) {
          console.log(err);
        });
    });
});
// get the contacts
router.get("/getuser", async function (req, res) {
  try {
    const user = await Contacts.find();
    res.json(user);
  } catch (error) {
    console.error(error)
    res.status(404).send("contacts not found")
  }
});

//update the contacts
router.put('/contactupdate/:id', async function (req, res) {
  const {name, designation, company, industry, email, phonenumber, country} = req.body;
  try {const newpost = {};
  if (name) {
    newpost.name = name;
  }
  if (designation) {
    newpost.designation = designation;
  }
  if (company) {
    newpost.company = company;
  }
  if (industry) {
    newpost.industry = industry;
  }
  if (email) {
    newpost.email = email;
  }
  if (phonenumber) {
    newpost.phonenumber = phonenumber;
  }
  if (country) {
    newpost.country = country;
  }
  //----------------------
  let contact = await Contacts.findById(req.params.id);
  if (!contact) {
    return res.status(404).send("Not Found");
  }
  // if (contact.user.toString() !== req.user.id) {
  //   return res.status(401).send("Not Allowed");
  // }
  contact = await Contacts.findByIdAndUpdate(
    req.params.id,
    { $set: newpost },
    { new: true }
  );
  res.json({ contact });
    
  } catch (error) {
    console.error(error)
    res.status(404).send("Internal error occurred")
  }
})

// delete the contact
router.delete('/contactdelete/:id', async function(req, res){
  try {
    let contact = await Contacts.findById(req.params.id);
    if (!contact) {
      return res.status(404).send("Not Found");
    }
    // if (contact.user.toString() !== req.user.id) {
    //   return res.status(401).send("Not Allowed");
    // }
    contact = await Contacts.findByIdAndDelete(req.params.id);
    res.json({ Success: "Deleted the post", contact });
  } catch (error) {
    // checking for errors
    console.error(error.message);
    res.status(500).send("Internal Error Occurred");
  }
})
module.exports = router;
>>>>>>> 0caaa142d454f28308aa10b0c8060e6785815efa
