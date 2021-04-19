const CommentsService = {
    getAllComments(knex) {
        return knex.select('*').from('comments')
    },

    insertNewComment(knex, newComment) {
        return knex
            .insert(newComment)
            .into('comments')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getByCommentId(knex, id) {
        return knex
            .from('comments')
            .select('*')
            .where('id', id)
            .first()
    },

    getByPeakId(knex, id) {
        return knex
            .from('comments')
            .select('*')
            .where('peak_id', id)
    },

    deleteComment(knex, id) {
        return knex('comments')
            .where({ id })
            .delete()
    },

    updateComment(knex, id, newCommentFields) {
        return knex('comments')
            .where({ id })
            .update(newCommentFields)
    }
}

module.exports = CommentsService