require('dotenv').config;
const express = require('express');
const app = express();
const cors = require('cors');
require('./db/conn');
const PORT = process.env.PORT || 8080;
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-google-oauth2').Strategy;
const userdb = require('./model/userModel');
const projectdb = require('./model/projectModel');
const notedb = require('./model/notesModel');

app.use(
  cors({
    origin: 'https://taskapp-app.vercel.app',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);

app.use(express.json());

//setup session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

//setup passport
//google auth
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.CLIENTID,
      clientSecret: process.env.CLIENSECRET,
      callbackURL: 'https://taskapp-api.vercel.app/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userdb.findOne({
          googleId: profile.id,
        });

        if (!user) {
          user = new userdb({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

//initial google auth login
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: 'https://taskapp-app.vercel.app/notes',
    failureRedirect: 'https://taskapp-app.vercel.app/login',
  })
);

// Middleware untuk mengecek autentikasi
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ message: 'Not Authorized' });
  }
};

app.get('/login/success', async (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: 'User Login Successfully',
      user: req.user,
    });
  } else {
    res.status(401).json({
      message: 'Not Authorized',
    });
  }
});

app.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('https://taskapp-app.vercel.app/login');
  });
});

//close google auth
//project
//post
app.post('/project/add', isAuthenticated, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const newProject = new projectdb({
      name,
      userId: req.user._id, // Ambil userId dari pengguna yang sedang login
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//put
app.put('/project/update/:id', isAuthenticated, async (req, res) => {
  try {
    const { name } = req.body;
    switch (true) {
      case !name:
        return res.status(500).send({
          error: 'Name is required',
        });
    }

    const projects = await projectdb.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });

    await projects.save();
    res.status(201).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//get
app.get('/project', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const projects = await projectdb.find({ userId });

    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this user' });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/project/get/:id', async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await projectdb.findById(projectId);

    if (!project) {
      return res.status(404).send({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Get project successfully',
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//delete
app.delete('/project/delete/:id', async (req, res) => {
  try {
    const projectId = req.params.id;

    // Delete the project
    const project = await projectdb.findOneAndDelete({ _id: projectId });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or not authorized' });
    }

    // Delete notes related to the project
    await notedb.deleteMany({ project: projectId });

    res.status(200).json({ message: 'Project and related notes deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//notes
//add notes
app.post('/notes/add', isAuthenticated, async (req, res) => {
  try {
    const { project, fitur, desc, status } = req.body;

    if (!project) {
      return res.status(400).json({ message: 'Project is required' });
    }
    if (!fitur) {
      return res.status(400).json({ message: 'Fitur is required' });
    }
    if (!desc) {
      return res.status(400).json({ message: 'Description is required' });
    }

    const newNote = new notedb({
      project,
      fitur,
      desc,
      status,
      userId: req.user._id,
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//update notes
app.put('/notes/update/:id', isAuthenticated, async (req, res) => {
  try {
    const { fitur, desc, status } = req.body;

    switch (true) {
      case !status:
        return res.status(500).send({
          error: 'Status is required',
        });
    }

    const notes = await notedb.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
    await notes.save();

    res.status(200).send({
      success: true,
      message: 'Notes updated successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//get notes
app.get('/notes', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id; // Pastikan req.user diisi oleh isAuthenticated middleware
    const notes = await notedb.find({ userId }).populate('project');

    if (notes.length === 0) {
      return res.status(404).json({ message: 'No notes found for this user' });
    }

    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//
app.get('/notes/all', async (req, res) => {
  try {
    const notes = await notedb.find({}).sort({ createdAt: -1 }).populate('project').populate('userId');

    if (notes.length === 0) {
      return res.status(404).json({ message: 'No notes found for this user' });
    }

    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//get notes date
app.get('/notes/date', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id; // Pastikan req.user diisi oleh isAuthenticated middleware
    const { startDate, endDate } = req.query;

    let filter = { userId };

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const notes = await notedb.find(filter).populate('project');

    if (notes.length === 0) {
      return res.status(404).json({ message: 'No notes found for this user' });
    }

    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//get notes project
app.get('/notes/project/:id', isAuthenticated, async (req, res) => {
  try {
    // Mencari project berdasarkan ID
    const project = await projectdb.findOne({ _id: req.params.id });
    if (!project) {
      return res.status(404).send({ message: 'Project not found' });
    }

    // Mencari catatan berdasarkan project
    const notes = await notedb.find({ project: project._id }).populate('project', 'name');

    res.status(200).send({
      success: true,
      project,
      notes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//get notes by id
app.get('/notes/get/:id', async (req, res) => {
  try {
    const notesId = req.params.id;
    const notes = await notedb.findById(notesId).populate('project');

    if (!notes) {
      return res.status(404).send({
        success: false,
        message: 'Notes not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Get notes successfully',
      notes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//delete notes
app.delete('/notes/delete/:id', async (req, res) => {
  try {
    const notesId = req.params.id;

    const notes = await notedb.findOneAndDelete({ _id: notesId });

    if (!notes) {
      return res.status(404).json({ message: 'notes not found or not authorized' });
    }

    res.status(200).json({ message: 'notes deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/notes/search/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await notedb
      .find({
        $or: [{ fitur: { $regex: keyword, $options: 'i' } }],
      })
      .populate('project')
      .populate('userId');
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: 'Error in search notes api',
      error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`server start a port ${PORT}`);
});
