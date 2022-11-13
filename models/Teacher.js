const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       required:
 *         - userName
 *         - courseId
 *         - password
 *       properties:
 *         _id:
 *           type: mongoose objectId
 *           description: The auto-generated id of teacher
 *         userName:
 *           type: string
 *           description: The Teacher's name
 *         courseId:
 *           type: string
 *           description: The teacher's course id
 *         password:
 *           type: string
 *           description: The hashed password
 *       example:
 *         _id: s5dsd454fd5fcd5d5
 *         userName: Ahmed Saleh
 *         courseId: MEC2022
 *         password: qa5ws4d15d24f5fdsc5f4vd5ef41d5efc41d5f4c1 
 */


const teacherSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    courseId:{
        type: String,
        required: true,
        unique: true
    }
});

module.exports = Teacher = mongoose.model('Teacher', teacherSchema);