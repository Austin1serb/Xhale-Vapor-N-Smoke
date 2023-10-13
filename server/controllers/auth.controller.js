// controllers/auth.controller.js
function logout(req, res) {
    // Remove the JWT from the client (e.g., clear it from localStorage)
    res.status(200).json({ message: 'Logout successful' });
}
