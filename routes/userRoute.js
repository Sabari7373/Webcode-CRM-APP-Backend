const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY || "yourSecretKey";
const authenticateToken = require("./token")
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
});

router.get("/get", async (req, res) => {
  try {
    const product = await Product.find();
    return res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== User registration route ==================

router.post("/register", upload.single("profile"), async (req, res) => {
  const { name, email, phone, password, imurl } = req.body;

  try {
    const newUser = new User({
      name,
      email,
      phone,
      password,
      // imurl: `http://localhost:5000/profile/${req.file.filename}`,
    });

    const user = await newUser.save();
    // const token = jwt.sign({user}, secretKey); // Encode data

  //  localStorage.setItem("currentUser", JSON.stringify(token));

    const response = {
      // token,
      message: "User Added Successfully",
      // userid: user._id,
      newUser
      // name: user.name
    };
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ============== User login route =================

// router.post("/login", async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email: email });
//     if (user) {
//       const token = jwt.sign({id:user._id}, process.env.SECRETKEY);
//       // const response = {
//       //   token,
//       //   message: "User Logged In Successfully",
//       //   userid: user._id,
//       //   name: user.name,
//       // };
//       res.send({message : "Successful", token:token});
//     } else {
//       return res.status(400).json({ message: "Login failed" });
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Decode token 
router.get("/decode", (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  const decodedData = jwt.verify(token, secretKey); 
  res.json(decodedData);
});

// Delete a user
// router.delete("/users/:id", authenticateToken, async (req, res) => {
//   const userId = req.params.id;

//   try {
//     await User.findByIdAndDelete(userId);

//     res.send("User Deleted Successfully");
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Update a user
// router.put("/users/:id", authenticateToken, upload.single("profile"), async (req, res) => {
//   const { name, email, phonenumber, password, imurl } = req.body;
//   const userId = req.params.id;

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         name,
//         email,
//         phonenumber,
//         password,
//         // imurl,
//       },
//       { new: true }
//     );


//     res.send("User Updated Successfully");
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

router.put("/users/:id",authenticateToken, async (req, res) => {
  const { name, email, phone, password, imurl } = req.body;
  const userId = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        phone,
        password,
        // imurl,
      },
      { new: true }
    );
    // const token = jwt.sign({user}, secretKey);
    res.send("User Updated Successfully");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ================= delete a users =================

router.delete("/users/:id",authenticateToken, async (req, res) => {
  const userId = req.params.id;

  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Get all users
// router.get("/users", authenticateToken, async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
router.get("/users",authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// router.get("/users/:id", async (req, res) => {
//   try {
//     const users = await User.findOne();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


module.exports = router;