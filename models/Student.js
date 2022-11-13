const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - _id
 *         - studentCourses
 *       properties:
 *         _id:
 *           type: UUID
 *           description: Studend's Id
 *         studentCourses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *               grade:
 *                 type: integer
 *               score: 
 *                 type: string                     
 *       example:
 *         _id: e00ffcc8-5548-4f03-a096-a852e33de3eb
 *         studentCourses: [{courseId: MEC2022 , grade: 70 , score: pass}]
 */

const studentSchema = new Schema  ({
    _id:{
        type: String
    },
    studentCourses:[{
        courseId:{ 
            type: String,
            required: true
        },
        grade:{
            type: Number,
            required: true
        },
        score:{
            type: String,
            required: true
        }
    }]
});

module.exports = Student = mongoose.model('Student', studentSchema);