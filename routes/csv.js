const express = require('express');
const multer = require('multer');
const {parse} = require('csv-parse');
const fs = require('fs');
const requireAuth = require('../middlewares/requireAuth');
const Student = require('../models/Student');
const Course = require('../models/Course');
const mailgun = require('mailgun-js');

const router = express.Router();

require('dotenv').config();

/**
 * @swagger
 * tags:
 *   name: CSV Upload
 *   description: csv upload api
 */


/**
 * @swagger
 * /api/upload-csv:
 *   post:
 *     summary: upload csv
 *     tags: [CSV Upload]
 *     requestBody:
 *       content: 
 *         multipart/formdata:
 *          schema:
 *             type: object
 *             required: [csv] 
 *             properties:
 *               csv: 
 *                 type: string
 *                 format: csv
 *               email:
 *                 type: string      
 *     responses:
 *       200:
 *         description: file uploaded successfully
 *       422:
 *         description: wrong format, duplicated line or grade
 *       500:
 *         description: server error      
 *       
 */


let storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './uploads')
    },
    filename: (req, file, callBack) => {
        callBack(
            null,
            req.currentUser.courseId,
            )
        },
    });
    
let upload = multer({
    storage
});

const mg = mailgun({
    apiKey: process.env.APIKEY ,
    domain: process.env.DOMAIN
})


router.post('/api/upload-csv',requireAuth, upload.single('csv') ,async(req,res) =>{
    try {
        const {email} = req.body;
        console.log(email);
        let studentId = new Set();
        console.log(req.currentUser.courseId);
        let courseStudents = []
        const student={
            _id: null,
            studentCourses: []
        }
        let students = [];
        let rowNumber = 1;
        fs.createReadStream(`./uploads/${req.currentUser.courseId}`)
            .pipe(parse({delimiter:',', from_line: 2}))
            .on('data', function(row){
                if(row.length !== 2){
                    fs.unlink(`./uploads/${req.currentUser.courseId}`, (error =>{
                        if(error) {throw err}
                        console.log('deleted')
                    }))
                    return res.status(422).json({errors: [{msg: 'Invalid format'}]});
                }
                rowNumber++;
                const [id, grade] = row ;
                if(studentId.has(id)){
                    fs.unlink(`./uploads/${req.currentUser.courseId}`, (error =>{
                        if(error) {throw err}
                        console.log('deleted')
                    }))
                    return res.status(422).json({errors: [{msg: `Duplicated student id at line ${rowNumber}`}]})
                }
                if(parseInt(grade) > 100 || parseInt(grade) < 0){
                    fs.unlink(`./uploads/${req.currentUser.courseId}`, (error =>{
                        if(error) {throw err}
                        console.log('deleted')
                    }))
                    return res.status(422).json({errors: [{msg: `Invalid grade at line ${rowNumber}`}]})
                }
                let score;
                if(parseInt(grade) >= 50){
                    score = 'pass'
                }else{
                    score = 'fail'
                }
                studentId.add(id);
                courseStudents.push({
                    studentId: id,
                    grade: parseInt(grade),
                    score
                });
                students.push({
                    _id: id,
                    studentCourses: [{
                        courseId: req.currentUser.courseId,
                        grade: parseInt(grade),
                        score
                    }]
                })
            })
            .on('error', function(error){
                console.log(error);
            })
            .on('end', async function(){
                const newCourseResults = new Course({
                    courseId: req.currentUser.courseId,
                    courseStudents
                });
                await newCourseResults.save()
                await Student.insertMany(students)
                if(email){
                    await mg.messages().send({
                        from: 'mohamed.salah678mo@gmail.com',
                        to: email,
                        subject: `${req.currentUser.courseId} results are published by ${req.currentUser.userName}`,
                        html: `
                        <html>
                            <body>
                                <a href='localhost:5000/api/course-results'>results</a>
                            </body>
                        </html>
                        `
                    }, (error,body) =>{console.log(body.message)})
                }
                res.json({msg:'Uploaded Successfully'});
                studentId.clear()
                courseStudents = [];
                student._id = null ;
                student.studentCourses = [];
                students = []
                fs.unlink(`./uploads/${req.currentUser.courseId}`, (error =>{
                    if(error) {throw err}
                    console.log('deleted')
                }))
            })
    } catch (error) {
        console.error(error);
    }
});


module.exports = router ;