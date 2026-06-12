const Contact = require('../models/Contact.model');
const sendEmail = require('../utils/sendEmail');

const submitContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);

    // Send email notification to admin with details from form
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'singhshivam112002@gmail.com';
      const emailText = `Hi FLORA Team,\n\nYou have received a new message through the Contact Us form on your website:\n\nName: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone || 'N/A'}\nSubject: ${contact.subject || 'N/A'}\n\nMessage:\n${contact.message}\n\nBest regards,\nFLORA Catalog`;
      const emailHtml = `
        <h3>New Contact Form Message</h3>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Phone:</strong> ${contact.phone || 'N/A'}</p>
        <p><strong>Subject:</strong> ${contact.subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f7f3ed; padding: 15px; border-left: 4px solid #2a5c3f; white-space: pre-wrap;">
          ${contact.message}
        </div>
      `;

      await sendEmail({
        to: adminEmail,
        subject: `[FLORA Contact] New Message: ${contact.subject || 'Enquiry'}`,
        text: emailText,
        html: emailHtml,
      });
    } catch (emailErr) {
      console.error('❌ Error sending contact email:', emailErr);
    }

    res.status(201).json({ success: true, message: 'Message sent! We will get back to you soon.', contact });
  } catch (error) {
    next(error);
  }
};

const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, contacts });
  } catch (error) {
    next(error);
  }
};

const markRead = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json({ success: true, contact });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContact, getContacts, markRead };
