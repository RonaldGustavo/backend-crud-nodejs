const { response } = require('express');
const db = require('../models');
const axios = require('axios');

const Todolist = db.todolist;

exports.create = async (req, res) => {
  const responseSuccess = {
    message: 'berhasil create',
    status: 200,
  };
  const responseFailed = {
    message: 'gagal create',
    status: 401,
  };

  try {
    const documents = req.body.map((item) => ({
      user: item.user,
      activity: item.activity,
      description: item.description,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    console.log('documents', documents);
    await Todolist.insertMany(documents);

    res.status(200).send(responseSuccess);
  } catch (error) {
    res.status(500).send(responseFailed);
  }
};

exports.findAll = async (req, res) => {
  const user = req.params.user;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const searchQuery = req.query.search || '';

    const startIndex = (page - 1) * limit;

    const results = {
      status: 200,
      pagination: {
        page: page,
        limit: limit,
        search: searchQuery,
      },
      data: [],
    };

    // Build the regex pattern for case-insensitive search
    const regexPattern = new RegExp(searchQuery, 'i');

    // Define search conditions for string fields
    const stringSearchConditions = [
      { activity: { $regex: regexPattern } },
      { description: { $regex: regexPattern } },
    ];

    // If searchQuery can be converted to a valid Date, add date search conditions
    const dateSearchConditions = !isNaN(Date.parse(searchQuery))
      ? [
          {
            $or: [
              { created_at: { $gte: new Date(searchQuery) } },
              { updated_at: { $gte: new Date(searchQuery) } },
            ],
          },
        ]
      : [];

    const userSearchConditions = [{ user: user }];

    const totalCount = await Todolist.countDocuments({
      $and: [
        { $or: [...stringSearchConditions, ...dateSearchConditions] },
        { $or: userSearchConditions },
      ],
    }).exec();

    results.pagination.total = totalCount;

    if (startIndex < totalCount) {
      results.data = await Todolist.find({
        $and: [
          { $or: [...stringSearchConditions, ...dateSearchConditions] },
          { $or: userSearchConditions },
        ],
      })
        .limit(limit)
        .skip(startIndex)
        .exec();
    }

    if (results.data.length === 0) {
      results.message = 'No data found.';
    }

    res.status(200).send(results);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.show = (req, res) => {
  const id = req.params.id;
  Todolist.findById(id)
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.update = (req, res) => {
  const responseSuccess = {
    message: 'berhasil update',
    status: 200,
  };
  const responseFailed = {
    message: 'gagal update',
    status: 401,
  };
  const id = req.params.id;

  req.body.updated_at = new Date(req.body.updated_at);
  Todolist.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(async (data) => {
      if (!data) {
        res.status(404).send({ message: 'tidak dapat di update' });
        console.log('tidak masuk');
      } else {
        res.status(200).send(responseSuccess);
      }
    })
    .catch((err) => {
      res.status(500).send(responseFailed);
    });
};

exports.delete = (req, res) => {
  const responseSuccess = {
    message: 'berhasil delete',
    status: 200,
  };
  const responseFailed = {
    message: 'gagal delete',
    status: 401,
  };

  const id = req.params.id;
  Todolist.findByIdAndDelete(id)
    .then(async (data) => {
      if (!data) {
        res.status(404).send({ message: 'tidak dapat delete data' });
      } else {
        res.status(200).send(responseSuccess);
      }
    })

    .catch((err) => {
      res.status(500).send(responseFailed);
    });
};
