const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	title: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String,
		required: true,
	},
	createAt: {
		type: Date,
		default: Date.now(),
	},
	url: {
		type: String
	},
	status: {
		type: String,
		enum: ['To learn', 'Learning', 'Finished'],
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	}
})

module.exports = mongoose.model('posts', PostSchema);