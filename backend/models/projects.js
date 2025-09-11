const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    managers: [
        {
            managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: { type: String, required: true, trim: true },
            email: { type: String, required: true, unique: true },
            _id: false // Prevents the creation of an additional _id field for this subdocument
        }
    ],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['Active', 'Completed', 'On Hold'], default: 'Active', required: true },
    teamMembers: [
        { 
            employeeId: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: { type: String, required: true, trim: true },
            email: { type: String, required: true, unique: true },
            _id: false // Prevents the creation of an additional _id field for this subdocument
        }
    ],
    skillTags: [{ type: String, trim: true }],
    client: { type: String, required: true, trim: true }
});

// Method to check if a user is a team member
projectSchema.methods.isTeamMember = function(userId) {
  return this.teamMembers.some(member => member.equals(userId));
};

module.exports = mongoose.model('Project', projectSchema);