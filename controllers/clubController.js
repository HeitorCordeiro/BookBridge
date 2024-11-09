import Club from '../models/club.js'

export const createClub = async (req, res) => {
    const { name, description } = req.body;
    try{
        const existingClub = await Club.findOne({ where: { name } });
        if (existingClub) {
            return res.status(400).json({ error: 'Name already taken'});
        }
        const club = await Club.create({name, description});
        res.status(200).json();
    }catch(error){
        res.status(400).json({error: error.message});
    }
}

export const getClubs = async(req, res) => {
    try{
        const clubs = await Club.findAll();
        res.status(200).json(clubs);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

export const updateClub = async (req, res) =>{
    const{ id } = req.params;
    const{ name, description } = req.body;
    try{
        const club = await Club.findByPk(id);
        if(!club) return res.status(404).json({error: 'Club not found'});
        const existingClub = await Club.findOne({ where: { name } });
        if (existingClub && existingClub.id !== parseInt(id, 10)) {
            return res.status(400).json({ error: 'Name already taken'});
        }
        club.name = name;
        club.description = description;
        await club.save();
        res.status(200).json(club);
    }catch(error){
        res.status(400).json({error: error.message});
    }
}

export const deleteClub = async (req, res) => {
    const { id } = req.params;
    try{
        const club = await Club.findByPk(id);
        if(!club) return res.status(404).json({error: 'Club not found'});
        await club.destroy();
        res.status(200).json();
    }catch(error){
        res.status(400).json({error: error.message});
    }
}