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
        members: {
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
