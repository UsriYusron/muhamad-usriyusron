import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      maxlength: 160,
      default: '',
    },
    thumbnail: {
      type: String, // URL gambar
      default: null,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // otomatis menambah createdAt dan updatedAt
  }
);

// Indexes
// Catatan: slug sudah punya unique: true di definisi field,
// jadi tidak perlu didefinisikan ulang di sini.
ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ authorId: 1 });

// Gunakan optional chaining untuk menghindari error saat mongoose.models
// belum terinisialisasi di lingkungan serverless Next.js
const Article = mongoose.models?.Article ?? mongoose.model('Article', ArticleSchema);

export default Article;
