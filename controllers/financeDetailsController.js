
const FinanceDetails = require('../models/FinanceDetails');

// Create or update finance details
exports.createOrUpdateFinanceDetails = async (req, res) => {
    const { id, dealName, clientName, dueDate, advancePayment, midPayment, finalPayment, amount, paymentDate } = req.body;

    if (!id || !dealName || !clientName || amount == null) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        let financeEntry = await FinanceDetails.findOne({ id });

        if (financeEntry) {
            // Update only the fields that are provided
            financeEntry.dueDate = dueDate || financeEntry.dueDate;
            financeEntry.advancePayment = advancePayment !== undefined ? advancePayment : financeEntry.advancePayment;
            financeEntry.midPayment = midPayment !== undefined ? midPayment : financeEntry.midPayment;
            financeEntry.finalPayment = finalPayment !== undefined ? finalPayment : financeEntry.finalPayment;
            financeEntry.amount = amount;
            financeEntry.balance = amount - (financeEntry.advancePayment + financeEntry.midPayment + financeEntry.finalPayment);

            if (paymentDate) {
                financeEntry.paymentDate.advancedPDate = paymentDate.advancedPDate || financeEntry.paymentDate.advancedPDate;
                financeEntry.paymentDate.midPDate = paymentDate.midPDate || financeEntry.paymentDate.midPDate;
                financeEntry.paymentDate.finalPDate = paymentDate.finalPDate || financeEntry.paymentDate.finalPDate;
            }

            const updatedFinance = await financeEntry.save();
            return res.status(200).json(updatedFinance);
        } else {
            // Create a new entry if none exists
            const newFinance = new FinanceDetails({
                id,
                dealName,
                clientName,
                dueDate,
                advancePayment: advancePayment || 0,
                midPayment: midPayment || 0,
                finalPayment: finalPayment || 0,
                amount,
                balance: amount - ((advancePayment || 0) + (midPayment || 0) + (finalPayment || 0)),
                paymentDate: {
                    advancedPDate: paymentDate?.advancedPDate || null,
                    midPDate: paymentDate?.midPDate || null,
                    finalPDate: paymentDate?.finalPDate || null
                }
            });

            const savedFinance = await newFinance.save();
            return res.status(201).json(savedFinance);
        }
    } catch (error) {
        console.error('Error saving or updating finance details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all finance details
exports.getAllFinanceDetails = async (req, res) => {
    try {
        const financeData = await FinanceDetails.find();
        res.status(200).json(financeData);
    } catch (err) {
        console.error("Error fetching finance details:", err);
        res.status(500).json({ message: 'Error fetching finance details' });
    }
};
