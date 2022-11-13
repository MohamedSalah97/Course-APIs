const express = require('express');
const requireAuth = require('../middlewares/requireAuth');
const Student = require('../models/Student');
const Course = require('../models/Course');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Results
 *   description: Showing results managing APIs
 */


/**
 * @swagger
 * /api/course-results:
 *   get:
 *     summary: Getting paginated course result
 *     tags: [Results]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           description: page number starts from 1  
 *     responses:
 *       200:
 *         description: ok
 *         content: 
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   studentId:
 *                     type: string
 *                   grade:
 *                     type: integer
 *                   score: 
 *                     type: string
 *       500:
 *         description: server error 
 */

router.get('/api/course-results', requireAuth, async(req,res) =>{
    try {
        const {page} = req.query ;
        const resultsPerPage = 5;
        const total = (page - 1) * resultsPerPage ;;
        const courseId = req.currentUser.courseId ;

        const results = await Course.aggregate([
            {$match:{courseId: courseId}},
            {$unwind: {path: '$courseStudents'}},
            {$skip: total},
            {$limit: resultsPerPage },
            {$project: {courseStudents: 1, _id: 0}}
        ]);


        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({errors: [{msg: 'Server error'}]});
        console.error(error);
    }
});


/**
 * @swagger
 * /api/student-result:
 *   get:
 *     summary: Getting student's course result
 *     tags: [Results]
 *     responses: 
 *       200:
 *         description: ok
 *         content: 
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   courseId:
 *                     type: string
 *                   grade:
 *                     type: integer
 *                   score: 
 *                     type: string
 *       500:
 *         description: server error 
 */

router.get('/api/student-result', async (req,res) =>{
    try {
        const {studentId , courseId} = req.body;

        const query = await Student.findById(studentId);
        const result = query.studentCourses.filter(doc => doc.courseId === courseId);

        res.json(result);
    } catch (error) {
        res.status(500).json({errors: [{msg: 'Server error'}]});
        console.error(error);
    }
})

module.exports = router ;