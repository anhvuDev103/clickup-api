import { Document, ObjectId } from 'mongodb';

export const generateGetProfileAggregate = (user_id: string): Document[] => [
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

export const generateGetWorkspaceAggregate = (user_id: string, workspace_id: string): Document[] => {
  const objectUserId = new ObjectId(user_id);

  return [
    {
      $match: {
        _id: new ObjectId(workspace_id),
        $or: [
          {
            member_ids: {
              $in: [objectUserId],
            },
          },
          {
            owner_id: objectUserId,
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'owner_id',
        foreignField: '_id',
        as: 'owner',
      },
    },
    {
      $unwind: {
        path: '$owner',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'member_ids',
        foreignField: '_id',
        as: 'members',
      },
    },
    {
      $project: {
        owner_id: 0,
        member_ids: 0,
        owner: {
          password: 0,
          refresh_token: 0,
          forgot_password_token: 0,
          created_at: 0,
          updated_at: 0,
        },
        members: {
          password: 0,
          refresh_token: 0,
          forgot_password_token: 0,
          created_at: 0,
          updated_at: 0,
        },
      },
    },
  ];
};

export const generateGetHierachyAggregate = (user_id: string, workspace_id: string): Document[] => {
  return [
    {
      $match: {
        owner_id: new ObjectId(user_id),
        workspace_id: new ObjectId(workspace_id),
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'member_ids',
        foreignField: '_id',
        as: 'members',
      },
    },
    {
      $lookup: {
        from: 'lists',
        localField: '_id',
        foreignField: 'parent_id',
        as: 'lists',
      },
    },
    {
      $unwind: {
        path: '$lists',
      },
    },
    {
      $lookup: {
        from: 'lists',
        localField: 'lists._id',
        foreignField: 'parent_id',
        as: 'lists.sub_lists',
      },
    },
    {
      $group: {
        _id: '$_id',
        root: {
          $first: '$$ROOT',
        },
        lists: {
          $push: '$lists',
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            '$root',
            {
              lists: '$lists',
            },
          ],
        },
      },
    },
    {
      $project: {
        workspace_id: 0,
        owner_id: 0,
        created_at: 0,
        updated_at: 0,
        member_ids: 0,
        members: {
          password: 0,
          refresh_token: 0,
          forgot_password_token: 0,
          created_at: 0,
          updated_at: 0,
        },
        lists: {
          parent_id: 0,
          member_ids: 0,
          created_at: 0,
          updated_at: 0,
          sub_lists: {
            parent_id: 0,
            member_ids: 0,
            created_at: 0,
            updated_at: 0,
          },
        },
      },
    },
  ];
};
