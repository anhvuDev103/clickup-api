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
        from: 'categories',
        localField: '_id',
        foreignField: 'parent_id',
        as: 'categories',
      },
    },
    {
      $unwind: {
        path: '$categories',
      },
    },
    {
      $unwind: {
        path: '$categories',
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'categories._id',
        foreignField: 'parent_id',
        as: 'categories.subcategories',
      },
    },
    {
      $addFields: {
        categories: {
          $cond: {
            if: {
              $eq: ['$categories.hierarchy_level', 1],
            },
            then: {
              name: 'hidden',
              is_hidden: true,
              subcategories: ['$categories'],
            },
            else: {
              $mergeObjects: [
                '$categories',
                {
                  is_hidden: false,
                },
              ],
            },
          },
        },
      },
    },
    {
      $group: {
        _id: '$_id',
        root: {
          $first: '$$ROOT',
        },
        categories: {
          $push: '$categories',
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            '$root',
            {
              categories: '$categories',
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
        categories: {
          _id: 0,
          parent_id: 0,
          member_ids: 0,
          created_at: 0,
          updated_at: 0,
          hierarchy_level: 0,
          subcategories: {
            _id: 0,
            parent_id: 0,
            member_ids: 0,
            created_at: 0,
            updated_at: 0,
            subcategories: 0,
            hierarchy_level: 0,
          },
        },
      },
    },
  ];
};
