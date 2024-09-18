import { ObjectId } from 'mongodb';

export const getProfileAggregate = (user_id: string) => [
  {
    $match: {
      _id: new ObjectId(user_id),
    },
  },
  {
    $lookup: {
      from: 'workspaces',
      as: 'workspaces',
      let: {
        user_id: '$_id',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $or: [
                {
                  $in: ['$$user_id', '$member_ids'],
                },
                {
                  $eq: ['$$user_id', '$owner_id'],
                },
              ],
            },
          },
        },
      ],
    },
  },
  {
    $unwind: {
      path: '$workspaces',
    },
  },
  {
    $lookup: {
      as: 'workspaces.members',
      from: 'users',
      foreignField: '_id',
      localField: 'workspaces.member_ids',
    },
  },
  {
    $lookup: {
      as: 'workspaces.owner',
      from: 'users',
      foreignField: '_id',
      localField: 'workspaces.owner_id',
    },
  },
  {
    $addFields: {
      workspaces: {
        owner: {
          $arrayElemAt: ['$workspaces.owner', 0],
        },
      },
    },
  },
  {
    $group: {
      _id: '$_id',
      name: {
        $first: '$name',
      },
      email: {
        $first: '$email',
      },
      description: {
        $first: '$description',
      },
      workspaces: {
        $push: '$workspaces',
      },
    },
  },
  {
    $project: {
      workspaces: {
        member_ids: 0,
        owner_id: 0,
        members: {
          password: 0,
          refresh_token: 0,
          forgot_password_token: 0,
          created_at: 0,
          updated_at: 0,
        },
        owner: {
          password: 0,
          refresh_token: 0,
          forgot_password_token: 0,
          created_at: 0,
          updated_at: 0,
        },
      },
    },
  },
];
