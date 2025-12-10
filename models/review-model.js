const pool = require("../database/")


async function registerReview(review_text, review_vehicle_id, review_account_id) {
    try {
        const sql = "INSERT INTO review (review, created_at, inv_id, account_id) VALUES ($1, $2, $3, $4) RETURNING *"
        return await pool.query(sql, [review_text, new Date(), review_vehicle_id, review_account_id])
    } catch (error) {
        console.error(error)
        return error.message
    }
}



async function getReviewsByVehicleId(vehicle_id) {
    try {
        const sql = "SELECT * FROM review WHERE inv_id = $1"
        const result = await pool.query(sql, [vehicle_id])
        return result.rows
    } catch (error) {
        return error.message
    }
}



module.exports = { registerReview, getReviewsByVehicleId }