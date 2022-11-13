const express = require('express');
const bcrypt = require('bcrypt');
const {body} = require('express-validator');
const Teacher = require('../models/Teacher');
const jwt = require('jsonwebtoken');
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication managing APIs
 */


/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new teacher
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       201:
 *         description: Teacher registered
 *       400:
 *         description: Username Or CourseId is existed
 *       500:
 *         description: server error      
 *       
 */


router.post('/api/register',[
    body('userName').not().isEmpty().withMessage("Teacher's name must be provided"),
    body('password').trim().isLength({min:6,max:20}).withMessage('Password must be between 6 and 20 characters')
], validateRequest, async(req,res) =>{
    try {
        const {userName, password, courseId} = req.body ;

        const founded = await Teacher.findOne({userName});
        if(founded){
            return res.status(400).json({errors: [{msg: 'Username is already taken please use another one'}]})
        }

        const foundedCourse = await Teacher.findOne({courseId});
        if(foundedCourse){
            return res.status(400).json({errors: [{msg: 'Course is already existed'}]})
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newTeacher = new Teacher({
            userName,
            password: hashedPassword,
            courseId
        });

        await newTeacher.save();
        res.status(201).send({success: true});
    } catch (error) {
        res.status(500).json({errors: [{msg: error.message}]});
        console.error(error);
    }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: login a teacher
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string    
 *               password:
 *                 type: string  
 *     responses:
 *       200:
 *         description: Teacher logedin
 *       400:
 *         description: Wrong password
 *       404: 
 *         description: not found   
 *       500:
 *         description: server error 
 */

router.post('/api/login',[
    body('userName').not().isEmpty().withMessage("Teacher's name must be provided"),
    body('password').trim().isLength({min:6,max:20}).withMessage('Password must be between 6 and 20 characters')
], validateRequest, async(req,res)=>{

    try {
        const {userName,password} = req.body ;

        const foundTeacher = await Teacher.findOne({userName})
        if(!foundTeacher){
            return res.status(404).json({errors: [{msg: 'Not found'}]})
        }

        const match = await bcrypt.compare(password, foundTeacher.password);
        if(!match){
            return res.status(400).json({errors: [{msg: 'Incorrect Password'}]})
        }

        const payload = {
            userName: foundTeacher.userName,
            courseId: foundTeacher.courseId
        };

        const token = jwt.sign(payload,'secrete');

        req.session = {
            jwt: token
        };

        res.status(200).json({success: true});
    } catch (error) {
        res.status(500).json({errors: [{msg: 'Server error'}]});
        console.error(error);
    }
});

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: login a teacher
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Teacher logedin
 */

router.post('/api/logout', async(req,res) =>{
    req.session = null ;
    res.status(200).send({})
});

module.exports = router ;