import connectDB from '../../../utils/db';
import Template from '../../../models/Template';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  try {
    switch (req.method) {
      case 'GET':
        if (req.query.version !== undefined) {
          // Handle version-specific request
          const template = await Template.findById(id);
          if (!template) {
            return res.status(404).json({ error: 'Template not found' });
          }

          const versionIndex = parseInt(req.query.version);
          if (isNaN(versionIndex)) {
            return res.status(400).json({ error: 'Invalid version number' });
          }

          if (versionIndex < 0 || versionIndex >= template.versions.length) {
            return res.status(404).json({ error: 'Version not found' });
          }

          return res.status(200).json(template.versions[versionIndex]);
        } else {
          // Handle regular template request
          const template = await Template.findById(id);
          if (!template) {
            return res.status(404).json({ error: 'Template not found' });
          }
          return res.status(200).json(template);
        }

      case 'PUT':
        const { name, subject, displayText, from, replyTo, htmlContent } = req.body;
        
        // Find the template and create a new version
        const templateToUpdate = await Template.findById(id);
        if (!templateToUpdate) {
          return res.status(404).json({ error: 'Template not found' });
        }

        // Add current version to history before updating
        templateToUpdate.versions.push({
          name: templateToUpdate.name,
          subject: templateToUpdate.subject,
          displayText: templateToUpdate.displayText,
          from: templateToUpdate.from,
          replyTo: templateToUpdate.replyTo,
          htmlContent: templateToUpdate.htmlContent,
          createdAt: new Date()
        });

        // Update the template with new data
        templateToUpdate.name = name || templateToUpdate.name;
        templateToUpdate.subject = subject || templateToUpdate.subject;
        templateToUpdate.displayText = displayText || templateToUpdate.displayText;
        templateToUpdate.from = from || templateToUpdate.from;
        templateToUpdate.replyTo = replyTo || templateToUpdate.replyTo;
        templateToUpdate.htmlContent = htmlContent || templateToUpdate.htmlContent;
        templateToUpdate.updatedAt = new Date();

        await templateToUpdate.save();
        return res.status(200).json(templateToUpdate);

      case 'DELETE':
        const deletedTemplate = await Template.findByIdAndDelete(id);
        if (!deletedTemplate) {
          return res.status(404).json({ error: 'Template not found' });
        }
        return res.status(200).json({ message: 'Template deleted successfully' });

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}