
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
// Import routes
const projectRoutes = require('./routes/projectRoutes');
const projectDetailsRoutes = require('./routes/projectDetailsRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dataRoutes = require('./routes/dataRoutes');
const revenueRoutes = require('./routes/revenueRoutes');
const clientProjectRoutes = require('./routes/clientProjectRoutes');
const dealRoutes = require('./routes/dealRoutes');
const dealManagementRoutes = require('./routes/dealManagementRoutes');
const recyclebinRoutes = require('./routes/recyclebinRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const financeDetailsRoutes = require('./routes/financeDetailsRoutes');
const clientRoutes = require('./routes/clientRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const leadsRoutes = require('./routes/leadsRoutes');
const newLeadRoutes = require('./routes/newLeadRoutes');
const integrationRoutes = require('./routes/integrationRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const quotationRoutes = require('./routes/quotationRoutes');

const app = express();
const PORT = process.env.PORT;


connectDB();


app.use(cors());
app.use(express.json());

app.use('/api', projectRoutes);
app.use('/api', projectDetailsRoutes);
app.use('/api', taskRoutes);
app.use('/api', dataRoutes);
app.use('/api', revenueRoutes);
app.use('/api', clientProjectRoutes);
app.use('/api', dealRoutes);
app.use('/api', dealManagementRoutes);
app.use('/api', recyclebinRoutes);
app.use('/api', organizationRoutes);
app.use('/api', complaintRoutes);
app.use('/api', financeDetailsRoutes);
app.use('/api', clientRoutes);
app.use('/api', meetingRoutes);
app.use('/api', invoiceRoutes);
app.use('/api', leadsRoutes);
app.use('/api', newLeadRoutes);
app.use('/api', integrationRoutes);
app.use('/api', quoteRoutes);
app.use('/api', quotationRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('MVC Backend API is running');
});



// Export for serverless functions or testing
module.exports = app;
