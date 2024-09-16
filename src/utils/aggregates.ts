import { ObjectId } from 'mongodb';

export const getProfileAggregate = (user_id: string) => [
  {
    $match: {
      _id: new ObjectId(user_id),
    },
  },
  {
    $project: {
      password: 0,
      refresh_token: 0,
      forgot_password_token: 0,
      created_at: 0,
      updated_at: 0,
    },
  },
  {
    $lookup: {
      from: 'workspaces',
      localField: '_id',
      foreignField: 'owner_id',
      as: 'workspaces',
    },
  },
  {
    $lookup: {
      from: 'workspaces',
      localField: '_id',
      foreignField: 'member_ids',
      as: 'collab_workspaces',
      let: {
        user_id: '$_id',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ['$$user_id', '$member_ids'],
            },
          },
        },
      ],
    },
  },
  {
    $addFields: {
      workspaces: {
        $setUnion: ['$collab_workspaces', '$workspaces'],
      },
    },
  },
  {
    $project: {
      collab_workspaces: 0,
    },
  },
];
