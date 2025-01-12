import { Schema } from "mongoose";
import Quote from "../models/userQuoteModel.js";

// Fetch today's quote for users
export const getTodaysQuote = async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0];

        // Check if a quote for today exists
        const quote = await Quote.findOne({ date: today });

        if (!quote) {
            return res.status(404).json({ message: "No quote available for today." });
        }

        res.status(200).json({ success: true, quote: quote.text });
    } catch (error) {
        console.error("Error fetching today's quote:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

export const createQuote = async (req, res) => {
    try {
      const quoteInfo = req.body; // Access the request body
  
      // Validate the request data
      if (!quoteInfo.text || !quoteInfo.date) {
        return res.status(400).json({
          message: "Text and date are required to create a quote.",
        });
      }
  
      // Create and save the new quote
      const newQuote = new Quote(quoteInfo);
      await newQuote.save();
  
      res.status(200).json({
        message: "We added your quote. The quote will be displayed on that day.",
      });
    } catch (error) {
      console.error("Error creating a quote:", error);
  
      // Handle duplicate date error
      if (error.code === 11000) {
        return res.status(400).json({
          message: "A quote already exists for this date.",
        });
      }
  
      // Handle general server error
      res.status(500).json({
        message: "Server error. Please try creating the quote later.",
      });
    }
  };
  export const deleteQuote = async (req, res) => {
    try {
      const { text, date } = req.body;
  
      // Validate that at least one field was provided
      if (!text && !date) {
        return res.status(400).json({
          message: "Either 'text' or 'date' is required to delete a quote.",
        });
      }
  
      // Create filter based on which field is provided
      const filter = date ? { date } : { text };
  
      // Find the quote
      const item = await Quote.findOne(filter);
      if (!item) {
        return res.status(404).json({
          message: "Quote not found. Please check your input.",
        });
      }
  
      // Delete the quote
      await Quote.deleteOne(filter);
      console.log("Deleted quote:", item);
      res.status(200).json({
        message: "We deleted your quote. Now you can add another.",
      });
    } catch (error) {
      console.error("Error deleting quote:", error);
      res.status(500).json({
        message: "Server error. Please try deleting the quote later.",
      });
    }
  };
  export const getAllQuotes = async (req, res) => {
    try {
      const allQuotes = await Quote.find();
      res.status(200).json({ quotes: allQuotes });
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
  };

  export const editQuote = async (req, res) => {
    try {
      // Extract the quote identifier and possible update fields from the request body
      const { id, text, date } = req.body;
  
      // Validate that a valid id is provided
      if (!id) {
        return res.status(400).json({
          message: "Quote id is required to edit a quote.",
        });
      }
  
      // Build the update data object based on provided fields
      const updateData = {};
      if (text) updateData.text = text;
      if (date) updateData.date = date;
  
      // If no update data is provided, return error
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          message: "At least one field (text or date) is required to update the quote.",
        });
      }
  
      // Find the quote by its id and update it
      const updatedQuote = await Quote.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true } // Returns the updated document
      );
  
      // If quote not found, respond with 404
      if (!updatedQuote) {
        return res.status(404).json({
          message: "Quote not found. Please check the quote id.",
        });
      }
  
      // Respond with success and the updated quote document
      res.status(200).json({
        message: "Quote updated successfully.",
        quote: updatedQuote,
      });
    } catch (error) {
      console.error("Error updating quote:", error);
      res.status(500).json({
        message: "Server error. Please try editing the quote later.",
        error: error.message,
      });
    }
  };
  
  
  