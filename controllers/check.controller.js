const Check = require('../schemas/check.schema')

async function getAllChecks(req, res) {

    try {
        const checks = await Check.find()
        if (checks.length === 0) {
            return res.status(404).send('No checks were found.')
        }
        return res.status(200).send({ checks })
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error')
    }
}


async function getChequesByDateRangeAndEnterprise(req, res) {
    try {
        const startDate = new Date(req.params.startDate)
        const endDate = new Date(req.params.endDate)
        const enterprise = req.params.enterprise


        try {
            const checks = await Check.find({
                enterprise: enterprise,
                debitDate: { $gte: startDate, $lte: endDate },
            })

            console.log(checks)

            return res.status(200).send({
                msg: `List of checks`,
                checks
            })

        } catch (error) {
            console.error('Error loading checks:', error)
            throw error;
        }
    } catch (error) {
        console.log(error)
        return "Some Error"
    }
}


async function newCheck(req, res) {
    try {
        const { amount, bank, createDate, debitDate, note, enterprise } = req.body
        const chk = new Check({ amount, bank, createDate, debitDate, note, enterprise })
        const newChk = await chk.save()

        return res.status(201).send({
            msg: 'New check Created',
            newChk
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ msg: 'The creation of check failed' })
    }
}


async function delCheck(req, res) {
    const id = req.params.id

    const delCheck = await Check.findByIdAndDelete(id)
    if (!delCheck) {
        return res.status(401).send({msg:"The check to delet don't exist"})
    }
    return res.status(200).send({msg:'Check deleted successfully'})
}

module.exports = {
    getAllChecks,
    getChequesByDateRangeAndEnterprise,
    newCheck,
    delCheck
}