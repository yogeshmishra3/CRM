
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Set NODE_TLS_REJECT_UNAUTHORIZED to 0 for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
const emailRoutes = require('./routes/emailRoutes');

// Initialize express app
const app = express();
const PORT = process.env.PORT;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
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
app.use('/api', emailRoutes);


app.get('/', (req, res) => {
    res.send('MVC Backend API is running');
});


if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}


module.exports = app;
