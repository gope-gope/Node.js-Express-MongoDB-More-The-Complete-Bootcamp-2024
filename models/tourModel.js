const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// Mongoose Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [50, 'A tour name cannot be longer than 50 characters.'],
      minLength: [10, 'A tour name must have at least 10 characters.'],
      // validate: [validator.isAlpha, 'Name must contain letters only!'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult.',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuality: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // console.log('this', this);
          // console.log('value', val);
          // This only points to the current document on CREATING NEW DOCUMENTS
          return val < this.price;
        },
        message: 'Discounted price cannot be bigger than the tour price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      // Hide field
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    // add virtual properties
    toJSON: { virtuals: true },
  },
);

// A virtual property
tourSchema.virtual('durationWeeks').get(function () {
  // return duration in weeks
  return this.duration / 7;
});

// MONGO DOCUMENT MIDDLEWARE
// // 1. pre runs before .save() and .create() functions
// tourSchema.pre('save', function (next) {
//   // this is the currently processed document
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// // 2. post
// tourSchema.post('save', function (doc, next) {
//   // doc is the saved document
//   next();
// });

// MONGO QUERY MIDDLEWARE
// tourSchema.pre(/^find/, function (next) {
//   this.start = Date.now();
//   // this points at the current query
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

// tourSchema.post(/^find/, function (docs, next) {
//   console.log('this took', Date.now() - this.start, 'ms');
//   // this points at the document
//   console.log(docs);
//   next();
// });

// MONGO AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  // Add a new match stage BEFORE all the other stages in the aggregate
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
});

// Model based on Schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
