const Bank = require('../schemas/bank.schema')

async function getAllBanks(req, res) {

    try {
        const banks = await Bank.find()
        if (banks.length === 0) {
            return res.status(404).send('No banks were found.')
        }
        return res.status(200).send({ banks })
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error')
    }
}

async function newBank(req, res) {
    console.log(req.body)
    try {
        const { name, fontColor, color } = req.body
        const bank = new Bank(
            {
                name: name.toUpperCase(),
                fontColor,
                color
            })
        try {
            const savedBank = await bank.save()
            console.log(savedBank)
            return res.status(200).send({ msg: 'New bank created.', bank: savedBank })
        } catch (error) {
            console.log(error)
            return res.status(401).send({ msg: error })
        }

    } catch (err) {
        console.error(err)
        return res.status(500).send('Error while creating the bank.')
    }
}

async function editBank(req, res) {
    try {
        const { _id, name, fontColor, color } = req.body

        const updatedBank = await Bank.findByIdAndUpdate(
            _id,
            {
                name: name.toUpperCase(),
                fontColor,
                color
            },
            { new: true }
        )

        if (!updatedBank) {
            return res.status(404).json({ error: 'Bank not found.' })
        }

        console.log(updatedBank);
        return res.status(200).json({ msg: 'Bank edited.', bank: updatedBank })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error while editing the bank.' })
    }
}

async function deleteBank(req, res) {
    try {
        const id = req.params.id
        const delBank = await Bank.findByIdAndDelete(id)

        if (delBank) {
            return res.status(200).send({ status: 200, msg: 'Bank deleted successfully.' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send('Error')
    }
}

module.exports = {
    getAllBanks,
    newBank,
    editBank,
    deleteBank
}