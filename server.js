import express from 'express'
import cors from 'cors'
import axios from 'axios'
import McDonaldsApi from 'mcdonalds-api'
// server.js
/* const express = require('express')
const cors = require('cors')
const axios = require('axios')
const McDonaldsApi = require('mcdonalds-api') */

const app = express();
const port = 3000;
const mcdonaldsApi = McDonaldsApi('SE') // Adjust the region as needed

app.use(cors());

app.get('/api/mcdonalds-locations', async (req, res) => {
    try {
        const { latitude, longitude, radius, count } = req.query
        const locations = await mcdonaldsApi.getLocations(latitude, longitude, radius, count);
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});





