function makeCommentsArray() {
    return [
        {
            id: 1,
            peak_id: 1,
            date_commented: '2021-04-18T00:40:09.141Z',
            username: 'Sara',
            comment: 'Amazing views - first peak this year!'
        },
        {
            id: 2,
            peak_id: 1,
            date_commented: '2021-04-18T00:40:09.141Z',
            username: 'Chance',
            comment: 'Sara is so slow.'
        },
        {
            id: 3,
            peak_id: 1,
            date_commented: '2021-04-18T00:40:09.141Z',
            username: 'Molly',
            comment: 'Thank you legs!'
        },
        {
            id: 4,
            peak_id: 1,
            date_commented: '2021-04-18T00:40:09.141Z',
            username: 'Claire',
            comment: 'Insert pun or dad joke here.'
        },
        {
            id: 5,
            peak_id: 1,
            date_commented: '2021-04-18T00:40:09.141Z',
            username: 'Syd',
            comment: 'SUMMIT SALAMI!'
        },
    ]
}

function makeMaliciousComment() {
    const maliciousComment = {
        id: 911,
        peak_id: 1,
        date_commented: '2021-04-18T00:40:09.141Z',
        username: 'HACKER',
        comment: 'Naughty naughty very naughty <script>alert("xss");</script>'
    }

    const expectedComment = {
        ...maliciousComment,
        comment: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    }

    return {
        maliciousComment,
        expectedComment
    }
}

module.exports = {
    makeCommentsArray,
    makeMaliciousComment
}