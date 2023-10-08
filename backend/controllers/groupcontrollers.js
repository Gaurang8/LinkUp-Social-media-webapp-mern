const Group = require("../model/groupmodal");

const GetGroups = async (req , res) => {
    try {
        const groups = await Group.find(); 
        res.json(groups);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}

const Creategroup = async (req , res) => {
    try {
        const { groupName, description, image } = req.body;
        // const user = req.user;
        const group = new Group({ groupName, description, image });
        const savedGroup = await group.save();
        res.json(savedGroup);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}

module.exports = {
    GetGroups,
    Creategroup,
}