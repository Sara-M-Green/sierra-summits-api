const PeaksService = {
    getAllPeaks(knex) {
        return knex.select('*').from('peaks_table')
    },
    getById(knex, id) {
        return knex.from('peaks_table').select('*').where('id', id).first()
    }

}

module.exports = PeaksService