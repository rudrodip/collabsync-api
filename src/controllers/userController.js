const User = require('../models/User');
const Workspace = require('../models/Workspace');

/**
 * Creates a user account or returns a message if the user already exists.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves once the operation is complete.
 */
async function createAccount(req, res) {
  try {
    const { id, email, access_token, refresh_token, expires_at } = req.body;

    let user = await User.getById(id.toString());

    if (user) {
      // User already exists
      res.status(200).json({ message: 'User already exists.' });
    } else {
      let data = {
        id,
        email,
        ...(access_token !== undefined ? { access_token } : {}),
        ...(refresh_token !== undefined ? { refresh_token } : {}),
        ...(expires_at !== undefined ? { expires_at } : {}),
        workspaces: [],
        roles: {
          creator: access_token !== undefined,
          editor: true,
        },
      };
      user = new User(data);
      await user.create();

      res.status(201).json({ message: 'User account created successfully.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}

/**
 * Retrieves user data by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves once the operation is complete.
 */
async function getUserData(req, res) {
  try {
    const id = req.params.id;

    let user = await User.getById(id.toString());

    if (user) {
      res.status(200).json(user.data);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}

/**
 * Retrieves workspaces data associated with a creator by their ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves once the operation is complete.
 */
async function getWorkspacesData(req, res) {
  try {
    const creatorId = req.params.creatorId;
    const user = await User.getById(creatorId);
    let workspaces = [];

    await Promise.all(
      user.data.workspaces.map(async (w) => {
        try {
          const workspaceData = await Workspace.getById(w.toString());
          workspaces.push({ id: w, ...workspaceData.data });
        } catch (err) {
          console.error(err);
        }
      })
    );

    res.status(200).json({ workspaces: workspaces });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
}

module.exports = { createAccount, getUserData, getWorkspacesData };
