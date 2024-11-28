module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      user: String,
      activity: String,
      description: String,
      created_at: Date,
      updated_at: Date,
    },
    {
      timestamp: true,
    }
  );

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    const json = { _id: _id, ...object };
    return json;
  });

  return mongoose.model('todolist', schema);
};
