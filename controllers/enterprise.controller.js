const Enterprise = require('../schemas/enterprise.schema')

async function getAllEnterprises(req, res) {

    try {
        const enterprise = await Enterprise.find()
        if (enterprise.length === 0) {
            return res.status(404).send('No company were found.')
        }
        return res.status(200).send({ enterprise })
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error')
    }
}

async function newEnterprise(req, res) {

    try {
        const { name, fontColor, color } = req.body
        const company = new Enterprise(
            {
                name: name.toUpperCase(),
                fontColor,
                color
            })
        try {
            const savedCompany = await company.save()
            return res.status(200).send({ msg: 'New company created.', enterprise: savedCompany })
        } catch (error) {
            console.log(error)
            return res.status(401).send({ msg: error })
        }

    } catch (err) {
        console.error(err)
        return res.status(500).send('Error while creating the company.')
    }
}

async function editEnterprise(req, res) {
    try {
        const { _id, name, fontColor, color } = req.body

        const updatedEnterprise = await Enterprise.findByIdAndUpdate(
            _id,
            {
                name: name.toUpperCase(),
                fontColor,
                color
            },
            { new: true }
        )

        if (!updatedEnterprise) {
            return res.status(404).json({ error: 'Company not found.' })
        }

        return res.status(200).json({ msg: 'Company edited.', enterprise: updatedEnterprise })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error while editing the company.' })
    }
}

async function deleteEnterprise(req, res) {
    try {
        const id = req.params.id
        const delCompany = await Enterprise.findByIdAndDelete(id)

        if (delCompany) {
            return res.status(200).send({ status: 200, msg: 'Company deleted successfully.' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send('Error')
    }
}


module.exports = {
    getAllEnterprises,
    newEnterprise,
    editEnterprise,
    deleteEnterprise
}