import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      enum: ['google', 'github'],
      required: true,
    },
  },
  {
    timestamps: true, // otomatis menambah createdAt dan updatedAt
  }
);

// Index unik pada email sudah didefinisikan via unique: true di field,
// tidak perlu didefinisikan ulang di sini.

// Gunakan optional chaining untuk menghindari error saat mongoose.models
// belum terinisialisasi di lingkungan serverless Next.js
const User = mongoose.models?.User ?? mongoose.model('User', UserSchema);

export default User;
