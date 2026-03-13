import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subject: String,
  displayText: String,
  from: String,
  replyTo: String,
  htmlContent: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  versions: [{
    subject: String,
    displayText: String,
    from: String,
    replyTo: String,
    htmlContent: String,
    createdAt: { type: Date, default: Date.now }
  }]
});

templateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Template || mongoose.model('Template', templateSchema);