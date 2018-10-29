const deptTree = [
  {
    id: 0,
    name: '测试部',
    seq: '1',
    operateTime: '2017-02-12 10:12:24',
    operate: 'Admin',
    children: [
      {id: 1, name: '测试一部', seq: 1, operateTime: '2017-02-12 10:12:24', operate: 'Admin'},
      {id: 2, name: '测试二部', seq: 2, operateTime: '2017-02-12 10:12:24', operate: 'Admin'},
      {id: 3, name: '测试三部', seq: 3, operateTime: '2017-02-12 10:12:24', operate: 'Admin'}
    ]
  },
  {
    id: 4,
    name: '研发部',
    seq: '1',
    operateTime: '2017-02-12 10:12:24',
    operate: 'Admin',
    children: [
      {id: 5, name: '研发一部', seq: 1, operateTime: '2017-02-12 10:12:24', operate: 'Admin'},
      {id: 6, name: '研发二部', seq: 2, operateTime: '2017-02-12 10:12:24', operate: 'Admin'},
      {id: 7, name: '研发三部', seq: 3, operateTime: '2017-02-12 10:12:24', operate: 'Admin'}
    ]
  },
  {
    id: 8,
    name: '销售部',
    seq: '1',
    operateTime: '2017-02-12 10:12:24',
    operate: 'Admin',
    children: [
      {id: 9, name: '销售一部', seq: 1, operateTime: '2017-02-12 10:12:24', operate: 'Admin'},
      {id: 10, name: '销售二部', seq: 2, operateTime: '2017-02-12 10:12:24', operate: 'Admin'},
      {
        id: 11,
        name: '销售中心',
        seq: 3,
        operateTime: '2017-02-12 10:12:24',
        operate: 'Admin',
        children: [
          {id: 12, name: '一级销售', seq: 1, operateTime: '2017-02-12 10:12:24', operate: 'Admin'},
          {id: 13, name: '二级销售', seq: 2, operateTime: '2017-02-12 10:12:24', operate: 'Admin'},
          {id: 14, name: '三级销售', seq: 3, operateTime: '2017-02-12 10:12:24', operate: 'Admin'}
        ]
      }
    ]
  },
  {
    id: 15,
    name: '省区',
    seq: '1',
    operateTime: '2017-02-12 10:12:24',
    operate: 'Admin',
    children: [
      {
        id: 16,
        name: '市区',
        seq: '1',
        operateTime: '2017-02-12 10:12:24',
        operate: 'Admin',
        children: [
          {
            id: 17,
            name: '县区',
            seq: '1',
            operateTime: '2017-02-12 10:12:24',
            operate: 'Admin',
            children: [
              {
                id: 18,
                name: '镇区',
                seq: '1',
                operateTime: '2017-02-12 10:12:24',
                operate: 'Admin',
                children: [
                  {
                    id: 19,
                    name: '村镇',
                    seq: '1',
                    operateTime: '2017-02-12 10:12:24',
                    operate: 'Admin',
                    children: [
                      {id: 20, name: '村组', seq: 1, operateTime: '2017-02-12 10:12:24', operate: 'Admin'}
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]

export default {
  getDeptList: request => {
    return {
      code: 0,
      msg: '请求成功',
      data: deptTree
    }
  }
}
