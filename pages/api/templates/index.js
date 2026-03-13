import connectDB from '../../../utils/db';
import Template from '../../../models/Template';

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const templates = await Template.find({});
        res.status(200).json(templates);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch templates' });
      }
      break;

    case 'POST':
      try {
        const { name, subject, displayText, from, replyTo, htmlContent } = req.body;
        
        // Create new version history
        const newVersion = {
          subject,
          displayText,
          from,
          replyTo,
          htmlContent
        };

        const template = new Template({
          name,
          subject,
          displayText,
          from,
          replyTo,
          htmlContent,
          versions: [newVersion]
        });

        await template.save();
        res.status(201).json(template);
      } catch (error) {
        res.status(400).json({ error: 'Failed to create template' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}