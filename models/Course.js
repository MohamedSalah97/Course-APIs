const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - courseId
 *       properties:
 *         _id:
 *           type: mongoose objectId
 *           description: course's Id in db
 *         courseId:
 *           type: string
 *           description: Id of the course
 *         courseStudents:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *               grade:
 *                 type: integer
 *               score: 
 *                 type: string                     
 *       example:
 *         _id: e00ffcc8-5548-4f03-a096-a852e33de3eb
 *         studentCourses: [{courseId: MEC2022 , grade: 70 , score: pass}]
 */


const courseSchema = new Schema({
    courseId:{
        type: String,
        required: true,
        unique: true
    },
    courseStudents: [{ 
        studentId: String,
        grade: Number,
        score: String
    }]
});

module.exports = Course = mongoose.model('Course', courseSchema);